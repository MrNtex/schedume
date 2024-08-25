import { useState, useEffect } from 'react';

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

  return (
    <div className="relative">
      <div className="grid grid-cols-1 border-gray-300">
        {hours.map((hour) => (
          <div
            key={hour}
            className="relative border-t border-gray-300 h-16 cursor-pointer"
            onClick={() => addEvent(hour)}
          >
            <div className="absolute -left-12 top-2 text-gray-500">{hour}</div>
            {events
              .filter((event) => event.hour === hour)
              .map((event, index) => (
                <div
                  key={index}
                  className="absolute left-0 top-2 bg-blue-200 p-2 rounded text-sm"
                >
                  {event.title}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Current Time Line */}
      {currentTime && (
        <div
          className="absolute left-0 right-0 h-0.5 bg-red-500"
          style={{
            top: `${(new Date().getHours() * 60 + new Date().getMinutes()) / 1440 * 100}%`,
          }}
        >
          <span className="absolute left-0 -translate-y-1/2 -translate-x-12 bg-red-500 text-white px-2 py-1 rounded">
            {currentTime}
          </span>
        </div>
      )}
    </div>
  );
}
