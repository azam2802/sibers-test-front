"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { useAuthStore } from "@/store/auth-store"
import { AuthProtected } from "@/components/auth-protected"
import { LoaderFullPage } from "@/components/loader"
import type { Task, TaskStatus } from "@/types"
import { Trash2, Save, ArrowLeft } from "lucide-react"
import { toast } from "react-hot-toast"

function TaskDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const taskId = parseInt(params.id as string)
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [priority, setPriority] = useState("1")
  const [status, setStatus] = useState<TaskStatus>("ToDo")
  const [assigneeId, setAssigneeId] = useState<number | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await tasksService.getById(taskId)
        setTask(data)
        setTitle(data.title)
        setComment(data.comment)
        setPriority(data.priority.toString())
        setStatus(data.status)
        setAssigneeId(data.assigneeId)
      } catch (error: any) {
        toast.error(error?.data?.detail || "Failed to fetch task")
        console.error("Failed to fetch task:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  const canEdit =
    user?.role === "Director" ||
    user?.role === "ProjectManager" ||
    (user?.role === "Employee" && task?.assigneeId === user.id)

  const canDelete = user?.role === "Director"

  const canChangeAssignee = user?.role === "Director" || user?.role === "ProjectManager"

  const handleSave = async () => {
    if (!task) return

    setIsSaving(true)
    try {
      await tasksService.update(taskId, {
        title,
        comment,
        priority: parseInt(priority),
        status,
        assigneeId: assigneeId || undefined,
      })

      router.push(`/projects/${task.projectId}`)
    } catch (error: any) {
      console.error("Failed to update task:", error)
      toast.error(error?.data?.detail || "Failed to update task")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!task || !confirm("Are you sure you want to delete this task?")) return

    setIsDeleting(true)
    try {
      await tasksService.delete(taskId)
      router.push(`/projects/${task.projectId}`)
    } catch (error: any) {
      console.error("Failed to delete task:", error)
      toast.error(error?.data?.detail || "Failed to delete task")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <LoaderFullPage />
  }

  if (!task) {
    return (
      <div className="container text-center mx-auto py-8 px-4">
        <p className="mb-4">Task not found or you don't have access to it.</p>
        <Button variant="outline" onClick={() => router.push("/tasks")}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back to Tasks
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push(`/projects/${task.projectId}`)}>
          ← Back to Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>View and edit task information</CardDescription>
            </div>
            {canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!canEdit}
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
                disabled={!canEdit}
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
                  disabled={!canEdit}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as TaskStatus)}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ToDo">To Do</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {
              canChangeAssignee && (
                <div className="space-y-2">
                  <EmployeeSelect
                    value={assigneeId}
                    onChange={setAssigneeId}
                    label="Assignee"
                    placeholder="Select assignee..."
                    disabled={!canChangeAssignee}
                  />
                </div>
              )
            }

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Author: {task.authorFullName}</p>
                <p>Project ID: {task.projectId}</p>
              </div>
            </div>

            {canEdit && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TaskDetailPage() {
  return (
    <AuthProtected>
      <TaskDetailContent />
    </AuthProtected>
  )
}

