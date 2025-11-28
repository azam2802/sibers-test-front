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
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("customerCompany", data.customerCompany)
    formData.append("executorCompany", data.executorCompany)
    formData.append("startDate", data.startDate)
    formData.append("endDate", data.endDate)
    formData.append("priority", data.priority.toString())
    formData.append("managerId", data.managerId.toString())

    data.employeeIds.forEach((id) => {
      formData.append("employeeIds", id.toString())
    })

    console.log(data.files)
    if (data.files) {
      console.log(data.files)
      data.files.forEach((file) => {
        formData.append("files", file)
      })
    }

    return api.post<Project>("/projects", formData)
  },

  update: async (id: number, data: UpdateProjectDto): Promise<Project> => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("customerCompany", data.customerCompany)
    formData.append("executorCompany", data.executorCompany)
    formData.append("startDate", data.startDate)
    formData.append("endDate", data.endDate)
    formData.append("priority", data.priority.toString())
    formData.append("managerId", data.managerId.toString())

    if (data.files) {
      console.log(data.files)
      data.files.forEach((file) => {
        formData.append("files", file)
      })
    }

    return api.put<Project>(`/projects/${id}`, formData)
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/projects/${id}`)
  },

  addEmployees: async (projectId: number, employeeIds: number[]): Promise<void> => {
    return api.post<void>(`/projects/${projectId}/employees`, { employeeIds })
  },

  removeEmployees: async (projectId: number, employeeIds: number[]): Promise<void> => {
    return api.delete<void>(`/projects/${projectId}/employees`, { employeeIds })
  },
}

