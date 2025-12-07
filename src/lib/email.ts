import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactNotificationData {
  name: string
  email: string
  subject?: string | null
  message: string
  timestamp?: Date
}

/**
 * Sends an email notification when a contact form is submitted
 * @param data - Contact form submission data
 * @returns Promise with send result or error
 */
export async function sendContactNotification(data: ContactNotificationData): Promise<{
  success: boolean
  error?: string
}> {
  const contactEmail = process.env.CONTACT_EMAIL
  const fromEmail = process.env.EMAIL_FROM || 'noreply@example.com'

  if (!contactEmail) {
    console.error('CONTACT_EMAIL environment variable is not set')
    return { success: false, error: 'Contact email not configured' }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not set')
    return { success: false, error: 'Email service not configured' }
  }

  const timestamp = data.timestamp || new Date()
  const formattedTimestamp = timestamp.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  const emailSubject = data.subject
    ? `New Contact: ${data.subject}`
    : 'New Contact Form Submission'

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #0070f3; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #666; width: 120px;">Name:</td>
          <td style="padding: 10px; color: #333;">${escapeHtml(data.name)}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; color: #666;">Email:</td>
          <td style="padding: 10px; color: #333;">
            <a href="mailto:${escapeHtml(data.email)}" style="color: #0070f3;">${escapeHtml(data.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #666;">Subject:</td>
          <td style="padding: 10px; color: #333;">${escapeHtml(data.subject || 'No subject provided')}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; color: #666;">Timestamp:</td>
          <td style="padding: 10px; color: #333;">${formattedTimestamp}</td>
        </tr>
      </table>

      <div style="margin-top: 20px;">
        <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap; color: #333;">
${escapeHtml(data.message)}
        </div>
      </div>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        This email was sent from the contact form on your personal website.
      </p>
    </div>
  `

  const emailText = `
New Contact Form Submission
===========================

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'No subject provided'}
Timestamp: ${formattedTimestamp}

Message:
--------
${data.message}

---
This email was sent from the contact form on your personal website.
  `.trim()

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
      replyTo: data.email,
    })

    if (error) {
      console.error('Failed to send contact notification email:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending contact notification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char)
}

const SITE_NAME = 'Fernando Torres'
const SITE_URL = process.env.NEXTAUTH_URL || 'https://fernandotorres.dev'

interface SendWelcomeEmailParams {
  to: string
}

interface WelcomeEmailResult {
  success: boolean
  error?: string
}

/**
 * Sends a welcome email to a new newsletter subscriber
 */
export async function sendWelcomeEmail({ to }: SendWelcomeEmailParams): Promise<WelcomeEmailResult> {
  const fromEmail = process.env.EMAIL_FROM || 'noreply@fernandotorres.dev'

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not set')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(to)}`

    const { error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Welcome to ${SITE_NAME}'s Newsletter!`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f9ff; color: #0f1a2a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #dce3ec;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #0f1a2a;">${SITE_NAME}</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #4b637d;">MSx '26, Stanford GSB</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #0f1a2a;">Welcome to the Newsletter!</h2>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4b637d;">
                Thank you for subscribing! I'm excited to have you join our community of tech enthusiasts, product leaders, and AI practitioners.
              </p>

              <h3 style="margin: 24px 0 12px; font-size: 18px; font-weight: 600; color: #0f1a2a;">What to Expect</h3>

              <ul style="margin: 0 0 24px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #4b637d;">
                <li>Insights on AI agents and enterprise technology</li>
                <li>Deep dives into product strategy and system design</li>
                <li>Research findings from Stanford GSB projects</li>
                <li>Practical learnings from building real-world prototypes</li>
              </ul>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b637d;">
                I typically send 2-3 emails per week with new content. Every email aims to provide actionable insights you can apply to your own work.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}/blog" style="display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Explore the Blog
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f4f9ff; border-top: 1px solid #dce3ec; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #8da1b5; text-align: center;">
                You're receiving this email because you subscribed to ${SITE_NAME}'s newsletter.
              </p>
              <p style="margin: 0; font-size: 14px; text-align: center;">
                <a href="${unsubscribeUrl}" style="color: #4b637d; text-decoration: underline;">Unsubscribe</a>
                <span style="color: #8da1b5; margin: 0 8px;">|</span>
                <a href="${SITE_URL}" style="color: #4b637d; text-decoration: underline;">Visit Website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
      text: `
Welcome to ${SITE_NAME}'s Newsletter!

Thank you for subscribing! I'm excited to have you join our community of tech enthusiasts, product leaders, and AI practitioners.

What to Expect:
- Insights on AI agents and enterprise technology
- Deep dives into product strategy and system design
- Research findings from Stanford GSB projects
- Practical learnings from building real-world prototypes

I typically send 2-3 emails per week with new content. Every email aims to provide actionable insights you can apply to your own work.

Visit the blog: ${SITE_URL}/blog

---
You're receiving this email because you subscribed to ${SITE_NAME}'s newsletter.
Unsubscribe: ${unsubscribeUrl}
      `.trim(),
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
