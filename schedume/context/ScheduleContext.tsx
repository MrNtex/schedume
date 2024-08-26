"use client"

import React, { useEffect } from "react";
import { useContext } from "react";
import { useAuth } from "./AuthContext";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";


interface EventType {
    id?: number;
    title: string;
    description: string;
    hour: number;
}

interface ScheduleContextType {
    events: EventType[];

    loading: boolean;

    addEvent: (event: EventType) => Promise<void>;
    removeEvent: (id: number) => Promise<void>;
}

const ScheduleContext = React.createContext<ScheduleContextType>({
    events: [],

    loading: false,

    addEvent: async () => {},
    removeEvent: async () => {},
})

export function useSchedule() {
  return useContext(ScheduleContext)
}

export function ScheduleProvider(props: { children: any }) {
    const { user } = useAuth()
    const [events, setEvents] = React.useState<EventType[]>([])
    const [loading, setLoading] = React.useState(true)

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

                const userEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as EventType[];
                setEvents(userEvents)
            } catch (error) {
                console.error('Error fetching events:', error)
            } finally {
                setLoading(false)
            }
        }


    }, [user])


    const addEvent = async (event: EventType) => {
        if (!user) {
            throw new Error('User not logged in')
            return
        }

        const docRef = await addDoc(collection(db, 'users', user.uid, 'events'), event)
        setEvents(prevEvents => [...prevEvents, { id: Number(docRef.id), ...event }])

    }

    const removeEvent = async (id: number) => {
        if (!user) {
            throw new Error('User not logged in')
            return
        }

        await deleteDoc(doc(db, 'users', user.uid, 'events', id.toString()))
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id))
    }


    const value = {
        events: events,
        loading: false,

        addEvent: async () => {},
        removeEvent: async () => {},
    }

    return (
    <ScheduleContext.Provider value={value}>
        {props.children}
    </ScheduleContext.Provider>
    )
}