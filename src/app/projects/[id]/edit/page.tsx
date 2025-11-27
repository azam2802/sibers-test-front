"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EmployeeSelect } from "@/components/employee-select"
import { EmployeeMultiSelect } from "@/components/employee-multi-select"
import { FileUpload } from "@/components/file-upload"
import { projectsService } from "@/services/projects.service"
import { useAuthStore } from "@/store/auth-store"
import { AuthProtected } from "@/components/auth-protected"
import type { Project } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "react-hot-toast"

type WizardStep = 1 | 2 | 3 | 4 | 5

function EditProjectContent() {
  const router = useRouter()
  const params = useParams()
  const projectId = parseInt(params.id as string)
  const { user } = useAuthStore()

  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Step 1
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [priority, setPriority] = useState("1")

  // Step 2
  const [customerCompany, setCustomerCompany] = useState("")
  const [executorCompany, setExecutorCompany] = useState("")

  // Step 3
  const [managerId, setManagerId] = useState<number | null>(null)

  // Step 4
  const [employeeIds, setEmployeeIds] = useState<number[]>([])
  const [initialEmployeeIds, setInitialEmployeeIds] = useState<number[]>([])

  // Step 5
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    const loadProject = async () => {
      try {
        const project = await projectsService.getById(projectId)

        const canEdit =
          user?.role === "Director" ||
          (user?.role === "ProjectManager" && project.managerId === user.id)

        if (!canEdit) {
          toast.error("You do not have permission to edit this project.")
          router.push(`/projects/${projectId}`)
          return
        }

        populateForm(project)
      } catch (error: any) {
        console.error("Failed to load project:", error)
        toast.error(error?.data?.detail || "Failed to load project.")
        router.push(`/projects/${projectId}`)
      } finally {
        setIsLoading(false)
      }
    }

    if (!Number.isNaN(projectId)) {
      loadProject()
    }
  }, [projectId, router, user])

  const populateForm = (project: Project) => {
    setName(project.name)
    setStartDate(new Date(project.startDate).toISOString().split("T")[0])
    setEndDate(new Date(project.endDate).toISOString().split("T")[0])
    setPriority(project.priority.toString())
    setCustomerCompany(project.customerCompany)
    setExecutorCompany(project.executorCompany)
    setManagerId(project.managerId)
    const currentEmployeeIds = project.employees.map((emp) => emp.id)
    setEmployeeIds(currentEmployeeIds)
    setInitialEmployeeIds(currentEmployeeIds)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name && startDate && endDate && priority
      case 2:
        return customerCompany && executorCompany
      case 3:
        return managerId !== null
      case 4:
        return true
      case 5:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep)
    }
  }

  const handleCancel = () => {
    router.push(`/projects/${projectId}`)
  }

  const handleSubmit = async () => {
    if (!canProceed() || !managerId) return

    setIsSubmitting(true)
    try {
      const updateData = {
        name,
        customerCompany,
        executorCompany,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        priority: parseInt(priority),
        managerId,
      }

      await projectsService.update(projectId, updateData)

      // Handle adding new employees
      const newEmployeeIds = employeeIds.filter(
        (id) => !initialEmployeeIds.includes(id)
      )

      if (newEmployeeIds.length > 0) {
        await projectsService.addEmployees(projectId, newEmployeeIds)
      }

      // Handle removing employees
      const removedEmployeeIds = initialEmployeeIds.filter(
        (id) => !employeeIds.includes(id)
      )

      if (removedEmployeeIds.length > 0) {
        await projectsService.removeEmployees(projectId, removedEmployeeIds)
      }

      router.push(`/projects/${projectId}`)
    } catch (error: any) {
      console.error("Failed to update project:", error)
      toast.error(error?.data?.detail || "Failed to update project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Priority <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="1-10"
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Customer Company <span className="text-destructive">*</span>
              </Label>
              <Input
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                placeholder="Enter customer company name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
                Executor Company <span className="text-destructive">*</span>
              </Label>
              <Input
                value={executorCompany}
                onChange={(e) => setExecutorCompany(e.target.value)}
                placeholder="Enter executor company name"
                required
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <EmployeeSelect
              value={managerId}
              onChange={setManagerId}
              label="Project Manager"
              placeholder="Search for project manager..."
              required
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <EmployeeMultiSelect
              value={employeeIds}
              onChange={setEmployeeIds}
              label="Project Employees"
              placeholder="Search and add employees..."
            />
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <FileUpload
              files={files}
              onChange={setFiles}
              label="Project Documents"
              maxFiles={10}
            />
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading project data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>
            Step {currentStep} of 5:{" "}
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Companies"}
            {currentStep === 3 && "Project Manager"}
            {currentStep === 4 && "Employees"}
            {currentStep === 5 && "Documents"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded ${step <= currentStep ? "bg-primary" : "bg-muted"
                    } ${step < 5 ? "mr-2" : ""}`}
                />
              ))}
            </div>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            {currentStep === 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EditProjectPage() {
  return (
    <AuthProtected>
      <EditProjectContent />
    </AuthProtected>
  )
}
