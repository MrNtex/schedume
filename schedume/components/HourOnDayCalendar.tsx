import React from 'react'

export default function HourOnDayCalendar({ date }: { date?: Date }) {
  if(date == null || typeof date !== 'object' || !(date instanceof Date)) {
    console.error("Invalid date", date)
    return
  }
  console.log("the days is ",date)
  return (
    <div
        className="absolute left-0 right-0 h-0.5 bg-zinc-500 mx-auto"
        style={{
        top: `${(date.getHours() * 60 + date.getMinutes()) / (24 * 60) * 100}%`,

        }}
    >
        <span className="absolute left-0 -translate-y-1/2 -translate-x-12 bg-red-500 text-white px-2 py-1 rounded">
        {`${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`}
        </span>
    </div>
  )
}
