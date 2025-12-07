'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
}

interface SiteSettings {
  siteTitle: string
  siteDescription: string
  socialLinks: SocialLinks
}

// ------------------------------------------------------------------
// Icons
// ------------------------------------------------------------------
const Icons = {
  Settings: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  Save: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Spinner: () => (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  GitHub: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  Twitter: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

// ------------------------------------------------------------------
// Admin Settings Page
// ------------------------------------------------------------------
export default function AdminSettingsPage() {
  const { status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  // Form state
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: '',
    siteDescription: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Fetch current settings on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchSettings()
    }
  }, [status])

  async function fetchSettings() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/settings')

      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()

      if (data.success && data.settings) {
        setSettings({
          siteTitle: data.settings.siteTitle || '',
          siteDescription: data.settings.siteDescription || '',
          socialLinks: {
            github: data.settings.socialLinks?.github || '',
            linkedin: data.settings.socialLinks?.linkedin || '',
            twitter: data.settings.socialLinks?.twitter || '',
          },
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      showToast({ type: 'error', message: 'Failed to load settings' })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    try {
      setIsSaving(true)

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteTitle: settings.siteTitle,
          siteDescription: settings.siteDescription,
          socialLinks: settings.socialLinks,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings')
      }

      if (data.success) {
        showToast({ type: 'success', message: 'Settings saved successfully!' })

        // Update local state with the returned settings
        if (data.settings) {
          setSettings({
            siteTitle: data.settings.siteTitle || '',
            siteDescription: data.settings.siteDescription || '',
            socialLinks: {
              github: data.settings.socialLinks?.github || '',
              linkedin: data.settings.socialLinks?.linkedin || '',
              twitter: data.settings.socialLinks?.twitter || '',
            },
          })
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save settings'
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Show loading state while checking session
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    )
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="space-y-8" data-testid="admin-settings-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
            <Icons.Settings />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
              Settings
            </h1>
            <p className="mt-1 text-text-secondary dark:text-text-dark-secondary">
              Configure your site metadata and social links
            </p>
          </div>
        </div>
      </div>

      {/* Site Metadata Section */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark">
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="font-heading text-xl font-semibold text-text-primary dark:text-text-dark-primary">
            Site Metadata
          </h2>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary">
            Update your site title and description used in meta tags
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Site Title */}
          <div>
            <label
              htmlFor="siteTitle"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              Site Title
            </label>
            <input
              id="siteTitle"
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              placeholder="Enter site title"
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary placeholder-text-tertiary dark:placeholder-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
              data-testid="site-title-input"
            />
            <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
              {settings.siteTitle.length}/100 characters
            </p>
          </div>

          {/* Site Description */}
          <div>
            <label
              htmlFor="siteDescription"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              Site Description
            </label>
            <textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              placeholder="Enter site description"
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary placeholder-text-tertiary dark:placeholder-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors resize-none"
              data-testid="site-description-input"
            />
            <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
              {settings.siteDescription.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark">
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="font-heading text-xl font-semibold text-text-primary dark:text-text-dark-primary">
            Social Links
          </h2>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary">
            Add links to your social media profiles
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* GitHub */}
          <div>
            <label
              htmlFor="github"
              className="flex items-center gap-2 text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              <Icons.GitHub />
              GitHub
            </label>
            <input
              id="github"
              type="url"
              value={settings.socialLinks.github}
              onChange={(e) => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, github: e.target.value }
              })}
              placeholder="https://github.com/username"
              className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary placeholder-text-tertiary dark:placeholder-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
              data-testid="github-input"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label
              htmlFor="linkedin"
              className="flex items-center gap-2 text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              <Icons.LinkedIn />
              LinkedIn
            </label>
            <input
              id="linkedin"
              type="url"
              value={settings.socialLinks.linkedin}
              onChange={(e) => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
              })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary placeholder-text-tertiary dark:placeholder-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
              data-testid="linkedin-input"
            />
          </div>

          {/* Twitter/X */}
          <div>
            <label
              htmlFor="twitter"
              className="flex items-center gap-2 text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              <Icons.Twitter />
              Twitter / X
            </label>
            <input
              id="twitter"
              type="url"
              value={settings.socialLinks.twitter}
              onChange={(e) => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, twitter: e.target.value }
              })}
              placeholder="https://x.com/username"
              className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary placeholder-text-tertiary dark:placeholder-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
              data-testid="twitter-input"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent-primary text-white font-medium hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="save-settings-button"
        >
          {isSaving ? (
            <>
              <Icons.Spinner />
              Saving...
            </>
          ) : (
            <>
              <Icons.Save />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-light-icy-blue dark:bg-dark-deep-blue rounded-xl p-4 border border-border-light dark:border-border-dark">
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
          <span className="font-medium">Note:</span> Changes to site metadata will be reflected in the site&apos;s
          meta tags. Social links will appear in the footer of your website.
        </p>
      </div>
    </div>
  )
}
