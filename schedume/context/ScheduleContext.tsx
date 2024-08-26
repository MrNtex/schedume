"use client"

import React from "react";
import { useContext } from "react";



interface ScheduleContextType {
    loading: boolean;

    addEvent: (schedule: any) => Promise<any>;
    removeEvent: (schedule: any) => Promise<any>;
}

const defaultScheduleContext: ScheduleContextType = {
    loading: false,

    addEvent: async () => {},
    removeEvent: async () => {},
};

const ScheduleContext = React.createContext(defaultScheduleContext)

export function useSchedule() {
  return useContext(ScheduleContext)
}

export function ScheduleProvider(props: { children: any }) {

    const value = {
        loading: false,

        addEvent: async () => {},
        removeEvent: async () => {},
    }

    return (
    <ScheduleContext.Provider value={value}>
        {props.children}
    </ScheduleContext.Provider>
    )
}