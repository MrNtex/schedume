import React, { useEffect } from 'react'
import { useAuth } from './AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

interface DayContextType {
    // Define the properties and methods of your context
    lastLogin: Date;
    setLastLogin: (time: Date) => void;

    wakeUpTime?: Date;
    setWakeUpTime: (time: Date) => void;
}

const DayContext = React.createContext<DayContextType>({
    lastLogin: new Date(),
    setLastLogin: () => {},

    wakeUpTime: undefined,
    setWakeUpTime: () => {},
})

export function useDayContext() {
    return React.useContext(DayContext)
}

export default function DayContextProvider(props: { children: any }) {
    const { user, userDataObj, setUserDataObj } = useAuth()

    const [wakeUpTime, setWakeUpTime] = React.useState(new Date())
    const [lastLogin, setLastLogin] = React.useState(new Date())
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        if (userDataObj == null) {
            setWakeUpTime(new Date()) // Clear events if user is not logged in
            return
        }
        
        console.log('Fetching wake up time')
        console.log(userDataObj)

        setUserDataObj({ ...userDataObj, wakeUpTime: wakeUpTime, lastLogin: lastLogin })
    }, [user])

    const value = {
        wakeUpTime,
        setWakeUpTime,
        lastLogin,
        setLastLogin,
    }

    return (
        <DayContext.Provider value={value}>
            {props.children}
        </DayContext.Provider>
    )
}
