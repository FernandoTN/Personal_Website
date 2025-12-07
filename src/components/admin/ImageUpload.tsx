'use client'

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface ImageUploadProps {
  /** Callback when an image is successfully uploaded */
  onUpload?: (url: string) => void
  /** Callback when upload is cleared */
  onClear?: () => void
  /** Additional CSS classes */
  className?: string
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number
  /** Accepted file types */
  accept?: string[]
  /** Initial image URL for preview */
  initialImage?: string
}

interface UploadState {
  status: 'idle' | 'dragging' | 'uploading' | 'success' | 'error'
  progress: number
  error: string | null
  previewUrl: string | undefined
  uploadedUrl: string | null
}

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB
const DEFAULT_ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const FILE_EXTENSIONS = {
  'image/jpeg': '.jpg, .jpeg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getAcceptString(types: string[]): string {
  return types.join(',')
}

function getExtensionsString(types: string[]): string {
  return types
    .map((type) => FILE_EXTENSIONS[type as keyof typeof FILE_EXTENSIONS] || type)
    .join(', ')
}

// ------------------------------------------------------------------
// ImageUpload Component
// ------------------------------------------------------------------
/**
 * Image upload component with drag-and-drop, preview, and validation.
 * Supports file size and type validation, upload progress, and removal.
 *
 * Usage:
 * <ImageUpload onUpload={(url) => console.log('Uploaded:', url)} />
 * <ImageUpload maxSize={2 * 1024 * 1024} accept={['image/png']} />
 *
 * Accessibility:
 * - Uses proper ARIA labels for screen readers
 * - Supports keyboard navigation
 * - Provides clear status feedback
 */
export function ImageUpload({
  onUpload,
  onClear,
  className = '',
  maxSize = DEFAULT_MAX_SIZE,
  accept = DEFAULT_ACCEPT,
  initialImage,
}: ImageUploadProps) {
  const [state, setState] = useState<UploadState>({
    status: initialImage ? 'success' : 'idle',
    progress: 0,
    error: null,
    previewUrl: initialImage || undefined,
    uploadedUrl: initialImage || null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // ------------------------------------------------------------------
  // File Validation
  // ------------------------------------------------------------------
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!accept.includes(file.type)) {
        return `Invalid file type. Accepted types: ${getExtensionsString(accept)}`
      }

      // Check file size
      if (file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}. Your file: ${formatFileSize(file.size)}`
      }

      return null
    },
    [accept, maxSize]
  )

  // ------------------------------------------------------------------
  // Upload Handler
  // ------------------------------------------------------------------
  const uploadFile = useCallback(
    async (file: File) => {
      // Validate file first
      const validationError = validateFile(file)
      if (validationError) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: validationError,
        }))
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)

      // Set uploading state
      setState({
        status: 'uploading',
        progress: 0,
        error: null,
        previewUrl,
        uploadedUrl: null,
      })

      try {
        // Create FormData
        const formData = new FormData()
        formData.append('file', file)

        // Use XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest()

        const uploadPromise = new Promise<string>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100)
              setState((prev) => ({ ...prev, progress }))
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText)
                if (response.success && response.url) {
                  resolve(response.url)
                } else {
                  reject(new Error(response.error || 'Upload failed'))
                }
              } catch {
                reject(new Error('Invalid response from server'))
              }
            } else {
              try {
                const response = JSON.parse(xhr.responseText)
                reject(new Error(response.error || `Upload failed with status ${xhr.status}`))
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`))
              }
            }
          })

          xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'))
          })

          xhr.addEventListener('abort', () => {
            reject(new Error('Upload was cancelled'))
          })

          xhr.open('POST', '/api/upload')
          xhr.send(formData)
        })

        const uploadedUrl = await uploadPromise

        setState({
          status: 'success',
          progress: 100,
          error: null,
          previewUrl,
          uploadedUrl,
        })

        onUpload?.(uploadedUrl)
      } catch (error) {
        // Clean up preview URL on error
        URL.revokeObjectURL(previewUrl)

        setState({
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Upload failed',
          previewUrl: undefined,
          uploadedUrl: null,
        })
      }
    },
    [validateFile, onUpload]
  )

  // ------------------------------------------------------------------
  // Event Handlers
  // ------------------------------------------------------------------
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, status: 'dragging' }))
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set to idle if leaving the drop zone (not entering a child element)
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setState((prev) => ({
        ...prev,
        status: prev.status === 'dragging' ? 'idle' : prev.status,
      }))
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setState((prev) => ({ ...prev, status: 'idle' }))

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        uploadFile(files[0])
      }
    },
    [uploadFile]
  )

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        uploadFile(files[0])
      }
      // Reset input value to allow selecting the same file again
      e.target.value = ''
    },
    [uploadFile]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick]
  )

  const handleClear = useCallback(() => {
    // Clean up preview URL
    if (state.previewUrl && !state.previewUrl.startsWith('/')) {
      URL.revokeObjectURL(state.previewUrl)
    }

    setState({
      status: 'idle',
      progress: 0,
      error: null,
      previewUrl: undefined,
      uploadedUrl: null,
    })

    onClear?.()
  }, [state.previewUrl, onClear])

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  const isUploading = state.status === 'uploading'
  const hasImage = state.status === 'success' && state.previewUrl
  const isDragging = state.status === 'dragging'
  const hasError = state.status === 'error'

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString(accept)}
        onChange={handleFileSelect}
        className="sr-only"
        aria-label="Upload image"
      />

      {/* Drop zone / Preview area */}
      {!hasImage ? (
        <div
          ref={dropZoneRef}
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          aria-label="Click or drag and drop to upload image"
          aria-describedby="upload-instructions"
          className={`
            relative flex flex-col items-center justify-center
            w-full min-h-[200px] p-6
            border-2 border-dashed rounded-lg
            transition-all duration-200 cursor-pointer
            ${isDragging
              ? 'border-accent-primary bg-accent-primary/5'
              : hasError
                ? 'border-accent-error dark:border-accent-error-dark bg-accent-error/5'
                : 'border-border-light dark:border-border-dark hover:border-accent-primary hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue'
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2
            focus-visible:ring-offset-light-base dark:focus-visible:ring-offset-dark-base
          `}
        >
          {isUploading ? (
            // Uploading state
            <div className="flex flex-col items-center gap-4">
              {/* Upload progress circle */}
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  {/* Background circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-border-light dark:text-border-dark"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - state.progress / 100)}`}
                    className="text-accent-primary transition-all duration-200"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-text-primary dark:text-text-dark-primary">
                  {state.progress}%
                </span>
              </div>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                Uploading...
              </p>
            </div>
          ) : (
            // Idle / Dragging / Error state
            <>
              {/* Upload icon */}
              <div
                className={`
                  w-12 h-12 mb-4 rounded-full flex items-center justify-center
                  ${isDragging
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : hasError
                      ? 'bg-accent-error/10 text-accent-error dark:text-accent-error-dark'
                      : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-secondary dark:text-text-dark-secondary'
                  }
                `}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>

              {/* Instructions */}
              <div id="upload-instructions" className="text-center">
                <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                  {isDragging ? 'Drop image here' : 'Drag and drop an image, or click to select'}
                </p>
                <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">
                  {getExtensionsString(accept)} (max {formatFileSize(maxSize)})
                </p>
              </div>

              {/* Error message */}
              {hasError && state.error && (
                <div
                  role="alert"
                  className="mt-4 px-4 py-2 rounded-lg bg-accent-error/10 text-accent-error dark:text-accent-error-dark text-sm"
                >
                  {state.error}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Preview state
        <div className="relative rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
          {/* Image preview */}
          <div className="relative aspect-video bg-light-neutral-grey dark:bg-dark-deep-blue">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={state.previewUrl}
              alt="Uploaded image preview"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Image info bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-light-base dark:bg-dark-panel">
            <div className="flex items-center gap-2">
              {/* Success icon */}
              <div className="w-5 h-5 rounded-full bg-accent-success/10 text-accent-success dark:text-accent-success-dark flex items-center justify-center">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
                Image uploaded successfully
              </span>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={handleClear}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-sm font-medium
                text-accent-error dark:text-accent-error-dark
                hover:bg-accent-error/10
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-error focus-visible:ring-offset-2
                focus-visible:ring-offset-light-base dark:focus-visible:ring-offset-dark-base
              "
              aria-label="Remove uploaded image"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
