"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"

interface AuthProtectedProps {
  children: React.ReactNode
}

export function AuthProtected({ children }: AuthProtectedProps) {
  const isSignedIn = useAuthStore((state) => state.isSignedIn)
  const router = useRouter()

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login")
    }
  }, [isSignedIn, router])

  if (!isSignedIn) {
    return null
  }

  return <>{children}</>
}

