# Configuración de CORS - FleetSmart Backend

## Descripción
Este documento explica la configuración de CORS (Cross-Origin Resource Sharing) implementada en el backend de FleetSmart.

## Configuración Actual

### Orígenes Permitidos
- `http://localhost:3000` - Backend API
- `http://localhost:3001` - Frontend React
- `http://127.0.0.1:3000` - Backend API (alternativo)
- `http://127.0.0.1:3001` - Frontend React (alternativo)

### Métodos HTTP Permitidos
- GET, POST, PUT, DELETE, OPTIONS, PATCH

### Headers Permitidos
- Content-Type
- Authorization
- X-Requested-With
- Accept
- Origin

### Headers Expuestos
- Content-Length
- X-Requested-With

### Configuración Adicional
- **Credentials**: Habilitado (permite cookies y headers de autorización)
- **Max Age**: 86400 segundos (24 horas)
- **Preflight**: Automático para requests complejos

## Archivos de Configuración

### `config/cors.js`
Contiene la configuración principal de CORS con validación de orígenes.

### `server.js`
Aplica la configuración de CORS al servidor Express.

## Puertos de la Aplicación

| Servicio | Puerto | Propósito |
|----------|--------|-----------|
| Backend API | 3000 | Servidor principal |
| Frontend React | 3001 | Interfaz de usuario |
| Base de Datos | 3306 | MySQL |

## Solución de Problemas

### Error: "Not allowed by CORS"
- Verificar que el frontend esté corriendo en `localhost:3001`
- Verificar que el backend esté corriendo en `localhost:3000`
- Revisar la consola del navegador para errores de CORS

### Error: "Request Header Fields Too Large"
- Limpiar caché del navegador
- Verificar que no se estén enviando headers muy grandes
- Revisar la configuración de límites en `server.js`

## Testing

Para probar la configuración de CORS:

```bash
# Backend
cd backend
npm run dev

# Frontend (en otra terminal)
cd frontend
npm start
```

## Notas Importantes

1. **Desarrollo**: Esta configuración es para desarrollo local
2. **Producción**: Cambiar los orígenes permitidos según el dominio de producción
3. **Seguridad**: CORS está configurado para permitir solo orígenes específicos
4. **Headers**: Se permiten headers estándar para APIs REST
