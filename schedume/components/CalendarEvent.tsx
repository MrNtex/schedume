import { EventType } from '@/context/ScheduleContext'
import React from 'react'

export default function CalendarEvent({event}: {event:EventType}) {
  return (
    <div className='absolute bg-emerald-500 rounded-xl px-5 w-[40%]' style={{
      top: `${event.hour * 60 / (24 * 60) * 100}%`,

    }}>
        <h1 className='text-white text-3xl font-bold p-4'>Event</h1>
        <p className='text-white text-lg p-4'>Event details</p>
    </div>
  )
}
