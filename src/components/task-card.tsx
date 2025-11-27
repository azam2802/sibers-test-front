import { Card, CardContent } from "@/components/ui/card"
import type { Task } from "@/types"

interface TaskCardProps {
    task: Task
    onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{task.title}</h3>
                            <span
                                className={`px-2 py-1 rounded text-xs ${task.status === "Done"
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
    )
}
