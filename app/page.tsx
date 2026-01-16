import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StoriesList from '@/components/StoriesList'
import BackToTop from '@/components/BackToTop'

export default function Home() {
  console.log('[PAGE] Home component rendering, calling getApprovedStories...')
  const stories = prisma.getApprovedStories()
  console.log(`[PAGE] Received ${stories.length} stories from database`)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-200 mb-2">
                Priče za laku noć
              </h1>
              <p className="text-amber-300/70 text-sm md:text-base">
                Lijepe priče za djecu prije spavanja
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Pošalji priču
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 border border-slate-600 hover:border-slate-500 text-amber-300 rounded-lg text-sm font-medium transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stories */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <StoriesList stories={stories} />
      </main>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}
