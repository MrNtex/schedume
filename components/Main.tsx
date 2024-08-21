import React from 'react'

export default function Main(props: { children: any }) {
    const {children} = props

  return (
    <main className='flex-1'>
        {children}
    </main>
  )
}
