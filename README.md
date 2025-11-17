# UPPSALA BARBER - Temple of the Gods

Sitio web moderno y urbano para la barbería UPPSALA en Encarnación, Paraguay.

## Características

- **Diseño Urbano con Neon**: Estética oscura con toques neón en violeta, fucsia y amarillo
- **Sistema de Reservas**: Los clientes pueden reservar turnos por barbero y horario
- **Panel de Administración**: Gestión de reservas con filtros por fecha y barbero
- **Galería de Trabajos**: Muestra los mejores trabajos por barbero
- **Responsive**: Optimizado para móviles y tablets
- **Base de datos Supabase**: PostgreSQL con Row Level Security

## Tecnologías

- **Next.js 13** (App Router)
- **TypeScript**
- **TailwindCSS** con tema personalizado neon
- **Supabase** (PostgreSQL)
- **shadcn/ui** para componentes
- **date-fns** para manejo de fechas

## Configuración

### 1. Configurar variables de entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=uppsala2024
```

### 2. Base de datos

La base de datos ya está configurada con las siguientes tablas:
- `barbers` - Información de los barberos
- `services` - Lista de servicios
- `appointments` - Reservas de clientes
- `media` - Galería de fotos/videos

Los datos de ejemplo (Hugo y Miguel) ya están cargados.

### 3. Imágenes

Reemplaza las siguientes imágenes placeholder:
- `/public/barbers/hugo.jpg` - Foto de Hugo
- `/public/barbers/miguel.jpg` - Foto de Miguel
- `/public/gallery/*.jpg` - Fotos de trabajos para la galería

### 4. Instalar dependencias y ejecutar

```bash
npm install
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## Estructura del proyecto

```
├── app/
│   ├── page.tsx              # Página principal
│   ├── admin/                # Panel de administración
│   └── api/appointments/     # API endpoints
├── components/
│   ├── sections/             # Secciones de la página principal
│   ├── navbar.tsx            # Barra de navegación
│   ├── footer.tsx            # Pie de página
│   ├── barber-card.tsx       # Tarjeta de barbero
│   ├── booking-form.tsx      # Formulario de reservas
│   ├── admin-auth.tsx        # Autenticación admin
│   └── admin-dashboard.tsx   # Dashboard de reservas
├── lib/
│   └── supabase.ts          # Cliente Supabase y tipos
└── public/
    ├── barbers/             # Fotos de barberos
    └── gallery/             # Galería de trabajos
```

## Funcionalidades principales

### Sistema de Reservas

Los clientes pueden:
1. Seleccionar un barbero (Hugo o Miguel)
2. Elegir fecha en el calendario
3. Ver horarios disponibles (9:00 - 20:00)
4. Seleccionar un servicio
5. Ingresar sus datos (nombre, WhatsApp, Instagram opcional)
6. Agregar comentarios opcionales
7. Confirmar la reserva
8. Enviar mensaje por WhatsApp al barbero

La lógica previene dobles reservas para el mismo barbero y horario.

### Panel de Administración

Acceso en `/admin` con credenciales:
- Usuario: `admin` (configurable)
- Contraseña: `uppsala2024` (configurable)

Funcionalidades:
- Ver reservas por día
- Filtrar por barbero
- Marcar reservas como: Pendiente, Realizada o Cancelada
- Ver información completa de cada reserva

### Secciones del sitio

1. **Hero**: Logo, título y CTAs principales
2. **Sobre**: Descripción de la barbería y especialidades
3. **Barberos**: Perfiles de Hugo y Miguel con sus trabajos
4. **Servicios**: Lista de servicios con precios
5. **Reservar**: Sistema de reservas interactivo
6. **Galería**: Trabajos destacados
7. **Contacto**: Ubicación, WhatsApp y redes sociales

## Personalización

### Cambiar colores

Edita `app/globals.css` para cambiar la paleta de colores:
- `--primary`: Color principal (fucsia/violeta)
- `--secondary`: Color secundario (violeta)
- `--accent`: Color de acento (amarillo)

### Agregar servicios

Usa Supabase Studio o ejecuta:

```sql
INSERT INTO services (name, description, price)
VALUES ('Nuevo Servicio', 'Descripción', 100000);
```

### Agregar fotos a la galería

```sql
INSERT INTO media (barber_id, type, url, description)
VALUES ('id-del-barbero', 'photo', '/gallery/imagen.jpg', 'Descripción');
```

Para galería general (sin barbero específico), usa `NULL` en `barber_id`.

## Contacto

- Instagram: [@uppsala_enc](https://www.instagram.com/uppsala_enc)
- Hugo: [@hug0._mrt](https://www.instagram.com/hug0._mrt) | +595 976 854267
- Miguel: [@miguel_barb3r_](https://www.instagram.com/miguel_barb3r_) | +595 993 385530

## Licencia

© 2024 UPPSALA BARBER. Todos los derechos reservados.
