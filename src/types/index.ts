// Auth Types
export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
  middleName?: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: "Director" | "ProjectManager" | "Employee"
}

export interface AuthResponse {
  accessToken: string
  user: User
}

// Employee Types
export interface Employee {
  id: number
  firstName: string
  lastName: string
  middleName?: string
  email: string
  role: string
}

export interface EmployeeShort {
  id: number
  fullName: string
  role: string
}

export interface CreateEmployeeDto {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  password: string
  role: "Developer" | "ProjectManager" | "Director"
}

export interface UpdateEmployeeDto {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  role: "Developer" | "ProjectManager" | "Director"
  password?: string
}

// Project Types
export interface Project {
  id: number
  name: string
  customerCompany: string
  executorCompany: string
  startDate: string
  endDate: string
  priority: number
  managerId: number
  managerFullName: string
  employees: EmployeeShort[]
  tasksCount: number
}

export interface CreateProjectDto {
  name: string
  customerCompany: string
  executorCompany: string
  startDate: string
  endDate: string
  priority: number
  managerId: number
  employeeIds: number[]
}

export interface UpdateProjectDto {
  name: string
  customerCompany: string
  executorCompany: string
  startDate: string
  endDate: string
  priority: number
  managerId: number
}

// Task Types
export type TaskStatus = "ToDo" | "InProgress" | "Done"

export interface Task {
  id: number
  title: string
  comment: string
  priority: number
  status: TaskStatus
  authorId: number
  authorFullName: string
  assigneeId: number | null
  assigneeFullName: string | null
  projectId: number
}

export interface CreateTaskDto {
  title: string
  comment: string
  priority: number
  projectId: number
  authorId: number
  assigneeId: number
}

export interface UpdateTaskDto {
  title: string
  comment: string
  priority: number
  status?: TaskStatus
  assigneeId?: number
}

