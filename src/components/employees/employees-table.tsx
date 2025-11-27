import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Employee } from "@/types"

interface EmployeesTableProps {
    employees: Employee[]
    onEdit: (employee: Employee) => void
    onDelete: (employee: Employee) => void
}

export function EmployeesTable({
    employees,
    onEdit,
    onDelete,
}: EmployeesTableProps) {
    if (employees.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">No employees found.</p>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left border-b border-border">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2 pr-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr
                            key={`${employee.id}-${employee.email}`}
                            className="border-b border-border/50 last:border-0"
                        >
                            <td className="py-2 pr-4">
                                {employee.lastName} {employee.firstName}
                                {employee.middleName ? ` ${employee.middleName}` : ""}
                            </td>
                            <td className="py-2 pr-4">{employee.email}</td>
                            <td className="py-2 pr-4 capitalize">{employee.role}</td>
                            <td className="py-2 pr-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(employee)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(employee)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
