import { cn } from "@/lib/utils"

interface WizardProgressProps {
    currentStep: number
    totalSteps: number
    className?: string
}

export function WizardProgress({ currentStep, totalSteps, className }: WizardProgressProps) {
    return (
        <div className={cn("flex items-center justify-between mb-2 wizard-progress", className)}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
                const isActive = step <= currentStep
                const isPast = step < currentStep

                return (
                    <div
                        key={step}
                        className={cn(
                            "relative flex-1 h-2 rounded overflow-hidden bg-muted",
                            step < totalSteps ? "mr-2" : ""
                        )}
                    >
                        <div
                            className={cn(
                                "absolute inset-0 bg-primary transition-all duration-500 ease-out origin-left",
                                isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                                isPast && "animate-pulse"
                            )}  
                            style={{
                                transformOrigin: "left",
                            }}
                        />
                    </div>
                )
            })}
        </div>
    )
}
