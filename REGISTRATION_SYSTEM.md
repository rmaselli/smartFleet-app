# Sistema de Registro de Usuarios - FleetSmart

## Descripción General

El sistema de registro de usuarios ha sido completamente implementado para crear nuevos usuarios en la tabla `flveh_s002` de la base de datos FLVEHI. El sistema incluye validación completa tanto en el frontend como en el backend, y maneja todos los campos necesarios para la gestión de usuarios.

## Tabla de Base de Datos: `flveh_s002`

### Estructura de la Tabla
```sql
CREATE TABLE flveh_s002 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'user', 'manager') DEFAULT 'user',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  company_id INT,
  department VARCHAR(100),
  phone VARCHAR(20),
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT
);
```

### Campos del Formulario de Registro

#### Campos Obligatorios:
- **username**: Nombre de usuario (mínimo 3 caracteres)
- **email**: Correo electrónico válido
- **password**: Contraseña (mínimo 6 caracteres)
- **confirmPassword**: Confirmación de contraseña
- **full_name**: Nombre completo del usuario

#### Campos Opcionales:
- **phone**: Número de teléfono (mínimo 7 dígitos)
- **department**: Departamento o área de trabajo
- **company_id**: ID de la empresa (número positivo)

## Implementación Frontend

### Componente: `Register.js`
- Formulario completo con validación en tiempo real
- Campos adicionales para información del usuario
- Validación de formato de teléfono y ID de empresa
- Manejo de estados de carga y errores
- Mensajes de éxito y error
- Navegación automática al dashboard tras registro exitoso

### Validaciones Frontend:
- Username: mínimo 3 caracteres
- Email: formato válido
- Password: mínimo 6 caracteres
- Confirmación de password: debe coincidir
- Nombre completo: mínimo 2 caracteres
- Teléfono: mínimo 7 dígitos (si se proporciona)
- ID de empresa: número positivo (si se proporciona)

## Implementación Backend

### Ruta: `POST /api/auth/register`
- Validación de datos con express-validator
- Verificación de usuarios duplicados
- Hash seguro de contraseñas con bcrypt (12 salt rounds)
- Inserción en tabla `flveh_s002`
- Generación de JWT token
- Respuesta con datos del usuario creado

### Validaciones Backend:
- Username: mínimo 3 caracteres, único
- Email: formato válido, único
- Password: mínimo 6 caracteres
- Nombre completo: no vacío
- Teléfono: opcional, mínimo 7 caracteres
- Departamento: opcional
- ID de empresa: opcional, entero positivo

### Seguridad:
- Contraseñas hasheadas con bcrypt
- Validación y sanitización de entrada
- Prevención de inyección SQL
- Tokens JWT para autenticación

## Flujo de Registro

1. **Usuario llena formulario** → Validación frontend en tiempo real
2. **Envío del formulario** → Validación backend completa
3. **Verificación de duplicados** → Check en tabla `flveh_s002`
4. **Hash de contraseña** → Bcrypt con 12 salt rounds
5. **Inserción en BD** → Tabla `flveh_s002`
6. **Generación de token** → JWT para autenticación
7. **Respuesta exitosa** → Usuario creado y autenticado
8. **Redirección** → Dashboard principal

## Archivos Modificados

### Frontend:
- `frontend/src/pages/Register.js` - Formulario completo con campos adicionales
- `frontend/src/context/AuthContext.js` - Manejo de mensajes de éxito

### Backend:
- `backend/routes/auth.js` - Ruta de registro con campos adicionales
- `backend/test_registration.js` - Script de prueba del sistema

## Pruebas del Sistema

### Script de Prueba: `test_registration.js`
```bash
cd backend
node test_registration.js
```

Este script:
- Conecta a la base de datos
- Crea un usuario de prueba
- Verifica la inserción
- Valida el hash de contraseña
- Limpia los datos de prueba
- Confirma el funcionamiento del sistema

## Características del Sistema

✅ **Registro completo** de usuarios en tabla `flveh_s002`  
✅ **Validación robusta** frontend y backend  
✅ **Campos adicionales** para información del usuario  
✅ **Seguridad** con hash de contraseñas y JWT  
✅ **Manejo de errores** completo  
✅ **Feedback visual** para el usuario  
✅ **Navegación automática** tras registro exitoso  
✅ **Prevención de duplicados** por username y email  
✅ **Campos opcionales** para flexibilidad  

## Uso del Sistema

1. **Acceso**: Navegar a `/register`
2. **Llenar formulario**: Completar campos obligatorios y opcionales
3. **Validación**: El sistema valida en tiempo real
4. **Envío**: Al completar, se envía al backend
5. **Creación**: Usuario se crea en tabla `flveh_s002`
6. **Autenticación**: Usuario queda autenticado automáticamente
7. **Dashboard**: Redirección al panel principal

## Notas Técnicas

- **Base de datos**: MySQL FLVEHI
- **Tabla principal**: `flveh_s002`
- **Hash de contraseñas**: Bcrypt con 12 salt rounds
- **Autenticación**: JWT tokens
- **Validación**: Express-validator
- **Frontend**: React con hooks y context
- **Backend**: Node.js con Express
- **Conexión BD**: MySQL2 con pool de conexiones

## Mantenimiento

- Verificar conexión a base de datos
- Monitorear logs de registro
- Validar estructura de tabla periódicamente
- Actualizar validaciones según necesidades del negocio
- Revisar políticas de seguridad de contraseñas
