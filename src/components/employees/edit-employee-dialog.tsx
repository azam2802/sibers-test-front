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
} from "@/components/ui/dialog"
import type { UpdateEmployeeDto } from "@/types"

const ROLE_OPTIONS: UpdateEmployeeDto["role"][] = [
    "Director",
    "ProjectManager",
    "Developer",
]

interface EditEmployeeDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    form: UpdateEmployeeDto
    onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRoleChange: (role: UpdateEmployeeDto["role"]) => void
    onSubmit: (e: React.FormEvent) => Promise<void>
    isSubmitting: boolean
    error: string | null
    success: string | null
}

export function EditEmployeeDialog({
    isOpen,
    onOpenChange,
    form,
    onFormChange,
    onRoleChange,
    onSubmit,
    isSubmitting,
    error,
    success,
}: EditEmployeeDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                    <DialogDescription>Update employee information.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-firstName">
                            First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={onFormChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-lastName">
                            Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={onFormChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-middleName">Middle Name</Label>
                        <Input
                            id="edit-middleName"
                            name="middleName"
                            value={form.middleName}
                            onChange={onFormChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-email">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onFormChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Role <span className="text-destructive">*</span>
                        </Label>
                        <Select value={form.role} onValueChange={onRoleChange}>
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
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Employee"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
