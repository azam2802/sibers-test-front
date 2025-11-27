"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { employeesService } from "@/services/employees.service"
import type { Employee } from "@/types"
import { cn } from "@/lib/utils"

interface EmployeeMultiSelectProps {
  value?: number[]
  onChange: (employeeIds: number[]) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export function EmployeeMultiSelect({
  value = [],
  onChange,
  label,
  placeholder = "Search employees...",
  disabled = false,
  required = false,
}: EmployeeMultiSelectProps) {
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
    const available = employees.filter((emp) => !value.includes(emp.id))
    if (!searchTerm) return available
    const term = searchTerm.toLowerCase()
    return available.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        `${emp.lastName} ${emp.firstName}`.toLowerCase().includes(term)
    )
  }, [employees, searchTerm, value])

  const selectedEmployees = employees.filter((emp) => value.includes(emp.id))

  const handleAdd = (employeeId: number) => {
    if (!value.includes(employeeId)) {
      onChange([...value, employeeId])
      setSearchTerm("")
    }
  }

  const handleRemove = (employeeId: number) => {
    onChange(value.filter((id) => id !== employeeId))
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="space-y-2">
        {selectedEmployees.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm"
              >
                <span>
                  {employee.lastName} {employee.firstName}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(employee.id)}
                  disabled={disabled}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            onMouseDown={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            required={required && value.length === 0}
          />
          {isOpen && filteredEmployees.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredEmployees.map((employee) => (
                <button
                  key={employee.id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleAdd(employee.id)
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
    </div>
  )
}

