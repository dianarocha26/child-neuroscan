# Deployment Guide

## 🚀 Quick Deploy

### Prerequisites
- ✅ Supabase account (database configured)
- ✅ Environment variables ready
- ✅ Git repository (optional but recommended)

---

## 📦 Build Information

### Production Build Stats
```
dist/index.html                     3.80 kB │ gzip:  1.33 kB
dist/assets/index-[hash].css       71.89 kB │ gzip: 10.88 kB
dist/assets/icons-vendor.js        28.04 kB │ gzip:  5.55 kB
dist/assets/supabase-vendor.js    124.09 kB │ gzip: 34.13 kB
dist/assets/react-vendor.js       141.31 kB │ gzip: 45.38 kB
dist/assets/index.js              331.35 kB │ gzip: 61.24 kB

Total: ~157 KB gzipped (initial load)
```

**Optimizations Applied:**
- ✅ Code splitting (vendor chunks)
- ✅ Minification (esbuild)
- ✅ CSS optimization
- ✅ Tree shaking
- ✅ Asset compression

---

## 🔧 Environment Setup

### 1. Create `.env` file
```bash
cp .env.example .env
```

### 2. Add your Supabase credentials
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available

**Steps:**
1. Push code to GitHub/GitLab/Bitbucket
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

**Auto-detected settings:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Domain:**
- Auto: `your-project.vercel.app`
- Custom: Add in Settings → Domains

---

### Option 2: Netlify

**Why Netlify?**
- Easy setup
- Automatic deploys
- Form handling
- Edge functions

**Steps:**
1. Push code to Git
2. Visit [netlify.com](https://netlify.com)
3. Click "Add new site"
4. Choose your repository
5. Build settings (auto-detected from `netlify.toml`):
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click "Deploy site"

**Domain:**
- Auto: `your-project.netlify.app`
- Custom: Add in Domain settings

---

### Option 3: Cloudflare Pages

**Why Cloudflare?**
- Fast global CDN
- Free tier
- DDoS protection
- Analytics included

**Steps:**
1. Push code to Git
2. Visit [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Go to Pages
4. Click "Create a project"
5. Connect your repository
6. Configure build:
   ```
   Build command: npm run build
   Build output directory: dist
   ```
7. Add environment variables
8. Click "Save and Deploy"

---

### Option 4: Self-Hosted (VPS/Server)

**Requirements:**
- Node.js 18+
- Nginx or Apache
- SSL certificate (Let's Encrypt)

**Steps:**

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to server:**
   ```bash
   scp -r dist/* user@your-server:/var/www/childneuroscan/
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name childneuroscan.com;
       root /var/www/childneuroscan;
       index index.html;

       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Security headers
       add_header X-Frame-Options "DENY";
       add_header X-Content-Type-Options "nosniff";
       add_header X-XSS-Protection "1; mode=block";
   }
   ```

4. **Enable HTTPS with Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d childneuroscan.com
   ```

---

## 🔒 Post-Deployment Checklist

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Environment variables set (not committed)
- [ ] Supabase RLS policies active
- [ ] API keys secured

### Performance
- [ ] Assets cached properly
- [ ] CDN configured
- [ ] Compression enabled (gzip/brotli)
- [ ] Images optimized

### SEO
- [ ] Domain connected
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Meta tags present
- [ ] Google Search Console configured

### Functionality
- [ ] Login/signup works
- [ ] Database connections work
- [ ] All features functional
- [ ] Dark mode works
- [ ] Search works (Cmd/Ctrl+K)
- [ ] Export functions work

---

## 🔍 Testing Deployment

### 1. Homepage
```
https://your-domain.com/
```
- Should load landing page
- Theme toggle works
- Search button visible (when logged in)

### 2. Authentication
```
https://your-domain.com/ → Sign Up
```
- User can create account
- Email verification (if enabled)
- Login works
- Session persists

### 3. Features
Test key features:
- [ ] Screening questionnaires
- [ ] Progress dashboard
- [ ] Behavior diary
- [ ] Medication tracker
- [ ] Report generation
- [ ] Export (HTML, JSON, CSV)

### 4. Mobile
- [ ] Responsive design
- [ ] Touch interactions
- [ ] PWA install prompt
- [ ] Mobile navigation

---

## 🐛 Troubleshooting

### Issue: White screen after deployment
**Solution:**
1. Check browser console for errors
2. Verify environment variables are set
3. Ensure Supabase URL/key are correct
4. Check build output in `dist/`

### Issue: 404 errors on page refresh
**Solution:**
1. Configure SPA routing:
   - Vercel: Use `vercel.json` (already configured)
   - Netlify: Use `netlify.toml` (already configured)
   - Custom: Configure server rewrites

### Issue: Supabase connection fails
**Solution:**
1. Check environment variables
2. Verify Supabase project is active
3. Check RLS policies allow access
4. Test connection in browser console:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   ```

### Issue: Build fails
**Solution:**
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Run typecheck:
   ```bash
   npm run typecheck
   ```
3. Check Node version (18+)

---

## 📊 Monitoring

### Performance Monitoring
- Use [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- Check [WebPageTest](https://www.webpagetest.org)
- Monitor with [Google Analytics](https://analytics.google.com)

### Uptime Monitoring
- [Upptime](https://upptime.js.org) (free, GitHub-based)
- [Uptime Robot](https://uptimerobot.com) (free tier)
- [Better Uptime](https://betteruptime.com)

### Error Tracking
- [Sentry](https://sentry.io) (recommended)
- [LogRocket](https://logrocket.com)
- [Rollbar](https://rollbar.com)

---

## 🔄 Updates & Maintenance

### Deploying Updates

**Git-based (Vercel/Netlify):**
```bash
git add .
git commit -m "Update: description"
git push origin main
```
- Automatic deployment triggered
- Build logs available in dashboard

**Manual (Self-hosted):**
```bash
npm run build
scp -r dist/* user@server:/var/www/childneuroscan/
```

### Database Migrations

**New migrations:**
1. Create migration file in `supabase/migrations/`
2. Apply via Supabase Dashboard or CLI:
   ```bash
   supabase db push
   ```

---

## 🌍 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify
1. Go to Domain Settings → Custom domains
2. Add your domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### Cloudflare
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Configure DNS in Cloudflare dashboard
4. Enable proxy (orange cloud)

---

## 📈 Performance Tips

### Further Optimizations
1. **Enable Brotli compression** (most hosts enable by default)
2. **Use HTTP/2** (automatic on Vercel/Netlify)
3. **Enable service worker** (for offline support)
4. **Optimize images** (convert to WebP)
5. **Preload critical assets**

### CDN Configuration
- Use edge caching for static assets
- Configure cache headers (already set)
- Enable geographic distribution

---

## 🎯 Production Checklist

Before going live:

### Code
- [ ] Remove console.logs
- [ ] No hardcoded credentials
- [ ] Error boundaries in place
- [ ] Analytics configured
- [ ] Social media tags set

### Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] Fonts optimized

### Security
- [ ] HTTPS only
- [ ] Security headers
- [ ] RLS policies tested
- [ ] No exposed secrets
- [ ] CORS configured

### SEO
- [ ] Meta tags complete
- [ ] Sitemap submitted
- [ ] robots.txt configured
- [ ] Schema markup (optional)
- [ ] Analytics tracking

---

## 📞 Support

### Resources
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Common Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint

# Clean
npm run clean
```

---

**Ready to deploy?** Choose your platform and follow the steps above!

**Questions?** Check TECHNICAL.md for in-depth documentation.

---

Good luck with your deployment! 🚀
