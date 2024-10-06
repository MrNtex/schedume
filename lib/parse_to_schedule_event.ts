import { EventPeriod, ScheduleEvent } from "@/context/ScheduleContext";
import { RRule } from "rrule";

export default function parseToScheduleEvent(event: any, startDate: Date, endDate: Date): ScheduleEvent {
    
    // Calculate duration in minutes
    const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

    // Create a new ScheduleEvent
    const scheduleEvent = new ScheduleEvent(startDate.getHours(), startDate.getMinutes());
    
    
    // Set properties
    scheduleEvent.id = event.id;
    scheduleEvent.title = event.summary || '';
    scheduleEvent.description = event.description || ''; // Assuming you want to include description if available
    scheduleEvent.hour = startDate.getHours();
    scheduleEvent.minute = startDate.getMinutes();

    scheduleEvent.duration = duration;
    scheduleEvent.dateRange = [startDate, endDate];

    
      if(event.recurrence)
      {
          const rrule =  RRule.fromString(event.recurrence[0]);
          const freq = rrule.options.freq;
          // Determine the EventPeriod
          if (freq === RRule.DAILY) {
              // Single day event
              scheduleEvent.period = EventPeriod.EveryDay;
          } else if (freq === RRule.WEEKLY) {
              
              // Recurring event
              const weekdays = rrule.options.byweekday;
              scheduleEvent.period = EventPeriod.WeekRange;
              scheduleEvent.weekdays = [false, false, false, false, false, false, false];
              for (const weekday of weekdays) {
              scheduleEvent.weekdays[weekday] = true;
              }
          }
          else {
              // TODO: Handle other frequencies
              scheduleEvent.period = EventPeriod.EveryDay;
          }
      }
      else{
          scheduleEvent.period = EventPeriod.Custom;
          scheduleEvent.dateRange = [startDate, endDate];
      }
    

    return scheduleEvent;
}