import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '@radix-ui/react-dropdown-menu'
import { AdvancedData } from './EventCreator'
import { Input } from '../ui/input';
import WeekRangeSelector from './WeekRangeSelector';
import { DatePickerWithRange } from '../ui/datepicker';
import { EventPeriod } from '@/context/ScheduleContext';

export default function EventCreatorAdvanced({
    data,
    ShareAdvancedData,
}: {
    data: AdvancedData;
    ShareAdvancedData: (data: AdvancedData) => void;
}) {
    
  const [period, setPeriod] = React.useState(EventPeriod.EveryDay)

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
        {period === EventPeriod.WeekRange && <WeekRangeSelector day1={0} day2={4}/>}
        {period === EventPeriod.Weekday && <WeekRangeSelector day1={new Date().getDay()-1} day2={new Date().getDay()-1}/>}
        
        <Label>Duration</Label>
        <Input id="duration" placeholder="60" onChange={(e) => ShareAdvancedData({...data, duration: parseInt(e.target.value)})}/>
    </div>
  )
}
