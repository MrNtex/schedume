import { EventPriority, ScheduleEvent } from "@/context/ScheduleContext";

export function getLocalEvents(fixedEvents: ScheduleEvent[], wakeUpTime: Date): ScheduleEvent[] {

    const toMinutes = (event: ScheduleEvent): number => event.hour * 60 + event.minute;

    let endTime = (wakeUpTime?.getHours() ?? 0) * 60 + (wakeUpTime?.getMinutes() ?? 0);

    fixedEvents.sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));

    fixedEvents.forEach((element, index) => {
      let startTime = element.hour * 60 + element.minute;
      //console.log("Event: ", element, "idx: ", index, "Start time: ", startTime, "End time: ", endTime);
      if (startTime > 24 * 60 || endTime > 24 * 60) {
        return fixedEvents.slice(0, index);
      }

      if (element.eventPriority == EventPriority.Fixed){
        endTime = startTime + element.duration;

        let i = index - 1;
        while (i >= 0 && toMinutes(fixedEvents[i]) + fixedEvents[i].duration > startTime) {
          if (fixedEvents[i].eventPriority == EventPriority.Flexible && startTime - toMinutes(fixedEvents[i]) > fixedEvents[i].duration / 2) {
            fixedEvents[i].fixedDuration = fixedEvents[i].duration
            fixedEvents[i].duration = startTime - toMinutes(fixedEvents[i]);
            break;
          }
          fixedEvents[i].fixedTime = toMinutes(fixedEvents[i])
          fixedEvents[i].hour = Math.floor(endTime / 60);
          fixedEvents[i].minute = endTime % 60;
          endTime += fixedEvents[i].duration;
          i--;
        }

        return;
      }

      if (element.fixedDuration != null) {
        element.duration = element.fixedDuration;
        element.fixedDuration = null;
      }
      
      if (element.fixedTime != null)
      {
        element.hour = Math.floor(element.fixedTime / 60);
        element.minute = element.fixedTime % 60;
        element.fixedTime = null;
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
              last.fixedDuration = last.duration;
              last.duration = startTime - (last.hour * 60 + last.minute);
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