import React, { useState, useEffect } from 'react';
import CalendarEvent from './CalendarEvent';
import { EventPeriod, useSchedule } from '@/context/ScheduleContext';
import { useDashboard } from '@/app/dashboard/page';
import { ScheduleEvent } from '@/context/ScheduleContext';
import { useDayContext } from '@/context/DayContext';
import HourOnDayCalendar from './HourOnDayCalendar';

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);


export default function DayCalendar() {
  const { events, addEvent, removeEvent, loading, newEventData } = useSchedule();
  const { CreateEvent, date } = useDashboard();
  const { wakeUpTime } = useDayContext();

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
      console.log('Invalid Event ID');
      //removeEvent(event.id); // it will remove all events with invalid id
      return false;
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
          console.log('Invalid Event DateRange');
          return false;
        }
        return date >= event.dateRange[0] && date <= event.dateRange[1];
    }

    return true;
  }

  const Events = () => {
    let fixedEvents: ScheduleEvent[] = []
    let endTime = (wakeUpTime?.getHours() ?? 0) * 60 + (wakeUpTime?.getMinutes() ?? 0);

    events.sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));

    events.forEach(element => {
      let startTime = element.hour * 60 + element.minute;
      if (startTime > endTime) {
        fixedEvents.push(element);
        endTime = startTime + element.duration;
      }
      else {
        element.hour = Math.floor(endTime / 60);
        element.minute = endTime % 60;
        fixedEvents.push(element);
        endTime = startTime + element.duration;
      }
      console.log(element);
    });

    return fixedEvents
      .filter((event) => ValidateEvent(event))
      .map((event) => (
        <React.Fragment key={event.id}>
          <CalendarEvent event={event} partial={false} />
          {event.hour * 60 + event.minute + event.duration > 24 * 60 && (
            <CalendarEvent event={event} partial={true} />
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
        <HourOnDayCalendar date={wakeUpTime} />
        <div className="grid grid-cols-1 border-gray-300 mx-auto">
          {hours.map((hour) => (
            <Hour hour={hour} key={hour}/>
          ))}
        </div>
        
      </div>
      
    </div>
    
  );
}
