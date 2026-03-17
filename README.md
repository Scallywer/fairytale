# Priče za laku noć – Kids Nighttime Stories

A web app for Croatian children’s bedtime stories, built with Next.js, SQLite, and Tailwind CSS.

## Features

- 📚 Collection of Croatian bedtime stories for kids (ages 5–10)
- 🌙 Dark theme with navy, slate, and amber
- ⭐ 5-star rating system (ratings stored per user, averages computed)
- 💬 Comments per story with simple math CAPTCHA and IP rate limiting
- 📖 List and gallery view modes with search, filters (author, rating, reading time, read/unread), and sort
- ✅ Mark stories as read (stored in localStorage) with grayed-out styling
- 📄 “Load more” pagination on the story list
- 🎯 **Preporučeno za večeras** – recommended unread stories by reading time
- 🔗 **Ostale priče** – related stories (same author, then others) on each story page
- 🔐 Admin area: approve/delete stories, HTTP-only cookie auth, login rate limiting
- ♿ Keyboard and screen-reader friendly (ARIA, focus styles, scroll-to-comments)
- 📱 Responsive layout
- 🎨 Optional AI-generated illustrations (OpenAI DALL-E 3)

## Tech stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with `better-sqlite3`
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Validation**: Zod (API request bodies)
- **Image generation**: OpenAI DALL-E 3 (optional, via scripts)

## Getting started

### Prerequisites

- Node.js 20+ (or Docker and Docker Compose)

### Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure:

| Variable | Purpose |
|----------|---------|
| `ADMIN_PASSWORD` | Password for `/admin` (required in production) |
| `OPENAI_API_KEY` | For image-generation scripts (optional) |
| `NEXT_PUBLIC_SITE_URL` | Base URL for SEO/canonical links (e.g. `https://pricezalakunoc.hr`) |
| `DEBUG` / `NEXT_PUBLIC_DEBUG` | Set to `true` to enable debug logging |
| `LOG_JSON` | Set to `1` or `true` for JSON-structured logs (e.g. in production) |

The `.env` file is gitignored. If any secret was ever committed, rotate it and update `.env` and deployment secrets.

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker deployment

### Docker Compose (recommended)

```bash
docker compose pull
# OR build locally
docker compose build

docker compose up -d
```

App: [http://localhost:8889](http://localhost:8889).

### Docker run

```bash
docker run -d \
  --name fairytale-app \
  -p 8889:3000 \
  -v $(pwd)/data:/app/data \
  -e ADMIN_PASSWORD=your-secure-password \
  ghcr.io/scallywer/fairytale:latest
```

### Data persistence

The SQLite database lives in `./data`, mounted as a volume. Back up this directory regularly.

## API overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stories` | GET | Approved stories (optional `?limit=&offset=` for pagination) |
| `/api/stories` | POST | Submit a new story (Zod-validated) |
| `/api/comments?storyId=` | GET | Comments for a story |
| `/api/comments` | POST | Add comment (Zod, math check, IP rate limit) |
| `/api/ratings` | POST | Submit rating 1–5 (Zod) |
| `/api/admin` | GET/POST | Admin actions (cookie auth, rate-limited login) |
| `/api/health` | GET | Health check (returns 200 and DB status) |
| `/api/analytics` | POST | Optional event logging (no persistence, returns 204) |

## Database schema

SQLite with three main tables:

- **stories** – id, title, author, body, imageUrl, isApproved, createdAt, updatedAt. Reading time and average rating are computed at read time from `ratings`.
- **ratings** – id, storyId, userId, rating (1–5), createdAt. One rating per user per story.
- **comments** – id, storyId, authorName, content, isApproved, createdAt.

Domain logic lives in `lib/storiesService.ts`, `lib/ratingsService.ts`, and `lib/commentsService.ts`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run generate-images` | Generate story images (OpenAI; needs API key) |
| `npm run export-prompts` | Export DALL-E prompts to file |
| `npm run update-image-links` | Sync image URLs in DB from local files |
| `npm run review-prompts` | Review prompts |
| `npm run regenerate-specific` | Regenerate images for selected stories |
| `npm run expand-stories` | Expand stories script |
| `npm run export-stories-list` | Export story list to file |

After adding stories or images, run `npm run update-image-links` then `npm test`.

## Testing

```bash
npm test
```

Runs Vitest (e.g. image mapping, stories API, UI components). For a single file:

```bash
npx vitest tests/image-mapping.test.ts
npx vitest tests/api-stories.test.ts
```

## GitHub Actions

- **CI** (`.github/workflows/ci.yml`) – on push/PR to `main`/`master`: `npm ci`, `npm run lint`, `npm test`.
- **Docker** (`.github/workflows/docker-build.yml`) – build and push image to GitHub Container Registry; image `ghcr.io/scallywer/fairytale:latest`, tags for branch, SHA, and version.

## License

Private project – all rights reserved.
