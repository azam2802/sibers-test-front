import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProjectBasicInfoStepProps {
    name: string
    setName: (value: string) => void
    startDate: string
    setStartDate: (value: string) => void
    endDate: string
    setEndDate: (value: string) => void
    priority: string
    setPriority: (value: string) => void
}

export function ProjectBasicInfoStep({
    name,
    setName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    priority,
    setPriority,
}: ProjectBasicInfoStepProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>
                    Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter project name"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Start Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>
                        End Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
            </div>
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
                    placeholder="1-10"
                    required
                />
            </div>
        </div>
    )
}
