import { EventType } from '@/context/ScheduleContext';
import React, { useState, useRef } from 'react';
import { DraggableCore } from "react-draggable";

export default function CalendarEvent({ event }: { event: EventType }) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const eventRef = useRef<HTMLDivElement>(null); // Reference to the draggable element

  // Function to handle drag event
  const handleDrag = (e, data) => {
    const parentElement = eventRef.current?.parentElement; // Get the parent element
    if (!parentElement) return; // Guard clause if parent is not found

    const parentHeight = parentElement.clientHeight; // Get the parent height
    const newY = data.y; // Get the current dragged y-position

    // Calculate the percentage of the dragged position relative to the parent's height
    const positionPercent = (newY / parentHeight) * 100;

    // Update position state and log the percentage
    setPosition(positionPercent);
    console.log('Position as a percentage of parent height:', positionPercent);
  };

  // Function to handle drag stop
  const handleStop = (e, data) => {
    const parentElement = eventRef.current?.parentElement; // Get the parent element
    if (!parentElement) return; // Guard clause if parent is not found

    const parentHeight = parentElement.clientHeight; // Get the parent height
    const finalY = position.y; // Get the final y-position

    // Calculate the final position percentage
    const finalPositionPercent = (finalY / parentHeight) * 100;

    setIsDragging(false); // Set dragging state to false
    console.log('Final position as a percentage of parent height:', finalPositionPercent);
  };

  return (
    <DraggableCore
      onStart={() => setIsDragging(true)} // Set dragging state to true when dragging starts
      onDrag={handleDrag} // Handle continuous dragging
      onStop={handleStop} // Finalize and log the position when dragging stops
    >
      <div
        ref={eventRef} // Reference to the draggable element
        className='absolute bg-emerald-500 rounded-xl px-5 w-[40%]'
        style={{
          top: isDragging ? `${position}%` : `${event.hour * 60 / (24 * 60) * 100}%`,
          height: `${event.duration / (24 * 60) * 100}%`,
        }}
      >
        <h1 className='text-white text-3xl font-bold p-4'>{event.title}</h1>
        <p className='text-white text-lg p-4'>Event details</p>
      </div>
    </DraggableCore>
  );
}
