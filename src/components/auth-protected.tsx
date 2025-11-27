"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Loader } from "@/components/loader"

interface AuthProtectedProps {
  children: React.ReactNode
}

export function AuthProtected({ children }: AuthProtectedProps) {
  const isSignedIn = useAuthStore((state) => state.isSignedIn)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && !isSignedIn) {
      router.push("/login")
    }
  }, [isSignedIn, isHydrated, router])

  // Show loader while hydrating from localStorage
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return <>{children}</>
}

