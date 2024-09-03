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

import { useSchedule } from "@/context/ScheduleContext"
import TimeInput from "../TimeInput"

import EventCreatorAdvanced from "./EventCreatorAdvanced"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import PrioritySelector from "./PrioritySelector"

export interface AdvancedData {
  period?: string
  description: string
}
export function EventCreator() {
  const { addEvent, newEventData, setCreatingEvent } = useSchedule()

  const [eventName, setEventName] = React.useState('')
  const [hour, setHour] = React.useState('')
  const [minute, setMinute] = React.useState('')

  
  const [advancedData, setAdvancedData] = React.useState<AdvancedData>({
    description: ''
  })

  const ShareAdvancedData = (data: AdvancedData) => {
    setAdvancedData(data)
  }

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
      id: ""
    })

    console.log('Event created:', eventName, hour, minute)
  }

  return (
    <Tabs defaultValue="basic" className="w-[20%]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <Card>
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
                
              </div>

              <PrioritySelector/>
              
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCreatingEvent(false)}>Cancel</Button>
            <Button onClick={() => handleCreateEvent()}>Deploy</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="advanced">
      <Card>
          <CardHeader>
            <CardTitle>Create event</CardTitle>
            <CardDescription>Add new event in one click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <EventCreatorAdvanced data={advancedData} ShareAdvancedData={(data: AdvancedData) => ShareAdvancedData(data)} />
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCreatingEvent(false)}>Cancel</Button>
            <Button onClick={() => handleCreateEvent()}>Deploy</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
