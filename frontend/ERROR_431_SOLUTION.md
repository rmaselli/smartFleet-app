# Solución del Error 431 - Request Header Fields Too Large

## Descripción del Error
El error **431** significa "Request Header Fields Too Large" - los headers de la petición HTTP son demasiado grandes para ser procesados por el servidor.

## Causas del Error 431

### 1. 🚨 Token JWT Demasiado Largo
- **Problema**: El token almacenado en localStorage es excesivamente largo
- **Síntoma**: Headers de Authorization muy grandes
- **Causa común**: Token corrupto o malformado

### 2. 🚨 Headers Innecesarios
- **Problema**: Headers automáticos del navegador muy grandes
- **Síntoma**: Headers como User-Agent, Accept-Language, etc. muy extensos
- **Causa común**: Configuración del navegador o extensiones

### 3. 🚨 Caché Corrupta
- **Problema**: Datos almacenados en localStorage/sessionStorage corruptos
- **Síntoma**: Headers con datos basura o muy largos
- **Causa común**: Caché del navegador corrupta

## Solución Implementada

### 1. ✅ Interceptor de Headers Optimizado
```javascript
// Interceptor para requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Limpiar headers innecesarios para evitar problemas
    const cleanHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Agregar token solo si existe y es válido
    const token = localStorage.getItem('token');
    if (token && token.length < 1000) { // Verificar que el token no sea demasiado largo
      cleanHeaders.Authorization = `Bearer ${token}`;
    }
    
    // Aplicar headers limpios
    config.headers = cleanHeaders;
    
    return config;
  }
);
```

### 2. ✅ Manejo Específico del Error 431
```javascript
case 431:
  // Request Header Fields Too Large
  console.error('❌ Headers demasiado grandes:', error.response.data);
  // Limpiar headers problemáticos y reintentar
  localStorage.removeItem('token');
  delete axiosInstance.defaults.headers.common['Authorization'];
  return Promise.reject({
    ...error,
    message: 'Error de configuración. Intenta limpiar la caché del navegador y volver a iniciar sesión.'
  });
```

### 3. ✅ Función de Limpieza Completa
```javascript
export const clearAllConfig = () => {
  // Limpiar headers de Axios
  delete axiosInstance.defaults.headers.common['Authorization'];
  delete axiosInstance.defaults.headers.common['X-Requested-With'];
  delete axiosInstance.defaults.headers.common['X-CSRF-Token'];
  
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Limpiar sessionStorage
  sessionStorage.clear();
  
  // Limpiar cookies relacionadas con la sesión
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
};
```

## Pasos para Resolver el Error 431

### Paso 1: Verificar el Estado Actual
1. **Ir a la página de vehículos**
2. **Hacer clic en "Debug de Headers"**
3. **Verificar el estado del token**:
   - ✅ **Verde**: Token válido (< 1000 caracteres)
   - ❌ **Rojo**: Token inválido (> 1000 caracteres)

### Paso 2: Limpiar Caché del Navegador
1. **Abrir DevTools (F12)**
2. **Ir a Application → Storage**
3. **Hacer clic en "Clear storage"**
4. **Recargar la página**

### Paso 3: Usar la Función de Limpieza Automática
1. **En el componente HeadersDebug**
2. **Hacer clic en "🧹 Limpiar Todo (Caché + Recargar)"**
3. **Esto limpiará automáticamente todo y recargará**

### Paso 4: Verificar Headers de Request
1. **Abrir DevTools (F12)**
2. **Ir a Network**
3. **Intentar hacer login**
4. **Verificar que los headers sean limpios**:
   ```
   Content-Type: application/json
   Accept: application/json
   Authorization: Bearer [token-corto]
   ```

## Configuración del Backend

### Verificar Límites de Headers
```javascript
// En backend/config/server.js
const serverConfig = {
  limits: {
    headers: 100,          // Número máximo de headers
    fieldSize: 2 * 1024 * 1024, // 2MB para campos individuales
  }
};
```

### Verificar Configuración de Express
```javascript
// En backend/server.js
app.use(express.json({ 
  limit: serverConfig.limits.body,
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
```

## Prevención del Error 431

### 1. ✅ Validación de Token
- Verificar longitud del token antes de enviarlo
- Limpiar tokens corruptos automáticamente
- Implementar rotación de tokens

### 2. ✅ Headers Mínimos
- Solo enviar headers esenciales
- Evitar headers automáticos innecesarios
- Limpiar headers en cada request

### 3. ✅ Monitoreo Continuo
- Componente ApiStatus para verificar conectividad
- Componente HeadersDebug para diagnosticar problemas
- Logs automáticos de headers

## Comandos de Verificación

### Verificar Headers en el Navegador
```javascript
// En consola del navegador (F12)
console.log('Token length:', localStorage.getItem('token')?.length);
console.log('Headers actuales:', document.querySelector('meta[name="headers"]'));
```

### Verificar Headers en el Backend
```bash
cd backend
node check_server_config.js
```

### Verificar Base de Datos
```bash
cd backend
node check_database.js
```

## Archivos de Configuración Clave

### Frontend
- ✅ `frontend/src/utils/axiosConfig.js` - Interceptores optimizados
- ✅ `frontend/src/components/HeadersDebug.js` - Debug de headers
- ✅ `frontend/src/context/AuthContext.js` - Manejo de autenticación

### Backend
- ✅ `backend/config/server.js` - Límites de headers
- ✅ `backend/server.js` - Configuración de Express

## Próximos Pasos

1. **Usar el componente HeadersDebug** para diagnosticar
2. **Limpiar caché** si el token es muy largo
3. **Verificar headers** en la consola del navegador
4. **Probar login** después de la limpieza
5. **Monitorear** que no se repita el error

## Contacto

Si el error persiste después de seguir estos pasos:
1. Revisar logs completos del backend
2. Verificar configuración de red y firewall
3. Probar en navegador diferente
4. Verificar que no haya extensiones interfiriendo
