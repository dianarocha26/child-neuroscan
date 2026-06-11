# Technical Documentation

## Architecture & Best Practices

### 🏗️ Project Structure

```
childneuroscan/
├── public/              # Static assets
│   ├── CS1.png         # App icon
│   ├── manifest.json   # PWA manifest
│   ├── robots.txt      # SEO crawler instructions
│   ├── sitemap.xml     # SEO sitemap
│   └── sw.js           # Service worker
├── src/
│   ├── components/     # React components (25+)
│   ├── contexts/       # React contexts (Auth, Language, Theme)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities & database
│   ├── types/          # TypeScript definitions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── supabase/
│   └── migrations/     # Database migrations (70+)
└── Configuration files
```

---

## 🎯 Performance Optimizations

### Code Splitting
```typescript
// vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'supabase-vendor': ['@supabase/supabase-js'],
  'icons-vendor': ['lucide-react']
}
```

**Benefits:**
- Reduces initial bundle size
- Improves cache efficiency
- Faster page loads
- Better update handling

### Bundle Analysis
- Main bundle: 623 KB (145 KB gzipped)
- CSS: 71 KB (10.68 KB gzipped)
- HTML: 1.42 KB (0.57 KB gzipped)

**Total initial load:** ~157 KB gzipped

---

## 🔒 Security Headers

### Implemented Headers (vercel.json & netlify.toml)

```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
}
```

**Protection Against:**
- ✅ MIME type sniffing attacks
- ✅ Clickjacking (iframe embedding)
- ✅ Cross-site scripting (XSS)
- ✅ Referrer leakage
- ✅ Unauthorized device access

---

## 📱 Progressive Web App (PWA)

### Manifest Features
- **Install prompt**: Users can install as native app
- **Offline support**: Service worker ready
- **App shortcuts**: Quick actions from home screen
- **Share target**: Can receive shares from other apps
- **Responsive icons**: Maskable and standard formats

### Shortcuts Configured
1. New Screening
2. Progress Dashboard
3. Behavior Diary

---

## 🎨 Theme System

### Implementation
```typescript
// ThemeContext.tsx
- Light mode
- Dark mode
- System preference detection
- localStorage persistence
- CSS class strategy
```

### Dark Mode Support
- Uses `prefers-color-scheme` media query
- Smooth transitions (300ms)
- All components support both themes
- Proper contrast ratios (WCAG AA)

---

## 🔍 SEO Optimization

### Meta Tags
```html
<!-- Title & Description -->
<title>ChildNeuroScan - Comprehensive Child Development...</title>
<meta name="description" content="Professional neurodevelopmental..." />

<!-- Keywords -->
<meta name="keywords" content="child development, autism screening..." />

<!-- Open Graph (Facebook) -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
```

### Structured Data
- robots.txt for crawler control
- sitemap.xml for indexing
- Canonical URLs
- Language alternates (en, es)

---

## 🧪 Error Handling

### Error Boundary
```typescript
// ErrorBoundary.tsx
- Catches React component errors
- Graceful fallback UI
- Error logging
- Reset functionality
- User-friendly messages
```

### Benefits:
- Prevents full app crashes
- Better user experience
- Easier debugging
- Professional error pages

---

## 🚀 Deployment Configuration

### Vercel (vercel.json)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Cache Strategy
- **Static assets**: 1 year (`max-age=31536000`)
- **Manifest**: 1 day (`max-age=86400`)
- **Service worker**: No cache (`max-age=0`)

---

## 🔐 Authentication & Database

### Supabase Setup
```typescript
// lib/supabase.ts
- Singleton client instance
- Environment variable configuration
- Type-safe database queries
- Row Level Security (RLS)
```

### RLS Policies
Every table has policies for:
- SELECT (read)
- INSERT (create)
- UPDATE (modify)
- DELETE (remove)

**Security Principle:** Users can only access their own data.

---

## 🎨 Styling System

### Tailwind CSS
- **Dark mode**: `dark:` prefix
- **Custom colors**: Primary, secondary, accent
- **Animations**: Fade, slide, scale, shimmer
- **Utilities**: Safe areas, touch handling

### Custom Components
```css
.btn-primary
.btn-secondary
.btn-friendly
.card
.card-interactive
.input-field
.skeleton
.glass
```

---

## 📊 Data Export System

### Export Formats
```typescript
// lib/exportUtils.ts

1. JSON - Complete data backup
2. CSV - Spreadsheet analysis
3. HTML - Professional reports
4. Print - Paper/PDF output
```

### Report Generation
```typescript
generateHTMLReport(data: ExportData): string
- Professional medical report styling
- Color-coded sections
- Print-optimized layout
- Responsive design
```

---

## ♿ Accessibility

### Implemented
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast (WCAG AA)
- ✅ Dark mode support
- ✅ Touch targets (44x44px minimum)
- ✅ Error messages
- ✅ Loading states

### In Progress
- 🔄 ARIA labels
- 🔄 Screen reader optimization
- 🔄 Skip navigation links
- 🔄 Form field descriptions

---

## 🔧 Development Tools

### VSCode Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Recommended Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Error Lens
- Path Intellisense

---

## 📦 Build Process

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run build:clean  # Clean build
npm run preview      # Preview production
npm run typecheck    # TypeScript check
npm run lint         # Lint code
npm run lint:fix     # Fix lint issues
```

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── CS1.png
├── manifest.json
├── robots.txt
└── sitemap.xml
```

---

## 🌍 Internationalization (i18n)

### Supported Languages
- English (en) - Default
- Spanish (es)

### Implementation
```typescript
// contexts/LanguageContext.tsx
- Translation function: t(key)
- Language switcher component
- localStorage persistence
- Dynamic content loading
```

---

## 🔄 State Management

### React Contexts
1. **AuthContext** - User authentication
2. **LanguageContext** - i18n
3. **ThemeContext** - Dark/light mode

### Local State
- Component-level `useState`
- Form state management
- UI state (modals, tabs, etc.)

### Server State
- Supabase real-time subscriptions
- Optimistic updates
- Error handling

---

## 🧩 Component Architecture

### Design Patterns
- **Composition**: Small, reusable components
- **Container/Presentational**: Separation of concerns
- **Custom Hooks**: Shared logic extraction
- **Error Boundaries**: Graceful error handling

### Component Types
```typescript
// Presentation Components
- LandingPage
- ThemeSwitch
- GlobalSearch

// Container Components
- App
- ProgressDashboard
- BehaviorDiary

// Context Providers
- AuthProvider
- ThemeProvider
- LanguageProvider
```

---

## 🔍 Search Implementation

### Global Search
```typescript
// components/GlobalSearch.tsx
- Real-time filtering
- Keyboard shortcuts (Cmd/Ctrl+K)
- Arrow key navigation
- Categorized results
- Modal UI
```

**Searchable Items:**
- All major features (15+)
- Categorized by type
- Fuzzy matching support

---

## 📈 Performance Monitoring

### Metrics to Track
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Tools
- Lighthouse (Chrome DevTools)
- Web Vitals extension
- Network panel analysis
- Bundle analyzer

---

## 🔒 Data Privacy

### Compliance
- **GDPR Ready**: User data control
- **HIPAA Considerations**: Medical data handling
- **Local Storage**: Browser-based caching
- **Data Export**: User data portability
- **No Tracking**: No third-party analytics

### User Rights
- ✅ Access their data
- ✅ Export their data
- ✅ Delete their account
- ✅ Control sharing

---

## 🚨 Error Logging

### Error Boundary
- Catches React errors
- Logs to console
- Shows user-friendly UI
- Provides recovery options

### Future Improvements
- Integration with error tracking (Sentry)
- User feedback collection
- Error rate monitoring
- Automated alerts

---

## 🔧 Environment Variables

### Required
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Optional
```env
VITE_APP_NAME=ChildNeuroScan
VITE_APP_URL=https://childneuroscan.com
NODE_ENV=production
```

---

## 📚 Code Quality

### TypeScript
- Strict mode enabled
- Type safety enforced
- Interface definitions
- Generic types

### ESLint
- React best practices
- TypeScript rules
- Import organization
- Code style consistency

### Best Practices
- Component composition
- Single responsibility
- DRY principle
- Clean code standards

---

## 🎯 Future Optimizations

### Performance
- [ ] Code splitting by route
- [ ] Image optimization (WebP)
- [ ] Font subsetting
- [ ] Service worker caching

### Features
- [ ] Push notifications
- [ ] Offline mode
- [ ] Background sync
- [ ] IndexedDB storage

### Developer Experience
- [ ] Storybook integration
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline

---

**Last Updated:** February 24, 2026
**Version:** 2.0.0
