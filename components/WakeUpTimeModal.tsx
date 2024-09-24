'use client';

import React, { useEffect, useState } from 'react'
import { DatePicker } from './DatePicker'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card'
import { Label } from './ui/label'
import { Button } from './ui/button'
import TimeInput from './TimeInput'
import { useDashboard } from '@/app/dashboard/page'

export default function WakeUpTimeModal() {
    const { setSettingWakeUpTime, setWakeUpTime, wakeUpTime  } = useDashboard()

    const [time, setTime] = useState<Date>(wakeUpTime || new Date())

    function Submit()
    {
        const todayTime = new Date()
        todayTime.setHours(time.getHours(), time.getMinutes(), 0, 0)

        setWakeUpTime(todayTime)
        setSettingWakeUpTime(false)
        console.log('Wake up time set to: ', todayTime)
    }

    function Skip()
    {
        setSettingWakeUpTime(false)
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
            
            <TimeInput 
                defaultHour={time.getHours()} 
                defaultMinute={time.getMinutes()} 
                onHourChange={(s: string) => setTime((prev: string | number | Date) => {
                    const newTime = new Date(prev)
                    newTime.setHours(parseInt(s))
                    return newTime
                })} 
                onMinuteChange={(s: string) => setTime((prev: string | number | Date) => {
                    const newTime = new Date(prev)
                    newTime.setMinutes(parseInt(s))
                    return newTime
                })} />
            
        </form>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => Skip()}>Skip</Button>
            <Button variant="outline" onClick={() => Submit()}>Submit</Button>
        </CardFooter>
    </Card>
    )
}
