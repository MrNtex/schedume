'use client';

import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ShootingStars } from './ui/shooting-stars'
import { StarsBackground } from './ui/stars-background'
import { useRouter } from 'next/navigation'

export default function Hero() {

  const router = useRouter();

  const registerClick = () => {
    router.push('/signup');
  }

  return (
    
    <div className='flex flex-col items-center justify-center h-full '>
      
      <ShootingStars/>
      <StarsBackground />
      
      <div className='py-6'>
      <h1 className="text-center font-bold text-2xl md:text-3xl">A Schedule That Adapts to You</h1>
      <p className="text-center text-md md:text-xl mt-4 max-w-2xl mx-auto">
          Seamlessly integrate your tasks, meetings, and reminders into one smart calendar powered by AI, so you can focus on what truly matters.
      </p>

      </div>
      <button className="p-[3px] relative" onClick={registerClick}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
          Try Shedume Now
        </div>
      </button>
    </div>
    
  )
}
