import { EmployeeMultiSelect } from "@/components/employee-multi-select"

interface ProjectEmployeesStepProps {
    employeeIds: number[]
    setEmployeeIds: (ids: number[]) => void
}

export function ProjectEmployeesStep({
    employeeIds,
    setEmployeeIds,
}: ProjectEmployeesStepProps) {
    return (
        <div className="space-y-4">
            <EmployeeMultiSelect
                value={employeeIds}
                onChange={setEmployeeIds}
                label="Project Employees"
                placeholder="Search and add employees..."
            />
        </div>
    )
}
