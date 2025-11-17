# 🚀 Guía de Despliegue - UPPSALA BARBER

## Opciones de Hosting

Este proyecto puede desplegarse en múltiples plataformas. Aquí las más recomendadas:

---

## 1. Vercel (Recomendado) ⭐

### Ventajas
- Integración perfecta con Next.js
- Deploy automático desde Git
- SSL gratuito
- CDN global
- **GRATIS** para proyectos personales

### Pasos

1. **Sube tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "UPPSALA BARBER - Proyecto completo"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/uppsala-barber.git
   git push -u origin main
   ```

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - "Import Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará Next.js automáticamente

3. **Configura Variables de Entorno**
   En Vercel Dashboard > Settings > Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   NEXT_PUBLIC_ADMIN_USERNAME=admin
   NEXT_PUBLIC_ADMIN_PASSWORD=tu_password_seguro
   ```

4. **Deploy**
   - Clic en "Deploy"
   - ¡Listo! Tu sitio estará en `https://uppsala-barber.vercel.app`

---

## 2. Netlify

### Ventajas
- Fácil de usar
- SSL gratuito
- Forms y Functions incluidos
- **GRATIS** para proyectos pequeños

### Pasos

1. **Build local**
   ```bash
   npm run build
   ```
   Esto genera la carpeta `out/`

2. **Deploy en Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - "Add new site" > "Deploy manually"
   - Arrastra la carpeta `out/`

3. **Configura Variables de Entorno**
   En Site settings > Environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_ADMIN_USERNAME=...
   NEXT_PUBLIC_ADMIN_PASSWORD=...
   ```

4. **Redeploy**
   - Build and deploy > Trigger deploy

---

## 3. GitHub Pages

### Ventajas
- **Totalmente GRATIS**
- Hosting directo desde tu repositorio
- Fácil actualización

### Pasos

1. **Configura para GitHub Pages**

   Edita `next.config.js`:
   ```javascript
   const nextConfig = {
     output: 'export',
     basePath: '/uppsala-barber', // nombre de tu repo
     images: { unoptimized: true },
   };
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   cd out
   git init
   git add .
   git commit -m "Deploy"
   git branch -M gh-pages
   git remote add origin https://github.com/tu-usuario/uppsala-barber.git
   git push -f origin gh-pages
   ```

4. **Configurar en GitHub**
   - Settings > Pages
   - Source: gh-pages branch
   - Save

Tu sitio estará en: `https://tu-usuario.github.io/uppsala-barber`

---

## 4. Servidor Propio (VPS)

### Requisitos
- Servidor con Node.js
- Dominio propio (opcional)
- SSL (Let's Encrypt)

### Pasos

1. **Copia el proyecto al servidor**
   ```bash
   scp -r . usuario@tu-servidor:/var/www/uppsala-barber
   ```

2. **En el servidor**
   ```bash
   cd /var/www/uppsala-barber
   npm install
   npm run build
   ```

3. **Configura PM2 o similar**
   ```bash
   npm install -g pm2
   pm2 start npm --name "uppsala-barber" -- start
   pm2 save
   ```

4. **Configura Nginx**
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL con Let's Encrypt**
   ```bash
   sudo certbot --nginx -d tu-dominio.com
   ```

---

## Configuración Post-Deploy

### 1. Variables de Entorno
Asegúrate de configurar en tu plataforma elegida:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_USERNAME`
- `NEXT_PUBLIC_ADMIN_PASSWORD`

### 2. Dominio Personalizado (Opcional)

#### En Vercel:
- Settings > Domains > Add
- Agrega tu dominio
- Configura DNS según instrucciones

#### En Netlify:
- Domain settings > Add custom domain
- Configura DNS

### 3. Analytics (Opcional)

Puedes agregar:
- Google Analytics
- Vercel Analytics
- Plausible
- Umami

---

## Actualizar el Sitio

### Desde Git (Vercel/Netlify con GitHub)
```bash
git add .
git commit -m "Actualización"
git push
```
El deploy se hace automáticamente.

### Manual (Netlify)
```bash
npm run build
# Arrastra carpeta out/ a Netlify
```

### Servidor Propio
```bash
git pull
npm install
npm run build
pm2 restart uppsala-barber
```

---

## Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Imágenes reemplazadas (barbers y gallery)
- [ ] Mapa de Google actualizado
- [ ] Contraseña de admin cambiada
- [ ] Build exitoso (`npm run build`)
- [ ] Probado localmente
- [ ] Supabase URL y Key correctas
- [ ] RLS configurado en Supabase

---

## Monitoreo y Mantenimiento

### Logs en Vercel
- Dashboard > Deployments > View logs

### Logs en Servidor Propio
```bash
pm2 logs uppsala-barber
```

### Backups de Base de Datos
Supabase hace backups automáticos, pero puedes:
```sql
-- Exportar appointments
SELECT * FROM appointments WHERE date >= CURRENT_DATE;
```

---

## Performance Tips

1. **Optimizar Imágenes**
   - Usa formatos modernos (WebP, AVIF)
   - Comprime antes de subir
   - Tamaño recomendado: 800x800px max

2. **CDN**
   - Vercel y Netlify incluyen CDN
   - Para servidor propio: Cloudflare

3. **Caché**
   - Las páginas estáticas se cachean automáticamente
   - Supabase tiene rate limiting por defecto

---

## Soporte

### Problemas Comunes

**"No se conecta a Supabase"**
- Verifica las variables de entorno
- Confirma que la URL termina en `.supabase.co`
- Revisa que la ANON KEY sea correcta

**"Admin no funciona"**
- Verifica usuario/contraseña en variables de entorno
- Limpia localStorage del navegador
- Usa modo incógnito para probar

**"Imágenes no cargan"**
- Verifica rutas (deben empezar con `/`)
- Confirma que existen en `public/`
- En GitHub Pages, ajusta basePath

---

## URLs de Referencia

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deploy**: https://nextjs.org/docs/deployment
- **Supabase Docs**: https://supabase.com/docs

---

## 🎉 ¡Éxito!

Tu sitio estará online y listo para recibir clientes de UPPSALA BARBER.

**Recuerda compartir la URL con:**
- [@uppsala_enc](https://instagram.com/uppsala_enc)
- [@hug0._mrt](https://instagram.com/hug0._mrt)
- [@miguel_barb3r_](https://instagram.com/miguel_barb3r_)
