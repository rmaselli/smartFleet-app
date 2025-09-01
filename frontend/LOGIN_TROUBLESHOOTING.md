# Solución de Problemas de Login - FleetSmart Frontend

## Descripción
Este documento explica cómo solucionar problemas comunes de login en la aplicación FleetSmart.

## Problemas Comunes

### 1. ❌ Error de Conexión a la API
**Síntomas:**
- No se puede hacer login
- Mensaje: "No se pudo conectar con el servidor"
- Error en consola: Network Error

**Causas:**
- Backend no está corriendo
- Puerto incorrecto
- Problemas de CORS
- Firewall bloqueando conexiones

**Solución:**
1. **Verificar que el backend esté corriendo:**
   ```bash
   cd backend
   npm run dev
   ```
   
2. **Verificar el puerto del backend:**
   - Debe estar en `http://localhost:3000`
   - Verificar en la consola del backend: `🚀 Server running on port 3000`

3. **Verificar CORS:**
   - El backend debe permitir conexiones desde `http://localhost:3001`
   - Verificar archivo `backend/config/server.js`

### 2. ❌ Error de Timeout
**Síntomas:**
- Login tarda mucho tiempo
- Mensaje: "La petición tardó demasiado en completarse"
- Error en consola: `ECONNABORTED`

**Solución:**
1. **Verificar configuración de timeouts:**
   - Frontend: 30 segundos en `frontend/src/utils/axiosConfig.js`
   - Backend: 30 segundos en `backend/config/server.js`

2. **Verificar rendimiento del backend:**
   - Revisar logs del servidor
   - Verificar consultas de base de datos

### 3. ❌ Error de Autenticación
**Síntomas:**
- Credenciales incorrectas
- Mensaje: "Usuario o contraseña incorrectos"
- Error 401 en consola

**Solución:**
1. **Verificar credenciales:**
   - Usuario y contraseña correctos
   - Usuario activo en la base de datos

2. **Verificar base de datos:**
   ```bash
   cd backend
   node check_database.js
   ```

### 4. ❌ Error de Token
**Síntomas:**
- Login exitoso pero redirección falla
- Error: "Token expired or invalid"
- Problemas de autorización

**Solución:**
1. **Limpiar localStorage:**
   ```javascript
   // En consola del navegador (F12)
   localStorage.clear()
   ```

2. **Verificar configuración JWT:**
   - Backend: `backend/.env` o `backend/env.example`
   - Secret JWT válido

## Configuración de URLs

### Frontend
- **Puerto**: 3001
- **URL**: `http://localhost:3001`

### Backend
- **Puerto**: 3000
- **URL**: `http://localhost:3000`

### Configuración en Archivos

#### `frontend/src/config/environment.js`
```javascript
const ENV_CONFIG = {
  API_URL: 'http://localhost:3000',
  // ... otras configuraciones
};
```

#### `frontend/src/config/api.js`
```javascript
const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_URL,
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile'
  }
  // ... otros endpoints
};
```

#### `frontend/src/utils/axiosConfig.js`
```javascript
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  // ... otras configuraciones
});
```

## Pasos de Verificación

### 1. Verificar Estado de la API
- El componente `ApiStatus` muestra el estado de conexión
- Verde: API conectada
- Rojo: Error de conexión
- Amarillo: Verificando

### 2. Verificar Consola del Navegador
- Abrir DevTools (F12)
- Ir a la pestaña Console
- Buscar errores relacionados con:
  - Network errors
  - CORS errors
  - Timeout errors
  - Authentication errors

### 3. Verificar Consola del Backend
- Terminal donde corre `npm run dev`
- Buscar errores de:
  - Conexión a base de datos
  - CORS
  - Rutas no encontradas

### 4. Verificar Base de Datos
```bash
cd backend
node check_database.js
node check_db_structure.js
```

## Comandos de Solución

### Reiniciar Servidores
```bash
# Backend
cd backend
npm run dev

# Frontend (en otra terminal)
cd frontend
npm start
```

### Limpiar Caché
```bash
# Frontend
cd frontend
npm run build
npm start

# Navegador
# F12 → Application → Storage → Clear storage
```

### Verificar Puertos
```bash
# Windows
netstat -an | findstr :3000
netstat -an | findstr :3001

# Linux/Mac
lsof -i :3000
lsof -i :3001
```

## Archivos de Configuración Clave

### Frontend
- ✅ `frontend/src/config/environment.js` - Configuración del entorno
- ✅ `frontend/src/config/api.js` - Endpoints de la API
- ✅ `frontend/src/utils/axiosConfig.js` - Configuración de Axios
- ✅ `frontend/src/context/AuthContext.js` - Lógica de autenticación

### Backend
- ✅ `backend/config/server.js` - Configuración del servidor
- ✅ `backend/config/cors.js` - Configuración de CORS
- ✅ `backend/server.js` - Servidor principal
- ✅ `backend/.env` - Variables de entorno

## Próximos Pasos

1. **Verificar configuración**: Asegurar que las URLs sean correctas
2. **Reiniciar servidores**: Backend y frontend
3. **Verificar logs**: Consola del navegador y backend
4. **Probar endpoints**: Usar Postman o curl para verificar API
5. **Verificar base de datos**: Conexión y estructura correctas

## Contacto

Si los problemas persisten:
1. Revisar logs completos
2. Verificar configuración de red
3. Probar en navegador diferente
4. Verificar firewall y antivirus
