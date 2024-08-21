import Dashboard from '@/components/Dashboard'
import Login from '@/components/Login'
import { Main } from 'next/document'
import React from 'react'

export const metadata = {
    title: "ScheduMe | Dashboard",
    description: "Scheduling made painless",
};

export default function page() {

  const isAuth = false
  
  let children = (
    isAuth ? <Dashboard/> :
    <Login/>
  )

  return (
    <div>
      {children}
    </div>
  )
}
