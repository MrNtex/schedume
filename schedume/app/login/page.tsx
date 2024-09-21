
import Login from '@/components/Login'
import { Input } from '@/components/ui/input';
import Main from "@/components/Main";
import React from 'react'

export const metadata = {
    title: "ScheduMe | Login",
    description: "Scheduling made painless",
};

export default function page() {

  const isAuth = false
  
  return (
    <Main>
      <Login/>
    </Main>
  )
}
