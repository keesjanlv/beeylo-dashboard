# Cloudflare Pages Deployment Guide

This guide will help you deploy the Beeylo Dashboard to Cloudflare Pages.

## Why Cloudflare Pages?

- ✅ **Free tier for commercial projects** (unlike Vercel)
- ✅ Unlimited bandwidth on free tier
- ✅ Global CDN with 300+ locations
- ✅ Built-in DDoS protection
- ✅ Automatic HTTPS
- ✅ Perfect for Next.js static export

## Prerequisites

1. GitHub account (for connecting your repository)
2. Cloudflare account (free) - [Sign up here](https://dash.cloudflare.com/sign-up)

## Step 1: Prepare Your Repository

This app is already configured for static export with `output: 'export'` in `next.config.ts`.

**Push your code to GitHub:**

```bash
cd C:\Users\KJ\Documents\BEEYLO_OCT\dashboardapp

# Initialize git if not already done
git init
git add -A
git commit -m "Initial commit - Beeylo Dashboard"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/beeylo-dashboard.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Cloudflare Pages

### Via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com
   - Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

2. **Connect Your GitHub Repository**
   - Authorize Cloudflare to access your GitHub
   - Select the `beeylo-dashboard` repository

3. **Configure Build Settings**

   Use these exact settings:

   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   Root directory: /
   ```

4. **Add Environment Variables**

   Click **Environment variables** and add:

   ```
   NEXT_PUBLIC_BUILDER_API_KEY=your_builder_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   NEXT_PUBLIC_SHOPIFY_API_URL=https://your-shopify-api.railway.app
   ```

   ⚠️ **Important:** Make sure to set these for **both Production and Preview** environments!

5. **Deploy**
   - Click **Save and Deploy**
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at: `https://your-project-name.pages.dev`

## Step 3: Configure Custom Domain (Optional)

1. In Cloudflare Pages, go to your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `dashboard.beeylo.com`)
4. Follow the instructions to update DNS records
5. Cloudflare will automatically provision SSL certificate

## Step 4: Set Up Automatic Deployments

Cloudflare Pages automatically deploys when you push to your main branch!

```bash
# Make changes to your code
git add -A
git commit -m "Update dashboard"
git push origin main

# Cloudflare will automatically deploy in ~2 minutes
```

### Branch Previews

Cloudflare also creates preview deployments for every branch:
- Push to `develop` → Gets preview URL: `https://develop.your-project.pages.dev`
- Push to `feature-x` → Gets preview URL: `https://feature-x.your-project.pages.dev`

## Troubleshooting

### Build Fails with "Module not found"

**Solution:** Make sure all dependencies are in `package.json` and committed to git.

```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working

**Solution:**
1. Go to Cloudflare Pages → Your Project → **Settings** → **Environment variables**
2. Make sure variables are set for **both** Production and Preview
3. Redeploy: **Deployments** → **...** → **Retry deployment**

### Build Works Locally But Fails on Cloudflare

**Solution:** Check Node.js version

Add a `.nvmrc` file to specify Node version:
```bash
echo "20" > .nvmrc
git add .nvmrc
git commit -m "Set Node.js version to 20"
git push
```

Or set in Cloudflare Pages → **Settings** → **Environment variables**:
```
NODE_VERSION=20
```

### 404 Errors on Page Refresh

This is already handled by Next.js static export with `trailingSlash: true` in your config. If you still see issues:

1. Go to Cloudflare Pages → **Settings** → **Redirects/Headers**
2. Add a `_redirects` file in your `public` folder:

```
/*    /index.html   200
```

## Monitoring & Analytics

**Built-in Analytics:**
- Go to your project → **Analytics**
- View page views, bandwidth, requests
- All included in free tier!

**Real User Monitoring (Optional):**
- Enable **Web Analytics** in Cloudflare dashboard
- Add the snippet to your `_app.tsx` or `layout.tsx`

## Limits on Free Tier

| Feature | Free Tier Limit |
|---------|----------------|
| Builds per month | 500 |
| Bandwidth | Unlimited |
| Requests | Unlimited |
| Custom domains | Unlimited |
| Team members | Unlimited |
| Build time | 20 minutes |

Perfect for production use! 🚀

## Comparison: Cloudflare Pages vs Vercel

| Feature | Cloudflare Pages (Free) | Vercel (Free) |
|---------|------------------------|---------------|
| **Commercial use** | ✅ Allowed | ❌ Hobby only |
| **Bandwidth** | Unlimited | 100GB/month |
| **Builds** | 500/month | 6,000 minutes/month |
| **Custom domains** | Unlimited | 1 domain |
| **Team seats** | Unlimited | 1 seat |

## Next Steps

After deployment:

1. ✅ Test your dashboard at the Cloudflare Pages URL
2. ✅ Set up custom domain if needed
3. ✅ Enable Cloudflare Web Analytics
4. ✅ Configure CORS if needed for Supabase/Shopify APIs
5. ✅ Set up branch previews for staging environment

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Static Export Guide](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Community](https://community.cloudflare.com/)

---

**Need help?** Check the troubleshooting section above or reach out to the team.
