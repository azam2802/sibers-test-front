import { api } from "@/lib/api-client"
import type { Employee, EmployeeShort, CreateEmployeeDto } from "@/types"

export const employeesService = {
  getAll: async (): Promise<Employee[]> => {
    return api.get<Employee[]>("/employees")
  },

  getById: async (id: number): Promise<Employee> => {
    return api.get<Employee>(`/employees/${id}`)
  },

  create: async (data: CreateEmployeeDto): Promise<Employee> => {
    return api.post<Employee>("/employees", data)
  },

  update: async (id: number, data: CreateEmployeeDto): Promise<Employee> => {
    return api.put<Employee>(`/employees/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/employees/${id}`)
  },

  getByProject: async (projectId: number): Promise<EmployeeShort[]> => {
    return api.get<EmployeeShort[]>(`/employees/project/${projectId}`)
  },
}

