"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { employeesService } from "@/services/employees.service"
import type { Employee } from "@/types"
import { cn } from "@/lib/utils"

interface EmployeeSelectProps {
  value?: number | null
  onChange: (employeeId: number | null) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export function EmployeeSelect({
  value,
  onChange,
  label,
  placeholder = "Search employee...",
  disabled = false,
  required = false,
}: EmployeeSelectProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true)
      try {
        const data = await employeesService.getAll()
        setEmployees(data)
      } catch (error) {
        console.error("Failed to fetch employees:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees
    const term = searchTerm.toLowerCase()
    return employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        `${emp.lastName} ${emp.firstName}`.toLowerCase().includes(term)
    )
  }, [employees, searchTerm])

  const selectedEmployee = employees.find((emp) => emp.id === value)

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          value={selectedEmployee ? `${selectedEmployee.lastName} ${selectedEmployee.firstName}` : searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
            if (!e.target.value) {
              onChange(null)
            }
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          required={required}
        />
        {isOpen && filteredEmployees.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredEmployees.map((employee) => (
              <button
                key={employee.id}
                type="button"
                className={cn(
                  "w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors",
                  value === employee.id && "bg-accent"
                )}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(employee.id)
                  setSearchTerm("")
                  setIsOpen(false)
                }}
              >
                <div className="font-medium">
                  {employee.lastName} {employee.firstName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {employee.email} • {employee.role}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

