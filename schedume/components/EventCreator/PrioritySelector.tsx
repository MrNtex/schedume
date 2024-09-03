import React from 'react'
import { Slider } from '../ui/slider'
import { Label } from '../ui/label'

export default function PrioritySelector() {
  return (
    <div>
        <Label>Priority</Label>
        <Slider
            max={5}
            step={1}
        />
    </div>
  )
}
