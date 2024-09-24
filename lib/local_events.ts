import { EventPriority, ScheduleEvent } from "@/context/ScheduleContext";

export function getLocalEvents(fixedEvents: ScheduleEvent[], wakeUpTime: Date): ScheduleEvent[] {

    let endTime = (wakeUpTime?.getHours() ?? 0) * 60 + (wakeUpTime?.getMinutes() ?? 0);

    fixedEvents.sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));

    fixedEvents.forEach((element, index) => {
      let startTime = element.hour * 60 + element.minute;
      if (element.eventPriority == EventPriority.Fixed){
        endTime = startTime + element.duration;
        return;
      }
      
      if (startTime > endTime) {
        endTime = startTime + element.duration;
      }
      else {
       
        if(index > 0)
        {
          let last = fixedEvents[index - 1];
          if(last.eventPriority == EventPriority.Flexible) // If last event is flexible, we can try to reduce the duration
          {
            let lastEndTime = last.hour * 60 + last.minute + last.duration;
            if(lastEndTime - startTime < last.duration / 2)
            {
              last.duration = startTime - last.hour * 60 + last.minute ;
              endTime = startTime;
            }
          }
        }
        element.hour = Math.floor(endTime / 60);
        element.minute = endTime % 60;
        startTime = element.hour * 60 + element.minute;
        endTime = startTime + element.duration;
      }
    });

    return fixedEvents
}