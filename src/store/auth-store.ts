import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "@/types"

interface AuthState {
  isSignedIn: boolean
  token: string | null
  user: User | null
  signIn: (token: string, user: User) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isSignedIn: false,
      token: null,
      user: null,
      signIn: (token: string, user: User) => {
        set({
          isSignedIn: true,
          token,
          user,
        })
      },
      signOut: () => {
        set({
          isSignedIn: false,
          token: null,
          user: null,
        })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

