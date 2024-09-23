import { cn } from '@/lib/utils'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { HexColorPicker } from "react-colorful";
import { useAuth } from '@/context/AuthContext'

function HexColorPickerPop({ color, onChange }: { color: string, onChange: (color: string) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div
                    className="rounded-full w-10 h-8 border-2 border-zinc-900 cursor-pointer"
                    style={{ backgroundColor: color }}
                />
            </PopoverTrigger>
            <PopoverContent side='right'>
                <div>              
                    <HexColorPicker color={color} onChange={onChange} />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default function AddEventType() {
    const [color, setColor] = React.useState("#fff")
    const [name, setName] = React.useState("New event type")

    const { userEventTypes, addUserEventType } = useAuth()
    function handleSubmit(e: React.FormEvent) {
        addUserEventType({ name, color })
    }
    return (
        <div className="grid gap-2 w-full max-w-md mx-auto"> {/* Added max width for layout control */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Add more...
                    </Button>
                </PopoverTrigger>
                <PopoverContent side='top' className="w-full max-w-md">
                    <div className='flex justify-center flex-col items-center'>
                        <span className="block mb-2">Add new event type</span>
                        <div className='flex items-center gap-5 p-4'>
                            <Input className="flex-grow" placeholder="Event name" onChange={(e) => setName(e.target.value)}/>
                            <HexColorPickerPop color={color} onChange={setColor} />
                        </div>
                        <Button onClick={handleSubmit}>Add</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
