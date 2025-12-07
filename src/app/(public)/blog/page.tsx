import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read articles about AI agents, pharmaceutical innovation, and technology by Fernando Torres.',
}

export default function BlogPage() {
  return (
    <main className="container-wide py-16">
      <h1 className="font-heading text-4xl font-bold mb-8">Blog</h1>
      <p className="text-text-secondary dark:text-text-dark-secondary">
        Blog listing page content will be implemented here.
      </p>
      {/* TODO: Implement blog listing with filtering, pagination */}
    </main>
  )
}
