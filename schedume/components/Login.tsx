import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

export default function Login() {
  return (
    <div className='pt-12'>
      <div className=''>
        <h1 className='text-3xl font-bold '>Login</h1>
        <p className='text-muted-foreground '>Welcome back! Please login to continue.</p>
      </div>
      
      <div className='flex items-center justify-center py-5'>
        <div className='flex flex-col gap-3 max-w-xl w-full'>
          <Input type="email" placeholder="Email" className="w-full" />
          <Input type="password" placeholder="Password" className="w-full" />
        </div>
      </div>
      
      <div className='flex items-center justify-center'>
        <Button variant="outline">Login</Button>
        <Button variant="link">Register</Button>
      </div>

    </div>
  )
}
