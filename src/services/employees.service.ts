import { api } from "@/lib/api-client"
import type {
  Employee,
  EmployeeShort,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "@/types"

export const employeesService = {
  getAll: async (): Promise<Employee[]> => {
    return api.get<Employee[]>("/Employees")
  },

  getById: async (id: number): Promise<Employee> => {
    return api.get<Employee>(`/Employees/${id}`)
  },

  create: async (data: CreateEmployeeDto): Promise<Employee> => {
    return api.post<Employee>("/Employees", data)
  },

  update: async (id: number, data: UpdateEmployeeDto): Promise<Employee> => {
    return api.put<Employee>(`/Employees/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/Employees/${id}`)
  },

  getByProject: async (projectId: number): Promise<EmployeeShort[]> => {
    return api.get<EmployeeShort[]>(`/Employees/project/${projectId}`)
  },
}

