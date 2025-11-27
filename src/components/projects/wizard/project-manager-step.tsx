import { EmployeeSelect } from "@/components/employee-select"

interface ProjectManagerStepProps {
    managerId: number | null
    setManagerId: (id: number | null) => void
}

export function ProjectManagerStep({
    managerId,
    setManagerId,
}: ProjectManagerStepProps) {
    return (
        <div className="space-y-4">
            <EmployeeSelect
                value={managerId}
                onChange={setManagerId}
                label="Project Manager"
                placeholder="Search for project manager..."
                required
            />
        </div>
    )
}
