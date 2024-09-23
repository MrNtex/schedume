import React, { useEffect } from 'react'
import { Slider } from '../ui/slider'
import { Label } from '../ui/label'
import { EventPriority, ScheduleEvent } from '@/context/ScheduleContext';

export default function PrioritySelector({event, setEvent}: {event: ScheduleEvent, setEvent: (event: ScheduleEvent) => void}) {

  const [priority, setPriority] = React.useState<EventPriority>(event.eventPriority || EventPriority.Flexible);
  useEffect(() => {
    setEvent({...event, eventPriority: priority});
  }, [priority]);
  const emotes = ['💚', '🔥', '🔒'];
  const text = ['Flexible', 'Fixed Duration', 'FIXED'];

  function handleValueChange(number: number[]) // Why is this an array?
  {
    setPriority(number[0]);
  }

  const renderEmotes = () => ( 
    <div className='p-2 w-full justify-center'>
      <p className='text-3xl text-center w-full'>{emotes[priority]}</p>
      <p className='text-center w-full'>{text[priority]}</p>
    </div>
  );

  return (
    <div className='py-4'>
      <Label>Priority</Label>
      <div className='flex items-center justify-center w-full'>
        {renderEmotes()}
      </div>
      
      <div className='relative'>
        <div className='absolute w-full h-full flex items-center justify-between'>
          <div className={`w-5 h-5 ${priority >= 1 ? 'bg-emerald-500' : 'bg-zinc-800'} z-10 rounded-lg border-zinc-950 border-[3px]`}/>
          <div className={`w-5 h-5 ${priority >= 2 ? 'bg-emerald-500' : 'bg-zinc-800'} z-10 rounded-lg border-zinc-950 border-[3px]`}/>
          <div className={`w-5 h-5 ${priority >= 3 ? 'bg-emerald-500' : 'bg-zinc-800'} z-10 rounded-lg border-zinc-950 border-[3px]`}/>
        </div>
        <Slider className='p-2' max={2} step={1} defaultValue={[priority]} onValueChange={(value) => handleValueChange(value)}/>
      </div>
      
    </div>
  );
}
