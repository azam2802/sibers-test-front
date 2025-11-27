import { api } from "@/lib/api-client"
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from "@/types"

export const tasksService = {
  getAll: async (params?: {
    status?: TaskStatus
    sortBy?: string
  }): Promise<Task[]> => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append("status", params.status)
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy)

    const query = queryParams.toString()
    return api.get<Task[]>(`/tasks${query ? `?${query}` : ""}`)
  },

  getById: async (id: number): Promise<Task> => {
    return api.get<Task>(`/tasks/${id}`)
  },

  getByProject: async (projectId: number): Promise<Task[]> => {
    return api.get<Task[]>(`/tasks/project/${projectId}`)
  },

  getByAssignee: async (assigneeId: number): Promise<Task[]> => {
    return api.get<Task[]>(`/tasks/assignee/${assigneeId}`)
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    return api.post<Task>("/tasks", data)
  },

  update: async (id: number, data: UpdateTaskDto): Promise<Task> => {
    return api.put<Task>(`/tasks/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/tasks/${id}`)
  },
}

