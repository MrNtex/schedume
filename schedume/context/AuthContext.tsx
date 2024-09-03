"use client"

import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React, {useContext, useState, useEffect} from 'react'

interface AuthContextType {
  user: User | null;
  userDataObj: any;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  userDataObj: {},
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  loading: false,
};

const AuthContext = React.createContext(defaultAuthContext)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider(props: { children: any }) {

  const [user, setUser] = useState<User | null>(null)
  const [userDataObj, setUserDataObj] = useState({})
  const [loading, setLoading] = useState(true)


  // AUTH HAN
  function signup(email: string, password: string, firstName: string, lastName: string) {
    return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      const docRef = doc(db, 'users', user.uid)
      return setDoc(docRef, {
        email,
        firstName,
        lastName,
        uid: user.uid
      })
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage)
    })
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