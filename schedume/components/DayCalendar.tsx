import { useState, useEffect } from 'react';
import CalendarEvent from './CalendarEvent';

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export default function DayCalendar() {
  const [events, setEvents] = useState<{ hour: string; title: string }[]>([]);
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

  const addEvent = (hour: string) => {
    const eventTitle = prompt('Enter event title');
    if (eventTitle) {
      setEvents([...events, { hour, title: eventTitle }]);
    }
  };

  const Hour = ({ hour }: { hour: string }) => {
    return (
        <div className="px-5 pb-12 flex items-center justify-center text-sm text-gray-800 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
          <div className="hover:bg-emerald-500 rounded-sm ease-in-out transition duration-300 cursor-pointer absolute" onClick={() => addEvent(hour)}>{hour}</div>
        
      </div>)
  }

  return (
    <div className='relative flex justify-center items-center py-5'>
      <div className=" relative w-[60%]">
        {/* Current Time Line */}
        {currentTime && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-red-500 w-[70%] mx-auto"
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
            <Hour hour={hour}/>
          ))}
        </div>
        <div className="absolute right-0 top-0 w-[30%]">
          {events
          .map((event, idx) => (
            <CalendarEvent eventId={idx} />
          ))}
        </div>
      </div>
      
    </div>
    
  );
}
