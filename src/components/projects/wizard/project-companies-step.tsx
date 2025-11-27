import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProjectCompaniesStepProps {
    customerCompany: string
    setCustomerCompany: (value: string) => void
    executorCompany: string
    setExecutorCompany: (value: string) => void
}

export function ProjectCompaniesStep({
    customerCompany,
    setCustomerCompany,
    executorCompany,
    setExecutorCompany,
}: ProjectCompaniesStepProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>
                    Customer Company <span className="text-destructive">*</span>
                </Label>
                <Input
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    placeholder="Enter customer company name"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>
                    Executor Company <span className="text-destructive">*</span>
                </Label>
                <Input
                    value={executorCompany}
                    onChange={(e) => setExecutorCompany(e.target.value)}
                    placeholder="Enter executor company name"
                    required
                />
            </div>
        </div>
    )
}
