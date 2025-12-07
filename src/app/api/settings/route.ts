import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Public Site Settings API
 *
 * GET /api/settings - Returns public site settings
 *
 * This endpoint is public (no authentication required).
 * Used by the public site to display dynamic settings like social links.
 */

// Default settings
const DEFAULT_SETTINGS = {
  siteTitle: 'Fernando Torres',
  siteDescription: 'Personal website of Fernando Torres - AI, Healthcare Tech, and Enterprise Solutions',
  socialLinks: {
    github: 'https://github.com/FernandoTN',
    linkedin: 'https://www.linkedin.com/in/fernandotn/',
    twitter: '',
  },
}

interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
}

/**
 * GET /api/settings
 * Returns public site settings
 */
export async function GET() {
  try {
    // Fetch all settings from database
    const settings = await prisma.siteSetting.findMany()

    // Convert array of key-value pairs to object
    const settingsMap: Record<string, unknown> = {}
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value
    }

    // Merge with defaults (for any missing settings)
    const mergedSettings = {
      siteTitle: settingsMap.siteTitle ?? DEFAULT_SETTINGS.siteTitle,
      siteDescription: settingsMap.siteDescription ?? DEFAULT_SETTINGS.siteDescription,
      socialLinks: {
        github: (settingsMap.socialLinks as SocialLinks)?.github ?? DEFAULT_SETTINGS.socialLinks.github,
        linkedin: (settingsMap.socialLinks as SocialLinks)?.linkedin ?? DEFAULT_SETTINGS.socialLinks.linkedin,
        twitter: (settingsMap.socialLinks as SocialLinks)?.twitter ?? DEFAULT_SETTINGS.socialLinks.twitter,
      },
    }

    return NextResponse.json({
      success: true,
      settings: mergedSettings,
    })
  } catch (error) {
    console.error('Public settings fetch error:', error)
    // Return defaults on error
    return NextResponse.json({
      success: true,
      settings: DEFAULT_SETTINGS,
    })
  }
}
