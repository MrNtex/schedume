
import { EventPeriod, ScheduleEvent } from '@/context/ScheduleContext';
import ICAL from 'ical.js'; // Import ICAL.js for parsing ICS files
import parseToScheduleEvent from './parse_to_schedule_event';

/**
 * Function to parse ICS file content and convert it to ScheduleEvent format.
 * @param icsData The raw text content of the ICS file.
 * @returns An array of ScheduleEvent objects.
 */
export const parseICSFile = (icsData: string): ScheduleEvent[] => {
  const jcalData = ICAL.parse(icsData);
  const comp = new ICAL.Component(jcalData);
  const events: ScheduleEvent[] = [];

  const vevents = comp.getAllSubcomponents('vevent');

  vevents.forEach((vevent: any) => {
    const event = new ICAL.Event(vevent);

    const startDate = event.startDate.toJSDate();
    const endDate = event.endDate.toJSDate();

    events.push(parseToScheduleEvent(event, startDate, endDate));
  });

  return events;
};
