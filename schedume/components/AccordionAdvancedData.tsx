import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

export default function AccordionAdvancedData(props: { children: React.ReactNode }) {
  return (
    <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger>Advanced</AccordionTrigger>
            <AccordionContent>
            {props.children}
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  )
}
