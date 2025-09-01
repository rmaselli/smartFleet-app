# Configuración de Timeouts - FleetSmart Backend

## Descripción
Este documento explica la configuración de timeouts implementada para resolver el error `AxiosError: timeout of 10000ms exceeded`.

## Problema Original
- **Error**: `AxiosError {message: 'timeout of 10000ms exceeded', name: 'AxiosError', code: 'ECONNABORTED'}`
- **Causa**: Timeout muy bajo (10 segundos) en el frontend
- **Impacto**: Las peticiones HTTP fallaban antes de completarse

## Solución Implementada

### 1. Frontend - Configuración de Axios
**Archivo**: `frontend/src/utils/axiosConfig.js`

```javascript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000, // 30 segundos (antes era 10 segundos)
  maxContentLength: 10 * 1024 * 1024, // 10MB
  maxBodyLength: 10 * 1024 * 1024, // 10MB
});
```

**Características**:
- ✅ **Timeout aumentado**: De 10s a 30s
- ✅ **Manejo centralizado**: Una instancia para toda la app
- ✅ **Interceptores**: Logging y manejo de errores automático
- ✅ **Retry automático**: Para errores de red

### 2. Backend - Configuración del Servidor
**Archivo**: `backend/config/server.js`

```javascript
const serverConfig = {
  timeout: {
    request: 30000,        // 30 segundos para requests
    response: 30000,       // 30 segundos para responses
    idle: 120000,          // 2 minutos para conexiones inactivas
    keepAlive: 5000        // 5 segundos para keep-alive
  }
};
```

**Características**:
- ✅ **Timeouts del servidor**: Configurados para coincidir con el frontend
- ✅ **Keep-alive**: Optimización de conexiones HTTP
- ✅ **Headers timeout**: Para requests con headers grandes

## Configuración de Timeouts

### Frontend (Axios)
| Configuración | Valor | Descripción |
|---------------|-------|-------------|
| `timeout` | 30000ms | Tiempo máximo para completar una petición |
| `maxContentLength` | 10MB | Tamaño máximo del contenido de respuesta |
| `maxBodyLength` | 10MB | Tamaño máximo del body de request |

### Backend (Express)
| Configuración | Valor | Descripción |
|---------------|-------|-------------|
| `server.timeout` | 30000ms | Timeout para requests del servidor |
| `server.keepAliveTimeout` | 5000ms | Timeout para conexiones keep-alive |
| `server.headersTimeout` | 30000ms | Timeout para headers de requests |

## Manejo de Errores

### 1. Timeout Errors
```javascript
// Interceptor automático en axiosConfig.js
if (error.code === 'ECONNABORTED') {
  return Promise.reject({
    ...error,
    message: 'La petición tardó demasiado en completarse. Verifica tu conexión a internet.'
  });
}
```

### 2. Network Errors
```javascript
if (error.request) {
  return Promise.reject({
    ...error,
    message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
  });
}
```

### 3. Server Errors
```javascript
if (error.response) {
  switch (error.response.status) {
    case 401: // Token expirado
    case 403: // Acceso denegado
    case 404: // Recurso no encontrado
    case 500: // Error interno del servidor
  }
}
```

## Archivos Modificados

### Frontend
- ✅ `frontend/src/utils/axiosConfig.js` - Nueva configuración centralizada
- ✅ `frontend/src/context/AuthContext.js` - Usa nueva configuración
- ✅ `frontend/src/pages/catalogos/Vehiculos.js` - Usa nueva configuración

### Backend
- ✅ `backend/config/server.js` - Nueva configuración del servidor
- ✅ `backend/server.js` - Aplicada nueva configuración
- ✅ `backend/config/cors.js` - Configuración CORS mejorada

## Testing

### 1. Verificar Timeouts
```bash
# Frontend
cd frontend
npm start

# Backend
cd backend
npm run dev
```

### 2. Probar Peticiones Lentas
- Crear un vehículo con muchos datos
- Subir archivos grandes
- Hacer peticiones con headers complejos

### 3. Verificar Logs
- **Frontend**: Consola del navegador (F12)
- **Backend**: Terminal donde corre el servidor

## Solución de Problemas

### Error Persiste
1. **Verificar puertos**: Frontend en 3001, Backend en 3000
2. **Reiniciar servidores**: Ambos frontend y backend
3. **Limpiar caché**: Navegador y localStorage
4. **Verificar red**: Conexión a internet estable

### Performance
1. **Optimizar queries**: Revisar base de datos
2. **Comprimir respuestas**: Gzip en el backend
3. **Cache**: Implementar cache en el frontend
4. **Lazy loading**: Cargar datos por demanda

## Notas Importantes

1. **Desarrollo**: Timeouts de 30s son apropiados para desarrollo
2. **Producción**: Considerar timeouts más bajos (15-20s)
3. **Monitoreo**: Implementar métricas de performance
4. **Fallbacks**: Plan B para cuando fallan las peticiones

## Próximos Pasos

1. **Monitorear**: Verificar que no hay más errores de timeout
2. **Optimizar**: Revisar queries lentas en la base de datos
3. **Implementar**: Retry automático para peticiones fallidas
4. **Documentar**: Agregar métricas de performance
