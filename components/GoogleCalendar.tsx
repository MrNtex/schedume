import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import CalendarPopup from './CalendarPopup';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // Replace with your Client ID
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Replace with your API Key
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

interface GoogleCalendar {
    id: string;
    summary: string;
}
interface GoogleEvent {
    id: string;
    summary: string;
    start: { dateTime: string };
    end: { dateTime: string };
  }

const GoogleCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [activeCalendarID, setActiveCalendarID] = useState('');
  const [events, setEvents] = useState([]);

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
        .catch((error) => {
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
    .catch(error => {
      console.error('Login failed:', error);
    });
  };
  

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut();
    setCalendars([]);
    setActiveCalendarID('');
    setEvents([]);
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

  // Function to fetch events for the selected calendar
  const fetchEventsForSelectedCalendar = (calendarId: string) => {
    gapi.client.calendar.events
      .list({
        calendarId,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      })
      .then((response: { result: { items: never[]; }; }) => {
        const events = response.result.items || [];
        setEvents(events);
        console.log(`Events for calendar ${calendarId}:`, events);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar Integration</CardTitle>
        <CardDescription>Select a calendar to view its events.</CardDescription>
      </CardHeader>
      <CardContent>
        {isSignedIn ? (
          <form className='flex flex-col gap-2'>
            {/* Dropdown to select a calendar */}
            <Select onValueChange={(value) => {
              setActiveCalendarID(value);
              fetchEventsForSelectedCalendar(value);
            }} defaultValue={activeCalendarID}>
              <SelectTrigger id="calendar">
                <SelectValue placeholder="Select a calendar" />
              </SelectTrigger>
              <SelectContent position="popper">
                {calendars.map((calendar) => (
                  <SelectItem key={calendar.id} value={calendar.id}>
                    {calendar.summary}
                  </SelectItem>
                ))}
                <CalendarPopup />
              </SelectContent>
            </Select>
          </form>
        ) : (
          <Button onClick={handleLogin}>Login with Google</Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        {isSignedIn && (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GoogleCalendar;
