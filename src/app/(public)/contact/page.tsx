import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Fernando Torres. Connect on LinkedIn, GitHub, or send a message.',
}

export default function ContactPage() {
  return (
    <main className="container-narrow py-16">
      <h1 className="font-heading text-4xl font-bold mb-8">Contact</h1>
      <p className="text-text-secondary dark:text-text-dark-secondary">
        Contact page content will be implemented here.
      </p>
      {/* TODO: Implement contact form, social links, resume download */}
    </main>
  )
}
