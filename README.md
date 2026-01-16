# Priče za laku noć - Kids Nighttime Stories

A beautiful web application for Croatian children's bedtime stories, built with Next.js, SQLite, and Tailwind CSS.

## Features

- 📚 Collection of 42 Croatian bedtime stories for kids ages 5-10
- 🌙 Dark mode theme with navy, slate, and amber accents
- ⭐ 5-star rating system with averaged ratings stored in database
- 📖 List and Gallery view modes
- ✅ Mark stories as read with grayed-out styling
- 🔙 Back to top button for easy navigation
- 📱 Mobile-friendly responsive design
- 🎨 AI-generated illustrations for each story

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with `better-sqlite3`
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Image Generation**: OpenAI DALL-E 3 (optional)

## Getting Started

### Prerequisites

- Docker and Docker Compose installed

## Docker Deployment

### Using Docker Compose (Recommended)

1. Pull the latest image or build it:
```bash
docker compose pull
# OR build locally
docker compose build
```

2. Start the application:
```bash
docker compose up -d
```

3. The application will be available at [http://localhost:8889](http://localhost:8889)

### Using Docker directly

```bash
docker run -d \
  --name fairytale-app \
  -p 8889:3000 \
  -v $(pwd)/data:/app/data \
  ghcr.io/scallywer/fairytale:latest
```

### Data Persistence

The SQLite database is stored in the `./data` directory, which is mounted as a volume in Docker. The database is pre-populated with all stories, so it will be automatically copied to the volume on first run if it doesn't exist. Make sure to backup this directory regularly.

## GitHub Actions

Docker images are automatically built and pushed to GitHub Container Registry on every commit to `master` branch:

- Image: `ghcr.io/scallywer/fairytale:latest`
- Automatically tagged with branch name, SHA, and version tags

## Database Schema

The application uses SQLite with two main tables:

- **stories**: Contains story metadata (title, author, body, country, imageUrl, isApproved, averageRating, ratingCount)
- **ratings**: Stores individual user ratings (storyId, userId, rating 1-5)

Average ratings are calculated automatically when ratings are submitted and stored in the `stories` table for quick access.

## Scripts

Available npm scripts (for development/maintenance):

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run generate-images` - Generate images for stories (requires OpenAI API key)
- `npm run export-prompts` - Export all DALL-E prompts to file
- `npm run update-image-links` - Update image URLs in database from local files

## License

Private project - All rights reserved
