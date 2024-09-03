import { EventType, useSchedule } from '@/context/ScheduleContext';
import React, { useState, useRef } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';

export default function CalendarEvent({ event }: { event: EventType }) {
  const [position, setPosition] = useState((event.hour * 60 + event.minute) / (24 * 60) * 100); // Initial position based on event time
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHeight, setResizeHeight] = useState(0);
  const eventRef = useRef<HTMLDivElement>(null); // Reference to the draggable element

  const { UpdateEvent } = useSchedule();

  const [calculatedHours, setCalculatedHours] = useState(event.hour);
  const [calculatedMinutes, setCalculatedMinutes] = useState(event.minute);

  const [calculatedDuration, setCalculatedDuration] = useState(event.duration);

  const [startY, setStartY] = useState(0);

  const step = 100 / 24 / 4; // step every 15 minutes

  const dragOffset = useRef(0);

  const handleStartDrag = (e: DraggableEvent) => {
    const rect = eventRef.current?.getBoundingClientRect();

    e = e as MouseEvent;

    if (rect) dragOffset.current = e.clientY - rect.top;
  }
  // Function to handle drag event
  const handleDrag = (data: { y: number }, e: DraggableEvent) => {
    if (!isDragging) setIsDragging(true); // Set dragging state to true
    const parentElement = eventRef.current?.parentElement; // Get the parent element
    if (!parentElement) return; // Guard clause if parent is not found

    const parentHeight = parentElement.clientHeight || 1; // Get the parent height, avoid division by 0
    
    const newY = data.y - dragOffset.current; // Get the current dragged y-position

    // Calculate the percentage of the dragged position relative to the parent's height
    let positionPercent = (newY / parentHeight) * 100;

    positionPercent = Math.max(0, Math.min(100, Math.floor(positionPercent / step) * step)); // Keep within bounds and snap to steps

    const time = positionPercent / 100 * 24;

    setCalculatedHours(Math.floor(time));
    setCalculatedMinutes(Math.floor((time % 1) * 60)); // % 1 to get the decimal part

    setPosition(positionPercent);
  };

  // Function to handle drag stop
  const handleStop = () => {
    if (position === -1 || !isDragging) return; // Guard clause if position is not set
    // Update the event with the new calculated hours and minutes
    UpdateEvent({ ...event, hour: calculatedHours, minute: calculatedMinutes })
      .catch(console.error)
      .finally(() => {
        setIsDragging(false); // Set dragging state to false
      });
  };

  // Handle start of resizing to prevent drag interference
  const handleStartResize = (resizeType: 'top' | 'bottom', e: DraggableEvent, data: any) => {
    e.stopPropagation(); // Avoid event bubbling, with the drag event

    setStartY(position);
    setCalculatedDuration(event.duration);
    setCalculatedHours(event.hour);
    setCalculatedMinutes(event.minute);
  };

  // Function to handle resizing the event
  const handleResize = (resizeType: 'top' | 'bottom', e: DraggableEvent, data: { y: number }) => {
    if (!isResizing)    setIsResizing(true);
    const parentElement = eventRef.current?.parentElement;
    if (!parentElement) return;
  
    const parentRect = parentElement.getBoundingClientRect();
    const parentHeight = parentElement.clientHeight || 1;
  
    // Calculate the mouse position relative to the parent during resize
    e = e as MouseEvent;

    const relativeY = e.clientY - parentRect.top;

    let resizePercent = (relativeY / parentHeight) * 100;
    
    resizePercent = Math.max(0, Math.min(100, Math.floor(resizePercent / step) * step)); // Keep within bounds and snap to steps
    

    if(resizeType === 'top') 
    {
      let newDuration = (startY - resizePercent) / 100 * 24 * 60;
      newDuration += event.duration;

      const time = resizePercent / 100 * 24;
      setCalculatedHours(Math.floor(time));
      setCalculatedMinutes(Math.floor((time % 1) * 60)); // % 1 to get the decimal
      setCalculatedDuration(Math.round(newDuration));

      if(newDuration < 14) // 14 because of floating point errors
      { // Minimum duration of 15 minutes
        return;
      }
      setPosition(resizePercent);
      setResizeHeight(Math.abs(newDuration / (24 * 60) * 100));
    }
    else{ // for bottom we don't need to calculate the new position
      const newDuration = (resizePercent - position) / 100 * 24 * 60;

      if(newDuration < 14)
      { // Minimum duration of 15 minutes
        return;
      }
      setResizeHeight(newDuration / (24 * 60) * 100);

      setCalculatedHours(event.hour);
      setCalculatedMinutes(event.minute);
      setCalculatedDuration(Math.round(newDuration));
    }
  };

  // Handle resize stop
  const handleResizeStop = () => {

    if (!isResizing) return;

    UpdateEvent({ ...event, duration: calculatedDuration, hour: calculatedHours, minute: calculatedMinutes })
      .catch(console.error)
      .finally(() => {
        setIsResizing(false);
      });
    // Update the event duration based on resize
    // UpdateEvent logic for resizing if needed
  };

  const handleClick = () => {
    if(isDragging || isResizing)
      return;
    console.log('clicked');
  }

  const getTop  = () => {
    if(isDragging || isResizing)
      return position;
    return (event.hour * 60 + event.minute) / (24 * 60) * 100;
  }

  const getHeight = () => {
    if(isResizing)
      return resizeHeight;
    return event.duration / (24 * 60) * 100
  }

  function durationToTime(duration: number, startHours: number, startMinutes: number) {
    duration += startHours * 60 + startMinutes;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  const getTime = () => {
    if(isDragging || isResizing)
      return `${calculatedHours}:${calculatedMinutes || '00'}-${durationToTime(calculatedDuration, calculatedHours, calculatedMinutes)}`;
    return `${event.hour}:${event.minute || '00'}`;
  }

  const EventInsides = () => {
    if(getHeight() > 5)
    {
      return (
        <div className="flex justify-between left-0">
          <h1 className="text-white text-3xl font-bold p-4">{event.title}</h1>
          <h1 className="text-white text-lg p-4">
            {getTime()}
          </h1>
        </div>
      )
    }
    else if(getHeight() > 2)
    {
      return (
        <div className="absolute flex justify-between items-center left-0 top-0 px-4 w-full h-full">
          <h1 className="text-white text-xl font-bold align-middle ">{event.title}</h1>
          <h1 className="text-white text-md">{getTime()}</h1>
        </div>
      )
    }
  }
  return (
    <DraggableCore
      onStart={(e) => handleStartDrag(e)} // Start dragging
      onDrag={(e, data) => handleDrag(data, e)} // Handle continuous dragging
      onStop={(e, data) => handleStop()} // Finalize and log the position when dragging stops
    >
      <div
        ref={eventRef} // Reference to the draggable element
        className={`absolute rounded-xl px-5 w-[40%] ${isDragging ? 'bg-emerald-700' : 'bg-emerald-500'}`}
        style={{
          top: `${getTop()}%`,
          height: `${getHeight()}%`,
        }}
        onClick={handleClick}
      >
        {/* Top Resize Handler */}
        <DraggableCore
          onStart={(e, data) => handleStartResize('top', e, data)}
          onDrag={(e, data) => handleResize('top',e, data)}
          onStop={handleResizeStop}
        >
          <div className="absolute top-0 left-0 w-full h-3 cursor-ns-resize hover:bg-emerald-800 rounded-t-xl transition ease-in-out"></div>
        </DraggableCore>

        <EventInsides/>
        
        {
          getHeight() > 10 && <p className="text-white text-lg p-4">Event details</p>// Only show event details if the event is big enough
        }
        

        

        <DraggableCore
          onStart={(e, data) => handleStartResize('bottom', e, data)}
          onDrag={(e, data) => handleResize('bottom', e, data)}
          onStop={handleResizeStop}
        >
          <div className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize hover:bg-emerald-800 rounded-b-xl transition ease-in-out"></div>
        </DraggableCore>
      </div>
    </DraggableCore>
  );
}
