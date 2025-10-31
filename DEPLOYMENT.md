# Alpha Pulse - Vercel Deployment Guide

This guide will help you deploy Alpha Pulse to Vercel for **free, permanent hosting**.

## Prerequisites

- A Vercel account (free) - Sign up at [vercel.com](https://vercel.com)
- Node.js installed on your computer (v18 or higher)
- The Alpha Pulse ZIP file extracted

---

## Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (recommended) or email
4. Verify your email if needed

**Cost:** FREE forever for this project

---

## Step 2: Set Up Database

Alpha Pulse needs a PostgreSQL database. Vercel offers free PostgreSQL:

### Option A: Vercel Postgres (Recommended - Free)

1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Click "Create Database"
3. Select "Postgres"
4. Choose "Hobby" plan (FREE)
5. Name it `alpha-pulse-db`
6. Click "Create"
7. Copy the `DATABASE_URL` connection string

### Option B: Free External Database

Alternatives if you prefer:
- **Supabase** - [supabase.com](https://supabase.com) (500MB free)
- **Neon** - [neon.tech](https://neon.tech) (3GB free)
- **Railway** - [railway.app](https://railway.app) ($5 credit/month)

---

## Step 3: Install Vercel CLI

Open your terminal and run:

```bash
npm install -g vercel
```

Verify installation:

```bash
vercel --version
```

---

## Step 4: Prepare Your Project

1. **Extract the ZIP file:**
   ```bash
   cd ~/Downloads
   unzip alpha-pulse-complete.zip
   cd alpha-pulse
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```
   
   If you don't have pnpm:
   ```bash
   npm install -g pnpm
   pnpm install
   ```

---

## Step 5: Configure Environment Variables

You'll need to set these in Vercel dashboard:

### Required Variables:

1. `DATABASE_URL` - Your PostgreSQL connection string from Step 2
2. `JWT_SECRET` - Generate with: `openssl rand -base64 32`

### Optional Variables (can skip for now):

- `VITE_APP_TITLE` - "Alpha Pulse" (default)
- `VITE_APP_LOGO` - "/logo.svg" (default)
- `OWNER_NAME` - Your name
- `OWNER_OPEN_ID` - Your user ID (for admin access)

---

## Step 6: Deploy to Vercel

### Method A: Using Vercel CLI (Easiest)

1. **Login to Vercel:**
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate.

2. **Deploy:**
   ```bash
   vercel
   ```
   
   Answer the prompts:
   - "Set up and deploy?" → **Yes**
   - "Which scope?" → Choose your account
   - "Link to existing project?" → **No**
   - "What's your project's name?" → `alpha-pulse`
   - "In which directory is your code located?" → `./` (press Enter)
   - "Want to override settings?" → **No**

3. **Add environment variables:**
   ```bash
   vercel env add DATABASE_URL
   ```
   Paste your database URL when prompted.
   
   ```bash
   vercel env add JWT_SECRET
   ```
   Paste your JWT secret.

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

**Done!** You'll get a URL like: `https://alpha-pulse.vercel.app`

### Method B: Using Vercel Dashboard (Alternative)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository" or "Import Project"
3. Upload your project folder
4. Configure:
   - Framework Preset: **Other**
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`
5. Add environment variables in "Environment Variables" section
6. Click "Deploy"

---

## Step 7: Initialize Database

After first deployment, you need to create database tables:

1. **Go to your Vercel project dashboard**
2. **Open the "Functions" tab**
3. **Find the deployment URL** (e.g., `https://alpha-pulse.vercel.app`)
4. **Run database migration:**
   
   Open terminal and run:
   ```bash
   cd alpha-pulse
   DATABASE_URL="your-vercel-database-url" pnpm db:push
   ```

Alternatively, you can run this in Vercel's serverless function by adding a migration endpoint (advanced).

---

## Step 8: Test Your Deployment

1. Visit your Vercel URL: `https://alpha-pulse.vercel.app`
2. Click "Launch Alpha Pulse"
3. Enter keywords like "AI" and click Run
4. Verify data is fetched from all 6 sources

**If everything works:** 🎉 Congratulations! Your site is live!

---

## Step 9: Add Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `alphapulse.com`)
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

**Cost:** Domain registration ~$10-15/year (from Namecheap, GoDaddy, etc.)

---

## Troubleshooting

### Error: "Database connection failed"

- Check that `DATABASE_URL` is set correctly in Vercel dashboard
- Verify database is running (check Vercel Storage dashboard)
- Make sure you ran `pnpm db:push` to create tables

### Error: "Build failed"

- Check build logs in Vercel dashboard
- Ensure `pnpm install` completed successfully
- Try deploying again: `vercel --prod`

### Error: "API routes not working"

- Check that `vercel.json` is in the project root
- Verify serverless functions are enabled in Vercel dashboard
- Check function logs in Vercel dashboard

### News sources returning 0 results

- This is normal for some sources (they may be rate-limiting)
- Try with different keywords
- Check browser console for specific errors

---

## Updating Your Deployment

When you make changes to the code:

```bash
# Pull latest changes or modify code
# Then redeploy:
vercel --prod
```

Vercel will automatically rebuild and deploy.

---

## Monitoring & Limits

### Vercel Free Tier Limits:

- ✅ **Bandwidth:** Unlimited
- ✅ **Serverless Functions:** 1,000,000 executions/month
- ✅ **Build Minutes:** 6,000 minutes/month
- ✅ **Deployments:** Unlimited

**You're very unlikely to hit these limits** with normal usage.

### Check Usage:

1. Go to Vercel dashboard
2. Click "Usage" tab
3. Monitor bandwidth, function calls, build minutes

---

## Cost Breakdown

| Item | Cost |
|------|------|
| **Vercel Hosting** | FREE |
| **Vercel Postgres Database** | FREE (512MB) |
| **SSL Certificate** | FREE |
| **Bandwidth** | FREE (unlimited) |
| **Custom Domain** | ~$12/year (optional) |

**Total:** $0/month (or $1/month if you buy a domain)

---

## Alternative: Deploy Without Database

If you don't want to set up a database, you can deploy just the standalone `alpha-pulse.html` file:

1. Create a new folder: `alpha-pulse-static`
2. Copy only `client/public/alpha-pulse.html` to it
3. Rename to `index.html`
4. Deploy to Vercel:
   ```bash
   cd alpha-pulse-static
   vercel
   ```

**Note:** This version won't have user authentication or data persistence, but all news fetching will work.

---

## Support

If you encounter issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check build logs in Vercel dashboard
3. Review this deployment guide again
4. Check the DATASOURCES.md file for source-specific issues

---

## Next Steps

After successful deployment:

1. ✅ Bookmark your Vercel URL
2. ✅ Add to phone home screen (works as PWA)
3. ✅ Share with friends/colleagues
4. ✅ Consider adding a custom domain
5. ✅ Monitor usage in Vercel dashboard

**Your Alpha Pulse is now live 24/7, accessible from anywhere!** 🚀
