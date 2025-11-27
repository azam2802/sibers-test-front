"use client"

import { useEffect, useState } from "react"
import { AuthProtected } from "@/components/auth-protected"
import { useAuthStore } from "@/store/auth-store"
import { employeesService } from "@/services/employees.service"
import type { CreateEmployeeDto, Employee } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, EyeOff } from "lucide-react"

const ROLE_OPTIONS: CreateEmployeeDto["role"][] = [
  "Director",
  "ProjectManager",
  "Developer",
]

function EmployeesContent() {
  const { user } = useAuthStore()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState<CreateEmployeeDto>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    password: "",
    role: "Developer",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === "password") {
      validatePassword(value)
    }
  }
  const validatePassword = (value: string) => {
    const hasMinLength = value.length >= 6
    const hasSpecialChar = /[#\$!\?\%\^&\*]/.test(value)
    const hasLowercase = /[a-z]/.test(value)
    const hasUppercase = /[A-Z]/.test(value)
    if (!hasMinLength || !hasSpecialChar || !hasLowercase || !hasUppercase) {
      setPasswordError(
        "Password must be at least 6 characters and include upper, lower, and special characters (#$!?%^&*)."
      )
      return false
    }
    setPasswordError(null)
    return true
  }


  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setError(null)
      setSuccess(null)
      setPasswordError(null)
      setShowPassword(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      password: "",
      role: "Developer",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isDirector) return

    if (!validatePassword(form.password)) {
      setError(
        "Password must be at least 6 characters and include upper, lower, and special characters (#$!?%^&*)."
      )
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await employeesService.create(form)
      await fetchEmployees()
      resetForm()
      setSuccess("Employee created successfully.")
      handleOpenChange(false)
    } catch (err: any) {
      console.error(err)
      setError(err?.data?.title || "Failed to create employee.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p>Loading employees...</p>
      </div>
    )
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
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button type="button">Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Employee</DialogTitle>
                <DialogDescription>
                  Fill out the form to invite a new employee.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="grid gap-4"
              >
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-destructive">{passwordError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      role: value as CreateEmployeeDto["role"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                {(error || success) && (
                  <p
                    className={`text-sm ${
                      error ? "text-destructive" : "text-emerald-400"
                    }`}
                  >
                    {error || success}
                  </p>
                )}
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Employee"}
                </Button>
              </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No employees found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={`${employee.id}-${employee.email}`}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-2 pr-4">
                        {employee.lastName} {employee.firstName}
                        {employee.middleName ? ` ${employee.middleName}` : ""}
                      </td>
                      <td className="py-2 pr-4">{employee.email}</td>
                      <td className="py-2 pr-4 capitalize">
                        {employee.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
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
