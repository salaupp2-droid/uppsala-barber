# Guía de Configuración Rápida - UPPSALA BARBER

## 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Admin (opcional - cambiar contraseñas)
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=uppsala2024
```

### Obtener las credenciales de Supabase:

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Settings > API
3. Copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Instalar Dependencias

```bash
npm install
```

## 3. Base de Datos

La base de datos ya está configurada con:
- ✅ Tablas creadas (barbers, services, appointments, media)
- ✅ Datos de ejemplo (Hugo y Miguel)
- ✅ Servicios cargados
- ✅ Row Level Security configurado

## 4. Reemplazar Imágenes

### Logo Principal
Ya está usando la imagen proporcionada:
- `public/Imagen de WhatsApp 2025-11-16 a las 12.47.37_3992471e.jpg`

### Fotos de Barberos
Reemplaza estos archivos con fotos reales:
- `public/barbers/hugo.jpg` (400x400px recomendado)
- `public/barbers/miguel.jpg` (400x400px recomendado)

### Galería de Trabajos
Agrega fotos reales en `public/gallery/`:
- Para Hugo: `hugo-1.jpg`, `hugo-2.jpg`, etc.
- Para Miguel: `miguel-1.jpg`, `miguel-2.jpg`, etc.
- Generales: `general-1.jpg`, `general-2.jpg`, etc.

Luego actualiza la base de datos con las nuevas rutas (ver README.md).

## 5. Ejecutar el Proyecto

### Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Producción
```bash
npm run build
npm run start
```

## 6. Acceder al Panel Admin

1. Ve a [http://localhost:3000/admin](http://localhost:3000/admin)
2. Usuario: `admin` (o el que configuraste)
3. Contraseña: `uppsala2024` (o la que configuraste)

## 7. Personalización

### Cambiar Información de Barberos

Ve a Supabase > Table Editor > barbers y edita:
- Nombre
- Bio
- Instagram
- WhatsApp
- URL de foto

### Agregar/Editar Servicios

Ve a Supabase > Table Editor > services y modifica:
- Nombre del servicio
- Descripción
- Precio (en guaraníes)

### Agregar Fotos a la Galería

1. Sube la imagen a `public/gallery/`
2. En Supabase > Table Editor > media, crea un nuevo registro:
   - `barber_id`: Selecciona Hugo/Miguel o deja vacío para galería general
   - `type`: 'photo' o 'video'
   - `url`: '/gallery/nombre-de-tu-imagen.jpg'
   - `description`: Descripción del trabajo (opcional)

### Cambiar Colores del Tema

Edita `app/globals.css` - busca las variables CSS:
- `--primary`: Color principal (fucsia)
- `--secondary`: Color secundario (violeta)
- `--accent`: Color de acento (amarillo)

## 8. Mapa de Google

Actualiza el iframe del mapa en:
- `components/sections/contact-section.tsx`

1. Ve a [Google Maps](https://www.google.com/maps)
2. Busca "Tomás R. Pereira, Encarnación"
3. Clic en "Compartir" > "Insertar un mapa"
4. Copia el código del iframe
5. Reemplaza el iframe existente

## ¿Problemas?

### No aparecen los datos
- Verifica que las variables de entorno estén bien configuradas
- Revisa que la URL de Supabase sea correcta
- Confirma que las RLS policies estén activas

### Error al reservar
- Verifica que ambos barberos existan en la BD
- Confirma que haya servicios cargados
- Revisa la consola del navegador para errores

### Imágenes no se ven
- Verifica que las rutas sean correctas (empiezan con `/`)
- Asegúrate de que los archivos existan en `public/`
- Limpia caché del navegador

## Contacto del Proyecto

- Instagram UPPSALA: [@uppsala_enc](https://www.instagram.com/uppsala_enc)
- Hugo: [@hug0._mrt](https://www.instagram.com/hug0._mrt)
- Miguel: [@miguel_barb3r_](https://www.instagram.com/miguel_barb3r_)
