# ✅ Deployment Checklist - ChildNeuroScan

Use esta checklist para asegurar un deployment exitoso.

---

## Pre-Deploy (Local)

### 1. Verificación de Código
- [ ] `npm run build` funciona sin errores
- [ ] `npm run typecheck` pasa sin errores
- [ ] No hay console.log en el código (excepto en lib/logger.ts)
- [ ] Archivo `.env` NO está en Git (verificar .gitignore)
- [ ] Archivo `.env.example` SÍ está en Git

### 2. Verificación de Configuración
- [ ] `netlify.toml` existe y está configurado
- [ ] `vercel.json` existe (si usas Vercel)
- [ ] `package.json` tiene scripts de build correctos
- [ ] Service worker (`public/sw.js`) está actualizado

### 3. Testing Local
- [ ] App funciona en `npm run dev`
- [ ] Login/SignUp funciona
- [ ] Puedes hacer un screening completo
- [ ] Dashboard carga datos correctamente
- [ ] Funciona en modo offline
- [ ] Dark mode funciona
- [ ] Cambio de idioma funciona

---

## Supabase Setup

### 1. Base de Datos
- [ ] Proyecto de Supabase creado
- [ ] Todas las migraciones aplicadas (revisa `/supabase/migrations/`)
- [ ] Tablas tienen RLS (Row Level Security) habilitado
- [ ] Policies de RLS están configuradas
- [ ] Puedes conectarte desde local

### 2. Credenciales
- [ ] Tienes tu `SUPABASE_URL` (ej: https://xyz.supabase.co)
- [ ] Tienes tu `SUPABASE_ANON_KEY` (la llave pública)
- [ ] Las credenciales funcionan en local

### 3. Configuración de Auth
- [ ] Email/Password auth está habilitado
- [ ] Email confirmation está DESHABILITADO (para testing)
- [ ] Site URL configurado en Supabase Auth settings

---

## Git & GitHub

### 1. Repositorio Local
- [ ] Git inicializado (`git init`)
- [ ] Primer commit hecho
- [ ] `.gitignore` incluye `.env`
- [ ] `.gitignore` incluye `node_modules`
- [ ] `.gitignore` incluye `dist`

### 2. GitHub
- [ ] Repositorio creado en GitHub
- [ ] Remote añadido (`git remote add origin ...`)
- [ ] Push inicial hecho (`git push -u origin main`)
- [ ] Código visible en GitHub

Comandos:
```bash
git init
git add .
git commit -m "Initial commit - ChildNeuroScan v2.1"
git remote add origin https://github.com/TU_USUARIO/childneuroscan.git
git branch -M main
git push -u origin main
```

---

## Deploy a Netlify

### 1. Cuenta de Netlify
- [ ] Cuenta creada en [netlify.com](https://netlify.com)
- [ ] GitHub conectado a Netlify

### 2. Deploy desde GitHub
- [ ] Nuevo sitio creado desde GitHub repo
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Variables de entorno añadidas:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`

### 3. Deploy Manual (Alternativa)
- [ ] `npm run build` ejecutado localmente
- [ ] Carpeta `dist` arrastrada a Netlify
- [ ] Variables de entorno añadidas después

---

## Post-Deploy

### 1. Verificación de URL
- [ ] Sitio está accesible (ej: https://tu-app.netlify.app)
- [ ] HTTPS funciona automáticamente
- [ ] No hay errores 404 en las rutas

### 2. Testing en Producción
- [ ] Landing page carga correctamente
- [ ] Login/SignUp funciona
- [ ] Puedes crear una cuenta nueva
- [ ] Puedes hacer login con cuenta existente
- [ ] Puedes completar un screening
- [ ] Los datos se guardan en Supabase
- [ ] Dashboard muestra los datos correctos
- [ ] Todos los features funcionan:
  - [ ] Progress Dashboard
  - [ ] Report Generator
  - [ ] Resource Finder
  - [ ] Community
  - [ ] Video Library
  - [ ] Appointment Prep
  - [ ] Photo Journal
  - [ ] Goal Tracker
  - [ ] Medication Tracker
  - [ ] Behavior Diary
  - [ ] Crisis Plan
  - [ ] Rewards System
  - [ ] Visual Schedule
  - [ ] Sensory Profile
  - [ ] Analytics Dashboard

### 3. Testing en Dispositivos
- [ ] Funciona en iPhone (Safari)
- [ ] Funciona en Android (Chrome)
- [ ] Funciona en iPad
- [ ] Funciona en Desktop (Chrome)
- [ ] Funciona en Desktop (Firefox)
- [ ] Funciona en Desktop (Safari)

### 4. Performance Check
- [ ] Carga en < 3 segundos en 3G
- [ ] Animaciones son suaves
- [ ] No hay errores en la consola
- [ ] Service Worker se instala correctamente

---

## Supabase Producción

### 1. Auth Configuration
- [ ] Ve a Supabase → Authentication → URL Configuration
- [ ] Añade tu URL de producción:
  ```
  Site URL: https://tu-app.netlify.app
  ```
- [ ] Añade redirect URLs:
  ```
  Redirect URLs: https://tu-app.netlify.app/**
  ```

### 2. Database
- [ ] Verifica que los datos de producción se guardan correctamente
- [ ] Revisa los logs en Supabase
- [ ] Verifica que RLS funciona (los usuarios solo ven sus datos)

### 3. Monitoring
- [ ] Configura Email Alerts en Supabase (opcional)
- [ ] Revisa Database Usage en dashboard

---

## Dominio Custom (Opcional)

### Si tienes un dominio:
- [ ] Comprado en Namecheap/GoDaddy/etc
- [ ] Añadido en Netlify (Domain settings)
- [ ] DNS configurado correctamente
- [ ] SSL/HTTPS funcionando
- [ ] Actualizar Site URL en Supabase

---

## Analytics & Monitoring (Opcional)

### Google Analytics
- [ ] Cuenta de GA creada
- [ ] Tracking ID añadido a index.html
- [ ] Eventos funcionando

### Sentry (Error Tracking)
- [ ] Cuenta creada en sentry.io
- [ ] DSN configurado
- [ ] Errores se reportan correctamente

### Uptime Monitoring
- [ ] UptimeRobot configurado
- [ ] Recibe alerts si el sitio cae

---

## Final Checks

### 1. Security
- [ ] Variables de entorno NO están en el código
- [ ] HTTPS funciona en todo el sitio
- [ ] Headers de seguridad configurados (en netlify.toml)
- [ ] No hay API keys expuestas

### 2. SEO
- [ ] `meta` tags están en index.html
- [ ] Open Graph tags configurados
- [ ] Favicon presente
- [ ] robots.txt configurado
- [ ] sitemap.xml presente

### 3. PWA
- [ ] manifest.json configurado
- [ ] Service Worker funciona
- [ ] App se puede instalar en mobile
- [ ] Funciona offline básicamente

### 4. Documentation
- [ ] README.md actualizado
- [ ] DEPLOYMENT_GUIDE.md disponible
- [ ] Variables de entorno documentadas en .env.example

---

## Rollback Plan

Si algo sale mal:

### Netlify:
1. Ve a Deploys
2. Encuentra el deploy anterior que funcionaba
3. Haz clic en "Publish deploy"
4. ¡Revertido!

### Supabase:
1. Si algo sale mal con la DB, restaura desde backup
2. Ve a Settings → Backup
3. Restaura el backup más reciente

---

## Mantenimiento Continuo

### Cada semana:
- [ ] Revisa errores en Sentry (si lo tienes)
- [ ] Revisa analytics
- [ ] Verifica uptime

### Cada mes:
- [ ] Actualiza dependencias: `npm update`
- [ ] Revisa security advisories: `npm audit`
- [ ] Revisa usage de Supabase
- [ ] Backup de base de datos

### Cada deploy:
- [ ] Verifica que el build pasa
- [ ] Testa en producción después del deploy
- [ ] Revisa que no hay errores en consola

---

## Troubleshooting Rápido

### "Site not loading"
→ Verifica que el build pasó en Netlify
→ Revisa los logs de build

### "Cannot connect to Supabase"
→ Verifica variables de entorno en Netlify
→ Verifica URL configuration en Supabase

### "Login no funciona"
→ Añade tu dominio a Supabase Auth redirect URLs
→ Verifica que SUPABASE_ANON_KEY es correcto

### "404 en rutas"
→ Verifica que `netlify.toml` tiene el redirect
→ Re-deploy

---

## Deploy Exitoso ✅

Cuando todo esté ✅:

**¡Felicitaciones! Tu app está en producción.**

Comparte tu URL:
- Con usuarios de prueba
- En redes sociales
- En tu portfolio

Siguiente paso: **¡Conseguir usuarios reales!** 🚀

---

## Quick Commands

```bash
# Build local
npm run build

# Deploy manual a Netlify
# 1. npm run build
# 2. Arrastra carpeta 'dist' a netlify.com

# Deploy con CLI de Netlify
npm i -g netlify-cli
netlify deploy --prod

# Ver logs de build
# Ve a Netlify dashboard → Deploys → Click en el deploy → Ver logs

# Actualizar dependencias
npm update

# Check de seguridad
npm audit

# Fix de seguridad
npm audit fix
```

---

**Total tiempo estimado: 15-30 minutos para primer deploy** ⏱️

**¿Listo? ¡Vamos!** 🚀
