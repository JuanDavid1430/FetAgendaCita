# Documentación de la API - FetAgenda

Base URL: `http://localhost:3000/api`

## 🔓 Endpoints Públicos (No requieren autenticación)

### Health Check
```
GET /health
```
Verifica que el servidor esté funcionando correctamente.

**Response:**
```json
{
  "status": "OK",
  "message": "Backend FetAgenda funcionando correctamente",
  "timestamp": "2025-10-11T12:00:00.000Z"
}
```

---

## 🔐 Autenticación

### Login
```
POST /auth/login
```
Inicia sesión como administrador.

**Body:**
```json
{
  "email": "admin@fetagenda.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "administrador": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@fetagenda.com",
    "telefono": "1234567890"
  }
}
```

### Obtener Perfil (Requiere Token)
```
GET /auth/perfil
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "nombre": "Administrador",
  "email": "admin@fetagenda.com",
  "telefono": "1234567890",
  "activo": true,
  "created_at": "2025-10-11T12:00:00.000Z"
}
```

### Cambiar Contraseña (Requiere Token)
```
PUT /auth/cambiar-password
Authorization: Bearer {token}
```

**Body:**
```json
{
  "passwordActual": "admin123",
  "nuevoPassword": "nueva_contraseña_segura"
}
```

---

## 🛍️ Servicios

### Listar Servicios Activos (Público)
```
GET /servicios/activos
```

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Corte de Cabello",
    "descripcion": "Corte de cabello para hombre o mujer",
    "duracion": 30,
    "precio": 15.00,
    "activo": true
  }
]
```

### Obtener un Servicio (Público)
```
GET /servicios/:id
```

### Listar Todos los Servicios (Admin)
```
GET /servicios
Authorization: Bearer {token}
```

### Crear Servicio (Admin)
```
POST /servicios
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Consulta Médica",
  "descripcion": "Consulta general",
  "duracion": 45,
  "precio": 50.00
}
```

### Actualizar Servicio (Admin)
```
PUT /servicios/:id
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Consulta Médica Actualizada",
  "descripcion": "Consulta general completa",
  "duracion": 60,
  "precio": 60.00,
  "activo": true
}
```

### Eliminar Servicio (Admin)
```
DELETE /servicios/:id
Authorization: Bearer {token}
```

---

## 📅 Reservas

### Crear Reserva (Público)
```
POST /reservas
```

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "555-1234",
  "servicio_id": 1,
  "fecha": "2025-10-15",
  "hora_inicio": "10:00",
  "notas": "Primera vez"
}
```

**Response:**
```json
{
  "mensaje": "Reserva creada exitosamente",
  "id": 123,
  "reserva": {
    "id": 123,
    "cliente_id": 45,
    "servicio_id": 1,
    "fecha": "2025-10-15",
    "hora_inicio": "10:00:00",
    "hora_fin": "10:30:00",
    "estado": "pendiente"
  }
}
```

### Obtener Disponibilidad (Público)
```
GET /reservas/disponibilidad?fecha=2025-10-15&servicio_id=1
```

**Response:**
```json
{
  "disponible": true,
  "horario": {
    "inicio": "09:00:00",
    "fin": "17:00:00"
  },
  "duracion": 30,
  "reservasExistentes": [
    {
      "hora_inicio": "10:00:00",
      "hora_fin": "10:30:00"
    }
  ]
}
```

### Listar Reservas (Admin)
```
GET /reservas?fecha=2025-10-15&estado=pendiente
Authorization: Bearer {token}
```

**Query Parameters:**
- `fecha`: Filtrar por fecha específica (YYYY-MM-DD)
- `estado`: Filtrar por estado (pendiente, confirmada, completada, cancelada)
- `fecha_desde`: Fecha inicio del rango (YYYY-MM-DD)
- `fecha_hasta`: Fecha fin del rango (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": 123,
    "cliente_id": 45,
    "servicio_id": 1,
    "fecha": "2025-10-15",
    "hora_inicio": "10:00:00",
    "hora_fin": "10:30:00",
    "estado": "pendiente",
    "notas": "Primera vez",
    "cliente_nombre": "Juan Pérez",
    "cliente_email": "juan@example.com",
    "cliente_telefono": "555-1234",
    "servicio_nombre": "Corte de Cabello",
    "duracion": 30,
    "precio": 15.00
  }
]
```

### Obtener una Reserva (Admin)
```
GET /reservas/:id
Authorization: Bearer {token}
```

### Actualizar Estado de Reserva (Admin)
```
PUT /reservas/:id/estado
Authorization: Bearer {token}
```

**Body:**
```json
{
  "estado": "confirmada"
}
```

Estados válidos:
- `pendiente`
- `confirmada`
- `completada`
- `cancelada`

### Cancelar Reserva (Admin)
```
PUT /reservas/:id/cancelar
Authorization: Bearer {token}
```

### Obtener Estadísticas (Admin)
```
GET /reservas/estadisticas?fecha_inicio=2025-10-01&fecha_fin=2025-10-31
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total_reservas": 100,
  "completadas": 75,
  "canceladas": 10,
  "pendientes": 15
}
```

---

## ⚙️ Configuración

Todos los endpoints de configuración requieren autenticación de administrador.

### Listar Horarios de Trabajo
```
GET /configuracion/horarios
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "dia_semana": 1,
    "hora_inicio": "09:00:00",
    "hora_fin": "17:00:00",
    "activo": true
  }
]
```

Días de la semana:
- `0` = Domingo
- `1` = Lunes
- `2` = Martes
- `3` = Miércoles
- `4` = Jueves
- `5` = Viernes
- `6` = Sábado

### Actualizar Horario de Trabajo
```
PUT /configuracion/horarios/:dia_semana
Authorization: Bearer {token}
```

**Body:**
```json
{
  "hora_inicio": "08:00:00",
  "hora_fin": "18:00:00",
  "activo": true
}
```

### Listar Días Bloqueados
```
GET /configuracion/dias-bloqueados
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "fecha": "2025-12-25",
    "motivo": "Navidad",
    "created_at": "2025-10-11T12:00:00.000Z"
  }
]
```

### Crear Día Bloqueado
```
POST /configuracion/dias-bloqueados
Authorization: Bearer {token}
```

**Body:**
```json
{
  "fecha": "2025-12-25",
  "motivo": "Navidad"
}
```

### Eliminar Día Bloqueado
```
DELETE /configuracion/dias-bloqueados/:id
Authorization: Bearer {token}
```

---

## 🚨 Códigos de Respuesta HTTP

- `200` - OK: Petición exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Datos inválidos o faltantes
- `401` - Unauthorized: No autenticado o token inválido
- `404` - Not Found: Recurso no encontrado
- `409` - Conflict: Conflicto (ej: horario ya reservado)
- `500` - Internal Server Error: Error del servidor

## 📝 Formato de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "error": "Descripción del error"
}
```

Ejemplos:
```json
{
  "error": "Token no proporcionado"
}
```

```json
{
  "error": "Ya existe una reserva en ese horario"
}
```

---

## 🧪 Ejemplos de Uso con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fetagenda.com","password":"admin123"}'
```

### Listar Servicios
```bash
curl http://localhost:3000/api/servicios/activos
```

### Crear Reserva
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "555-1234",
    "servicio_id": 1,
    "fecha": "2025-10-15",
    "hora_inicio": "10:00"
  }'
```

### Crear Servicio (Admin)
```bash
curl -X POST http://localhost:3000/api/servicios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "nombre": "Masaje",
    "descripcion": "Masaje relajante",
    "duracion": 60,
    "precio": 40.00
  }'
```
