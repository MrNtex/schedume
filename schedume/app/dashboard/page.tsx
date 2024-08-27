"use client"

import Dashboard from '@/components/Dashboard'
import { DashboardFloatingDock } from '@/components/DashboardFloatingDock'
import DayCalendar from '@/components/DayCalendar'
import { EventCreator } from '@/components/EventCreator'
import Login from '@/components/Login'
import { FloatingDock } from '@/components/ui/floating-dock'
import { useAuth } from '@/context/AuthContext'
import { ScheduleProvider, useSchedule } from '@/context/ScheduleContext'
import { Main } from 'next/document'
import React, { useEffect, useState } from 'react'


export default function Page() {
  const { user, userDataObj } = useAuth();

  if (!user) {
    return <div>No user</div>;
  }

  if (!userDataObj) {
    return <div>No user data</div>;
  }

  return (
    <ScheduleProvider>
      <MainContent />
    </ScheduleProvider>
  );
}

function MainContent() {
  // It's important to use the `useSchedule` hook inside the `ScheduleProvider` component
  const { creatingEvent } = useSchedule();

  return (
    <>
      {creatingEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EventCreator />
        </div>
      )}
      
      <DayCalendar />
      <DashboardFloatingDock />
    </>
  );
}
