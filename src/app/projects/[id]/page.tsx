"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { projectsService } from "@/services/projects.service"
import { tasksService } from "@/services/tasks.service"
import { useAuthStore } from "@/store/auth-store"
import { AuthProtected } from "@/components/auth-protected"
import { TaskCard } from "@/components/task-card"
import { LoaderFullPage } from "@/components/loader"
import type { Project, Task } from "@/types"
import { Plus, Trash2, Edit, FileIcon, Download, ArrowLeft } from "lucide-react"
import { FaRegFileCode, FaRegFileExcel, FaRegFileImage, FaRegFilePowerpoint, FaRegFileWord, FaRegFilePdf } from "react-icons/fa6"
import toast from "react-hot-toast"
import { FaRegFileArchive } from "react-icons/fa"
import { FiFileText } from "react-icons/fi"

function ProjectDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const projectId = parseInt(params.id as string)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, tasksData] = await Promise.all([
          projectsService.getById(projectId),
          tasksService.getByProject(projectId),
        ])
        setProject(projectData)

        if (user?.role !== "Employee") {
          setTasks(tasksData)
        } else {
          setTasks(tasksData.filter((task) => task.assigneeId === user.id))
        }

      } catch (error: any) {
        console.error("Failed to fetch project:", error)
        toast.error(error?.data?.detail || "Failed to fetch project.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [projectId])

  const downloadDocument = (documentUrl: string) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${documentUrl}`
    window.open(fullUrl, '_blank')
  }

  const canManageProject =
    user?.role === "Director" ||
    (user?.role === "ProjectManager" && project?.managerId === user.id)

  const canCreateTask = canManageProject

  if (isLoading) {
    return <LoaderFullPage />
  }

  if (!project) {
    return (
      <div className="container text-center mx-auto py-8 px-4">
        <p className="mb-4">Project not found or you don't have access to it.</p>
        <Button variant="outline" onClick={() => router.push("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back to Projects
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back to Projects
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{project.name}</CardTitle>
              <CardDescription className="mt-2">
                {project.customerCompany} → {project.executorCompany}
              </CardDescription>
            </div>
            {canManageProject && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/projects/${projectId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {user?.role === "Director" && (
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">
                {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">
                {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <p className="font-medium">{project.priority}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manager</p>
              <p className="font-medium">{project.managerFullName}</p>
            </div>
          </div>
          {project.employees.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Employees</p>
              <div className="flex flex-wrap gap-2">
                {project.employees.map((emp) => (
                  <span
                    key={emp.id}
                    className="px-2 py-1 bg-secondary rounded text-sm"
                  >
                    {emp.fullName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Documents</h2>
      </div>

      {project.documents.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No documents found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 mb-8">
          {project.documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <CardTitle className="text-lg">
                  {doc.fileName.includes(".pdf") ? (
                    <FaRegFilePdf className="inline mr-2 align-[-2px]" />
                  ) : doc.fileName.includes(".doc") || doc.fileName.includes(".docx") ? (
                    <FaRegFileWord className="inline mr-2 align-[-2px]" />
                  ) : doc.fileName.includes(".xls") || doc.fileName.includes(".xlsx") || doc.fileName.includes(".csv") ? (
                    <FaRegFileExcel className="inline mr-2 align-[-2px]" />
                  ) : doc.fileName.includes(".ppt") || doc.fileName.includes(".pptx") ? (
                    <FaRegFilePowerpoint className="inline mr-2 align-[-2px]" />
                  ) : doc.fileName.includes(".txt") ? (
                    <FiFileText className="inline mr-2 align-[-2px]" />
                  ) : doc.fileName.includes(".zip") || doc.fileName.includes(".rar") ? (
                    <FaRegFileArchive className="inline mr-2 align-[-2px]" />
                  ) : doc.fileName.includes(".jpg") || doc.fileName.includes(".png") || doc.fileName.includes(".jpeg") ? (
                    <FaRegFileImage className="inline mr-2 align-[-2px]" />
                  ) : doc.fileName.includes(".js") || doc.fileName.includes(".jsx") || doc.fileName.includes(".ts") || doc.fileName.includes(".tsx") || doc.fileName.includes(".json") || doc.fileName.includes(".html") || doc.fileName.includes(".css") ? (
                    <FaRegFileCode className="inline mr-2 align-[-2px]" />
                  ) : (
                    <FileIcon className="inline mr-2 align-[-2px]" />
                  )}
                  {doc.fileName}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => downloadDocument(doc.url)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>

            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{user?.role !== "Employee" ? "All" : "Your"} Tasks</h2>
        {canCreateTask && (
          <Button onClick={() => router.push(`/tasks/new?projectId=${projectId}`)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No tasks found. {canCreateTask && "Create your first task to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => router.push(`/tasks/${task.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectDetailPage() {
  return (
    <AuthProtected>
      <ProjectDetailContent />
    </AuthProtected>
  )
}

