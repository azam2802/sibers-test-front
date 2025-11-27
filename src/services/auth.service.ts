import { api } from "@/lib/api-client"
import type { LoginDto, RegisterDto, AuthResponse } from "@/types"

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/Auth/login", data)
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/Auth/register", data)
  },
}

