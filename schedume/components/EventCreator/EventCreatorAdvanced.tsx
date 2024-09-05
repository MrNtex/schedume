import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '@radix-ui/react-dropdown-menu'
import { AdvancedData } from './EventCreator'
import { Input } from '../ui/input';
import WeekRangeSelector from './WeekRangeSelector';

export default function EventCreatorAdvanced({
    data,
    ShareAdvancedData,
}: {
    data: AdvancedData;
    ShareAdvancedData: (data: AdvancedData) => void;
}) {
    
  const [period, setPeriod] = React.useState('')

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weekday = weekdays[new Date().getDay()]

  

  return (
    
    <div className="flex flex-col space-y-1.5">
        <Label>Period</Label>
        <Select onValueChange={setPeriod}>
            <SelectTrigger id="period">
            <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
            <SelectItem value="EveryDay">Every day</SelectItem>
            <SelectItem value="EveryMonday">Every {weekday}</SelectItem>
            <SelectItem value="Once">Once</SelectItem>
            <SelectItem value="More">More...</SelectItem>
            </SelectContent>
        </Select>

        <WeekRangeSelector/>
        <Label>Duration</Label>
        <Input id="duration" placeholder="60" onChange={(e) => ShareAdvancedData({...data, duration: parseInt(e.target.value)})}/>
    </div>
  )
}
