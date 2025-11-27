const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7013/api"

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data?: any
    ) {
        super(`API Error: ${status} ${statusText}`)
        this.name = "ApiError"
    }
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    let token: string | null = null
    if (typeof window !== "undefined") {
        const authStorage = localStorage.getItem("auth-storage")
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage)
                token = parsed?.state?.token || null
            } catch {
                token = null
            }
        }
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(response.status, response.statusText, errorData)
    }

    if (response.status === 204) {
        return null as T
    }

    return response.json()
}

export const api = {
    get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "GET" }),
    post: <T>(endpoint: string, data?: any) =>
        apiRequest<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        }),
    put: <T>(endpoint: string, data?: any) =>
        apiRequest<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        }),
    delete: <T>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: "DELETE" }),
}

