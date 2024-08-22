"use client"

import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, {useContext, useState, useEffect} from 'react'

interface AuthContextType {
  user: User | null;
  userDataObj: any;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider(props: { children: any }) {

  const [user, setUser] = useState<User | null>(null)
  const [userDataObj, setUserDataObj] = useState({})
  const [loading, setLoading] = useState(true)


  // AUTH HAN
  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    setUserDataObj({})
    setUser(null)

    return auth.signOut()
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      try {
        setLoading(true)
        setUser(user)
        if(!user){
          console.log('User is not logged in')
          return
        }

        // if user is logged in, get user data from firestore
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        let firebaseData = {}
        if(docSnap.exists()){
          console.log('Found user data:')
          firebaseData = docSnap.data()
          console.log(firebaseData)
        }
        setUserDataObj(firebaseData)
      } catch (err: any) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])
  const value: AuthContextType = {
    user,
    userDataObj,
    signup,
    login,
    logout,
    loading
  }
  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}