# 🔧 Solución al Error SSR en Angular 18

## ❌ Problema

El proyecto Angular 18 venía configurado por defecto con Server-Side Rendering (SSR), lo que causaba este error:

```
NG0210: The document object is not available in this context. 
Make sure the DOCUMENT injection token is provided.
```

## ✅ Solución Aplicada

### 1. Cambiar el Builder de Angular

**Archivo modificado:** `angular.json`

**Cambio realizado:**
```json
// ANTES:
"builder": "@angular-devkit/build-angular:application"

// DESPUÉS:
"builder": "@angular-devkit/build-angular:browser"
```

También cambiamos:
```json
// ANTES:
"browser": "src/main.ts"

// DESPUÉS:
"main": "src/main.ts"
```

Y eliminamos las opciones de SSR:
```json
// Eliminamos:
"server": "src/main.server.ts",
"prerender": true,
"ssr": {
  "entry": "server.ts"
}
```

### 2. Eliminar provideClientHydration()

**Archivo modificado:** `src/app/app.config.ts`

**Cambio realizado:**
```typescript
// ANTES:
import { provideClientHydration } from '@angular/platform-browser';
// ...
provideClientHydration(),

// DESPUÉS:
// Línea eliminada completamente
```

### 3. Limpiar el Cache

```bash
Remove-Item -Path ".angular" -Recurse -Force
```

## 🎯 ¿Por qué funcionó?

- **SSR (Server-Side Rendering)** es útil para SEO y renderizado inicial más rápido, pero agrega complejidad
- Para una aplicación interna de gestión de citas, SSR no es necesario
- El builder `browser` es más simple y solo genera código para el navegador
- Sin `provideClientHydration()` no hay intentos de sincronizar estado entre servidor y cliente

## 📝 Advertencias que Puedes Ignorar

Después del cambio, verás estas advertencias (son normales y no afectan la aplicación):

```
Warning: server.ts is part of the TypeScript compilation but it's unused.
Warning: app.config.server.ts is part of the TypeScript compilation but it's unused.
Warning: main.server.ts is part of the TypeScript compilation but it's unused.
```

Estos archivos son residuos de la configuración SSR original. Puedes dejarlos ahí (no afectan) o eliminarlos si quieres.

## 🚀 Resultado

Ahora la aplicación funciona correctamente:
- ✅ Frontend en: http://localhost:4200
- ✅ Backend en: http://localhost:3000
- ✅ Sin errores de SSR

## 🔄 Si Quisieras Habilitar SSR en el Futuro

Si más adelante necesitas SSR (para SEO, por ejemplo):

1. Volver a cambiar el builder a `application`
2. Agregar `provideClientHydration()` de vuelta
3. Configurar correctamente el app.config.server.ts
4. Usar `npm run serve:ssr:FetAgendaCita`

Pero para este proyecto de gestión de citas, **no es necesario**.

## 📚 Más Información

- [Angular SSR Guide](https://angular.io/guide/ssr)
- [Angular Builders](https://angular.io/guide/workspace-config#builder-configurations)
