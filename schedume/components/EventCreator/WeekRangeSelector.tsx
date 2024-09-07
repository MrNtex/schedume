import React, { use, useEffect, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

// Array of days of the week
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type WeekRangeSelectorProps = {
  day1: number;
  day2: number;
  updateRange: (range: number[]) => void;
};

export default function WeekRangeSelector({ day1, day2, updateRange }: WeekRangeSelectorProps) {
  const [range, setRange] = useState([day1, day2]); // Initial range from Monday to Friday
  useEffect(() => {
    updateRange(range);
  }, [range]);


  const selectedRange = () => {
    if (range[0] === range[1]) {
      return daysOfWeek[range[0]];
    }
    return `${daysOfWeek[range[0]]} to ${daysOfWeek[range[1]]}`;
  }

  return (
    <div className="p-4 max-w-md">
      <h3 className="mb-4 text-lg font-medium">Select Days of the Week</h3>
      <Slider.Root
        className="relative flex items-center w-full h-5"
        value={range}
        min={0}
        max={6}
        step={1}
        onValueChange={setRange}
        aria-label="Select range of days"
      >
        <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
        </Slider.Track>
        <Slider.Thumb className="block cursor-e-resize bg-blue-300 h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" style={{ zIndex: 20 }} />
        <Slider.Thumb className="block cursor-e-resize bg-blue-300 h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" style={{ zIndex: 20 }} />
      </Slider.Root>
      <p className="mt-4 text-sm">
        Selected Range: {selectedRange()}
      </p>
    </div>
  );
}
