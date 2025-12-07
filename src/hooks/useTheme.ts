'use client'

import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  systemTheme: Theme
}

/**
 * Custom hook for managing theme state with localStorage persistence
 * and system preference detection.
 *
 * Usage:
 * const { theme, toggleTheme, setTheme } = useTheme()
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('light')
  const [systemTheme, setSystemTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Get initial theme from localStorage or system preference
  useEffect(() => {
    setMounted(true)

    // Get system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemPreference: Theme = mediaQuery.matches ? 'dark' : 'light'
    setSystemTheme(systemPreference)

    // Get stored theme or use system preference
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = storedTheme || systemPreference

    setThemeState(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme: Theme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)

      // Only update if no stored preference
      if (!localStorage.getItem('theme')) {
        setThemeState(newSystemTheme)
        document.documentElement.classList.toggle('dark', newSystemTheme === 'dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }, [theme, setTheme])

  // Prevent hydration mismatch by returning default values before mount
  if (!mounted) {
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      systemTheme: 'light',
    }
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    systemTheme,
  }
}
