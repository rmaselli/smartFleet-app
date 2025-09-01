# Pasos para Debuggear y Resolver el Problema de Login - FleetSmart

## 🚨 Problema Actual
**Error**: "AuthContext: Login failed, returning error: Respuesta del servidor no contiene token"

## 🔍 Diagnóstico Paso a Paso

### **Paso 1: Verificar que el Backend esté Corriendo**
```bash
cd backend
npm run dev
```
**Verificar**: Debería mostrar "Server running on port 3000"

### **Paso 2: Verificar Base de Datos**
```bash
cd backend
node check_database.js
```
**Verificar**: 
- ✅ Tabla `flveh_s002` existe
- ✅ Hay usuarios en la tabla
- ✅ Usuario "otro" está presente

### **Paso 3: Crear Usuario de Prueba (si no existe)**
```bash
cd backend
node create_test_user.js
```
**Credenciales por defecto**:
- Usuario: `otro`
- Contraseña: `otro`

### **Paso 4: Debuggear el Proceso de Login**
```bash
cd backend
node debug_login.js
```
**Verificar**: 
- ✅ Usuario existe en BD
- ✅ Contraseña es válida
- ✅ Token se genera correctamente
- ✅ Respuesta tiene estructura correcta

### **Paso 5: Probar Backend Directamente**
```bash
cd backend
node test_backend.js
```
**Verificar**:
- ✅ Health check responde
- ✅ Login endpoint funciona
- ✅ Token se envía en respuesta
- ✅ CORS está configurado

### **Paso 6: Usar LoginDebug en el Frontend**
1. **Ir a la página de vehículos**
2. **Hacer clic en "Debug de Login"**
3. **Hacer clic en "🚀 Probar con Usuario 'otro'"**
4. **Revisar consola del navegador (F12)**

## 🧪 Componentes de Debug Disponibles

### **1. LoginDebug (Frontend)**
- **Función**: Prueba login desde el frontend
- **Ubicación**: Página de vehículos → "Debug de Login"
- **Características**:
  - Pruebas de conectividad
  - Verificación de endpoint
  - Análisis de respuesta
  - Botón para probar con usuario "otro"

### **2. AuthDebug (Frontend)**
- **Función**: Estado de autenticación
- **Ubicación**: Página de vehículos → "Debug de Autenticación"
- **Características**:
  - Estado de autenticación
  - Token en estado vs localStorage
  - Sincronización

### **3. ConnectionTest (Frontend)**
- **Función**: Pruebas de conectividad
- **Ubicación**: Página de vehículos → "Pruebas de Conexión"
- **Características**:
  - Health check
  - Endpoints de API
  - Diagnóstico de red

## 🔧 Scripts de Backend Disponibles

### **1. check_database.js**
```bash
node check_database.js
```
- Verifica estructura de BD
- Cuenta usuarios
- Muestra usuarios disponibles

### **2. create_test_user.js**
```bash
node create_test_user.js
```
- Crea usuario de prueba
- Credenciales: `otro` / `otro`

### **3. debug_login.js**
```bash
node debug_login.js
```
- Debug paso a paso del login
- Simula proceso completo
- Verifica cada componente

### **4. test_backend.js**
```bash
node test_backend.js
```
- Prueba endpoints directamente
- Verifica respuestas del servidor
- Prueba CORS

## 📊 Análisis de Respuestas Esperadas

### **✅ Login Exitoso**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "username": "otro",
    "email": "otro@fleetsmart.com",
    "full_name": "otro",
    "status": "ACT"
  }
}
```

### **❌ Login Fallido - Usuario No Encontrado**
```json
{
  "error": "Invalid credentials or account inactive"
}
```

### **❌ Login Fallido - Contraseña Incorrecta**
```json
{
  "error": "Invalid credentials"
}
```

## 🚨 Problemas Comunes y Soluciones

### **1. "Table flveh_s002 not found"**
**Causa**: Tabla no existe en BD
**Solución**: 
```bash
cd backend
node create_test_user.js
```

### **2. "No users found with these credentials"**
**Causa**: Usuario no existe o está inactivo
**Solución**: 
```bash
cd backend
node create_test_user.js
```

### **3. "Password is invalid"**
**Causa**: Contraseña incorrecta o hash corrupto
**Solución**: 
```bash
cd backend
node create_test_user.js
```

### **4. "Backend is not running"**
**Causa**: Servidor no está corriendo
**Solución**: 
```bash
cd backend
npm run dev
```

### **5. "CORS test failed"**
**Causa**: Configuración de CORS incorrecta
**Solución**: Verificar `backend/config/cors.js`

## 🔍 Verificación en el Navegador

### **1. Abrir DevTools (F12)**
- **Pestaña Console**: Buscar mensajes con 🧪 LoginDebug:
- **Pestaña Network**: Ver petición HTTP a `/api/auth/login`

### **2. Verificar Petición HTTP**
- **URL**: `http://localhost:3000/api/auth/login`
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**: `{"username":"otro","password":"otro"}`

### **3. Verificar Respuesta HTTP**
- **Status**: 200 OK
- **Headers**: Content-Type: application/json
- **Body**: JSON con token y user

## 📝 Logs a Revisar

### **Frontend (Consola del Navegador)**
```
🧪 LoginDebug: Testing with custom credentials...
🧪 LoginDebug: Credentials: {username: "otro", password: "***"}
🧪 LoginDebug: API URL: http://localhost:3000/api/auth/login
🧪 LoginDebug: Custom login response: [Response object]
🧪 LoginDebug: Response analysis: [Analysis object]
```

### **Backend (Terminal)**
```
🔐 AuthContext: Starting login...
🔐 AuthContext: Making API call to /api/auth/login
🔐 AuthContext: API response received: [Response object]
🔐 AuthContext: Response data: [Data object]
```

## 🎯 Pasos de Verificación Final

### **1. Base de Datos**
- [ ] Tabla `flveh_s002` existe
- [ ] Usuario "otro" está presente
- [ ] Contraseña está hasheada correctamente
- [ ] Estatus es "ACT"

### **2. Backend**
- [ ] Servidor corre en puerto 3000
- [ ] Endpoint `/api/auth/login` responde
- [ ] Genera token JWT válido
- [ ] Envía respuesta con estructura correcta

### **3. Frontend**
- [ ] Usa URL correcta: `http://localhost:3000`
- [ ] Envía credenciales correctas
- [ ] Recibe respuesta del servidor
- [ ] Procesa token correctamente

### **4. CORS**
- [ ] Headers de CORS están configurados
- [ ] Frontend puede hacer peticiones al backend
- [ ] No hay errores de CORS en consola

## 🚀 Comandos de Ejecución Rápida

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Verificar BD
cd backend
node check_database.js

# Terminal 3: Crear usuario (si es necesario)
cd backend
node create_test_user.js

# Terminal 4: Debug login
cd backend
node debug_login.js

# Terminal 5: Probar backend
cd backend
node test_backend.js
```

## 📞 Si el Problema Persiste

1. **Ejecutar todos los scripts de debug**
2. **Revisar logs completos del backend**
3. **Revisar consola del navegador**
4. **Verificar pestaña Network en DevTools**
5. **Compartir resultados de los scripts de debug**

## 📋 Checklist de Resolución

- [ ] Backend corriendo en puerto 3000
- [ ] Base de datos accesible
- [ ] Tabla `flveh_s002` existe
- [ ] Usuario "otro" creado y activo
- [ ] Endpoint de login responde correctamente
- [ ] Token se genera y envía
- [ ] Frontend recibe respuesta completa
- [ ] Login funciona con credenciales "otro"/"otro"
