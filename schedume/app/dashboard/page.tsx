"use client"

import { DashboardFloatingDock } from '@/components/DashboardFloatingDock'
import DayCalendar from '@/components/DayCalendar'
import { EventCreator } from '@/components/EventCreator/EventCreator'
import { useAuth } from '@/context/AuthContext'
import { EventPeriod, EventPriority, ScheduleProvider, useSchedule } from '@/context/ScheduleContext'
import React, { useEffect, useState } from 'react'
import { ScheduleEvent } from '@/context/ScheduleContext'
import DatePickerModal from '@/components/DatePickerModal'
import DayContextProvider from '@/context/DayContext'
import WakeUpTimeModal from '@/components/WakeUpTimeModal'

import { cookies } from 'next/headers'

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
  settingWakeUpTime: boolean
  setSettingWakeUpTime: (value: boolean) => void;

  CreateEvent: (event?: ScheduleEvent) => void;
  date: Date;
  setDate: (date: Date) => void;

  editMode: boolean;
  setEditMode: (value: boolean) => void;
}

const DashboardContext = React.createContext<DashboardContextType>({
  creatingEvent: false,
  setCreatingEvent: () => {},
  changingDate: false,
  setChangingDate: () => {},
  settingWakeUpTime: false,
  setSettingWakeUpTime: () => {},
  CreateEvent: () => {},
  date: new Date(),
  setDate: () => {},

  editMode: false,
  setEditMode: () => {},
})


function MainContent() {
  // It's important to use the `useSchedule` hook inside the `ScheduleProvider` component

  const { newEventData, setNewEventData, } = useSchedule();

  const [creatingEvent, setCreatingEvent] = useState(false);
  const [isChangingDate, setIsChangingDate] = useState(false);
  const [settingWakeUpTime, setSettingWakeUpTime] = useState(false);
  useEffect(() => {
    console.log(settingWakeUpTime)
  }, [settingWakeUpTime])

  const cookieStore = cookies();
  const editModeCookie = cookieStore.get('editMode');

  const [editMode, setEditMode] = useState(editModeCookie || false);
  useEffect(() => {
    cookieStore.set('editMode', editMode.toString(), { path: '/dashboard' });
  }, [editMode]);
  

  const [date, setDate] = useState<Date>(new Date());

  function CreateEvent(event?: ScheduleEvent) {
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
        eventPriority: event?.eventPriority || EventPriority.Flexible,
    })
  }

  const CurrentDate = () => {
    return (
      <aside className='sm:justify-normal px-8 sm:text-left justify-center text-center top-24 sticky w-[20%]'>
        <h1 className="inline text-2xl font-bold  hover:bg-emerald-600 rounded-lg transition ease-in-out items-center">
          <span className="px-2">{date.toLocaleDateString()}</span>
        </h1>
        {date.getDate() === new Date().getDate() && (<p className='italic px-2'>AKA Today</p>)}
      </aside>
    )
  }

  const value = {
    creatingEvent,
    setCreatingEvent,
    changingDate: isChangingDate,
    setChangingDate: setIsChangingDate,
    settingWakeUpTime,
    setSettingWakeUpTime: setSettingWakeUpTime,
    CreateEvent,
    date,
    setDate,
    editMode,
    setEditMode,
  }
  
  return (
    <DashboardContext.Provider value={value}>
      <DayContextProvider>
      <CurrentDate/>

        {settingWakeUpTime && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <WakeUpTimeModal />
          </div>
        )}
        {creatingEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <EventCreator />
          </div>
        )}
        {isChangingDate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <DatePickerModal />
          </div>
        )}

        <DayCalendar />
        <DashboardFloatingDock />
      </DayContextProvider>
      
    </DashboardContext.Provider>
  );
}
