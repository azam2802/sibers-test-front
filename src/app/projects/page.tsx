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
import { projectsService } from "@/services/projects.service"
import { useAuthStore } from "@/store/auth-store"
import { AuthProtected } from "@/components/auth-protected"
import { LoaderFullPage } from "@/components/loader"
import type { Project } from "@/types"
import { Plus, Calendar, Users, CheckSquare, Filter } from "lucide-react"

function ProjectsContent() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter and sort state
  const [startFrom, setStartFrom] = useState("")
  const [startTo, setStartTo] = useState("")
  const [priority, setPriority] = useState<string>("")
  const [sortBy, setSortBy] = useState("startdate_desc")

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const params: any = {}

      if (startFrom) params.startFrom = startFrom
      if (startTo) params.startTo = startTo
      if (priority) params.priority = parseInt(priority)
      if (sortBy) params.sortBy = sortBy

      const data = await projectsService.getAll(params)
      setProjects(data)
    } catch (error: any) {
      console.error("Failed to fetch projects:", error)
      if (error.status === 403) {
        setProjects([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [startFrom, startTo, priority, sortBy])

  const canCreateProject = user?.role === "Director"

  const handleClearFilters = () => {
    setStartFrom("")
    setStartTo("")
    setPriority("")
    setSortBy("startdate_desc")
  }

  if (isLoading) {
    return <LoaderFullPage />
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

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Sorting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Start Date From</Label>
              <Input
                type="date"
                value={startFrom}
                onChange={(e) => setStartFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date To</Label>
              <Input
                type="date"
                value={startTo}
                onChange={(e) => setStartTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Priorities</SelectItem>
                  <SelectItem value="1">Priority 1</SelectItem>
                  <SelectItem value="2">Priority 2</SelectItem>
                  <SelectItem value="3">Priority 3</SelectItem>
                  <SelectItem value="4">Priority 4</SelectItem>
                  <SelectItem value="5">Priority 5</SelectItem>
                  <SelectItem value="6">Priority 6</SelectItem>
                  <SelectItem value="7">Priority 7</SelectItem>
                  <SelectItem value="8">Priority 8</SelectItem>
                  <SelectItem value="9">Priority 9</SelectItem>
                  <SelectItem value="10">Priority 10</SelectItem>
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
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="startdate">Start Date (Oldest First)</SelectItem>
                  <SelectItem value="startdate_desc">Start Date (Newest First)</SelectItem>
                  <SelectItem value="priority">Priority (Low to High)</SelectItem>
                  <SelectItem value="priority_desc">Priority (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

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
