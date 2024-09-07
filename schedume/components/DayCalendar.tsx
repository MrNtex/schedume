import React, { useState, useEffect } from 'react';
import CalendarEvent from './CalendarEvent';
import { EventPeriod, useSchedule } from '@/context/ScheduleContext';
import { useDashboard } from '@/app/dashboard/page';
import { ScheduleEvent } from '@/context/ScheduleContext';

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);


export default function DayCalendar() {
  const { events, addEvent, removeEvent, loading, newEventData } = useSchedule();
  const { CreateEvent } = useDashboard();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setCurrentTime(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  const [date, setDate] = useState(new Date());


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
      removeEvent(event.id); // it will remove all events with invalid id
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
        return event.weekdays[date.getDay()];
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
    return events
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
        {currentTime && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-red-500 mx-auto"
            style={{
              top: `${(new Date().getHours() * 60 + new Date().getMinutes()) / (24 * 60) * 100}%`,

            }}
          >
            <span className="absolute left-0 -translate-y-1/2 -translate-x-12 bg-red-500 text-white px-2 py-1 rounded">
              {currentTime}
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 border-gray-300 mx-auto">
          {hours.map((hour) => (
            <Hour hour={hour} key={hour}/>
          ))}
        </div>
        
      </div>
      
    </div>
    
  );
}
