"use client"

import React, { useEffect } from "react";
import { useContext } from "react";
import { useAuth } from "./AuthContext";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useToast } from '@/components/ui/use-toast'

export interface EventType {
    id: string;

    name: string;
    color: string;
}

export const DefaultEvents: EventType[] = [
    { id:'0', name: 'Work', color: '#FF0000' },
    { id:'1', name: 'School', color: '#00FF00' },
    { id:'2', name: 'Excercise', color: '#0000FF' },
    { id:'3', name: 'Liesure', color: '#FFFF00' },
]
export enum EventPeriod {
    EveryDay,
    Weekday,
    WeekRange,
    Custom
}
export class ScheduleEvent {
    id: string = '';
    title: string = '';
    description: string = '';
    hour: number = 12;
    minute: number = 0;

    duration: number = 60; // Duration in minutes
    
    EventTypeID: number = -1; // -1 means no type selected

    connectedEvent?: ScheduleEvent; // Primary used for events that are during the night and go into the next day

    period: EventPeriod = EventPeriod.EveryDay;
    weekdays?: boolean[] = [false, false, false, false, false, false, false]; // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday 
    dateRange?: [Date, Date] = [new Date(), new Date()]; // Start and end date

    constructor(hour: number, minute: number = 0) {
        this.title = '';
        this.hour = hour;
        this.minute = minute;
    }
}
  

interface ScheduleContextType {
    events: ScheduleEvent[];
    EventDict: { [id: string]: ScheduleEvent };

    loading: boolean;

    addEvent: (event: ScheduleEvent) => Promise<void>;
    removeEvent: (id: string) => Promise<void>;

    UpdateEvent: (event: ScheduleEvent) => Promise<void>;

    newEventData?: ScheduleEvent;
    setNewEventData: (event: ScheduleEvent) => void;

    debug: () => void;
}

const ScheduleContext = React.createContext<ScheduleContextType>({
    events: [],
    EventDict: {},

    loading: false,

    addEvent: async () => {},
    removeEvent: async () => {},

    UpdateEvent: async () => {},

    newEventData: {title: '', description: '', hour: 0, minute: 0, duration: 60, EventTypeID: -1, id: '', period: EventPeriod.EveryDay, weekdays: [false, false, false, false, false, false, false], dateRange: [new Date(), new Date()]},
    setNewEventData: () => {},

    debug: () => {},
})

export function useSchedule() {
  return useContext(ScheduleContext)
}


export function ScheduleProvider(props: { children: any }) {
    const { user } = useAuth()
    const [events, setEvents] = React.useState<ScheduleEvent[]>([])
    const [EventDict, setEventDict] = React.useState<{ [id: string]: ScheduleEvent }>({})

    const [loading, setLoading] = React.useState(true)

    const [newEventData, setNewEventData] = React.useState<ScheduleEvent>()

    const { toast } = useToast()

    function isFiniteNumber(value: any): boolean {
        // Check if the value is a finite number
        return typeof value === 'number' && Number.isFinite(value);
      }

    function ValidateEvent(event: ScheduleEvent) {
        if(!event.title || event.title.length === 0) {
            event.title = 'Untitled Event'
        }
        if(!event.description) {
            event.description = ''
        }
        if(!isFiniteNumber(event.hour)) {
            event.hour = 0
        }
        if(!isFiniteNumber(event.minute)) {
            event.minute = 0
        }
        if(!isFiniteNumber(event.duration) || event.duration <= 0 || event.duration > 24 * 60) {
            event.duration = 60
            toast({
                title: "Uh oh! Something went wrong.",
                description: "Invalid duration.",})
        }
    }
    useEffect(() => {
        if (!user) {
            setEvents([]) // Clear events if user is not logged in
            return
        }
        
        setLoading(true)
        const fetchEvents = async () => {
            // Fetch events from the server
            try {
                const eventsCollection = collection(db, 'users', user.uid, 'events')
                const eventsSnapshot = await getDocs(eventsCollection)

                const userEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as ScheduleEvent[];

                const EventsCollection = collection(db, 'users', user.uid, 'Events')
                const EventsSnapshot = await getDocs(EventsCollection)
                const EventsArray = EventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as ScheduleEvent[];

                const EventsDictionary = EventsArray.reduce((acc, Event) => {
                acc[Event.id] = Event;
                return acc;
                }, {} as Record<string, ScheduleEvent>);
                setEventDict(EventsDictionary)
                setEvents(userEvents)
            } catch (error) {
                console.error('Error fetching events:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents();


    }, [user])


    const addEvent = async (event: ScheduleEvent) => {
        if (!user) {
            throw new Error('User not logged in')
        }

        ValidateEvent(event)

        const docRef = await addDoc(collection(db, 'users', user.uid, 'events'), event)
        await updateDoc(docRef, { id: docRef.id });
        setEvents(prevEvents => [...prevEvents, { ...event, id: docRef.id }])

        console.log('Event added:', event)
    }
    
    const UpdateEvent = async (event: ScheduleEvent) => {
        if(event.id === undefined) { throw new Error('Event id is undefined') }
        if (!user) {
            throw new Error('User not logged in')
        }
    
        ValidateEvent(event);
        try {
            const eventDocRef = doc(db, 'users', user.uid, 'events', event.id.toString())
    
            await updateDoc(eventDocRef, {
                ...event
            })
    
            setEvents(prevEvents =>
                prevEvents.map(ev => (ev.id === event.id ? { ...ev, ...event } : ev))
            );
            console.log('Event updated:', event)
        } catch (error) {
            console.error('Error updating event:', error)
        }
    }

    

    const removeEvent = async (id: string) => {
        if (!user) {
            throw new Error('User not logged in')
            return
        }
    
        await deleteDoc(doc(db, 'users', user.uid, 'events', id))
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id))
    }

    function debug() {
        console.log('Events:', events)
        console.log('EventDict:', EventDict)
    }

    const value = {
        events: events,
        EventDict: EventDict,
        loading: false,

        addEvent: addEvent,
        removeEvent: removeEvent,

        UpdateEvent: UpdateEvent,

        newEventData: newEventData,
        setNewEventData: setNewEventData,

        debug: debug,
    }

    return (
    <ScheduleContext.Provider value={value}>
        {props.children}
    </ScheduleContext.Provider>
    )
}