import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { Employee } from "@/types"

interface DeleteEmployeeDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    employee: Employee | null
    onConfirm: () => Promise<void>
    isSubmitting: boolean
    error: string | null
}

export function DeleteEmployeeDialog({
    isOpen,
    onOpenChange,
    employee,
    onConfirm,
    isSubmitting,
    error,
}: DeleteEmployeeDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Employee</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>
                            {employee?.firstName} {employee?.lastName}
                        </strong>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
