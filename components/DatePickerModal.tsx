import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { DatePicker } from './DatePicker'
import { useDashboard } from '@/app/dashboard/page'
import { Button } from './ui/button'
//import { DatePicker } from './DatePicker'

export default function DatePickerModal() {

    const { setChangingDate, setDate, date } = useDashboard()

    function Submit(date: Date)
    {
        setDate(date)
        setChangingDate(false)
    }

  return (
    <Card>
        <CardHeader>
        <CardTitle>Select date</CardTitle>
        <CardDescription>Click on the button below.</CardDescription>
        </CardHeader>
        <CardContent>
        <form className='flex flex-col gap-2'>
            <Label htmlFor="time">Select date</Label>

            <DatePicker date={date} setDate={Submit}/>
            
        </form>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setChangingDate(false)}>Cancel</Button>
        </CardFooter>
    </Card>
  )
}
