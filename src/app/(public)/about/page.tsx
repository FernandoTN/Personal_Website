import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Fernando Torres - MSx \'26 at Stanford GSB, exploring AI agents and pharmaceutical innovation.',
}

export default function AboutPage() {
  return (
    <main className="container-narrow py-16">
      <h1 className="font-heading text-4xl font-bold mb-8">About</h1>
      <p className="text-text-secondary dark:text-text-dark-secondary">
        About page content will be implemented here.
      </p>
      {/* TODO: Implement career timeline, skills, bio sections */}
    </main>
  )
}
