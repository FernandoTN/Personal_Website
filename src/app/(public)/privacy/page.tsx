import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for Fernando Torres personal website. Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy | Fernando Torres',
    description:
      'Privacy policy for Fernando Torres personal website. Learn how we collect, use, and protect your personal information.',
    type: 'website',
    url: 'https://fernandotorres.io/privacy',
  },
}

/**
 * Privacy Policy Page
 *
 * Displays the website's privacy policy including:
 * - Data collection practices (email, name from forms)
 * - Data usage (newsletter, contact responses)
 * - Third-party services (Vercel hosting, database)
 * - User rights (unsubscribe, data deletion)
 * - Contact information
 *
 * The page is fully responsive and accessible.
 */
export default function PrivacyPage() {
  const lastUpdated = 'December 6, 2025'

  return (
    <main className="container-narrow py-8 md:py-16">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <header className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-text-primary dark:text-text-dark-primary md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            Last updated: {lastUpdated}
          </p>
        </header>

        <section className="mb-10" aria-labelledby="introduction">
          <h2
            id="introduction"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Introduction
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            Welcome to Fernando Torres&apos;s personal website. This privacy policy explains how I
            collect, use, and protect your personal information when you visit my website
            and use my services. I am committed to ensuring your privacy is protected.
          </p>
        </section>

        <section className="mb-10" aria-labelledby="data-collection">
          <h2
            id="data-collection"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Information I Collect
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            I collect information that you voluntarily provide to me through forms on this
            website:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-text-secondary dark:text-text-dark-secondary">
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Contact Form:
              </strong>{' '}
              When you submit the contact form, I collect your name, email address, and
              the message you send.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Newsletter Subscription:
              </strong>{' '}
              When you subscribe to my newsletter, I collect your email address.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Comments:
              </strong>{' '}
              If you leave comments on blog posts, I collect your name, email address,
              and the content of your comment.
            </li>
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="data-usage">
          <h2
            id="data-usage"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            How I Use Your Information
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            The information I collect is used for the following purposes:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-text-secondary dark:text-text-dark-secondary">
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Responding to Inquiries:
              </strong>{' '}
              I use information from the contact form to respond to your questions and
              messages.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Sending Newsletters:
              </strong>{' '}
              If you subscribe, I use your email to send periodic updates about new blog
              posts, research, and projects.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Displaying Comments:
              </strong>{' '}
              Approved comments are displayed on blog posts along with the name you
              provided.
            </li>
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="third-party">
          <h2
            id="third-party"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Third-Party Services
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            This website uses the following third-party services that may collect or
            process your data:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-text-secondary dark:text-text-dark-secondary">
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Vercel:
              </strong>{' '}
              This website is hosted on Vercel. They may collect standard server logs
              including IP addresses. See{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:underline"
              >
                Vercel&apos;s Privacy Policy
              </a>{' '}
              for more information.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Database Services:
              </strong>{' '}
              I use secure database services to store contact submissions, newsletter
              subscriptions, and comments. This data is stored securely and is not shared
              with third parties.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Email Services:
              </strong>{' '}
              I may use email service providers to send newsletters and respond to
              contact form submissions. Your email address is only used for the stated
              purposes.
            </li>
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="user-rights">
          <h2
            id="user-rights"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Your Rights
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            You have the following rights regarding your personal data:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-text-secondary dark:text-text-dark-secondary">
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Unsubscribe:
              </strong>{' '}
              You can unsubscribe from the newsletter at any time by clicking the
              unsubscribe link in any email or by contacting me directly.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Data Deletion:
              </strong>{' '}
              You can request deletion of your personal data at any time. This includes
              your contact submissions, newsletter subscription, and any comments you may
              have left.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Data Access:
              </strong>{' '}
              You can request a copy of all personal data I hold about you.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Data Correction:
              </strong>{' '}
              You can request corrections to any inaccurate personal data.
            </li>
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="data-security">
          <h2
            id="data-security"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Data Security
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            I take the security of your personal data seriously. This website uses HTTPS
            encryption for all data transmission. Personal data is stored in secure
            databases with appropriate access controls. I do not sell, trade, or transfer
            your personal information to third parties for marketing purposes.
          </p>
        </section>

        <section className="mb-10" aria-labelledby="cookies">
          <h2
            id="cookies"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Cookies and Local Storage
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            This website uses minimal cookies and local storage for functional purposes
            only:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-text-secondary dark:text-text-dark-secondary">
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Theme Preference:
              </strong>{' '}
              I store your light/dark mode preference in local storage to provide a
              consistent experience.
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Session Cookies:
              </strong>{' '}
              Essential cookies may be used for authentication in the admin area.
            </li>
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="changes">
          <h2
            id="changes"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Changes to This Policy
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            I may update this privacy policy from time to time. Any changes will be
            posted on this page with an updated revision date. I encourage you to review
            this policy periodically.
          </p>
        </section>

        <section className="mb-10" aria-labelledby="contact">
          <h2
            id="contact"
            className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
          >
            Contact Information
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary">
            If you have any questions about this privacy policy or would like to exercise
            your data rights, please contact me through one of the following methods:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-text-secondary dark:text-text-dark-secondary">
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Contact Form:
              </strong>{' '}
              <Link
                href="/contact"
                className="text-accent-primary hover:underline"
              >
                Submit a message
              </Link>
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                Email:
              </strong>{' '}
              <a
                href="mailto:fertorresnavarrete@gmail.com"
                className="text-accent-primary hover:underline"
              >
                fertorresnavarrete@gmail.com
              </a>
            </li>
            <li>
              <strong className="text-text-primary dark:text-text-dark-primary">
                LinkedIn:
              </strong>{' '}
              <a
                href="https://www.linkedin.com/in/fernandotn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:underline"
              >
                linkedin.com/in/fernandotn
              </a>
            </li>
          </ul>
        </section>

        <footer className="mt-12 border-t border-border-light pt-8 dark:border-border-dark">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent-primary hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </footer>
      </article>
    </main>
  )
}
