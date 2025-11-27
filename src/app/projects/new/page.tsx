"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProjectBasicInfoStep } from "@/components/projects/wizard/project-basic-info-step"
import { ProjectCompaniesStep } from "@/components/projects/wizard/project-companies-step"
import { ProjectManagerStep } from "@/components/projects/wizard/project-manager-step"
import { ProjectEmployeesStep } from "@/components/projects/wizard/project-employees-step"
import { ProjectFilesStep } from "@/components/projects/wizard/project-files-step"
import { projectsService } from "@/services/projects.service"
import { useAuthStore } from "@/store/auth-store"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type WizardStep = 1 | 2 | 3 | 4 | 5

export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Basic info
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [priority, setPriority] = useState("1")

  // Step 2: Companies
  const [customerCompany, setCustomerCompany] = useState("")
  const [executorCompany, setExecutorCompany] = useState("")

  // Step 3: Manager
  const [managerId, setManagerId] = useState<number | null>(null)

  // Step 4: Employees
  const [employeeIds, setEmployeeIds] = useState<number[]>([])

  // Step 5: Files
  const [files, setFiles] = useState<File[]>([])

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name && startDate && endDate && priority
      case 2:
        return customerCompany && executorCompany
      case 3:
        return managerId !== null
      case 4:
        return true // Employees are optional
      case 5:
        return true // Files are optional
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

  const handleSubmit = async () => {
    if (!canProceed() || !managerId || !user) return

    setIsSubmitting(true)
    try {
      const projectData = {
        name,
        customerCompany,
        executorCompany,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        priority: parseInt(priority),
        managerId,
        employeeIds,
      }

      await projectsService.create(projectData)

      // TODO: Upload files if there's an endpoint
      // For now, files are stored in state but not uploaded

      router.push("/projects")
    } catch (error: any) {
      console.error("Failed to create project:", error)
      toast.error(error?.data?.detail || "Failed to create project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectBasicInfoStep
            name={name}
            setName={setName}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            priority={priority}
            setPriority={setPriority}
          />
        )

      case 2:
        return (
          <ProjectCompaniesStep
            customerCompany={customerCompany}
            setCustomerCompany={setCustomerCompany}
            executorCompany={executorCompany}
            setExecutorCompany={setExecutorCompany}
          />
        )

      case 3:
        return (
          <ProjectManagerStep
            managerId={managerId}
            setManagerId={setManagerId}
          />
        )

      case 4:
        return (
          <ProjectEmployeesStep
            employeeIds={employeeIds}
            setEmployeeIds={setEmployeeIds}
          />
        )

      case 5:
        return (
          <ProjectFilesStep
            files={files}
            setFiles={setFiles}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
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
                  className={`flex-1 h-2 rounded ${step <= currentStep
                    ? "bg-primary"
                    : "bg-muted"
                    } ${step < 5 ? "mr-2" : ""}`}
                />
              ))}
            </div>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            {
              currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/projects")}
            >
              Cancel
            </Button>
              )
            }
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
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

