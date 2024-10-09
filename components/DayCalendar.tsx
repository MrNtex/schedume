import React, { useState, useEffect } from 'react';
import CalendarEvent from './CalendarEvent';
import { EventPeriod, EventPriority, useSchedule } from '@/context/ScheduleContext';
import { useDashboard } from '@/app/dashboard/page';
import { ScheduleEvent } from '@/context/ScheduleContext';
import HourOnDayCalendar from './HourOnDayCalendar';
import { getLocalEvents } from '@/lib/local_events';
import { Timestamp } from 'firebase/firestore';

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);


export default function DayCalendar() {
  const { events, addEvent, removeEvent, loading, newEventData, localEvents } = useSchedule();
  const { CreateEvent, date, editMode, setSettingWakeUpTime, wakeUpTime } = useDashboard();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);


  const Hour = ({ hour }: { hour: string }) => {
    return (
        <div className="px-6 pb-12 flex items-center justify-center text-sm text-gray-800 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
          <div className="hover:bg-emerald-500 px-2 rounded-sm ease-in-out transition duration-300 cursor-pointer absolute" onClick={() => CreateEvent(new ScheduleEvent(parseInt(hour)))}>{hour}</div>
        
      </div>)
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  function ValidateEvent(event: ScheduleEvent) {
    if (event.id === '' || event.id == null) {
      
      //removeEvent(event.id); // it will remove all events with invalid id
      return false;
    }

    function stripTime(date: Date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    switch (event.period) {
      case EventPeriod.EveryDay:
        return true;
      case EventPeriod.Weekday:
      case EventPeriod.WeekRange:
        if (event.weekdays == null) {
          console.log('Invalid Event Weekdays');
          return false;
        }
        return event.weekdays[(date.getDay()+6)%7];
      case EventPeriod.Custom:
        if (event.dateRange == null) {
          console.log('Invalid Event DateRange for ', event);
          return false;
        }
        const start = event.dateRange[0] as any as Timestamp;
        const end = event.dateRange[1] as any as Timestamp;
        
        const startTimestamp = new Timestamp(start.seconds, start.nanoseconds);
        const endTimestamp = new Timestamp(end.seconds, end.nanoseconds);

        const startDay = stripTime(startTimestamp.toDate());
        const endDay = stripTime(endTimestamp.toDate());
        const currentDay = stripTime(date);
        
        return currentDay >= startDay && currentDay <= endDay;
    }

    return true;
  }

  const Events = () => {
      if (currentTime.getDate() !== date.getDate() || editMode) {
  
        return Object.values(events)
        .filter((event: ScheduleEvent) => ValidateEvent(event as ScheduleEvent))
        .map((event: ScheduleEvent) => (
          <React.Fragment key={event.id}>
            <CalendarEvent event={event} partial={false} currentTime={currentTime}/>
            {event.hour * 60 + event.minute + event.duration > 24 * 60 && (
              <CalendarEvent event={event} partial={true} currentTime={currentTime} />
            )}
          </React.Fragment>
        ));
      }

    return getLocalEvents(localEvents.filter((event) => ValidateEvent(event)), wakeUpTime || new Date(0, 0, 0, 0, 0))
      .map((event, idx) => (
        <React.Fragment key={event.id}>
          <CalendarEvent event={event} partial={false} currentTime={currentTime} />
          {event.hour * 60 + event.minute + event.duration > 24 * 60 && (
            <CalendarEvent event={event} partial={true} currentTime={currentTime} />
          )}
        </React.Fragment>
      ));

  }

  return (
    <div className='relative flex justify-center items-center py-5'>
      <div className=" relative w-[60%]">
        <Events />
        {/* Current Time Line */}
        <HourOnDayCalendar date={currentTime} />
        {currentTime.getDate() == date.getDate() && (<HourOnDayCalendar date={wakeUpTime} onClick={() => setSettingWakeUpTime(true)} />)}
        <div className="grid grid-cols-1 border-gray-300 mx-auto">
          {hours.map((hour) => (
            <Hour hour={hour} key={hour}/>
          ))}
        </div>
        
      </div>
      
    </div>
    
  );
}
