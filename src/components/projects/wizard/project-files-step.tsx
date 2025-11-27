import { FileUpload } from "@/components/file-upload"

interface ProjectFilesStepProps {
    files: File[]
    setFiles: (files: File[]) => void
}

export function ProjectFilesStep({ files, setFiles }: ProjectFilesStepProps) {
    return (
        <div className="space-y-4">
            <FileUpload
                files={files}
                onChange={setFiles}
                label="Project Documents"
                maxFiles={10}
            />
        </div>
    )
}
