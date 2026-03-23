import Link from 'next/link'
import type { Metadata } from 'next'
import { storiesService } from '@/lib/storiesService'
import StoriesList from '@/components/StoriesList'
import RecommendedTonight from '@/components/RecommendedTonight'
import BackToTop from '@/components/BackToTop'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pricezalakunoc.hr'

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
  const stories = storiesService.getApprovedStories()

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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
    />
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-200 mb-2">
                Priče za laku noć
              </h1>
              <p className="text-amber-300/90 text-sm md:text-base">
                Lijepe priče za djecu prije spavanja
              </p>
            </div>
            <Link
              href="/submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Pošalji priču
            </Link>
          </div>
        </div>
      </header>

      {/* Stories */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8">
        <RecommendedTonight stories={stories} />
        <StoriesList stories={stories} />
      </main>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
    </>
  )
}
