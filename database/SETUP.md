# Guía de Configuración de la Base de Datos

## Paso 1: Crear la Base de Datos

Abre MySQL desde la terminal o usando MySQL Workbench y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS Fetagenda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Paso 2: Ejecutar el Script de Creación de Tablas

### Opción A: Desde la terminal (recomendado)

```bash
mysql -u root -p Fetagenda < database/schema.sql
```

Introduce tu contraseña cuando se solicite (12345 según tu configuración).

### Opción B: Desde MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu servidor local (root/12345)
3. Abre el archivo `database/schema.sql`
4. Ejecuta todo el script (Ctrl+Shift+Enter)

## Paso 3: Verificar la Creación de Tablas

Ejecuta en MySQL:

```sql
USE Fetagenda;
SHOW TABLES;
```

Deberías ver las siguientes tablas:
- administradores
- clientes
- dias_bloqueados
- horarios_trabajo
- reservas
- servicios

## Paso 4: Verificar Datos Iniciales

### Verificar administrador:
```sql
SELECT id, nombre, email FROM administradores;
```

### Verificar servicios de ejemplo:
```sql
SELECT * FROM servicios;
```

### Verificar horarios de trabajo:
```sql
SELECT * FROM horarios_trabajo ORDER BY dia_semana;
```

## Credenciales del Administrador por Defecto

- **Email:** admin@fetagenda.com
- **Contraseña:** admin123

⚠️ **IMPORTANTE:** Cambia estas credenciales después del primer login en producción.

## Solución de Problemas

### Error: "Access denied for user"
- Verifica que el usuario root tenga la contraseña correcta
- Actualiza las credenciales en el archivo `.env`

### Error: "Table already exists"
- Las tablas ya fueron creadas previamente
- Puedes eliminar la base de datos y volver a crearla:
  ```sql
  DROP DATABASE Fetagenda;
  CREATE DATABASE Fetagenda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

### Error: "Command not found: mysql"
- Asegúrate de que MySQL esté instalado y en el PATH
- En Windows, agrega MySQL bin a las variables de entorno

## Comandos Útiles de MySQL

### Conectar a MySQL:
```bash
mysql -u root -p
```

### Ver todas las bases de datos:
```sql
SHOW DATABASES;
```

### Usar la base de datos:
```sql
USE Fetagenda;
```

### Ver estructura de una tabla:
```sql
DESCRIBE nombre_tabla;
```

### Eliminar todos los datos de una tabla:
```sql
TRUNCATE TABLE nombre_tabla;
```

### Ver contenido de una tabla:
```sql
SELECT * FROM nombre_tabla;
```
