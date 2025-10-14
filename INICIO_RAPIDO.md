# 🚀 Guía de Inicio Rápido - FetAgendaCita

## ⚠️ IMPORTANTE: Debes configurar la base de datos antes de usar la aplicación

Sigue estos pasos **en orden**:

---

## 📋 Paso 1: Verificar Requisitos

Asegúrate de tener instalado:
- ✅ Node.js 18 o superior
- ✅ MySQL 8.0 o superior
- ✅ npm (viene con Node.js)

Verifica las versiones:
```bash
node --version
npm --version
mysql --version
```

---

## 🗄️ Paso 2: Configurar MySQL

### Opción A: Línea de comandos

1. **Abrir MySQL:**
```bash
mysql -u root -p
```
Ingresa tu contraseña (en tu caso: `12345`)

2. **Crear la base de datos:**
```sql
CREATE DATABASE IF NOT EXISTS Fetagenda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

3. **Ejecutar el script de creación de tablas:**
```bash
mysql -u root -p Fetagenda < database/schema.sql
```

### Opción B: MySQL Workbench

1. Abre MySQL Workbench
2. Conecta con usuario `root` y contraseña `12345`
3. Haz clic en "File" → "Open SQL Script"
4. Selecciona el archivo `database/schema.sql`
5. Presiona el botón de ejecutar (⚡) o presiona Ctrl+Shift+Enter

---

## ⚙️ Paso 3: Configurar Variables de Entorno

El archivo `.env` ya está creado con tu configuración:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345
DB_NAME=Fetagenda
```

Si necesitas cambiar algo, edita el archivo `.env` en la raíz del proyecto.

---

## 📦 Paso 4: Verificar Instalación de Dependencias

Las dependencias ya deberían estar instaladas, pero si no:
```bash
npm install
```

---

## 🎬 Paso 5: Iniciar la Aplicación

### Opción A: Iniciar Backend y Frontend juntos (Recomendado)
```bash
npm run dev
```

Esto iniciará:
- Backend en: http://localhost:3000
- Frontend en: http://localhost:4200

### Opción B: Iniciar por separado

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm start
```

---

## ✅ Paso 6: Verificar que Todo Funciona

### Probar el Backend

Abre tu navegador y ve a:
```
http://localhost:3000/api/health
```

Deberías ver:
```json
{
  "status": "OK",
  "message": "Backend FetAgenda funcionando correctamente",
  "timestamp": "2025-10-11T..."
}
```

### Probar el Frontend

Abre tu navegador y ve a:
```
http://localhost:4200
```

---

## 🔑 Credenciales de Administrador

Para acceder al panel de administración:

- **URL:** http://localhost:4200/admin/login (cuando crees el componente)
- **Email:** admin@fetagenda.com
- **Contraseña:** admin123

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción.

---

## 🧪 Probar la API con cURL

### 1. Verificar servicios disponibles:
```bash
curl http://localhost:3000/api/servicios/activos
```

### 2. Hacer login como admin:
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@fetagenda.com\",\"password\":\"admin123\"}"
```

Nota: En PowerShell, usa `^` para continuar en la siguiente línea. En bash/linux usa `\`.

---

## 🚨 Solución de Problemas

### ❌ Error: "Cannot connect to database"

**Causa:** MySQL no está corriendo o las credenciales son incorrectas.

**Solución:**
1. Verifica que MySQL esté corriendo:
   ```bash
   # Windows - Servicios
   services.msc
   # Busca "MySQL" y asegúrate que esté en "Running"
   ```

2. Verifica las credenciales en `.env`

3. Prueba conectar manualmente:
   ```bash
   mysql -u root -p
   ```

### ❌ Error: "Database does not exist"

**Causa:** No has ejecutado el script de creación de la base de datos.

**Solución:**
```bash
mysql -u root -p Fetagenda < database/schema.sql
```

### ❌ Error: "Port 3000 is already in use"

**Causa:** Otro proceso está usando el puerto 3000.

**Solución:**
1. Mata el proceso que usa el puerto:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. O cambia el puerto en `.env`:
   ```
   PORT=3001
   ```

### ❌ Error: "Port 4200 is already in use"

**Causa:** Angular ya está corriendo en otra terminal.

**Solución:**
1. Cierra la otra instancia o usa otro puerto:
   ```bash
   ng serve --port 4201
   ```

---

## 📁 Estructura de Archivos Creados

```
FetAgendaCita/
├── .env                        ✅ Variables de entorno
├── package.json                ✅ Dependencias y scripts
├── README.md                   ✅ Documentación principal
├── INICIO_RAPIDO.md           ✅ Esta guía
├── PROYECTO_ESTADO.md         ✅ Estado del proyecto
│
├── backend/                    ✅ Backend completo
│   ├── config/
│   │   └── database.js        ✅ Conexión MySQL
│   ├── controllers/           ✅ 4 controladores
│   ├── middleware/            ✅ Autenticación JWT
│   ├── models/                ✅ 6 modelos de datos
│   ├── routes/                ✅ 4 archivos de rutas
│   ├── utils/                 ✅ Utilidades
│   ├── server.js              ✅ Servidor principal
│   └── API_DOCUMENTATION.md   ✅ Documentación API
│
├── database/
│   ├── schema.sql             ✅ Script de creación
│   └── SETUP.md               ✅ Guía de setup
│
└── src/app/
    ├── guards/                ✅ Auth guard
    ├── interceptors/          ✅ HTTP interceptor
    ├── models/                ✅ Interfaces TypeScript
    └── services/              ✅ 4 servicios Angular
```

---

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. **Revisa** `PROYECTO_ESTADO.md` para ver qué falta
2. **Lee** `backend/API_DOCUMENTATION.md` para conocer todos los endpoints
3. **Comienza** a crear los componentes Angular
4. **Consulta** los servicios ya creados en `src/app/services/`

---

## 📞 ¿Necesitas Ayuda?

- **Estado del proyecto:** Lee `PROYECTO_ESTADO.md`
- **Documentación API:** Lee `backend/API_DOCUMENTATION.md`
- **Setup de BD:** Lee `database/SETUP.md`
- **Documentación completa:** Lee `README.md`

---

## 🎓 Recursos de Aprendizaje

- **Angular:** https://angular.io/docs
- **FullCalendar:** https://fullcalendar.io/docs/angular
- **Express.js:** https://expressjs.com/
- **MySQL:** https://dev.mysql.com/doc/

---

¡Todo listo! Ahora puedes comenzar a desarrollar los componentes de la interfaz. 🚀
