# Kids Nighttime Stories (Priče za laku noć)

A beautiful dark-mode web application for Croatian bedtime stories, built with Next.js, Prisma, and SQLite.

## Features

- 🌙 **Dark Mode Theme** - Deep navy and amber colors perfect for nighttime reading
- 📚 **Story Collection** - Browse approved bedtime stories
- ✅ **Read Tracking** - Mark stories as read using browser LocalStorage
- 📝 **Story Submission** - Users can submit new stories
- 🔐 **Admin Panel** - Password-protected approval system
- 📱 **Mobile Friendly** - Optimized for reading on tablets and phones

## Tech Stack

- **Next.js 16** (App Router)
- **Prisma 7** with SQLite
- **TypeScript**
- **Tailwind CSS**

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="file:./dev.db"
   ADMIN_PASSWORD="your-secure-password-here"
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Seed the database (optional):**
   You can manually add stories through the admin panel, or if the seed script works:
   ```bash
   npx prisma db seed
   ```
   
   **Note:** If the seed script has issues, you can add stories manually:
   - Start the dev server
   - Go to `/submit` to add stories
   - Go to `/admin` to approve them

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding Stories

1. Navigate to `/submit`
2. Fill in the form (Title, Author, Body, Country)
3. Submit - the story will be pending approval

### Admin Panel

1. Navigate to `/admin`
2. Enter the admin password (set in `.env`)
3. View pending stories and approve/reject them
4. Manage all stories

### Reading Stories

- Browse stories on the homepage
- Click any story to read it
- Mark stories as read - they'll show a checkmark on the homepage
- Read tracking is stored in browser LocalStorage

## Project Structure

```
fairytale/
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Admin panel
│   ├── story/[id]/   # Story reading page
│   ├── submit/       # Story submission form
│   └── page.tsx      # Homepage
├── components/       # React components
├── lib/              # Utilities (Prisma client, auth)
├── prisma/           # Database schema and migrations
└── public/           # Static assets
```

## Database

The app uses SQLite stored in `prisma/dev.db`. This file is automatically created when you run migrations.

**Important:** Add `prisma/*.db` and `prisma/*.db-journal` to `.gitignore` (already included).

## Environment Variables

- `DATABASE_URL` - SQLite connection string (default: `file:./dev.db`)
- `ADMIN_PASSWORD` - Password for admin panel access

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma studio` - Open Prisma Studio to view/edit database

## Notes

- Stories are stored in Croatian language
- Read tracking uses browser LocalStorage (per-device)
- Admin password is simple - consider using proper authentication for production
