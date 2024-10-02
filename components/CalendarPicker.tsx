import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Label } from '@radix-ui/react-dropdown-menu'
import { DatePicker } from './DatePicker'
import { useDashboard } from '@/app/dashboard/page'
import { useSchedule } from '@/context/ScheduleContext'
import { CalendarType } from '@/context/ScheduleContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/context/AuthContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'


export default function CalendarPicker() {

    const { setChangingCalendar } = useDashboard()
    const { setActiveCalendarID, activeCalendarID } = useSchedule()
    const { user } = useAuth()

    const [ calendars, setCalendars ] = React.useState<CalendarType[]>([])
    const [ loading, setLoading ] = React.useState(true)

    const fetchCalendars = async () => {
        if (!user) return;
        setLoading(true)
        try {
            console.log('fetching calendars')
            const calendarsCollectionRef = collection(db, `users/${user.uid}/calendars`);
            const calendarsSnapshot = await getDocs(calendarsCollectionRef);
            
            const userCalendars = calendarsSnapshot.docs.map(doc => {
                const event = { id: doc.id, ...doc.data() } as CalendarType;
                return event;
            });

            setCalendars(userCalendars)
            } catch (error) {
            console.error('Error fetching events:', error)
            } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCalendars()
    }, [user])


  return (
    <Card>
        <CardHeader>
        <CardTitle>Select Calendar</CardTitle>
        <CardDescription>Click on the select below.</CardDescription>
        </CardHeader>
        <CardContent>
        <form className='flex flex-col gap-2'>
            <Select onValueChange={(value) => setActiveCalendarID(value)} defaultValue={activeCalendarID}>
            <SelectTrigger id="period">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
            {calendars.map(calendar => (
                <SelectItem key={calendar.id} value={calendar.id}>{calendar.name}</SelectItem>
            ))}
            </SelectContent>
            </Select>
        </form>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setChangingCalendar(false)}>Cancel</Button>
        </CardFooter>
    </Card>
  )
}
