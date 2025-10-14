# Beeylo Dashboard

Modern dashboard application for Beeylo - built with Next.js 15, React 19, and Tailwind CSS 4.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS 4
- 📊 Analytics dashboard with charts (Recharts)
- 💬 Real-time chat system with Supabase
- 👥 Team management
- 📝 Knowledge base
- 🔌 Shopify integration for order management
- 🎯 Drag-and-drop interfaces
- 🔐 Secure authentication with Supabase Auth

## Tech Stack

- **Framework:** Next.js 15.5 (Static Export)
- **UI:** React 19, Tailwind CSS 4, Headless UI
- **Database:** Supabase (PostgreSQL + Realtime)
- **Icons:** Heroicons, Lucide React
- **Charts:** Recharts
- **Drag & Drop:** dnd-kit, react-dnd

## Local Development

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Setup

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in your credentials in `.env`

3. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Cloudflare Pages (Recommended)

This app is optimized for Cloudflare Pages with Next.js static export.

**✅ Free tier for commercial projects (unlike Vercel)**

**See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for complete deployment guide.**

Quick steps:

1. Push code to GitHub
2. Connect to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `out`
5. Add environment variables
6. Deploy!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BUILDER_API_KEY` | Builder.io API key | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_SHOPIFY_API_URL` | Shopify integration API URL | Yes |

See `.env.example` for template.

## Key Features

### Shopify Integration

Connect your Shopify store via **Settings** → **Integrations** to sync orders and send notifications.

### Analytics

View key metrics: conversations, active users, response times, message volume.

### Real-time Chat

Built-in chat system with threading, attachments, presence, and push notifications.

## Scripts

```bash
npm run dev          # Development with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Lint code
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Supabase Documentation](https://supabase.com/docs)

## License

Proprietary - © 2025 Beeylo
