import { api } from "@/lib/api-client"
import type { Project, CreateProjectDto, UpdateProjectDto } from "@/types"

export const projectsService = {
  getAll: async (params?: {
    startFrom?: string
    startTo?: string
    priority?: number
    sortBy?: string
  }): Promise<Project[]> => {
    const queryParams = new URLSearchParams()
    if (params?.startFrom) queryParams.append("startFrom", params.startFrom)
    if (params?.startTo) queryParams.append("startTo", params.startTo)
    if (params?.priority) queryParams.append("priority", params.priority.toString())
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy)

    const query = queryParams.toString()
    return api.get<Project[]>(`/projects${query ? `?${query}` : ""}`)
  },

  getById: async (id: number): Promise<Project> => {
    return api.get<Project>(`/projects/${id}`)
  },

  create: async (data: CreateProjectDto): Promise<Project> => {
    return api.post<Project>("/projects", data)
  },

  update: async (id: number, data: UpdateProjectDto): Promise<Project> => {
    return api.put<Project>(`/projects/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/projects/${id}`)
  },

  addEmployee: async (projectId: number, employeeId: number): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/projects/${projectId}/employees/${employeeId}`)
  },

  removeEmployee: async (projectId: number, employeeId: number): Promise<void> => {
    return api.delete<void>(`/projects/${projectId}/employees/${employeeId}`)
  },
}

