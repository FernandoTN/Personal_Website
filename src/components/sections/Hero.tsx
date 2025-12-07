import Link from 'next/link'

/**
 * Hero Section Component
 *
 * Displays the main hero section with:
 * - Author name with gradient text
 * - Subtitle (MSx '26, Stanford GSB)
 * - Tagline about technology/healthcare/AI
 * - Two CTA buttons with staggered animations
 *
 * Uses CSS animations for better performance (no JS needed for animations).
 * Fully responsive and accessible.
 */
export default function Hero() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient accent */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent-primary/5 blur-3xl dark:bg-accent-primary/10" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-accent-secondary/5 blur-3xl dark:bg-accent-secondary/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Main Heading - Author Name */}
        <h1
          id="hero-heading"
          className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-text-dark-primary sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          Fernando Torres
        </h1>

        {/* Subtitle - Education */}
        <p
          className="mt-4 text-xl font-medium text-accent-primary sm:text-2xl animate-fade-in-up"
          style={{ animationDelay: '150ms' }}
        >
          MSx &apos;26, Stanford GSB
        </p>

        {/* Tagline - Focus Areas */}
        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary dark:text-text-dark-secondary sm:text-xl animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          Building at the intersection of{' '}
          <span className="font-semibold text-text-primary dark:text-text-dark-primary">
            technology
          </span>{' '}
          and{' '}
          <span className="font-semibold text-text-primary dark:text-text-dark-primary">
            healthcare
          </span>
          . Exploring{' '}
          <span className="text-gradient font-semibold">AI agents</span> and
          their potential to transform enterprise workflows.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '450ms' }}
          >
            <Link
              href="/projects"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-glow sm:text-lg"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              View Projects
            </Link>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '550ms' }}
          >
            <Link
              href="/research"
              className="btn-outline inline-flex items-center gap-2 px-8 py-3 text-base font-semibold transition-all duration-300 sm:text-lg"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Read Research
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
