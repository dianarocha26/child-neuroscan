# 🚀 Guía de Deployment - ChildNeuroScan

## Opción 1: Netlify (Recomendado) ⭐

### Por qué Netlify:
- ✅ **Gratis** para proyectos ilimitados
- ✅ **Deploy automático** cada vez que hagas push a Git
- ✅ **CDN global** - sitio súper rápido en todo el mundo
- ✅ **HTTPS gratis** automático
- ✅ **Rollbacks** fáciles si algo falla
- ✅ **Preview deploys** para cada PR
- ✅ **No requiere configuración de servidor**

### Paso 1: Crear cuenta en Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign up"
3. Usa tu cuenta de GitHub (recomendado)

### Paso 2: Subir tu código a GitHub

Si aún no tienes el código en GitHub:

```bash
# Inicializa Git (si no está inicializado)
git init

# Añade todos los archivos
git add .

# Haz tu primer commit
git commit -m "Initial commit - ChildNeuroScan ready for production"

# Crea un repo en GitHub y conecta
git remote add origin https://github.com/TU_USUARIO/childneuroscan.git
git branch -M main
git push -u origin main
```

### Paso 3: Deploy en Netlify

#### Opción A: Desde GitHub (Recomendado)

1. En Netlify, haz clic en **"Add new site" → "Import an existing project"**
2. Selecciona **"GitHub"**
3. Autoriza a Netlify
4. Busca tu repositorio **childneuroscan**
5. Configura:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. **Importante:** Añade las variables de entorno:
   - Haz clic en "Show advanced"
   - Añade estas variables:
     ```
     VITE_SUPABASE_URL = [tu_url_de_supabase]
     VITE_SUPABASE_ANON_KEY = [tu_anon_key_de_supabase]
     ```
7. Haz clic en **"Deploy site"**

#### Opción B: Deploy Manual (Drag & Drop)

Si quieres probar antes:

1. Ejecuta el build localmente:
   ```bash
   npm run build
   ```

2. Ve a Netlify y arrastra la carpeta `dist` al dashboard
3. ¡Listo! Tu sitio está en vivo

4. **Luego configura variables de entorno:**
   - Ve a "Site settings" → "Environment variables"
   - Añade:
     ```
     VITE_SUPABASE_URL = [tu_url_de_supabase]
     VITE_SUPABASE_ANON_KEY = [tu_anon_key_de_supabase]
     ```
   - Haz un nuevo deploy

### Paso 4: Configurar Dominio (Opcional)

Tu sitio estará en: `https://random-name-123456.netlify.app`

Para cambiar el nombre:
1. Ve a "Site settings" → "Change site name"
2. Elige algo como: `childneuroscan.netlify.app`

Para dominio custom:
1. Ve a "Domain settings" → "Add custom domain"
2. Sigue las instrucciones para conectar tu dominio

---

## Opción 2: Vercel (También excelente) ⭐

### Por qué Vercel:
- ✅ Igual de bueno que Netlify
- ✅ Excelente para proyectos React
- ✅ Deploy automático desde Git
- ✅ Edge Network global

### Deploy rápido:

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel

# Sigue las instrucciones interactivas
# Te preguntará por el proyecto, directorio, etc.

# Para producción
vercel --prod
```

**Variables de entorno:**
1. Ve al dashboard de Vercel
2. Tu proyecto → Settings → Environment Variables
3. Añade:
   ```
   VITE_SUPABASE_URL = [tu_url]
   VITE_SUPABASE_ANON_KEY = [tu_key]
   ```

---

## Opción 3: Cloudflare Pages

### Deploy:

```bash
# Instala Wrangler
npm i -g wrangler

# Deploy
npx wrangler pages deploy dist

# Configura variables en el dashboard
```

---

## Obtener las Credenciales de Supabase

### Paso 1: Ve a tu proyecto de Supabase

1. Abre [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** (⚙️) → **API**

### Paso 2: Copia las credenciales

Necesitas estos dos valores:

```
Project URL: https://xyzcompany.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Paso 3: Añade a tu plataforma de deploy

**Netlify:**
- Site settings → Environment variables → Add variable

**Vercel:**
- Project → Settings → Environment Variables

**Formato:**
```
Key: VITE_SUPABASE_URL
Value: https://xyzcompany.supabase.co

Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Checklist Pre-Deploy ✅

Antes de hacer deploy, verifica:

- [x] ✅ Build funciona localmente: `npm run build`
- [x] ✅ No hay errores de TypeScript
- [x] ✅ Credenciales de Supabase listas
- [x] ✅ Archivo `netlify.toml` o `vercel.json` configurado
- [x] ✅ `.env.example` existe (NO subas `.env` real)
- [x] ✅ `.gitignore` incluye `.env`

---

## Después del Deploy

### 1. Verifica que funciona:

Abre tu sitio y prueba:
- ✅ Login/SignUp funciona
- ✅ Puedes hacer un screening
- ✅ Los datos se guardan en Supabase
- ✅ Dashboard carga correctamente
- ✅ Todos los features funcionan

### 2. Configura Supabase para producción:

Ve a Supabase → Authentication → URL Configuration:

Añade tu URL de producción:
```
Site URL: https://tu-app.netlify.app
Redirect URLs: https://tu-app.netlify.app/**
```

### 3. Prueba en diferentes dispositivos:

- 📱 iPhone/Android
- 💻 Desktop
- 📱 Tablet
- 🌐 Diferentes navegadores

---

## Troubleshooting Común

### Error: "Build failed"
**Solución:** Verifica que las variables de entorno estén configuradas

### Error: "Cannot connect to Supabase"
**Solución:**
1. Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén correctos
2. En Supabase, añade tu dominio de producción en Auth settings

### Página en blanco
**Solución:**
1. Abre DevTools (F12) y revisa la consola
2. Probablemente faltan las variables de entorno
3. Re-deploy después de añadirlas

### 404 en rutas
**Solución:** Ya está resuelto en `netlify.toml` con el redirect a `/index.html`

---

## Deploy Automático (CI/CD)

Una vez conectado a GitHub:

```bash
# Haz cambios en tu código
git add .
git commit -m "Add new feature"
git push

# Netlify/Vercel automáticamente:
# 1. Detecta el push
# 2. Hace el build
# 3. Despliega la nueva versión
# 4. ¡Listo en ~2 minutos!
```

---

## Monitoreo Post-Deploy

### Analytics (Opcional)

Añade Google Analytics:

```html
<!-- En index.html, antes de </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Uptime Monitoring

Usa servicios gratis como:
- [UptimeRobot](https://uptimerobot.com) - Monitorea si tu sitio está up
- [Sentry](https://sentry.io) - Tracking de errores en producción

---

## Costos

### Gratis Forever:

**Netlify Free Plan:**
- ✅ 100 GB bandwidth/mes
- ✅ 300 build minutes/mes
- ✅ Deploy automático
- ✅ HTTPS gratis
- ✅ **Suficiente para miles de usuarios**

**Vercel Free Plan:**
- ✅ Similar a Netlify
- ✅ 100 GB bandwidth
- ✅ Unlimited proyectos

**Supabase Free Plan:**
- ✅ 500 MB database
- ✅ 1 GB storage
- ✅ 2 GB bandwidth
- ✅ 50,000 usuarios activos mensuales
- ✅ **Más que suficiente para empezar**

---

## Escalar en el Futuro

Cuando crezcas:

**Netlify Pro:** $19/mes
- 400 GB bandwidth
- Más build minutes
- Analytics incluido

**Supabase Pro:** $25/mes
- 8 GB database
- 100 GB storage
- 200 GB bandwidth
- Daily backups

---

## Resumen: Pasos Mínimos para Deploy

1. **Crea cuenta en Netlify** (2 minutos)
2. **Sube código a GitHub** (5 minutos)
3. **Conecta GitHub a Netlify** (3 minutos)
4. **Añade variables de entorno** (2 minutos)
5. **Deploy!** (automático, ~3 minutos)

**Total: ~15 minutos desde cero hasta producción** 🚀

---

## URLs Útiles

- **Netlify:** https://netlify.com
- **Vercel:** https://vercel.com
- **Supabase:** https://supabase.com
- **GitHub:** https://github.com
- **Cloudflare Pages:** https://pages.cloudflare.com

---

## ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa los logs de build en Netlify/Vercel
2. Verifica las variables de entorno
3. Consulta la documentación de Netlify
4. Pregúntame específicamente qué error estás viendo

---

**¡Tu app está 100% lista para deploy! Solo necesitas 15 minutos.** 🎉
