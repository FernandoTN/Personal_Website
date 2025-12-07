'use client'

/**
 * MDXUpload Component
 *
 * A file upload component for parsing MDX markdown files.
 * Allows users to upload .mdx or .md files and extracts frontmatter
 * and content body to pre-fill the blog editor form.
 *
 * Features:
 * - Drag and drop support
 * - File validation (type, size)
 * - Progress indication
 * - Error handling
 * - Dark mode support
 *
 * Usage:
 * <MDXUpload onParsed={(data) => console.log(data)} />
 */

import { useState, useCallback, useRef } from 'react'

// Parsed MDX data interface
export interface MDXParsedData {
  formData: {
    title: string
    slug: string
    excerpt: string
    content: string
    featuredImage: string
    category: string
    seriesId: string
    seriesOrder: string
    tags: string
    metaTitle: string
    metaDescription: string
  }
  frontmatter: Record<string, unknown>
  content: string
  rawFrontmatter: string
}

// Component props interface
interface MDXUploadProps {
  /** Callback when MDX is successfully parsed */
  onParsed: (data: MDXParsedData) => void
  /** Callback when upload/parse fails */
  onError?: (error: string) => void
  /** Optional custom class name */
  className?: string
}

// Upload icon component
function UploadIcon() {
  return (
    <svg
      className="w-10 h-10 text-text-muted dark:text-text-dark-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  )
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <svg
      className="w-6 h-6 animate-spin text-accent-primary"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// Document icon for file display
function DocumentIcon() {
  return (
    <svg
      className="w-5 h-5 text-accent-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  )
}

export function MDXUpload({ onParsed, onError, className = '' }: MDXUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate file before upload
  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.mdx') && !fileName.endsWith('.md')) {
      return 'Invalid file type. Please upload an .mdx or .md file'
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return 'File too large. Maximum size is 5MB'
    }

    return null
  }, [])

  // Upload and parse the file
  const uploadFile = useCallback(
    async (file: File) => {
      // Validate first
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        onError?.(validationError)
        return
      }

      setIsUploading(true)
      setError(null)
      setSelectedFile(file)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/posts/upload-mdx', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          const errorMessage = result.error || 'Failed to parse MDX file'
          setError(errorMessage)
          onError?.(errorMessage)
          return
        }

        // Call the success callback with parsed data
        onParsed(result.data as MDXParsedData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.'
        setError(errorMessage)
        onError?.(errorMessage)
      } finally {
        setIsUploading(false)
      }
    },
    [validateFile, onParsed, onError]
  )

  // Handle file selection from input
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        uploadFile(file)
      }
      // Reset input so same file can be selected again
      event.target.value = ''
    },
    [uploadFile]
  )

  // Handle drag events
  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)

      const file = event.dataTransfer.files?.[0]
      if (file) {
        uploadFile(file)
      }
    },
    [uploadFile]
  )

  // Trigger file input click
  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Clear selected file and error
  const handleClear = useCallback(() => {
    setSelectedFile(null)
    setError(null)
  }, [])

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mdx,.md"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload MDX file"
      />

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed p-6
          transition-all duration-200
          ${
            isDragging
              ? 'border-accent-primary bg-accent-primary/5'
              : 'border-border-light dark:border-border-dark hover:border-accent-primary/50 hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue'
          }
          ${error ? 'border-red-400 dark:border-red-500' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload MDX file by clicking or dragging"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        {/* Loading state */}
        {isUploading && (
          <div className="flex flex-col items-center justify-center py-4">
            <LoadingSpinner />
            <p className="mt-3 text-sm text-text-secondary dark:text-text-dark-secondary">
              Parsing MDX file...
            </p>
          </div>
        )}

        {/* Selected file state */}
        {!isUploading && selectedFile && !error && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentIcon />
              <div>
                <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-text-muted dark:text-text-dark-muted">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-light-neutral-grey dark:hover:bg-dark-panel transition-colors"
              aria-label="Clear selected file"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Default state */}
        {!isUploading && !selectedFile && (
          <div className="flex flex-col items-center justify-center py-2">
            <UploadIcon />
            <p className="mt-3 text-sm font-medium text-text-primary dark:text-text-dark-primary">
              {isDragging ? 'Drop your file here' : 'Upload MDX file'}
            </p>
            <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">
              Drag and drop or click to select (.mdx, .md)
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}

export default MDXUpload
