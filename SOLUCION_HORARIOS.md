# 🔧 Solución al Error de Horarios Disponibles

## ❌ Problema Original

Al seleccionar una fecha en el formulario de reservas, ocurría el siguiente error:

```
ERROR TypeError: Cannot read properties of undefined (reading 'length')
at reserva-form.component.ts:115:38
```

### Causas Identificadas:

1. **Desajuste en la estructura de datos**: El backend devolvía un objeto con estructura diferente a la que esperaba el frontend.

2. **Nombre de campo incorrecto**: 
   - Backend devolvía: `response.horario` (objeto)
   - Frontend esperaba: `response.horarios_disponibles` (array)

3. **Campo duracion inconsistente**: La base de datos y el backend usan `duracion_minutos` pero la interfaz TypeScript tenía `duracion`.

---

## ✅ Solución Implementada

### 1. **Backend - Modelo Reserva.js**

Se actualizó el método `obtenerDisponibilidad()` para:

#### Antes:
```javascript
return {
    disponible: true,
    horario: { inicio: horaInicio, fin: horaFin },
    duracion: duracionServicio,
    reservasExistentes: reservasExistentes
};
```

#### Después:
```javascript
return {
    fecha,
    horarios_disponibles: ['09:00', '09:30', '10:00', ...],
    servicio_id: parseInt(servicioId),
    mensaje: 'Día no laborable' // solo cuando no hay horarios
};
```

#### Mejoras implementadas:

✅ **Generación automática de slots**: Crea horarios cada 30 minutos dentro del horario laboral

✅ **Validación de conflictos**: Verifica que no haya reservas existentes en el horario

✅ **Días no laborables**: Retorna array vacío con mensaje explicativo

✅ **Días bloqueados**: Maneja días festivos o vacaciones

✅ **Cálculo de disponibilidad**: Considera la duración del servicio para evitar reservas que excedan el horario

### 2. **Frontend - Interfaces TypeScript**

Se actualizó la interfaz `DisponibilidadResponse`:

```typescript
export interface DisponibilidadResponse {
    fecha: string;
    horarios_disponibles: string[];  // ✅ Nombre correcto
    servicio_id: number;
    mensaje?: string;  // ✅ Mensaje opcional para días no disponibles
}
```

Se corrigió la interfaz `Servicio`:

```typescript
export interface Servicio {
    duracion_minutos: number;  // ✅ Coincide con la BD
    // ... otros campos
}
```

### 3. **Frontend - Componente reserva-form**

Se actualizó el método `verificarDisponibilidad()`:

```typescript
next: (response: DisponibilidadResponse) => {
    this.horariosDisponibles = response.horarios_disponibles || [];  // ✅ Protección contra undefined
    this.loading = false;
    
    if (this.horariosDisponibles.length === 0) {
        this.error = response.mensaje || 'No hay horarios disponibles para esta fecha';
    } else {
        this.error = '';
    }
}
```

---

## 🎯 Lógica de Generación de Horarios

### Algoritmo:

1. **Obtener horario laboral del día** (tabla `horarios_trabajo`)
   - Ejemplo: Lunes 09:00 - 17:00

2. **Verificar día bloqueado** (tabla `dias_bloqueados`)
   - Retorna mensaje si está bloqueado

3. **Obtener duración del servicio**
   - Ejemplo: Corte de cabello = 45 minutos

4. **Generar slots cada 30 minutos**:
   ```
   09:00, 09:30, 10:00, 10:30, 11:00, ...
   ```

5. **Para cada slot, verificar**:
   - Que el servicio complete antes del cierre
   - Que no se superponga con reservas existentes

6. **Retornar solo slots disponibles**

### Ejemplo Visual:

```
Horario laboral: 09:00 - 17:00
Servicio: Corte (45 min)

Slots generados:
✅ 09:00 (termina 09:45) - Disponible
✅ 09:30 (termina 10:15) - Disponible
❌ 10:00 (termina 10:45) - Ocupado (reserva existente)
✅ 10:30 (termina 11:15) - Disponible
✅ 11:00 (termina 11:45) - Disponible
...
✅ 16:00 (termina 16:45) - Disponible
❌ 16:30 (termina 17:15) - Excede horario
```

---

## 📊 Estructura de la Base de Datos

### Tabla: `horarios_trabajo`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único |
| dia_semana | INT | 0=Domingo, 1=Lunes, ..., 6=Sábado |
| hora_inicio | TIME | Ej: 09:00:00 |
| hora_fin | TIME | Ej: 17:00:00 |
| activo | BOOLEAN | Si está activo el horario |

### Ejemplo de datos:

```sql
INSERT INTO horarios_trabajo (dia_semana, hora_inicio, hora_fin, activo) VALUES
(1, '09:00:00', '19:00:00', 1), -- Lunes
(2, '09:00:00', '19:00:00', 1), -- Martes
(3, '09:00:00', '19:00:00', 1), -- Miércoles
(4, '09:00:00', '19:00:00', 1), -- Jueves
(5, '09:00:00', '19:00:00', 1), -- Viernes
(6, '09:00:00', '18:00:00', 1); -- Sábado
-- Domingo no tiene registro = día no laborable
```

---

## 🧪 Casos de Prueba

### Caso 1: Día laborable con horarios disponibles
- **Input**: Fecha: 2025-10-13 (lunes), Servicio: Corte (45 min)
- **Output**: Array con horarios ['09:00', '09:30', '10:00', ...]

### Caso 2: Domingo (día no laborable)
- **Input**: Fecha: 2025-10-12 (domingo)
- **Output**: 
  ```json
  {
    "horarios_disponibles": [],
    "mensaje": "Día no laborable"
  }
  ```

### Caso 3: Día con muchas reservas
- **Input**: Fecha con 5 reservas existentes
- **Output**: Solo horarios que no se superponen

### Caso 4: Día bloqueado (festivo)
- **Input**: Fecha: 2025-12-25
- **Output**:
  ```json
  {
    "horarios_disponibles": [],
    "mensaje": "Día festivo - Navidad"
  }
  ```

---

## 🚀 Resultado Final

✅ **Problema resuelto**: Ya no hay error de `undefined`

✅ **Horarios dinámicos**: Se generan automáticamente según:
   - Horario del salón
   - Duración del servicio
   - Reservas existentes

✅ **Mensajes claros**: Usuario sabe por qué no hay horarios

✅ **Validación robusta**: Previene reservas conflictivas

---

## 📝 Archivos Modificados

1. ✅ `backend/models/Reserva.js` - Lógica de generación de horarios
2. ✅ `src/app/models/interfaces.ts` - Interfaces actualizadas
3. ✅ `src/app/components/reserva-form/reserva-form.component.ts` - Manejo correcto de respuesta

---

## 🎉 ¡Listo para Usar!

Ahora el sistema de reservas:
- Muestra horarios disponibles correctamente
- Maneja días no laborables
- Respeta las reservas existentes
- Considera la duración de cada servicio
- Previene dobles reservas

**¡El formulario de agendamiento está completamente funcional! 💇‍♀️✨**
