import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useSchedule } from "@/context/ScheduleContext"
import TimeInput from "./TimeInput"

export function EventCreator() {
  const { addEvent, newEventData, setCreatingEvent } = useSchedule()

  const [eventName, setEventName] = React.useState('')
  const [hour, setHour] = React.useState('')
  const [minute, setMinute] = React.useState('')

  const [period, setPeriod] = React.useState('')

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weekday = weekdays[new Date().getDay()]

  function handleCreateEvent() {
    setCreatingEvent(false)

    if(!hour)
    {
      setHour('00')
    }
    if(!minute)
    {
      setMinute('00')
    }

    if(!eventName)
    {
      setEventName('New Event')
    }

    addEvent({
      title: eventName,
      description: '',
      hour: parseInt(hour),
      minute: parseInt(minute),
      duration: 60,
    })

    console.log('Event created:', eventName, hour, minute, period)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create event</CardTitle>
        <CardDescription>Add new event in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div>
              <Label htmlFor="time">Time</Label>
              <TimeInput event={newEventData} onHourChange={(s: string) => setHour(s)} onMinuteChange={(s: string) => setMinute(s)}/>
              
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your event" onChange={(e) => setEventName(e.target.value)}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="period">Period</Label>
              <Select>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="EveryDay">Every day</SelectItem>
                  <SelectItem value="EveryMonday">Every {weekday}</SelectItem>
                  <SelectItem value="Once">Once</SelectItem>
                  <SelectItem value="Once">More...</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setCreatingEvent(false)}>Cancel</Button>
        <Button onClick={() => handleCreateEvent()}>Deploy</Button>
      </CardFooter>
    </Card>
  )
}
