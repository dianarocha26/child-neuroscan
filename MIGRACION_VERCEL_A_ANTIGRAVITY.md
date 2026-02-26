# Migración de Vercel a Antigravity

## Guía Paso a Paso para Migrar tu Aplicación

### 📋 Pre-requisitos

Tu aplicación ya está funcionando en Vercel. Antes de migrar, necesitas:

1. ✅ El repositorio de GitHub conectado a Vercel
2. ✅ Las variables de entorno actuales de Vercel
3. ✅ Acceso al dashboard de Vercel

---

## 🔄 Proceso de Migración

### Paso 1: Exportar Variables de Entorno desde Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en tu proyecto "ChildNeuroScan"
3. Ve a **Settings** → **Environment Variables**
4. Anota o copia todas las variables:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
5. **IMPORTANTE**: Guarda estas credenciales en un lugar seguro

### Paso 2: Preparar el Repositorio

Tu código ya está en GitHub conectado a Vercel. No necesitas hacer cambios, pero verifica:

```bash
# Ver la rama actual
git branch

# Asegúrate de estar en main o master
git checkout main

# Verifica que todo esté actualizado
git pull origin main
```

### Paso 3: Conectar Antigravity

#### Opción A: Desde la Web (Recomendado)

1. Ve a [Antigravity Dashboard](https://app.antigravity.dev)
2. Click en **"New Project"** o **"Import Project"**
3. Conecta tu cuenta de GitHub (si no lo has hecho)
4. Selecciona el repositorio de ChildNeuroScan
5. Selecciona la rama `main` o `master`
6. Click en **"Import"**

#### Opción B: Desde CLI

```bash
# Instalar CLI de Antigravity
npm install -g antigravity-cli

# Iniciar sesión
antigravity login

# Navegar a tu proyecto local
cd /ruta/a/tu/proyecto

# Vincular y desplegar
antigravity link
antigravity deploy
```

### Paso 4: Configurar el Build en Antigravity

Antigravity detectará automáticamente la configuración, pero verifica que sea:

| Configuración | Valor |
|--------------|-------|
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node Version** | 18.x |

### Paso 5: Configurar Variables de Entorno en Antigravity

1. En Antigravity Dashboard, ve a tu proyecto
2. Click en **Settings** → **Environment Variables**
3. Agrega las mismas variables que tenías en Vercel:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

4. Selecciona el entorno: **Production**, **Preview**, **Development** (aplica a todos)
5. Click en **"Save"**

### Paso 6: Desplegar

1. Antigravity iniciará el primer build automáticamente
2. Espera a que termine (aparecerá el estado "Ready")
3. Click en el dominio generado (ej: `childneuroscan.antigravity.app`)
4. Verifica que todo funcione

### Paso 7: Probar la Aplicación

Verifica que todo funcione correctamente:

- [ ] La página principal carga
- [ ] El login funciona
- [ ] El registro funciona
- [ ] Las evaluaciones se guardan
- [ ] Los datos se cargan desde Supabase
- [ ] El diseño responsive funciona
- [ ] Las imágenes cargan correctamente

### Paso 8: Configurar Dominio Personalizado (Opcional)

Si tenías un dominio en Vercel:

1. En Antigravity, ve a **Settings** → **Domains**
2. Click en **"Add Domain"**
3. Ingresa tu dominio (ej: `childneuroscan.com`)
4. Antigravity te dará los registros DNS
5. Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.)
6. Actualiza los registros DNS:
   ```
   Tipo: A o CNAME
   Nombre: @ o www
   Valor: [el valor que te dio Antigravity]
   ```
7. Espera la propagación DNS (puede tomar 24-48 horas)

### Paso 9: Desactivar Vercel (Cuando estés listo)

**NO hagas esto hasta que Antigravity funcione al 100%**

1. Ve a Vercel Dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **General**
4. Scroll hasta abajo
5. Click en **"Delete Project"** (o simplemente pausa los deployments)

---

## 🔍 Comparación: Vercel vs Antigravity

| Característica | Vercel | Antigravity |
|----------------|--------|-------------|
| **Despliegue** | Automático con Git | Automático con Git |
| **Build Time** | ~2-3 min | ~2-3 min |
| **Variables de Entorno** | ✅ | ✅ |
| **Dominios Custom** | ✅ | ✅ |
| **SSL Automático** | ✅ | ✅ |
| **Edge Functions** | Sí | Sí |
| **Analytics** | Sí (pago) | Sí |
| **Precio** | Gratis hasta cierto límite | Verifica el plan actual |

---

## ⚠️ Problemas Comunes

### Error: "Failed to build"

**Causa**: Variables de entorno no configuradas

**Solución**:
1. Ve a Settings → Environment Variables en Antigravity
2. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Redespliega manualmente (Deployments → Redeploy)

### Error: "Page not found" en rutas

**Causa**: Falta configuración de SPA

**Solución**:
Ya está configurado en `antigravity.json`. Si el error persiste:
1. Verifica que el archivo `antigravity.json` exista
2. Redespliega el proyecto

### Error: "Cannot connect to Supabase"

**Causa**: URL o Key incorrectas

**Solución**:
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Verifica Settings → API
3. Copia nuevamente las credenciales
4. Actualiza en Antigravity
5. Redespliega

### La aplicación se ve diferente

**Causa**: Archivos estáticos no se copiaron

**Solución**:
```bash
# Verifica que la carpeta public exista
ls -la public/

# Si falta algo, commitea y pushea
git add public/
git commit -m "Add missing static files"
git push
```

---

## 📊 Monitoreo Post-Migración

### Durante las primeras 24 horas:

1. **Logs en tiempo real**:
   ```bash
   antigravity logs --follow
   ```

2. **Métricas de rendimiento**:
   - Ve a Dashboard → Analytics
   - Revisa response time
   - Revisa error rate

3. **Alertas**:
   - Configura notificaciones en Settings → Notifications
   - Recibe emails si hay errores

### Después de una semana:

- Compara el tráfico con Vercel Analytics
- Verifica que no haya pérdida de datos
- Confirma que todos los usuarios puedan acceder
- Si todo está bien, puedes eliminar el proyecto de Vercel

---

## 🆘 Soporte

Si tienes problemas:

1. **Documentación oficial**: [docs.antigravity.dev](https://docs.antigravity.dev)
2. **Soporte de Antigravity**: support@antigravity.dev
3. **Logs del build**: Ve a tu deployment en Antigravity y revisa los logs

---

## ✅ Checklist de Migración

Completa esta lista paso a paso:

- [ ] Exporté las variables de entorno de Vercel
- [ ] Mi código está actualizado en GitHub
- [ ] Creé el proyecto en Antigravity
- [ ] Conecté el repositorio correcto
- [ ] Configuré las variables de entorno en Antigravity
- [ ] El primer build fue exitoso
- [ ] La aplicación carga correctamente
- [ ] El login/registro funciona
- [ ] Supabase está conectado
- [ ] Probé en móvil y desktop
- [ ] Configuré el dominio personalizado (si aplica)
- [ ] Esperé 24 horas para verificar estabilidad
- [ ] Desactivé/eliminé el proyecto de Vercel

---

## 🎯 Comando Rápido para Migrar

Si tienes experiencia, este es el flujo rápido:

```bash
# 1. Instalar CLI
npm install -g antigravity-cli

# 2. Login
antigravity login

# 3. Navegar al proyecto
cd /ruta/a/childneuroscan

# 4. Vincular proyecto
antigravity link

# 5. Configurar variables
antigravity env add VITE_SUPABASE_URL="tu_url"
antigravity env add VITE_SUPABASE_ANON_KEY="tu_key"

# 6. Desplegar
antigravity deploy --prod

# 7. Verificar
antigravity open
```

---

**¡Éxito con tu migración!** 🚀

La migración de Vercel a Antigravity es directa y no deberías perder ningún dato ni funcionalidad.
