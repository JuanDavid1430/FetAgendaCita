# FetAgendaCita - Sistema de Reserva de Citas

Sistema web completo para la gestión de reservas de citas para negocios, desarrollado con **Angular 18** y **Node.js/Express** con **MySQL**.

## 📋 Características

### Vista del Cliente
- ✅ Ver servicios disponibles
- ✅ Seleccionar servicio y ver disponibilidad en calendario
- ✅ Horarios ocupados aparecen deshabilitados
- ✅ Formulario de reserva con validación
- ✅ Correo de confirmación automático

### Panel de Administración
- 🔐 Login protegido por contraseña
- 📅 Vista de todas las reservas (calendario/lista)
- ✅ Aprobar, cancelar o completar reservas
- ⚙️ Gestionar horarios de trabajo
- 🚫 Bloquear días específicos (feriados, vacaciones)
- 🛠️ Añadir, editar o eliminar servicios

## 🚀 Tecnologías Utilizadas

### Frontend
- Angular 18
- FullCalendar (para calendario interactivo)
- TypeScript
- CSS3

### Backend
- Node.js
- Express.js
- MySQL2 (conexión a MySQL)
- JWT (autenticación)
- Bcrypt (encriptación de contraseñas)
- Nodemailer (envío de correos)

### Base de Datos
- MySQL 8.0+

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ y npm
- MySQL 8.0+
- Angular CLI 18+

### 1. Configurar la Base de Datos

#### Crear la base de datos
```bash
mysql -u root -p
```

Dentro de MySQL:
```sql
CREATE DATABASE IF NOT EXISTS Fetagenda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

#### Ejecutar el script de creación de tablas
```bash
mysql -u root -p Fetagenda < database/schema.sql
```

#### Generar el hash de la contraseña del administrador
```bash
npm run generate-hash
```

Copia el hash generado y actualiza el archivo `database/schema.sql` en la línea del INSERT del administrador, luego vuelve a ejecutar ese INSERT.

### 2. Configurar Variables de Entorno

Edita el archivo `.env` en la raíz del proyecto con tus credenciales:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345
DB_NAME=Fetagenda
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Iniciar el Proyecto

#### Opción 1: Backend y Frontend simultáneamente (Recomendado)
```bash
npm run dev
```

#### Opción 2: Por separado

Terminal 1 - Backend:
```bash
npm run backend
```

Terminal 2 - Frontend:
```bash
npm start
```

El backend estará en: `http://localhost:3000`
El frontend estará en: `http://localhost:4200`

## 🔑 Credenciales por Defecto

**Panel de Administración:**
- Email: `admin@fetagenda.com`
- Contraseña: `admin123`

⚠️ **IMPORTANTE:** Cambia estas credenciales después del primer login.

## 📂 Estructura del Proyecto

```
FetAgendaCita/
├── backend/                    # Servidor Node.js/Express
│   ├── config/                 # Configuración de BD
│   ├── controllers/            # Controladores de rutas
│   ├── middleware/             # Middlewares (auth)
│   ├── models/                 # Modelos de datos
│   ├── routes/                 # Definición de rutas API
│   ├── utils/                  # Utilidades
│   └── server.js               # Punto de entrada del servidor
│
├── database/                   # Scripts de base de datos
│   └── schema.sql              # Schema de MySQL
│
├── src/                        # Aplicación Angular
│   ├── app/
│   │   ├── guards/             # Guards de autenticación
│   │   ├── interceptors/       # Interceptores HTTP
│   │   ├── models/             # Interfaces TypeScript
│   │   ├── services/           # Servicios Angular
│   │   └── app.routes.ts       # Rutas de la aplicación
│   └── ...
│
├── .env                        # Variables de entorno
└── package.json                # Dependencias
```

## 🛠️ API Endpoints

### Públicos (sin autenticación)
- `POST /api/auth/login` - Login de administrador
- `GET /api/servicios/activos` - Listar servicios activos
- `POST /api/reservas` - Crear una reserva
- `GET /api/reservas/disponibilidad` - Obtener disponibilidad

### Protegidos (requieren token JWT)
- Servicios (Admin): CRUD completo
- Reservas (Admin): Gestión de reservas
- Configuración (Admin): Horarios y días bloqueados

## ✨ Autor

JuanDavid1430
