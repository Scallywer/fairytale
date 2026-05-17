import Link from 'next/link'
import type { Metadata } from 'next'
import { storiesService } from '@/lib/storiesService'
import StoriesList from '@/components/StoriesList'
import RecommendedTonight from '@/components/RecommendedTonight'
import BackToTop from '@/components/BackToTop'
import { logger } from '@/lib/logger'
import { safeJsonLd } from '@/lib/utils'
import { getBaseUrl } from '@/lib/constants'

// "Predloži priču" is intentionally a quiet text link — the primary
// action on the home page is reading, not submitting. See design plan,
// Phase C "amber discipline + hero CTA inversion".
const linkGhost =
  'inline-flex items-center gap-1 h-11 px-3 rounded-full font-label font-bold text-sm text-on-surface hover:text-primary-container hover:underline underline-offset-4 transition-colors motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60'

const baseUrl = getBaseUrl()

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Priče za laku noć – Lijepe priče za djecu prije spavanja',
  description: 'Besplatne priče za djecu za laku noć. Čitajte najljepše bajke, basne i priče za djecu prije spavanja – na hrvatskom jeziku.',
  openGraph: {
    type: 'website',
    title: 'Priče za laku noć',
    description: 'Besplatne priče za djecu za laku noć. Čitajte najljepše bajke, basne i priče za djecu prije spavanja.',
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/images/suma_striborova.png`,
        alt: 'Priče za laku noć – ilustracija',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Priče za laku noć',
    description: 'Besplatne priče za djecu za laku noć. Najljepše bajke i priče na hrvatskom jeziku.',
    images: [`${baseUrl}/images/suma_striborova.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default function Home() {
  let stories: Awaited<ReturnType<typeof storiesService.getApprovedStories>> = []
  try {
    stories = storiesService.getApprovedStories()
  } catch (err) {
    logger.error('Failed to load stories', err)
  }

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Priče za laku noć',
    url: baseUrl,
    description: 'Besplatne priče za djecu za laku noć na hrvatskom jeziku.',
    inLanguage: 'hr',
    potentialAction: {
      '@type': 'ReadAction',
      target: baseUrl,
    },
  }

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Priče za laku noć',
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteLd) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationLd) }}
    />
    <div className="min-h-screen">
      {/* Top App Bar */}
      <header className="bg-surface/60 backdrop-blur-xl sticky top-0 z-50 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl md:text-2xl font-headline text-primary italic tracking-wide"
            >
              Priče za laku noć
            </Link>
            <div className="hidden md:flex gap-6 items-center">
              <Link
                href="/"
                className="text-on-surface font-bold border-b-2 border-primary-container pb-1 font-label text-sm tracking-wide"
              >
                Početna
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/submit" className={linkGhost} aria-label="Predloži novu priču">
              <span aria-hidden="true" className="text-lg leading-none">+</span>
              <span className="hidden sm:inline">Predloži priču</span>
              <span className="sm:hidden">Predloži</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-8 py-12 space-y-20">
        <h1 className="sr-only">Priče za laku noć — najljepše bajke i basne za djecu</h1>
        <RecommendedTonight stories={stories} />
        <StoriesList stories={stories} />
      </main>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Footer */}
      <footer className="bg-surface w-full pt-20 pb-10">
        <div className="flex flex-col items-center gap-8 w-full max-w-7xl mx-auto px-8">
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 border-b border-outline-variant/10 pb-12">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-headline italic text-primary mb-2">
                Priče za laku noć
              </h3>
              <p className="text-on-surface/70 text-sm max-w-xs font-body">
                Najljepše priče za miran san i čarobna jutra, kreirane s ljubavlju za vašu djecu.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/" className="text-on-surface/70 hover:text-primary-container transition-colors duration-[400ms] font-label text-sm uppercase tracking-widest">
                Početna
              </Link>
              <Link href="/submit" className="text-on-surface/70 hover:text-primary-container transition-colors duration-[400ms] font-label text-sm uppercase tracking-widest">
                Predloži priču
              </Link>
            </div>
          </div>
          <div className="text-on-surface/50 text-xs font-label uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Priče za laku noć. Sva prava pridržana.
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
