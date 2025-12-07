'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Check, Copy, FileCode } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

/**
 * CodeBlock Component for MDX
 *
 * Renders syntax-highlighted code blocks with copy functionality.
 *
 * Features:
 * - Syntax highlighting via CSS classes (works with rehype-highlight)
 * - Copy to clipboard button with visual feedback
 * - Optional filename header
 * - Optional line numbers
 * - Dark mode support
 * - Responsive scrolling for long lines
 *
 * Usage in MDX:
 * ```mdx
 * <CodeBlock language="typescript" filename="example.ts">
 * const greeting = "Hello, World!";
 * console.log(greeting);
 * </CodeBlock>
 * ```
 */
export function CodeBlock({
  children,
  language = 'text',
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [children])

  // Split code into lines for line numbering
  const lines = children.trim().split('\n')

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-light-panel dark:bg-dark-panel">
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-light-neutral-grey/50 dark:bg-dark-deep-blue/50">
        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-text-dark-muted">
          <FileCode className="h-4 w-4" aria-hidden="true" />
          {filename ? (
            <span className="font-mono">{filename}</span>
          ) : (
            <span className="capitalize">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all duration-200',
            copied
              ? 'text-accent-success dark:text-accent-success-dark bg-accent-success/10'
              : 'text-text-muted dark:text-text-dark-muted hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-light-neutral-grey dark:hover:bg-dark-panel'
          )}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="relative overflow-x-auto">
        <pre
          ref={codeRef}
          className={cn(
            'p-4 text-sm font-mono overflow-x-auto',
            'text-text-primary dark:text-text-dark-primary',
            `language-${language}`
          )}
        >
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table className="border-collapse w-full">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i} className="hover:bg-light-neutral-grey/30 dark:hover:bg-dark-deep-blue/30">
                      <td className="pr-4 text-right text-text-muted dark:text-text-dark-muted select-none w-8 align-top">
                        {i + 1}
                      </td>
                      <td className="whitespace-pre">{line || ' '}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              children.trim()
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock
