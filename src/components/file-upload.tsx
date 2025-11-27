"use client"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  files: File[]
  onChange: (files: File[]) => void
  label?: string
  maxFiles?: number
  accept?: string
  disabled?: boolean
}

export function FileUpload({
  files,
  onChange,
  label = "Upload Files",
  maxFiles = 10,
  accept,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    const newFiles = [...files, ...droppedFiles].slice(0, maxFiles)
    onChange(newFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const newFiles = [...files, ...selectedFiles].slice(0, maxFiles)
      onChange(newFiles)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop files here, or click to select
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || files.length >= maxFiles}
        >
          Select Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">
              Selected Files ({files.length}/{maxFiles})
            </p>
            <div className="space-y-1">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-secondary rounded-md"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    disabled={disabled}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

