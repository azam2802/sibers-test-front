"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { tasksService } from "@/services/tasks.service"
import { useAuthStore } from "@/store/auth-store"
import { AuthProtected } from "@/components/auth-protected"
import type { Task, TaskStatus } from "@/types"
import { Plus, Filter } from "lucide-react"

function TasksContent() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [sortBy, setSortBy] = useState<string>("priority")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let data: Task[]
        if (user?.role === "Director") {
          data = await tasksService.getAll()
        } else if (user?.role === "ProjectManager") {
          // ProjectManager sees tasks from their projects
          data = await tasksService.getAll()
        } else {
          // Employee sees only their assigned tasks
          data = user ? await tasksService.getByAssignee(user.id) : []
        }
        setTasks(data)
        setFilteredTasks(data)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
        setTasks([])
        setFilteredTasks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [user])

  useEffect(() => {
    let filtered = [...tasks]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.comment.toLowerCase().includes(term) ||
          task.assigneeFullName?.toLowerCase().includes(term)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return a.priority - b.priority
        case "priority_desc":
          return b.priority - a.priority
        case "title":
          return a.title.localeCompare(b.title)
        case "title_desc":
          return b.title.localeCompare(a.title)
        case "status":
          return a.status.localeCompare(b.status)
        case "status_desc":
          return b.status.localeCompare(a.status)
        default:
          return 0
      }
    })

    setFilteredTasks(filtered)
  }, [tasks, statusFilter, sortBy, searchTerm])

  const canCreateTask = user?.role === "Director" || user?.role === "ProjectManager"

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading tasks...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your tasks
          </p>
        </div>
        {canCreateTask && (
          <Button onClick={() => router.push("/tasks/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Sorting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as TaskStatus | "all")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ToDo">To Do</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority (Low to High)</SelectItem>
                  <SelectItem value="priority_desc">Priority (High to Low)</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No tasks found. {canCreateTask && "Create your first task to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/tasks/${task.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{task.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          task.status === "Done"
                            ? "bg-green-500/20 text-green-500"
                            : task.status === "InProgress"
                            ? "bg-blue-500/20 text-blue-500"
                            : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {task.status}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        Priority: {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.comment}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Author: {task.authorFullName}</span>
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

export default function TasksPage() {
  return (
    <AuthProtected>
      <TasksContent />
    </AuthProtected>
  )
}

