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

import { EventPeriod, ScheduleEvent, useSchedule } from "@/context/ScheduleContext"
import TimeInput from "../TimeInput"

import EventCreatorAdvanced from "./EventCreatorAdvanced"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import PrioritySelector from "./PrioritySelector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useAuth } from "@/context/AuthContext"
import { useDashboard } from "@/app/dashboard/page"
import { Trash } from "lucide-react"
import AddEventType from "../AddEventType"

export interface AdvancedData {
  period?: EventPeriod
  weekdays?: boolean[]
  dateRange?: Date[]
  description: string
  duration: number
}
export function EventCreator() {
  const { addEvent, newEventData, UpdateEvent, removeEvent } = useSchedule()
  const { creatingEvent, setCreatingEvent } = useDashboard()

  const { userEventTypes, removeEventType } = useAuth()

  const [ newEventDataLocal, setNewEventDataLocal ] = React.useState<ScheduleEvent>(newEventData || {title: '', description: '', hour: 0, minute: 0, duration: 60, EventTypeID: -1, id: '', eventPriority: 0, period: EventPeriod.EveryDay, weekdays: [false, false, false, false, false, false, false], dateRange: [new Date(), new Date()]})

  function handleCreateEvent() {
    setCreatingEvent(false)

    if(newEventData?.id)
    {
      UpdateEvent(newEventDataLocal, false)
    }else{
      addEvent(newEventDataLocal)
    }
  }

  function handleDeleteEvent() {
    setCreatingEvent(false)
    if(newEventData?.id)
    {
      removeEvent(newEventData.id)
    }
  }

  function Close()
  {
    setCreatingEvent(false)
  }

  function handeRemoveEventType(e: React.MouseEvent<HTMLDivElement, MouseEvent>, eventType: any)
  {
    e.preventDefault();
    e.stopPropagation();
    removeEventType(eventType);
  }

  const EventTypes = () => {
    return Object.keys(userEventTypes).map((key) => {
      return (
        <div className="relative">
          <SelectItem value={key} key={key}>
            <div className="flex items-center">
              <div
                className="rounded-full w-3 h-3 border-2 border-zinc-900"
                style={{ backgroundColor: userEventTypes[key].color }}
              />
              <div className="ml-2">{userEventTypes[key].name}</div>
            </div>
          </SelectItem>
          <div onClick={(e) => handeRemoveEventType(e, userEventTypes[key])} className="absolute top-1 right-1 hover:bg-zinc-900 rounded-md h-6 w-6 flex items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out">
            <Trash size={16} />
          </div>
        </div>
        
      );
    })
  }
  
  const Footer = () => {
    return (
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => Close()}>Cancel</Button>
        {newEventData?.id && <Button variant="destructive" onClick={() => handleDeleteEvent()}>Delete Event</Button>}
        <Button onClick={() => handleCreateEvent()}>Deploy</Button>
      </CardFooter>
    )
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
                  <div className="flex justify-center">
                    <TimeInput defaultHour={newEventDataLocal.hour} defaultMinute={newEventDataLocal.minute} onHourChange={(s: string) => setNewEventDataLocal({...newEventDataLocal, hour: parseInt(s)})} onMinuteChange={(s: string) => setNewEventDataLocal({...newEventDataLocal, minute: parseInt(s)})}/>
                  </div>
                  
                  
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={newEventDataLocal.title} placeholder="Name of your event" onChange={(e) => setNewEventDataLocal({...newEventDataLocal, title: e.target.value})}/>
                </div>
                
              </div>

              <PrioritySelector event={newEventDataLocal} setEvent={setNewEventDataLocal}/>

              <div className="flex flex-col space-y-1.5">
                <Label>Type</Label>
                <Select onValueChange={(value) => setNewEventDataLocal({...newEventDataLocal, EventTypeID: parseInt(value)})}>
                    <SelectTrigger id="period">
                    <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <EventTypes/>
                      <AddEventType/>
                    </SelectContent>
                </Select>
              </div>

              
            </form>
          </CardContent>
          <Footer/>
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
              <EventCreatorAdvanced event={newEventDataLocal} setEvent={(event: ScheduleEvent) => setNewEventDataLocal(event)} />
            </form>
          </CardContent>
          <Footer/>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
