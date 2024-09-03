"use client"

import React, { useEffect } from "react";
import { useContext } from "react";
import { useAuth } from "./AuthContext";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { create } from "domain";

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

export interface Event {
    id: string;
    title: string;
    description: string;
    hour: number;
    minute: number;

    duration: number; // Duration in minutes
    
    EventTypeID: number;
}


interface ScheduleContextType {
    events: Event[];
    EventDict: { [id: string]: Event };

    loading: boolean;

    addEvent: (event: Event) => Promise<void>;
    removeEvent: (id: number) => Promise<void>;

    createEvent: (hour?: string) => void;
    setCreatingEvent: (value: boolean) => void;
    creatingEvent: boolean;

    UpdateEvent: (event: Event) => Promise<void>;

    newEventData?: Event;
}

const ScheduleContext = React.createContext<ScheduleContextType>({
    events: [],
    EventDict: {},

    loading: false,

    addEvent: async () => {},
    removeEvent: async () => {},
    
    createEvent: () => {},
    setCreatingEvent: () => {},
    creatingEvent: false,

    UpdateEvent: async () => {},

    newEventData: undefined,
})

export function useSchedule() {
  return useContext(ScheduleContext)
}


export function ScheduleProvider(props: { children: any }) {
    const { user } = useAuth()
    const [events, setEvents] = React.useState<Event[]>([])
    const [EventDict, setEventDict] = React.useState<{ [id: string]: Event }>({})

    const [loading, setLoading] = React.useState(true)
    const [creatingEvent, setCreatingEvent] = React.useState(false)
    const [newEventData, setNewEventData] = React.useState<Event>()

    function isFiniteNumber(value: any): boolean {
        // Check if the value is a finite number
        return typeof value === 'number' && Number.isFinite(value);
      }

    function ValidateEvent(event: Event) {
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
        if(!isFiniteNumber(event.duration) || event.duration <= 0) {
            event.duration = 60
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

                const userEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Event[];

                const EventsCollection = collection(db, 'users', user.uid, 'Events')
                const EventsSnapshot = await getDocs(EventsCollection)
                const EventsArray = EventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Event[];

                const EventsDictionary = EventsArray.reduce((acc, Event) => {
                acc[Event.id] = Event;
                return acc;
                }, {} as Record<string, Event>);
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


    const addEvent = async (event: Event) => {
        if (!user) {
            throw new Error('User not logged in')
            return
        }

        ValidateEvent(event)

        const docRef = await addDoc(collection(db, 'users', user.uid, 'events'), event)
        setEvents(prevEvents => [...prevEvents, { ...event, id: docRef.id }])

        console.log('Event added:', event)
    }
    
    const UpdateEvent = async (event: Event) => {
        if(event.id === undefined) { throw new Error('Event id is undefined') }
        if (!user) {
            throw new Error('User not logged in')
            return
        }
    
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

    function CreateEvent(hour?: string) {
        
        hour = hour || '00:00'

        setCreatingEvent(true)
    
        setNewEventData({
            title: '',
            description: '',
            hour: parseInt(hour.split(':')[0]),
            minute: parseInt(hour.split(':')[1]),
            duration: 60,
            id: '',
            EventTypeID: 0,
        })

        console.log(creatingEvent)
    }

    const removeEvent = async (id: string) => {
        if (!user) {
            throw new Error('User not logged in')
            return
        }
    
        await deleteDoc(doc(db, 'users', user.uid, 'events', id))
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id))
    }


    const value = {
        events: events,
        EventDict: EventDict,
        loading: false,

        addEvent: addEvent,
        removeEvent: async () => {},

        createEvent: CreateEvent,
        creatingEvent: creatingEvent,
        setCreatingEvent: setCreatingEvent,

        UpdateEvent: UpdateEvent,

        newEventData: newEventData,
    }

    return (
    <ScheduleContext.Provider value={value}>
        {props.children}
    </ScheduleContext.Provider>
    )
}