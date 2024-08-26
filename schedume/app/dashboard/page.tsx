"use client"

import Dashboard from '@/components/Dashboard'
import { DashboardFloatingDock } from '@/components/DashboardFloatingDock'
import DayCalendar from '@/components/DayCalendar'
import Login from '@/components/Login'
import { FloatingDock } from '@/components/ui/floating-dock'
import { useAuth } from '@/context/AuthContext'
import { ScheduleProvider } from '@/context/ScheduleContext'
import { Main } from 'next/document'
import React, { useEffect, useState } from 'react'



export default function page() {
  
  const { user, userDataObj } = useAuth()

  if (!user) {
    return (
      <div> No user </div>
    )
  }

  if(!userDataObj) {
    return (
      <div> No user data </div>
    )
  }


  return (
    <ScheduleProvider>
      
      <DayCalendar/>
      <DashboardFloatingDock/>
    </ScheduleProvider>
  );
}