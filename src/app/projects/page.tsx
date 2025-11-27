"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { projectsService } from "@/services/projects.service"
import { useAuthStore } from "@/store/auth-store"
import { AuthProtected } from "@/components/auth-protected"
import type { Project } from "@/types"
import { Plus, Calendar, Users, CheckSquare } from "lucide-react"

function ProjectsContent() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // For now, only Director can see all projects
        // ProjectManager and Employee should see their own projects
        // This will be handled by backend filtering
        const data = await projectsService.getAll()
        setProjects(data)
      } catch (error: any) {
        console.error("Failed to fetch projects:", error)
        if (error.status === 403) {
          // User doesn't have permission
          setProjects([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const canCreateProject = user?.role === "Director"

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your projects and tasks
          </p>
        </div>
        {canCreateProject && (
          <Button onClick={() => router.push("/projects/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No projects found. {canCreateProject && "Create your first project to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <CardHeader>
                <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                <CardDescription>
                  {project.customerCompany} → {project.executorCompany}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Manager: {project.managerFullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckSquare className="h-4 w-4" />
                    <span>{project.tasksCount} tasks</span>
                  </div>
                  <div className="pt-2">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      Priority: {project.priority}
                    </span>
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

export default function ProjectsPage() {
  return (
    <AuthProtected>
      <ProjectsContent />
    </AuthProtected>
  )
}

