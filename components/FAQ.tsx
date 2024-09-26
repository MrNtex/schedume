import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

export default function FAQ() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
        <div className='w-[60%] justify-center'>
            <h1 className='text-3xl font-extrabold'>
                Frequently Asked Questions
            </h1>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className='font-extralight text-lg'>How does ScheduMe adjust my schedule if I'm running late?</AccordionTrigger>
                    <AccordionContent>
                    ScheduMe uses smart event shifting to automatically rearrange your schedule. If you're running late, the app will shift your upcoming tasks and events to accommodate the delay—ensuring that your day stays organized and stress-free.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className='font-extralight text-lg'>Can I prioritize certain tasks over others?</AccordionTrigger>
                    <AccordionContent>
                    Absolutely! With ScheduMe's Priority Manager, you can mark tasks as high, medium, or low priority. The app will ensure that top-priority tasks are given precedence and won't get pushed aside even if your schedule changes.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className='font-extralight text-lg'>How does ScheduMe handle overlapping events?</AccordionTrigger>
                    <AccordionContent>
                    ScheduMe's AI-powered scheduler is designed to handle overlapping events with ease. The app will analyze your calendar and intelligently manage overlapping tasks, ensuring that you can stay on top of your commitments without feeling overwhelmed.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className='font-extralight text-lg'>Can I sync ScheduMe with other calendar apps?</AccordionTrigger>
                    <AccordionContent>
                    Yes! ScheduMe offers seamless integration with popular calendar apps like Google Calendar, Apple Calendar, and Outlook. You can sync your schedules across multiple platforms, ensuring that you're always up to date on your commitments.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className='font-extralight text-lg'>Does ScheduMe work across multiple devices?</AccordionTrigger>
                    <AccordionContent>
                    Yes, ScheduMe is fully synchronized across all your devices. Whether you're on your phone, tablet, or desktop, your schedule is always up-to-date, allowing you to make changes on the go.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  )
}
