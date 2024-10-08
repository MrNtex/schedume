import { useDashboard } from '@/app/dashboard/page';
import { useAuth } from '@/context/AuthContext';
import { ScheduleEvent, EventType, useSchedule, EventPriority } from '@/context/ScheduleContext';
import { Lock } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';

export default function CalendarEvent({ event, partial, currentTime }: { event: ScheduleEvent, partial: boolean, currentTime: Date }) {
  const [position, setPosition] = useState((event.hour * 60 + event.minute) / (24 * 60) * 100); // Initial position based on event time
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const eventRef = useRef<HTMLDivElement>(null); // Reference to the draggable element

  const { userEventTypes } = useAuth();
  const { UpdateEvent, setNewEventData } = useSchedule();
  const { creatingEvent, setCreatingEvent, editMode } = useDashboard();

  
  const [tempEvent, setTempEvent] = useState(event);
  // Sync tempEvent with event whenever event changes
  useEffect(() => {
    setTempEvent(event);
  }, [event]);

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

    setTempEvent({ ...event, hour: Math.floor(time), minute: Math.floor((time % 1) * 60) }); // % 1 to get the decimal part

    setPosition(positionPercent);
  };

  // Function to handle drag stop
  const handleStop = () => {
    if (position === -1 || !isDragging) return; // Guard clause if position is not set
    // Update the event with the new calculated hours and minutes

    UpdateEvent({ ...event, hour: tempEvent.hour, minute: tempEvent.minute }, !editMode)
      .catch(console.error)
      .finally(() => {
        setIsDragging(false); // Set dragging state to false
      });
  };

  // Handle start of resizing to prevent drag interference
  const handleStartResize = (resizeType: 'top' | 'bottom', e: DraggableEvent, data: any) => {
    e.stopPropagation(); // Avoid event bubbling, with the drag event

    setStartY(position);
    setTempEvent(event);
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
      if(partial){ return; }
      let newDuration = (startY - resizePercent) / 100 * 24 * 60;
      newDuration += event.duration;

      const time = resizePercent / 100 * 24;

      setTempEvent({ ...event, hour: Math.floor(time), minute: Math.floor((time % 1) * 60), duration: Math.round(newDuration) }); // % 1 to get the decimal part

      if(newDuration < 14) // 14 because of floating point errors
      { // Minimum duration of 15 minutes
        return;
      }
      setPosition(resizePercent);
    }
    else{ // for bottom we don't need to calculate the new position
      if(partial)
      {
        var newDuration = (resizePercent) / 100 * 24 * 60;
        const padding = 24 * 60 - (tempEvent.hour * 60 + tempEvent.minute);
        newDuration += padding;
      }
      else{
        var newDuration = (resizePercent - position) / 100 * 24 * 60;
      }
      

      if(newDuration < 14)
      { // Minimum duration of 15 minutes
        return;
      }
      setTempEvent({ ...event, duration: Math.round(newDuration) });
    }
  };

  // Handle resize stop
  const handleResizeStop = () => {

    if (!isResizing) return;

    UpdateEvent({ ...event, duration: tempEvent.duration, hour: tempEvent.hour, minute: tempEvent.minute }, !editMode)
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
    setNewEventData(event);
    setCreatingEvent(true);
  }

  const getTop  = () => {
    if(partial) return 0;
    if(isDragging || isResizing)
      return position;
    return (event.hour * 60 + event.minute) / (24 * 60) * 100;
  }

  const getHeight = () => {
    if(partial)
    {
      return (tempEvent.duration - (24 * 60 - (tempEvent.hour * 60 + tempEvent.minute))) / (24 * 60) * 100;
    }

    
    if(tempEvent.hour * 60 + tempEvent.minute + tempEvent.duration > 24 * 60)
    {
      return 100 - getTop();
    }
    return tempEvent.duration / (24 * 60) * 100
  }

  function durationToTime(duration: number, startHours: number, startMinutes: number) {
    duration += startHours * 60 + startMinutes;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours%24}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  const getTime = () => {
    if(isDragging || isResizing)
      return `${tempEvent.hour}:${tempEvent.minute || '00'}-${durationToTime(tempEvent.duration, tempEvent.hour, tempEvent.minute)}`;
    return `${event.hour}:${(event.minute < 10 ? '0' + event.minute : event.minute) || '00'}`;
  }

  const getColor = () => {
    if(event.EventTypeID in userEventTypes)
    {
      return userEventTypes[event.EventTypeID].color;
    }
    return '#10b981';
  }

  const EventInsides = () => {

    const h = getHeight();

    if(h > 5)
    {
      return (
        <div className='h-full flex flex-col'>
          <div className="flex justify-between left-0 items-center h-full w-full">
            <h1 className={`text-white font-bold px-1 truncate text-xl`}>{event.title}</h1>
            <h1 className="text-white text-lg p-4">
              {getTime()}
            </h1>
          </div>
          {
            h > 10 && <p className="text-white text-lg px-1 pb-4">Event details</p>// Only show event details if the event is big enough
          }
        </div>
        
      )
    }
    else if(h > 2)
    {
      return (
        <div className="absolute left-0 top-0 px-6 w-full h-full">
          <div className="flex justify-between items-center w-full h-full">
            <h1 className="text-white text-xl font-bold align-middle truncate">{event.title}</h1>
            <h1 className="text-white text-md">{getTime()}</h1>
          </div>
          
        </div>
      )
    }
  }
    
  return (
    <DraggableCore
      nodeRef={eventRef} // Reference to the draggable element
      onStart={(e) => handleStartDrag(e)} // Start dragging
      onDrag={(e, data) => handleDrag(data, e)} // Handle continuous dragging
      onStop={(e, data) => handleStop()} // Finalize and log the position when dragging stops
    >
      <div
        ref={eventRef} // Reference to the draggable element
        className={`absolute rounded-xl px-5 w-[40%] ${currentTime && event.hour * 60 + event.minute + event.duration < currentTime.getHours() * 60 + currentTime.getMinutes() && "opacity-60"} ${event.eventPriority == EventPriority.Fixed ? 'border-4 border-emerald-100' : ''} ${isDragging ? 'brightness-50' : ''}`}
        style={{
          top: `${getTop()}%`,
          height: `${getHeight()}%`,
          backgroundColor: `${getColor()}`,
        }}
        onClick={handleClick}
      >
        {/* Top Resize Handler */}
        <DraggableCore
          onStart={(e, data) => handleStartResize('top', e, data)}
          onDrag={(e, data) => handleResize('top',e, data)}
          onStop={handleResizeStop}
          nodeRef={eventRef}
        >
          <div className="absolute top-0 left-0 w-full h-3 cursor-ns-resize hover:bg-black hover:bg-opacity-45 rounded-t-xl transition ease-in-out"></div>
        </DraggableCore>

        <EventInsides/>
        

        

        <DraggableCore
          onStart={(e, data) => handleStartResize('bottom', e, data)}
          onDrag={(e, data) => handleResize('bottom', e, data)}
          onStop={handleResizeStop}
          nodeRef={eventRef}
        >
          <div className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize hover:bg-black hover:bg-opacity-45 rounded-b-xl transition ease-in-out"></div>
        </DraggableCore>
      </div>
    </DraggableCore>
  );
}
