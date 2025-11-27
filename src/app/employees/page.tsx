"use client"

import { useEffect, useState } from "react"
import { AuthProtected } from "@/components/auth-protected"
import { useAuthStore } from "@/store/auth-store"
import { employeesService } from "@/services/employees.service"
import type { CreateEmployeeDto, Employee, UpdateEmployeeDto } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog"
import { EditEmployeeDialog } from "@/components/employees/edit-employee-dialog"
import { DeleteEmployeeDialog } from "@/components/employees/delete-employee-dialog"
import { EmployeesTable } from "@/components/employees/employees-table"
import { LoaderFullPage } from "@/components/loader"

function EmployeesContent() {
  const { user } = useAuthStore()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Edit state
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<UpdateEmployeeDto>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    role: "Developer",
  })

  // Delete state
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const fetchEmployees = async () => {
    try {
      const data = await employeesService.getAll()
      setEmployees(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load employees.")
    }
  }

  useEffect(() => {
    const load = async () => {
      await fetchEmployees()
      setIsLoading(false)
    }
    load()
  }, [])

  const isDirector = user?.role === "Director"

  // Create employee handler
  const handleCreateEmployee = async (data: CreateEmployeeDto) => {
    setIsSubmitting(true)
    try {
      await employeesService.create(data)
      await fetchEmployees()
      setSuccess("Employee created successfully.")
    } catch (err: any) {
      console.error(err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit handlers
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee)
    setEditForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      middleName: employee.middleName || "",
      email: employee.email,
      role: employee.role as UpdateEmployeeDto["role"],
    })
    setError(null)
    setSuccess(null)
    setIsEditDialogOpen(true)
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setError(null)
      setSuccess(null)
      setEditingEmployee(null)
    }
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isDirector || !editingEmployee) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await employeesService.update(editingEmployee.id, editForm)
      await fetchEmployees()
      setSuccess("Employee updated successfully.")
      setIsEditDialogOpen(false)
      setEditingEmployee(null)
    } catch (err: any) {
      console.error(err)
      setError(err?.data?.detail || "Failed to update employee.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete handlers
  const handleDeleteClick = (employee: Employee) => {
    setDeletingEmployee(employee)
    setError(null)
    setSuccess(null)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open)
    if (!open) {
      setError(null)
      setSuccess(null)
      setDeletingEmployee(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!isDirector || !deletingEmployee) return

    setIsSubmitting(true)
    setError(null)
    try {
      await employeesService.delete(deletingEmployee.id)
      await fetchEmployees()
      setSuccess("Employee deleted successfully.")
      setIsDeleteDialogOpen(false)
      setDeletingEmployee(null)
    } catch (err: any) {
      console.error(err)
      setError(err?.data?.detail || "Failed to delete employee.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoaderFullPage />
  }

  if (!isDirector) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Only Directors have access to manage employees.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Manage and invite employees.</CardDescription>
          </div>
          <AddEmployeeDialog
            onSuccess={async () => { }}
            onSubmit={handleCreateEmployee}
            isSubmitting={isSubmitting}
          />
        </CardHeader>
        <CardContent>
          <EmployeesTable
            employees={employees}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <EditEmployeeDialog
        isOpen={isEditDialogOpen}
        onOpenChange={handleEditDialogChange}
        form={editForm}
        onFormChange={handleEditChange}
        onRoleChange={(role) =>
          setEditForm((prev) => ({ ...prev, role }))
        }
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />

      <DeleteEmployeeDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        employee={deletingEmployee}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  )
}

export default function EmployeesPage() {
  return (
    <AuthProtected>
      <EmployeesContent />
    </AuthProtected>
  )
}
