# Configuración de Despliegue Automático

Este proyecto está configurado para despliegue automático en Vercel. Sigue estos pasos para activarlo.

## Opción 1: Vercel (Recomendado)

### 1. Conectar tu proyecto a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Selecciona tu repositorio de GitHub
4. Haz clic en "Import"

Vercel detectará automáticamente la configuración de Vite desde `vercel.json`.

### 2. Configurar variables de entorno

En el dashboard de Vercel:

1. Ve a Settings > Environment Variables
2. Añade tus variables de Supabase:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3. Despliegue automático

Una vez conectado, cada push a `main` desplegará automáticamente tu app.

**URL de despliegue**: `https://tu-proyecto.vercel.app`

---

## Opción 2: GitHub Actions + Vercel

Si quieres usar CI/CD con GitHub Actions:

### 1. Obtener tokens de Vercel

1. Ve a [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Crea un nuevo token
3. Copia el token

### 2. Configurar secrets en GitHub

1. Ve a tu repositorio > Settings > Secrets and variables > Actions
2. Añade estos secrets:
   - `VERCEL_TOKEN`: Tu token de Vercel
   - `VERCEL_ORG_ID`: Tu ID de organización (en vercel.com/account/tokens)
   - `VERCEL_PROJECT_ID`: Tu ID de proyecto (en vercel.json o en la URL)

### 3. GitHub Actions ejecutará automáticamente

El workflow `.github/workflows/deploy.yml` hace lo siguiente:

- ✅ Descarga dependencias
- ✅ Verifica tipos (TypeScript)
- ✅ Ejecuta linter
- ✅ Compila la app
- ✅ Despliega en Vercel (solo en push a main)

---

## Opción 3: Netlify

### 1. Conectar a Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "New site from Git"
3. Selecciona tu repositorio
4. Netlify detectará automáticamente desde `netlify.toml`

### 2. Configurar variables de entorno

En el dashboard de Netlify:

1. Ve a Site settings > Build & deploy > Environment
2. Añade tus variables de Supabase

### 3. Despliegue automático

Cada push a `main` desplegará automáticamente.

---

## Opción 4: Antigravity

### 1. Conectar tu proyecto

```bash
# Desde la línea de comandos
antigravity login
antigravity link
```

### 2. Desplegar

```bash
antigravity deploy
```

---

## Verificar el despliegue

Después de hacer push a `main`:

1. Ve a tu plataforma (Vercel/Netlify/Antigravity)
2. Verifica que el build pasó los tests
3. Accede a tu URL de despliegue

Si hay errores:

- Revisa los logs del build
- Verifica que las variables de entorno estén configuradas
- Asegúrate de que `npm run build` funciona localmente

---

## Local development

Para probar localmente antes de desplegar:

```bash
npm run build  # Compilar
npm run preview  # Ver la versión de producción
```

---

## Troubleshooting

**Error: "Cannot find VITE_SUPABASE_URL"**
- Asegúrate de que las variables de entorno estén configuradas en tu plataforma de despliegue
- No necesitan el prefijo `VITE_` en las variables de GitHub

**Build falla en CI pero funciona localmente**
- Ejecuta `npm ci` en lugar de `npm install` (usamos lock file)
- Verifica la versión de Node.js (18+)

**Despliegue lento**
- Los artefactos se cachean por 5 días en GitHub Actions
- Vercel cachea dependencias automáticamente
