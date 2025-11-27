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
import type { Project, Task } from "@/types"
import { Plus, Calendar, Users, Trash2, Edit } from "lucide-react"

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
        setTasks(tasksData)
      } catch (error) {
        console.error("Failed to fetch project:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [projectId])

  const canManageProject =
    user?.role === "Director" ||
    (user?.role === "ProjectManager" && project?.managerId === user.id)
console.log(user?.role, project?.managerId, user?.id)

  const canCreateTask = canManageProject

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Project not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/projects")}>
          ← Back to Projects
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
        <h2 className="text-2xl font-bold">Tasks</h2>
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
            <Card
              key={task.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/tasks/${task.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.comment}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Status: {task.status}</span>
                      <span>Priority: {task.priority}</span>
                      {task.assigneeFullName && (
                        <span>Assignee: {task.assigneeFullName}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

