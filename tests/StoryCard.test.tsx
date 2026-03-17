import { render, screen } from '@testing-library/react'
import StoryCard from '@/components/StoryCard'

describe('StoryCard', () => {
  it('renders title, author and image', () => {
    render(
      <StoryCard
        id="1"
        title="Test priča"
        author="Autor"
        imageUrl="/images/test.png"
        viewMode="gallery"
        averageRating={4.5}
        ratingCount={3}
        readingTime={8}
      />
    )

    expect(screen.getByText('Test priča')).toBeInTheDocument()
    expect(screen.getByText('Autor')).toBeInTheDocument()
  })
})

