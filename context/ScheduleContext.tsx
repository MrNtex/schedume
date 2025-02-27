"use client"

import React, { useEffect } from "react";
import { useContext } from "react";
import { useAuth } from "./AuthContext";
import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentReference, getDocs, limit, query, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useToast } from '@/components/ui/use-toast'
import { useCookies } from "next-client-cookies";

export interface EventType {
    id: string;

    name: string;
    color: string;
}

export interface CalendarType {
    id: string;
    name: string;
}

export const DefaultEvents: EventType[] = [
    { id:'0', name: 'Work', color: '#db524d' },
    { id:'1', name: 'School', color: '#ebc444' },
    { id:'2', name: 'Excercise', color: '#434884' },
    { id:'3', name: 'Liesure', color: '#69d16e' },
]
export enum EventPeriod {
    EveryDay,
    Weekday,
    WeekRange,
    Custom
}
export enum EventPriority {
    Flexible,
    FixedDuration,
    Fixed
}
export class ScheduleEvent {
    id: string = '';
    title: string = '';
    description: string = '';
    hour: number = 12;
    minute: number = 0;
    fixedTime: number | null = null

    duration: number = 60; // Duration in minutes
    fixedDuration: number | null = null; // Duration in minutes

    eventPriority = EventPriority.Flexible;
    
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
    events: { [id: string]: ScheduleEvent };
    localEvents: ScheduleEvent[];

    loading: boolean;

    addEvent: (event: ScheduleEvent) => Promise<void>;
    removeEvent: (id: string) => Promise<void>;

    UpdateEvent: (event: ScheduleEvent, local: boolean) => Promise<void>;

    newEventData?: ScheduleEvent;
    setNewEventData: (event: ScheduleEvent) => void;

    activeCalendarID: string;
    setActiveCalendarID: (id: string) => void;

    debug: () => void;
}

const ScheduleContext = React.createContext<ScheduleContextType>({
    events: {},
    localEvents: [],

    loading: false,

    addEvent: async () => {},
    removeEvent: async () => {},

    UpdateEvent: async () => {},

    newEventData: {title: '', description: '', hour: 0, minute: 0, duration: 60, EventTypeID: -1, id: '', eventPriority: EventPriority.Flexible, period: EventPeriod.EveryDay, weekdays: [false, false, false, false, false, false, false], dateRange: [new Date(), new Date()], fixedTime: null, fixedDuration: null},
    setNewEventData: () => {},

    activeCalendarID: '',
    setActiveCalendarID: () => {},

    debug: () => {},
})

export function useSchedule() {
  return useContext(ScheduleContext)
}


export function ScheduleProvider(props: { children: any }) {
    const { user } = useAuth()
    const [events, setEvents] = React.useState<{ [id: string]: ScheduleEvent }>({})
    const [localEvents, setLocalEvents] = React.useState<ScheduleEvent[]>([])
    useEffect(() => {
        setLocalEvents(JSON.parse(JSON.stringify(Object.values(events)))); // Deep copy);
    }, [events]);

    const [loading, setLoading] = React.useState(true)

    const [newEventData, setNewEventData] = React.useState<ScheduleEvent>()
    const [ showedWarning, setShowedWarning ] = React.useState(false)

    const { toast } = useToast()

    
    const cookies = useCookies();

    const activeCalendarCookie = cookies.get('activeCalendar');

    const [activeCalendarID, setActiveCalendarID] = React.useState<string>(activeCalendarCookie || '');
    useEffect(() => {
        cookies.set('activeCalendar', activeCalendarID, { path: '/' });
    }, [activeCalendarID]);
    const [activeCalendarRef, setActiveCalendarRef] = React.useState<DocumentReference | null>(null);
    
    async function getActiveCalendar(): Promise<CollectionReference> {
        if (!user) {
            throw new Error('User not logged in');
        }

        const calendarCollection = collection(db, 'users', user.uid, 'calendars');

        if (activeCalendarID) {
            return collection(db, 'users', user.uid, 'calendars', activeCalendarID, 'events');
        } else {
            const calendarSnapshot = await getDocs(query(calendarCollection, limit(1)));
            if (!calendarSnapshot.empty) {
                const calendarDoc = calendarSnapshot.docs[0];
                return collection(calendarDoc.ref, 'events');
            } else {
                throw new Error('No active calendar found');
            }
        }
    }

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
            setEvents({}) // Clear events if user is not logged in
            return
        }

        setLoading(true)
        const fetchEvents = async () => {
            // Fetch events from the server
            try {
            const eventsCollectionRef = await getActiveCalendar();
            const eventsSnapshot = await getDocs(eventsCollectionRef);
            
            const userEvents = eventsSnapshot.docs.map(doc => {
                const event = { id: doc.id, ...doc.data() } as ScheduleEvent;
                event.fixedTime = null;
                event.fixedDuration = null;
                
                return event;
            });

            const eventsDictionary = userEvents.reduce((acc, Event) => {
                acc[Event.id] = Event;
                return acc;
            }, {} as Record<string, ScheduleEvent>);
            setEvents(eventsDictionary)
            } catch (error) {
            console.error('Error fetching events:', error)
            } finally {
            setLoading(false)
            }
        }
        fetchEvents();

        console.log('Active calendar ID:', events)

    }, [user, activeCalendarID])


    const addEvent = async (event: ScheduleEvent) => {
        if (!user) {
            throw new Error('User not logged in')
        }

        ValidateEvent(event)

        const eventDocRef = await getActiveCalendar();

        const docRef = await addDoc(eventDocRef, event)
        await updateDoc(docRef, { id: docRef.id });
        setEvents(prevEvents => ({ ...prevEvents, [docRef.id]: { ...event, id: docRef.id } }))
    }
    
    const UpdateEvent = async (event: ScheduleEvent, localy: boolean = false) => {
        if (!event.id) {
            throw new Error('Event id is undefined');
        }
        if (!user) {
            throw new Error('User not logged in');
        }

        ValidateEvent(event);
        try {
            if(!localy) {

                const eventColectionRef = await getActiveCalendar();

                const eventDoc = doc(eventColectionRef, event.id);
                await updateDoc(eventDoc, {
                    ...event
                });

                setEvents(prevEvents => ({
                    ...prevEvents,
                    [event.id]: { ...prevEvents[event.id], ...event }
                }));

                setLocalEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));
            } else {
                if(!showedWarning) {
                    setShowedWarning(true)
                    toast({
                        title: "Warning",
                        description: "You are updating localy, this will not be saved to the server.",})
                }

                setLocalEvents(prevEvents => {
                    const eventExists = prevEvents.some(e => e.id === event.id);
                
                    if (eventExists) {
                        // Update the existing event
                        return prevEvents.map(e => e.id === event.id ? event : e);
                    } else {
                        // Add the new event
                        return [...prevEvents, event];
                    }
                });
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    }

    

    const removeEvent = async (id: string) => {
        if (!user) {
            throw new Error('User not logged in');
        }

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'events', id));
            setEvents(prevEvents => {
                const newEvents = { ...prevEvents };
                delete newEvents[id];
                return newEvents;
            });

        } catch (error) {
            console.error('Error removing event:', error);
        }
    }

    function debug() {
        console.log('Events:', events)
    }

    const value = {
        events: events,
        localEvents,
        loading: false,

        addEvent: addEvent,
        removeEvent: removeEvent,

        UpdateEvent: UpdateEvent,

        newEventData: newEventData,
        setNewEventData: setNewEventData,

        activeCalendarID: activeCalendarID,
        setActiveCalendarID: setActiveCalendarID,

        debug: debug,
    }

    return (
    <ScheduleContext.Provider value={value}>
        {props.children}
    </ScheduleContext.Provider>
    )
}