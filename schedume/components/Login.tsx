'use client'

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { useAuth } from '@/context/AuthContext'
import { ButtonLoading } from './ButtonLoading'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { Label } from './ui/label'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import UserHeader from './UserHeader'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [authenticating, setAuthenticating] = useState(false)

  const { toast } = useToast()

  const { login } = useAuth()

  const router = useRouter();

  const handleRedirect = () => {
      router.push('./signup');
  };

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
        case 'auth/invalid-credential':
          toast({
            title: "Uh oh! Something went wrong.",
            description: "Invalid credential.",})
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
    <div className="max-w-lg w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome back! 👋
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Please login to continue.
      </p>

      <form className="my-8" onSubmit={handleLogin}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input type="email" placeholder="Email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input type="password" placeholder="Password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </LabelInputContainer>

        <div className='flex items-center justify-center w-full'>
          {authenticating ? <ButtonLoading ></ButtonLoading> : <Button variant="outline" className='w-full' onClick={() => handleLogin()}>Login</Button>}
        </div>

        

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          
        </div>
      </form>
      <div className="flex items-center justify-center mt-8">
          <span className="text-neutral-600 dark:text-neutral-300 text-sm">
            Don't have an account?
            <Button variant="link" className="ml-1" onClick={handleRedirect}>
              Sign Up
            </Button>
          </span>
        </div>
    </div>
    
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
