# Guía de Despliegue en Antigravity

## Pasos para Desplegar ChildNeuroScan en Antigravity

### 1. Preparación del Proyecto

El proyecto ya está listo para desplegar. Incluye:
- ✅ Configuración de build optimizada
- ✅ Variables de entorno configuradas
- ✅ Enrutamiento SPA configurado
- ✅ Headers de seguridad
- ✅ Caché optimizado

### 2. Conectar con Antigravity

#### Opción A: Desde GitHub
1. Sube tu código a GitHub si aún no lo has hecho
2. Ve a [Antigravity Dashboard](https://antigravity.com)
3. Crea un nuevo proyecto
4. Conecta tu repositorio de GitHub
5. Selecciona la rama `main` o `master`

#### Opción B: Deploy Directo
1. Instala Antigravity CLI:
   ```bash
   npm install -g antigravity-cli
   ```

2. Inicia sesión:
   ```bash
   antigravity login
   ```

3. Despliega el proyecto:
   ```bash
   antigravity deploy
   ```

### 3. Configurar Variables de Entorno

En el dashboard de Antigravity, configura estas variables de entorno:

**IMPORTANTE**: Estas son las credenciales de tu proyecto Supabase

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

Para obtener estos valores:
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon/public key** → VITE_SUPABASE_ANON_KEY

### 4. Configuración de Build

Antigravity detectará automáticamente que es un proyecto Vite, pero asegúrate de que la configuración sea:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x
- **Install Command**: `npm install`

### 5. Configurar Dominio (Opcional)

1. En Antigravity Dashboard, ve a tu proyecto
2. Click en "Domains"
3. Agrega tu dominio personalizado
4. Configura los DNS según las instrucciones de Antigravity

### 6. Verificar el Despliegue

Una vez desplegado, verifica:

- ✅ La aplicación carga correctamente
- ✅ El login/registro funciona
- ✅ Las evaluaciones se guardan en Supabase
- ✅ Las imágenes y recursos cargan correctamente
- ✅ El responsive funciona en móvil

### 7. Configuración Adicional

#### A. Redirecciones SPA
Ya está configurado en `antigravity.json` para redirigir todas las rutas a `index.html`

#### B. Headers de Seguridad
Los headers de seguridad están pre-configurados:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

#### C. Caché
Los assets estáticos tienen caché de 1 año para optimizar la carga

### 8. Troubleshooting

#### Error: "VITE_SUPABASE_URL is not defined"
- Verifica que las variables de entorno estén configuradas en Antigravity
- Asegúrate de que tengan el prefijo `VITE_`
- Redespliega después de agregar las variables

#### Error: "Failed to fetch"
- Verifica que la URL de Supabase sea correcta
- Asegúrate de que el proyecto Supabase esté activo
- Revisa que las políticas RLS estén configuradas correctamente

#### La página muestra 404
- Verifica que la configuración de rutas esté en `antigravity.json`
- Asegúrate de que el directorio de output sea `dist`

### 9. Monitoreo

Antigravity proporciona:
- Analytics de tráfico
- Logs de errores en tiempo real
- Métricas de rendimiento
- Notificaciones de builds

### 10. Actualizaciones

Para actualizar la aplicación:

**Con Git:**
```bash
git add .
git commit -m "Actualización"
git push
```
Antigravity desplegará automáticamente los cambios.

**Con CLI:**
```bash
antigravity deploy
```

## Comandos Útiles

```bash
# Ver estado del proyecto
antigravity status

# Ver logs en tiempo real
antigravity logs --follow

# Lista de despliegues
antigravity deployments

# Rollback a versión anterior
antigravity rollback

# Variables de entorno
antigravity env ls
antigravity env add VARIABLE=valor
```

## Recursos Adicionales

- [Documentación de Antigravity](https://docs.antigravity.com)
- [Documentación de Supabase](https://supabase.com/docs)
- [Soporte de ChildNeuroScan](https://github.com/tuusuario/childneuroscan/issues)

## Checklist Final

- [ ] Código subido a GitHub
- [ ] Proyecto conectado en Antigravity
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Login funciona correctamente
- [ ] Base de datos Supabase conectada
- [ ] Dominio configurado (si aplica)
- [ ] SSL/HTTPS activo
- [ ] Responsive verificado
- [ ] Pruebas de funcionalidad completadas

---

¡Tu aplicación ChildNeuroScan está lista para ayudar a familias a monitorear el desarrollo infantil! 🎉
