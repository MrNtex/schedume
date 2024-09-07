"use client"

import { DashboardFloatingDock } from '@/components/DashboardFloatingDock'
import DayCalendar from '@/components/DayCalendar'
import { EventCreator } from '@/components/EventCreator/EventCreator'
import Login from '@/components/Login'
import { FloatingDock } from '@/components/ui/floating-dock'
import { useAuth } from '@/context/AuthContext'
import { EventPeriod, ScheduleProvider, useSchedule } from '@/context/ScheduleContext'
import { Main } from 'next/document'
import React, { useEffect, useState } from 'react'
import { ScheduleEvent } from '@/context/ScheduleContext'
import { Calendar } from '@/components/ui/calendar'
import { DatePicker } from '@/components/DatePicker'

export function useDashboard() {
  return React.useContext(DashboardContext)
}

export default function Page() {
  const { user, userDataObj } = useAuth();

  if (!user) {
    return <div>No user</div>;
  }

  if (!userDataObj) {
    return <div>No user data</div>;
  }

  

  return (
    <ScheduleProvider>
      <MainContent />
    </ScheduleProvider>
  );
}

interface DashboardContextType {
  creatingEvent: boolean
  setCreatingEvent: (value: boolean) => void;
  changingDate: boolean
  setChangingDate: (value: boolean) => void;
  CreateEvent: (event?: ScheduleEvent) => void;
}

const DashboardContext = React.createContext<DashboardContextType>({
  creatingEvent: false,
  setCreatingEvent: () => {},
  changingDate: false,
  setChangingDate: () => {},
  CreateEvent: () => {},
})


function MainContent() {
  // It's important to use the `useSchedule` hook inside the `ScheduleProvider` component

  const { newEventData, setNewEventData, } = useSchedule();

  const [creatingEvent, setCreatingEvent] = useState(false);
  const [isChangingDate, setIsChangingDate] = useState(false);

  const [date, setDate] = useState<Date>(new Date());

  function CreateEvent(event?: ScheduleEvent) {
    console.log('Creating event')

    setCreatingEvent(true)

    setNewEventData({
        title: event?.title || '',
        description: event?.description || '',
        hour: event?.hour || 12,
        minute: event?.minute || 0,
        duration: event?.duration || 60,
        id: '',
        EventTypeID: event?.EventTypeID || -1,
        period: event?.period || EventPeriod.EveryDay,
    })
}

const CurrentDate = () => {
  return (
    <div className='sm:justify-normal px-8 sm:text-left justify-center text-center top-24 sticky'>
      <div className="text-2xl font-bold  hover:bg-emerald-600">{date.toLocaleDateString()}</div>
      {date.getDate() === new Date().getDate() && (<p className='italic'>AKA Today</p>)}
    </div>
  )
}

  const value = {
    creatingEvent,
    setCreatingEvent,
    changingDate: isChangingDate,
    setChangingDate: setIsChangingDate,
    CreateEvent,
  }
  
  return (
    <DashboardContext.Provider value={value}>
      <CurrentDate/>


      {creatingEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EventCreator />
        </div>
      )}

      
      <DayCalendar />
      <DashboardFloatingDock />
    </DashboardContext.Provider>
  );
}
