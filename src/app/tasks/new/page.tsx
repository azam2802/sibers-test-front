"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { EmployeeSelect } from "@/components/employee-select"
import { tasksService } from "@/services/tasks.service"
import { projectsService } from "@/services/projects.service"
import { useAuthStore } from "@/store/auth-store"
import { AuthProtected } from "@/components/auth-protected"
import type { Project } from "@/types"

function NewTaskContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectIdParam = searchParams.get("projectId")
  const { user } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [priority, setPriority] = useState("1")
  const [projectId, setProjectId] = useState<number | null>(
    projectIdParam ? parseInt(projectIdParam) : null
  )
  const [assigneeId, setAssigneeId] = useState<number | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getAll()
        setProjects(data)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      }
    }

    fetchProjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !projectId || !assigneeId) return

    setIsLoading(true)
    try {
      await tasksService.create({
        title,
        comment,
        priority: parseInt(priority),
        projectId,
        authorId: user.id,
        assigneeId,
      })

      router.push(`/projects/${projectId}`)
    } catch (error: any) {
      console.error("Failed to create task:", error)
      alert(error?.data?.title || "Failed to create task")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>Add a new task to a project</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                Comment <span className="text-destructive">*</span>
              </Label>
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter task description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Project <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={projectId?.toString() || ""}
                  onValueChange={(value) => setProjectId(parseInt(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <EmployeeSelect
                value={assigneeId}
                onChange={setAssigneeId}
                label="Assignee"
                placeholder="Select assignee..."
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NewTaskPage() {
  return (
    <AuthProtected>
      <NewTaskContent />
    </AuthProtected>
  )
}

