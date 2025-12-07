import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * Site Settings API
 *
 * GET /api/admin/settings - Returns all site settings
 * PUT /api/admin/settings - Updates site settings
 *
 * Requires admin authentication.
 * Uses the SiteSetting model (key-value store with JSON values).
 */

// Default settings keys and their default values
const DEFAULT_SETTINGS = {
  siteTitle: 'Fernando Torres',
  siteDescription: 'Personal website of Fernando Torres - AI, Healthcare Tech, and Enterprise Solutions',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
  },
}

interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
}

interface SettingsPayload {
  siteTitle?: string
  siteDescription?: string
  socialLinks?: SocialLinks
}

/**
 * GET /api/admin/settings
 * Returns all site settings
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/settings
 * Updates site settings
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    let body: SettingsPayload
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate and update each setting
    const updates: { key: string; value: unknown }[] = []

    // Validate siteTitle
    if (body.siteTitle !== undefined) {
      if (typeof body.siteTitle !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Site title must be a string' },
          { status: 400 }
        )
      }
      if (body.siteTitle.trim().length < 1) {
        return NextResponse.json(
          { success: false, error: 'Site title cannot be empty' },
          { status: 400 }
        )
      }
      if (body.siteTitle.trim().length > 100) {
        return NextResponse.json(
          { success: false, error: 'Site title must be less than 100 characters' },
          { status: 400 }
        )
      }
      updates.push({ key: 'siteTitle', value: body.siteTitle.trim() })
    }

    // Validate siteDescription
    if (body.siteDescription !== undefined) {
      if (typeof body.siteDescription !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Site description must be a string' },
          { status: 400 }
        )
      }
      if (body.siteDescription.trim().length > 500) {
        return NextResponse.json(
          { success: false, error: 'Site description must be less than 500 characters' },
          { status: 400 }
        )
      }
      updates.push({ key: 'siteDescription', value: body.siteDescription.trim() })
    }

    // Validate socialLinks
    if (body.socialLinks !== undefined) {
      if (typeof body.socialLinks !== 'object' || body.socialLinks === null) {
        return NextResponse.json(
          { success: false, error: 'Social links must be an object' },
          { status: 400 }
        )
      }

      const { github, linkedin, twitter } = body.socialLinks

      // Validate URL formats (allow empty strings)
      const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i

      if (github !== undefined && github !== '' && !urlPattern.test(github)) {
        return NextResponse.json(
          { success: false, error: 'Invalid GitHub URL format' },
          { status: 400 }
        )
      }

      if (linkedin !== undefined && linkedin !== '' && !urlPattern.test(linkedin)) {
        return NextResponse.json(
          { success: false, error: 'Invalid LinkedIn URL format' },
          { status: 400 }
        )
      }

      if (twitter !== undefined && twitter !== '' && !urlPattern.test(twitter)) {
        return NextResponse.json(
          { success: false, error: 'Invalid Twitter URL format' },
          { status: 400 }
        )
      }

      updates.push({
        key: 'socialLinks',
        value: {
          github: github?.trim() ?? '',
          linkedin: linkedin?.trim() ?? '',
          twitter: twitter?.trim() ?? '',
        },
      })
    }

    // If no updates provided
    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No settings provided to update' },
        { status: 400 }
      )
    }

    // Upsert each setting
    for (const update of updates) {
      await prisma.siteSetting.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value },
      })
    }

    // Fetch updated settings
    const settings = await prisma.siteSetting.findMany()
    const settingsMap: Record<string, unknown> = {}
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value
    }

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
      message: 'Settings updated successfully',
      settings: mergedSettings,
    })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
