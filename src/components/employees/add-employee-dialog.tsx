import { useState } from "react"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, EyeOff } from "lucide-react"
import type { CreateEmployeeDto } from "@/types"

const ROLE_OPTIONS: CreateEmployeeDto["role"][] = [
    "Director",
    "ProjectManager",
    "Developer",
]

interface AddEmployeeDialogProps {
    onSuccess: () => void
    onSubmit: (data: CreateEmployeeDto) => Promise<void>
    isSubmitting: boolean
}

export function AddEmployeeDialog({
    onSuccess,
    onSubmit,
    isSubmitting,
}: AddEmployeeDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState<CreateEmployeeDto>({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        password: "",
        role: "Developer",
    })

    const validatePassword = (value: string) => {
        const hasMinLength = value.length >= 6
        const hasSpecialChar = /[#\$!\?\%\^\&\*]/.test(value)
        const hasLowercase = /[a-z]/.test(value)
        const hasUppercase = /[A-Z]/.test(value)
        if (!hasMinLength || !hasSpecialChar || !hasLowercase || !hasUppercase) {
            setPasswordError(
                "Password must be at least 6 characters and include upper, lower, and special characters (#$!?%^&*)."
            )
            return false
        }
        setPasswordError(null)
        return true
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (name === "password") {
            validatePassword(value)
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setError(null)
            setSuccess(null)
            setPasswordError(null)
            setShowPassword(false)
            resetForm()
        }
    }

    const resetForm = () => {
        setForm({
            firstName: "",
            lastName: "",
            middleName: "",
            email: "",
            password: "",
            role: "Developer",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePassword(form.password)) {
            setError(
                "Password must be at least 6 characters and include upper, lower, and special characters (#$!?%^&*)."
            )
            return
        }

        setError(null)
        setSuccess(null)
        try {
            await onSubmit(form)
            resetForm()
            setSuccess("Employee created successfully.")
            onSuccess()
            handleOpenChange(false)
        } catch (err: any) {
            console.error(err)
            setError(err?.data?.detail || "Failed to create employee.")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button type="button">Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogDescription>
                        Fill out the form to invite a new employee.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">
                            First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">
                            Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                            id="middleName"
                            name="middleName"
                            value={form.middleName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-xs text-destructive">{passwordError}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Role <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={form.role}
                            onValueChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    role: value as CreateEmployeeDto["role"],
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLE_OPTIONS.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {(error || success) && (
                        <p
                            className={`text-sm ${error ? "text-destructive" : "text-emerald-400"
                                }`}
                        >
                            {error || success}
                        </p>
                    )}
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Employee"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
