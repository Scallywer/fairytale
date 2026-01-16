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

- Node.js 20+ 
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Scallywer/fairytale.git
cd fairytale
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up environment variables:
```bash
cp .env.example .env
# Add your OPENAI_API_KEY if you want to generate images
```

4. Seed the database:
```bash
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

### Using Docker Compose (Recommended)

1. Pull the latest image or build it:
```bash
docker-compose pull
# OR build locally
docker-compose build
```

2. Start the application:
```bash
docker-compose up -d
```

3. The application will be available at [http://localhost:3000](http://localhost:3000)

### Using Docker directly

```bash
docker run -d \
  --name fairytale-app \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  ghcr.io/scallywer/fairytale:latest
```

### Data Persistence

The SQLite database is stored in the `./data` directory, which is mounted as a volume in Docker. Make sure to backup this directory regularly.

## GitHub Actions

Docker images are automatically built and pushed to GitHub Container Registry on every commit to `master` branch:

- Image: `ghcr.io/scallywer/fairytale:latest`
- Automatically tagged with branch name, SHA, and version tags

## Database Schema

The application uses SQLite with two main tables:

- **stories**: Contains story metadata (title, author, body, country, imageUrl, isApproved)
- **ratings**: Stores user ratings (storyId, userId, rating 1-5)

Average ratings are calculated on-the-fly using SQL `AVG()` function.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed the database with stories
- `npm run generate-images` - Generate images for stories (requires OpenAI API key)
- `npm run export-prompts` - Export all DALL-E prompts to file

## License

Private project - All rights reserved
