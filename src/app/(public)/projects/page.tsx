import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore projects by Fernando Torres across pharmaceutical, coding, and research domains.',
}

export default function ProjectsPage() {
  return (
    <main className="container-wide py-16">
      <h1 className="font-heading text-4xl font-bold mb-8">Projects</h1>
      <p className="text-text-secondary dark:text-text-dark-secondary">
        Projects page content will be implemented here.
      </p>
      {/* TODO: Implement project grid with category filtering */}
    </main>
  )
}
