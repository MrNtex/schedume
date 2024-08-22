"use client"

import React, {useContext, useState, useEffect} from 'react'

const AuthContext = React.createContext({
  user: null,
  login: () => {},
  logout: () => {},
  signup: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider(props: { children: any }) {

  const [user, setUser] = useState(null)

  const value = {
    user: null,
    login: () => {},
    logout: () => {},
    signup: () => {},
  }
  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}