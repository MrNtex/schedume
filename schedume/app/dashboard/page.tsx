"use client"

import Dashboard from '@/components/Dashboard'
import Login from '@/components/Login'
import { Main } from 'next/document'
import React, { useEffect, useState } from 'react'



export default function page() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5183/api/example');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Message from .NET API:</h1>
      <p>{message}</p>
    </div>
  );
}