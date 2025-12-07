import Link from 'next/link'
import Image from 'next/image'

/**
 * Hero Section Component
 *
 * Displays the main hero section with:
 * - Two column layout (Text Left, Image Right) on Desktop
 * - Author photo with floating animation and glassmorphism effect
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
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-12 md:py-0"
      aria-labelledby="hero-heading"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] dark:opacity-[0.15] pointer-events-none" />

      {/* Decorative gradient blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-[20%] right-0 h-[600px] w-[600px] rounded-full bg-accent-primary/5 blur-3xl dark:bg-accent-primary/10 animate-fade-in" />
        <div className="absolute -bottom-[20%] left-0 h-[500px] w-[500px] rounded-full bg-accent-secondary/5 blur-3xl dark:bg-accent-secondary/10 animate-fade-in" />
      </div>

      <div className="container-wide relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        {/* Text Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <span className="mb-4 inline-block rounded-full bg-accent-primary/10 px-4 py-1.5 text-sm font-semibold text-accent-primary backdrop-blur-sm dark:bg-accent-primary/20">
              👋 Welcome
            </span>
          </div>

          {/* Main Heading - Author Name */}
          <h1
            id="hero-heading"
            className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-text-dark-primary sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            Fernando Torres
          </h1>

          {/* Subtitle - Education */}
          <p
            className="mt-4 text-xl font-medium text-accent-primary sm:text-2xl animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            MSx &apos;26, Stanford GSB
          </p>

          {/* Tagline - Focus Areas */}
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary dark:text-text-dark-secondary sm:text-xl animate-fade-in-up"
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
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              <Link
                href="/projects"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold shadow-lg shadow-accent-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-glow sm:text-lg"
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
              style={{ animationDelay: '500ms' }}
            >
              <Link
                href="/research"
                className="group btn-outline inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold backdrop-blur-sm transition-all duration-300 hover:bg-light-icy-blue/50 dark:hover:bg-dark-panel/50 sm:text-lg"
              >
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
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

        {/* Hero Image / Illustration */}
        <div className="relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="relative h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 xl:h-[450px] xl:w-[450px]">
            {/* Back glow effect */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary opacity-30 blur-2xl dark:opacity-20 animate-pulse" />

            {/* Image Container with Float Animation */}
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white/50 bg-light-neutral-grey shadow-2xl dark:border-white/10 dark:bg-dark-panel animate-[float_6s_ease-in-out_infinite]">
              {/* Placeholder for when image loads or if it fails */}
              <div className="absolute inset-0 flex items-center justify-center text-text-muted dark:text-text-dark-muted">
                <span className="sr-only">Profile Image</span>
              </div>

              <Image
                src="/images/profile-photo.jpg"
                alt="Fernando Torres"
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-110"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Decorative elements around image */}
            <div className="absolute -right-4 top-10 flex h-16 w-16 animate-[float_5s_ease-in-out_infinite_1s] items-center justify-center rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur-md dark:bg-dark-panel/90">
              <svg className="h-8 w-8 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="absolute -left-4 bottom-10 flex h-16 w-16 animate-[float_7s_ease-in-out_infinite_2s] items-center justify-center rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur-md dark:bg-dark-panel/90">
              <svg className="h-8 w-8 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* CSS for custom float animation if not in tailwind config */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  )
}
