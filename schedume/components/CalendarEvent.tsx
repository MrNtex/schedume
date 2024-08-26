import React from 'react'

export default function CalendarEvent({eventId}: {eventId:number}) {
  return (
    <div key={eventId} className='bg-emerald-500 rounded-xl px-5 top-2' style={{
      top: `${1300 / (24 * 60) * 100}%`,

    }}>
        <h1 className='text-white text-3xl font-bold p-4'>Event</h1>
        <p className='text-white text-lg p-4'>Event details</p>
    </div>
  )
}
