import React, { useState } from 'react';
import { Input } from './ui/input';
import { EventType } from '@/context/ScheduleContext';
import { Button } from './ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';

export default function TimeInput({ event }: { event?: EventType }) 
{ // Update the type of the event parameter
  let defaultHour = '';
  if(event) defaultHour = event.hour < 10 ? `0${event.hour}` : event.hour.toString();
  const [hour, setHour] = useState(defaultHour);
  const [minute, setMinute] = useState('');

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

  const changeHour = (amount: number) => {
    setHour((prev) => {
      let newHour = (Number(prev) + amount) % 24;
      if (newHour < 0) newHour = 23
      return newHour < 10 ? `0${newHour}` : newHour.toString();
    });
  };

  const changeMinute = (amount: number) => {
    setMinute((prev) => {
        let newMinute = Math.floor((Number(prev) + amount) / 15) * 15;
        newMinute = newMinute % 60;
        if (newMinute < 0) newMinute = 60 + newMinute;
        return newMinute < 10 ? `0${newMinute}` : newMinute.toString();
    });
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 relative w-24">
      <Button
        type='button'
        variant="outline"
        size="icon"
        className="h-5 w-5 shrink-0 rounded-full absolute left-2"
        onClick={() => changeHour(-1)}
        >
        <MinusIcon className="h-4 w-4" />
        <span className="sr-only">Decrease</span>
      </Button>
      <Input
        id="timeHour"
        className="w-full text-center pl-2 pr-2" 
        value={hour}
        onChange={handleHourChange}
        maxLength={2}
        placeholder="00"
      />
      <Button
        type='button'
        variant="outline"
        size="icon"
        className="h-5 w-5 shrink-0 rounded-full absolute right-2"
        onClick={() => changeHour(1)}
        >
        <PlusIcon className="h-4 w-4" />
        <span className="sr-only">Increase</span>
      </Button>
      </div>
      <span className="mx-2">:</span>
      <div className="flex items-center gap-2 relative w-24">
      <Button
        type='button'
        variant="outline"
        size="icon"
        className="h-5 w-5 shrink-0 rounded-full absolute left-2"
        onClick={() => changeMinute(-15)}
        >
        <MinusIcon className="h-4 w-4" />
        <span className="sr-only">Decrease</span>
      </Button>
      <Input
        id="timeMinute"
        className="w-full text-center pl-2 pr-2" // Adjust padding for button spac
        value={minute}
        onChange={handleMinuteChange}
        maxLength={2}
        placeholder="00"
      />
      <Button
        type='button'
        variant="outline"
        size="icon"
        className="h-5 w-5 shrink-0 rounded-full absolute right-2"
        onClick={() => changeMinute(15)}
        >
        <PlusIcon className="h-4 w-4" />
        <span className="sr-only">Increase</span>
      </Button>
      </div>
      
      
    </div>
  );
}
