import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { ProjectDocument } from "@/types"
import { FileText, Download, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "react-hot-toast"

interface ProjectFilesStepProps {
    files: File[]
    setFiles: (files: File[]) => void
    existingDocuments?: ProjectDocument[]
    projectId?: number
    onDocumentDeleted?: (documentId: number) => void
}

export function ProjectFilesStep({
    files,
    setFiles,
    existingDocuments = [],
    projectId,
    onDocumentDeleted
}: ProjectFilesStepProps) {
    const [documentToDelete, setDocumentToDelete] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDownload = (url: string, fileName: string) => {
        const fullUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${url}`
        window.open(fullUrl, '_blank')
    }

    const confirmDelete = (id: number) => {
        setDocumentToDelete(id)
    }

    const handleDelete = async () => {
        if (!projectId || !documentToDelete) return

        setIsDeleting(true)
        try {
            await api.delete(`/Projects/${projectId}/documents/${documentToDelete}`)
            toast.success("Document deleted successfully")
            if (onDocumentDeleted) {
                onDocumentDeleted(documentToDelete)
            }
        } catch (error) {
            console.error("Failed to delete document:", error)
            toast.error("Failed to delete document")
        } finally {
            setIsDeleting(false)
            setDocumentToDelete(null)
        }
    }

    return (
        <div className="space-y-6">
            <ConfirmDialog
                open={!!documentToDelete}
                onOpenChange={(open) => !open && setDocumentToDelete(null)}
                title="Delete Document"
                description="Are you sure you want to delete this document? This action cannot be undone."
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />

            {existingDocuments.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium">Existing Documents</h3>
                    <div className="space-y-2">
                        {existingDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-md border">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{doc.fileName}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownload(doc.url, doc.fileName)}
                                        className="h-8 px-2 text-muted-foreground hover:text-primary"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => confirmDelete(doc.id)}
                                        className="h-8 px-2 text-white"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Upload New Documents</h3>
                <FileUpload
                    files={files}
                    onChange={setFiles}
                    label="Drag & drop or click to upload"
                    maxFiles={10}
                />
            </div>
        </div>
    )
}
