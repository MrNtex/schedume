'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import React from 'react'

export default function UserHeader() {

  const { user, logout, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return (
      <div>
        <ul className="flex space-x-4 max-w-7xl">
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <ul className="flex space-x-4 max-w-7xl">
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/signup">Sign Up</Link>
        </li>
      </ul>
    </div>
  )
}
