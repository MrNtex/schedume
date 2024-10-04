import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from './ui/input'
import { useSchedule } from '@/context/ScheduleContext'
import { useDashboard } from '@/app/dashboard/page'
import { useAuth } from '@/context/AuthContext'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase'
import { useToast } from './ui/use-toast'



export default function CalendarPopup() {

    const { setChangingCalendar } = useDashboard()
    const { setActiveCalendarID, activeCalendarID } = useSchedule()

    const { user } = useAuth()

    const [newCalendarName, setNewCalendarName] = React.useState('')

    const { toast } = useToast()
    

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newCalendarName === '') {
        toast({
            title: "Uh oh! Something went wrong.",
            description: "Please fill in the calendar name.",
        })
        return;
    }

    try {
        if (!user) throw new Error('User not found');

        const calendarsCollectionRef = collection(db, `users/${user.uid}/calendars`);
        const docRef = await addDoc(calendarsCollectionRef, { name: newCalendarName })

        setActiveCalendarID(docRef.id)
        setChangingCalendar(false)
    }
    catch (error) {
        toast({
            title: "Uh oh! Something went wrong.",
            description: "Error creating calendar.",
        })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>Create new</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <form onSubmit={handleSubmit}>
            <Label className='pt-4 pl-4'>Calendar Name: </Label>
            <div className='p-4'>
                <Input onChange={(e) => setNewCalendarName(e.target.value)} placeholder="Calendar Name" />
            </div>
            <div className='justify-center flex p-2'>
                <Button className='p-4'>Create</Button>
            </div>
            
        </form>
      </PopoverContent>
    </Popover>
  )
}
