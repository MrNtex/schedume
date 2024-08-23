'use client'

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { useAuth } from '@/context/AuthContext'
import { ButtonLoading } from './ButtonLoading'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [authenticating, setAuthenticating] = useState(false)

  const { toast } = useToast()

  const { login } = useAuth()

  async function handleLogin() {
    if (!email || !password) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please fill in your email and password.",})
      return
    }
    
    setAuthenticating(true)
    try {
      await login(email, password)
    }
    catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          toast({
            title: "Uh oh! Something went wrong.",
            description: "Invalid email.",})
          break
        case 'auth/user-not-found':
          toast({
            title: "Uh oh! Something went wrong.",
            description: "User not found.",})
          break
        case 'auth/wrong-password':
          toast({
            title: "Uh oh! Something went wrong.",
            description: "Wrong password.",})
          break
        default:
          toast({
            title: "Uh oh! Something went wrong.",
            description: "An error occurred. Please try again later.",})
          break
      }
      console.error(error)
      
    }
    finally {
      setAuthenticating(false)
    }
  }

  return (
    <div className='pt-12'>
      <div className=''>
        <h1 className='text-3xl font-bold '>Login</h1>
        <p className='text-muted-foreground '>Welcome back! Please login to continue.</p>
      </div>
      
      <div className='flex items-center justify-center py-5'>
        <div className='flex flex-col gap-3 max-w-xl w-full'>
          <Input type="email" placeholder="Email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <Input type="password" placeholder="Password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
      </div>
      
      <div className='flex items-center justify-center'>
        {authenticating ? <ButtonLoading></ButtonLoading> : <Button variant="outline" onClick={() => handleLogin()}>Login</Button>}
        
        <Button variant="link">Register</Button>
      </div>

    </div>
  )
}
