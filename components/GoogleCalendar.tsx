import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import CalendarPopup from './CalendarPopup';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useDashboard } from '@/app/dashboard/page';
import { EventPeriod, ScheduleEvent, useSchedule } from '@/context/ScheduleContext';
import { RRule } from 'rrule';
import { addDoc, collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import parseToScheduleEvent from '@/lib/parse_to_schedule_event';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // Replace with your Client ID
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Replace with your API Key
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

interface GoogleCalendar {
    id: string;
    summary: string;
}

const GoogleCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);

  const { setFetchingGoogleEvents } = useDashboard();
  const { user } = useAuth();
  const { setChangingCalendar } = useDashboard();
  const { setActiveCalendarID } = useSchedule();

  useEffect(() => {
    const initClient = () => {
    gapi.client
        .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: SCOPES,
        })
        .then(() => {
        console.log('GAPI client initialized');
        gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);
        const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        console.log('Is signed in:', signedIn);
        setIsSignedIn(signedIn);
        if (signedIn) {
            fetchCalendars(); // Fetch calendars if already signed in
        }
        })
        .catch((error: any) => {
        console.error('Error initializing GAPI client:', error);
        });
    };
  
    gapi.load('client:auth2', initClient);
  }, []);
  

  const handleLogin = () => {
    console.log('Attempting to log in...');
    gapi.auth2.getAuthInstance().signIn({
      scope: SCOPES,
      prompt: 'consent', // Zapewnia, że użytkownik będzie musiał wyrazić zgodę
    })
    .then(() => {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const id_token = user.getAuthResponse().id_token;
      console.log('ID Token:', id_token);
      fetchCalendars(); // Fetch calendars after successful login
    })
    .catch((error: any) => {
      console.error('Login failed:', error);
    });
  };
  

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut();
    setCalendars([]);
    setActiveCalendarID('');
  };

  // Function to fetch all user calendars
  const fetchCalendars = () => {
    console.log('Fetching calendars...');
    gapi.client.calendar.calendarList.list().then((response: { result: { items: never[]; }; }) => {
      const calendarList = response.result.items || [];
      setCalendars(calendarList);
      console.log('Fetched calendars:', calendarList);
    });
  };

  // Function to apply the new calendar
    const applyCalendar = async (calendarId: string) => {
      try {
          const parsed_events = await fetchEventsForSelectedCalendar(calendarId); // Await the promise

          console.log('Applying calendar:', parsed_events);

          if (!user) throw new Error('User not found');
          const name = calendars.find(calendar => calendar.id === calendarId)?.summary;

          const calendarsCollectionRef = collection(db, `users/${user.uid}/calendars`);
          const docRef = await addDoc(calendarsCollectionRef, { name: name });

          setActiveCalendarID(docRef.id);

          const eventsCollectionRef = collection(db, `users/${user.uid}/calendars/${docRef.id}/events`);

          const batch = writeBatch(db);

          // Loop through the events and add each one to the batch
          for (const event of parsed_events) { // Use parsed_events here
              const eventDocRef = doc(eventsCollectionRef, event.id); // Create a new document reference
              batch.set(eventDocRef, {
                  id: event.id,
                  title: event.title,
                  description: event.description,
                  duration: event.duration,
                  hour: event.hour,
                  minute: event.minute,
                  dateRange: event.dateRange,
                  period: event.period,
                  weekdays: event.weekdays,
              });
          }

          // Commit the batch
          await batch.commit();

      } catch (error) {
          console.error('Error applying calendar:', error);
      } finally {
          setChangingCalendar(false); // Make sure to set changingCalendar to false
      }
  };


  const MAX_GOOGLE_EVENTS = 256;

  // Function to fetch events for the selected calendar
  const fetchEventsForSelectedCalendar = (calendarId: string): Promise<ScheduleEvent[]> => {
    return gapi.client.calendar.events
      .list({
        calendarId,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: false, // Set singleEvents to false to get the original events
        maxResults: MAX_GOOGLE_EVENTS,
        //orderBy: 'startTime',n
      })
      .then((response: { result: { items: any[]; }; }) => {
        const scheduleEvents: ScheduleEvent[] = (response.result.items || []).map(event => {

          // Extract and parse start and end times
          const startDateTime = event.start.dateTime || event.start.date;
          const endDateTime = event.end.dateTime || event.end.date;

          const startDate = new Date(startDateTime);
          const endDate = new Date(endDateTime);

          console.log("Start Date: ", startDate, "End Date: ", endDate);

          const parsedEvent = parseToScheduleEvent(event, startDate, endDate);
          return parsedEvent;
        });
        return scheduleEvents;
      })
      .catch((error: any) => {
        console.error('Error fetching events:', error);
        return [];
      });
      
  };
  
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>👇 Google Calendar Integration</CardTitle>
        <CardDescription>Select a calendar to import its events.</CardDescription>
      </CardHeader>
      <CardContent>
        {isSignedIn ? (
          <form className='flex flex-col gap-2'>
            {/* Dropdown to select a calendar */}
            <Select onValueChange={(value) => {
              applyCalendar(value);
            }}>
              <SelectTrigger id="calendar">
                <SelectValue placeholder="Select a calendar" />
              </SelectTrigger>
              <SelectContent position="popper">
                {calendars.map((calendar) => (
                  <SelectItem key={calendar.id} value={calendar.id}>
                    {calendar.summary}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        ) : (
          <Button className=' relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]' onClick={handleLogin}>
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300"/>
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">Login with Google</span>
            
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-4">
        {isSignedIn && (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        )}
        <Button className=' relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]' onClick={() => setFetchingGoogleEvents(false)}>
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">Cancel</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoogleCalendar;
