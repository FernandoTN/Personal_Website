export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="font-heading text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
          Fernando Torres
        </h1>
        <p className="text-xl text-text-secondary dark:text-text-dark-secondary mb-8">
          MSx &apos;26, Stanford GSB
        </p>
        <p className="text-text-muted dark:text-text-dark-muted max-w-lg mx-auto">
          Building at the intersection of technology and healthcare.
          Exploring AI agents and their potential to transform enterprise workflows.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="https://github.com/FernandoTN"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-2"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/fernandotn/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-6 py-2"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Placeholder for development - TODO: Replace with full homepage */}
      <div className="mt-16 p-6 card max-w-2xl text-center">
        <p className="text-text-muted dark:text-text-dark-muted text-sm">
          This is a placeholder homepage. The full site is under development.
        </p>
        <p className="text-text-muted dark:text-text-dark-muted text-sm mt-2">
          See <code className="bg-light-neutral-grey dark:bg-dark-panel px-1.5 py-0.5 rounded">list.json</code> for the complete feature list.
        </p>
      </div>
    </main>
  )
}
