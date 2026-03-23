import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pošalji priču',
  description: 'Pošaljite svoju priču za djecu i podijelite je s drugim roditeljima i djecom. Priče prolaze moderaciju prije objave.',
}

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
