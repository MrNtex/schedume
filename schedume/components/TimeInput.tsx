import React, { useState } from 'react';
import { Input } from './ui/input';
import { EventType } from '@/context/ScheduleContext';

export default function TimeInput({ event }: { event?: EventType }) 
{ // Update the type of the event parameter
  let defaultHour = '00';
  if(event) defaultHour = event.hour < 10 ? `0${event.hour}` : event.hour.toString();
  const [hour, setHour] = useState(defaultHour);
  const [minute, setMinute] = useState('00');

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.length > 2) {
      // If more than 2 digits, jump to minutes
      value = value.slice(0, 2);
      document.getElementById('timeMinute')?.focus();
    }

    if (Number(value) > 24) value = '24'; // Restrict hour to max 24

    setHour(value);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.length > 2) {
      // Restrict to 2 digits
      value = value.slice(0, 2);
    }

    if (Number(value) > 59) value = '59'; // Restrict minute to max 59

    setMinute(value);
  };

  const increaseHour = () => {
    setHour((prev) => {
      const newHour = Math.min(Number(prev) + 1, 24);
      return newHour < 10 ? `0${newHour}` : newHour.toString();
    });
  };

  const decreaseHour = () => {
    setHour((prev) => {
      const newHour = Math.max(Number(prev) - 1, 0);
      return newHour < 10 ? `0${newHour}` : newHour.toString();
    });
  };

  return (
    <div className="flex items-center">
      <button type="button" onClick={decreaseHour}>-</button>
      <Input
        id="timeHour"
        value={hour}
        onChange={handleHourChange}
        maxLength={2}
        placeholder="HH"
      />
      <button type="button" onClick={increaseHour}>+</button>
      <span className="mx-2">:</span>
      <Input
        id="timeMinute"
        value={minute}
        onChange={handleMinuteChange}
        maxLength={2}
        placeholder="MM"
      />
    </div>
  );
}
