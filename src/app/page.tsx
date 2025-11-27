"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProtected } from "@/components/auth-protected"
import { useAuthStore } from "@/store/auth-store"
import { projectsService } from "@/services/projects.service"
import { tasksService } from "@/services/tasks.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, CheckSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Project, Task } from "@/types"

function HomeContent() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "Director") {
          const [projectsData, tasksData] = await Promise.all([
            projectsService.getAll(),
            tasksService.getAll(),
          ])
          setProjects(projectsData)
          setTasks(tasksData)
        } else if (user?.role === "ProjectManager") {
          const [projectsData, tasksData] = await Promise.all([
            projectsService.getAll(),
            tasksService.getAll(),
          ])
          setProjects(projectsData.filter((p) => p.managerId === user.id))
          setTasks(tasksData)
        } else if (user) {
          const tasksData = await tasksService.getByAssignee(user.id)
          setTasks(tasksData)
          // Get projects from tasks
          const projectIds = [...new Set(tasksData.map((t) => t.projectId))]
          const projectsData = await Promise.all(
            projectIds.map((id) => projectsService.getById(id))
          )
          setProjects(projectsData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading...</p>
      </div>
    )
  }

  const recentProjects = projects.slice(0, 5)
  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.firstName} {user?.lastName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Role: {user?.role}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Recent Projects
              </CardTitle>
              <Link href="/projects" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="text-muted-foreground text-sm">No projects found</p>
            ) : (
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.tasksCount} tasks
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
              <Link href="/tasks" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks found</p>
            ) : (
              <div className="space-y-2">
                {recentTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.status} • Priority: {task.priority}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProtected>
      <HomeContent />
    </AuthProtected>
  )
}
