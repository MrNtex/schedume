import React, { use, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '@radix-ui/react-dropdown-menu'
import { AdvancedData } from './EventCreator'
import { Input } from '../ui/input';
import WeekRangeSelector from './WeekRangeSelector';
import { DatePickerWithRange } from '../ui/datepicker';
import { EventPeriod, ScheduleEvent } from '@/context/ScheduleContext';

export default function EventCreatorAdvanced({
    event,
    setEvent,
}: {
    event: ScheduleEvent;
    setEvent: (event: ScheduleEvent) => void;
}) {
    
  const [period, setPeriod] = React.useState(event.period)
  useEffect(() => {
    setEvent({...event, period: period})
  }, [period])
  const [selectedWeekdays, setSelectedWeekdays] = React.useState<number[]>([])
  useEffect(() => {
      const weekdays = [false, false, false, false, false, false, false]
      for(let i = selectedWeekdays[0]; i <= selectedWeekdays[1]; i++)
      {
        weekdays[i] = true
      }
      setEvent({...event, weekdays: weekdays})
  }, [selectedWeekdays])

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weekday = weekdays[new Date().getDay()]

  function handlePeriodChange(value: string) {
    switch(value)
    {
      case 'EveryDay':
        setPeriod(EventPeriod.EveryDay)
        break
      case 'EveryWeekday':
        setPeriod(EventPeriod.Weekday)
        break
      case 'RangeWeek':
        setPeriod(EventPeriod.WeekRange)
        break
      case 'More':
        setPeriod(EventPeriod.Custom)
        break
    }
  }

  return (
    
    <div className="flex flex-col space-y-1.5">
        <Label>Period</Label>
        <Select onValueChange={(value) => handlePeriodChange(value)}>
            <SelectTrigger id="period">
            <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
            <SelectItem value="EveryDay">Everyday</SelectItem>
            <SelectItem value="EveryWeekday">Every {weekday}</SelectItem>
            <SelectItem value="RangeWeek">Select Week Range...</SelectItem>
            <SelectItem value="More">More...</SelectItem>
            
            </SelectContent>
        </Select>

        {period === EventPeriod.Custom && <DatePickerWithRange/>}
        {period === EventPeriod.WeekRange && <WeekRangeSelector day1={0} day2={4} updateRange={setSelectedWeekdays}/>}
        {period === EventPeriod.Weekday && <WeekRangeSelector day1={(new Date().getDay()+6)%7} day2={(new Date().getDay()+6)%7} updateRange={setSelectedWeekdays}/>}
        
        <Label>Duration</Label>
        <Input id="duration" placeholder="60" onChange={(e) => setEvent({...event, duration: parseInt(e.target.value)})}/>
    </div>
  )
}
