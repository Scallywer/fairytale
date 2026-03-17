import { render, screen } from '@testing-library/react'
import StoriesList from '@/components/StoriesList'

const sampleStories = [
  {
    id: '1',
    title: 'Šuma Striborova',
    author: 'Ivana Brlić-Mažuranić',
    imageUrl: '/images/42_SumaStriborova.png',
    averageRating: 4.8,
    ratingCount: 10,
    readingTime: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Kako je Potjeh tražio istinu',
    author: 'Ivana Brlić-Mažuranić',
    imageUrl: '/images/41_KakoJePotjehTrazioIstinu.png',
    averageRating: 4.5,
    ratingCount: 5,
    readingTime: 10,
    createdAt: new Date().toISOString(),
  },
]

describe('StoriesList', () => {
  it('renders story titles and authors', () => {
    render(<StoriesList stories={sampleStories} />)

    expect(
      screen.getByText('Šuma Striborova', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Kako je Potjeh tražio istinu', { exact: false })
    ).toBeInTheDocument()

    expect(
      screen.getAllByText('Ivana Brlić-Mažuranić', { exact: false }).length
    ).toBeGreaterThan(0)
  })
})

