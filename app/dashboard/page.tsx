"use client"

import { DashboardFloatingDock } from '@/components/DashboardFloatingDock'
import DayCalendar from '@/components/DayCalendar'
import { EventCreator } from '@/components/EventCreator/EventCreator'
import { useAuth } from '@/context/AuthContext'
import { EventPeriod, EventPriority, ScheduleProvider, useSchedule } from '@/context/ScheduleContext'
import React, { use, useEffect, useState } from 'react'
import { ScheduleEvent } from '@/context/ScheduleContext'
import DatePickerModal from '@/components/DatePickerModal'
import WakeUpTimeModal from '@/components/WakeUpTimeModal'

import { useCookies } from 'next-client-cookies';
import { getLocalEvents } from '@/lib/local_events'
import { set } from 'date-fns'
import CalendarPicker from '@/components/CalendarPicker'
import GoogleCalendar from '@/components/GoogleCalendar'

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
  wakeUpTime: Date;
  setWakeUpTime: (value: Date) => void;

  CreateEvent: (event?: ScheduleEvent) => void;
  date: Date;
  setDate: (date: Date) => void;

  editMode: boolean;
  setEditMode: (value: boolean) => void;

  changingCalendar: boolean;
  setChangingCalendar: (value: boolean) => void;

  fetchingGoogleEvents: boolean;
  setFetchingGoogleEvents: (value: boolean) => void;
}

const DashboardContext = React.createContext<DashboardContextType>({
  creatingEvent: false,
  setCreatingEvent: () => {},
  changingDate: false,
  setChangingDate: () => {},

  settingWakeUpTime: false,
  setSettingWakeUpTime: () => {},
  wakeUpTime: new Date(),
  setWakeUpTime: () => {},

  CreateEvent: () => {},
  date: new Date(),
  setDate: () => {},

  editMode: false,
  setEditMode: () => {},

  changingCalendar: false,
  setChangingCalendar: () => {},

  fetchingGoogleEvents: false,
  setFetchingGoogleEvents: () => {},
})


function MainContent() {
  // It's important to use the `useSchedule` hook inside the `ScheduleProvider` component
  const { events } = useSchedule();

  const { newEventData, setNewEventData } = useSchedule();

  const [creatingEvent, setCreatingEvent] = useState(false);
  const [isChangingDate, setIsChangingDate] = useState(false);
  const [settingWakeUpTime, setSettingWakeUpTime] = useState(false);

  const [date, setDate] = useState<Date>(new Date());

  const { user, userDataObj, setUserDataObj } = useAuth()
  const [wakeUpTime, setWakeUpTime] = React.useState<Date>(userDataObj?.wakeUpTime || new Date())

  const [fetchingGoogleEvents, setFetchingGoogleEvents] = useState(true)

  useEffect(() => {
    if (user == null) return
    if (userDataObj == null) return

    setUserDataObj({ ...userDataObj, wakeUpTime })
  }, [wakeUpTime])
  useEffect(() => {
    setWakeUpTime(userDataObj?.wakeUpTime || new Date())

    if (userDataObj == null) {
        setWakeUpTime(new Date()) // Clear events if user is not logged in
        return
    }

    if (wakeUpTime.toDateString() != new Date().toDateString()) {
        setSettingWakeUpTime(true)
    }
  }, [user])
  

  const cookies = useCookies();

  const editModeCookie = cookies.get('editMode') == "true";

  const [editMode, setEditMode] = useState(editModeCookie || false);
  useEffect(() => {
    cookies.set('editMode', editMode.toString(), { path: '/' });
  }, [editMode]);
  
  const [changingCalendar, setChangingCalendar] = useState(false);

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
        fixedDuration: event?.fixedDuration || null,
        fixedTime: event?.fixedTime || null,
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
    wakeUpTime,
    setWakeUpTime,

    CreateEvent,
    date,
    setDate,
    editMode,
    setEditMode,

    changingCalendar,
    setChangingCalendar,

    fetchingGoogleEvents,
    setFetchingGoogleEvents
  }
  
  return (
    <DashboardContext.Provider value={value}>
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
        {changingCalendar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <CalendarPicker />
          </div>
        )}
        {fetchingGoogleEvents && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <GoogleCalendar />
          </div>
        )}


        <DayCalendar />
        <DashboardFloatingDock />
      
    </DashboardContext.Provider>
  );
}
