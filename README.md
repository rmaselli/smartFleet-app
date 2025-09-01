# FleetSmart - Aplicación de Gestión de Flotas y Tareas

Una aplicación web moderna para la gestión de flotas de vehículos y tareas relacionadas, construida con React, Node.js, Express.js y MySQL.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de registro e inicio de sesión
- **Gestión de Tareas**: Crear, editar, eliminar y asignar tareas
- **Filtros y Búsqueda**: Buscar tareas por título, descripción, estado y prioridad
- **Diseño Responsivo**: Interfaz moderna y adaptativa para todos los dispositivos
- **Base de Datos MySQL FLVEHI**: Almacenamiento persistente en tabla flveh_s002
- **API RESTful**: Backend robusto y escalable
- **5 Módulos Principales**: Seguridad, Catálogos, Procesos, Repuestos y Consultas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento de la aplicación
- **Axios** - Cliente HTTP para API
- **Lucide React** - Iconos modernos
- **Date-fns** - Manipulación de fechas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL2** - Cliente de base de datos
- **JWT** - Autenticación basada en tokens
- **Bcryptjs** - Hash de contraseñas
- **Express Validator** - Validación de datos
- **Helmet** - Seguridad de headers
- **Morgan** - Logging de requests

## 📁 Estructura del Proyecto

```
fleetSmart-app/
├── backend/                 # Servidor Node.js/Express
│   ├── config/             # Configuración de base de datos
│   ├── middleware/         # Middleware de autenticación
│   ├── routes/             # Rutas de la API
│   ├── server.js           # Servidor principal
│   └── package.json        # Dependencias del backend
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── context/        # Contexto de autenticación
│   │   ├── utils/          # Utilidades
│   │   ├── App.js          # Componente principal
│   │   └── index.js        # Punto de entrada
│   ├── public/             # Archivos estáticos
│   ├── tailwind.config.js  # Configuración de Tailwind
│   └── package.json        # Dependencias del frontend
├── database_setup.sql      # Script de configuración de base de datos
└── README.md               # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- MySQL (versión 8.0 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd fleetSmart-app
```

### 2. Configurar la base de datos FLVEHI

#### Opción A: Usar el script SQL (Recomendado)
```bash
# Ejecutar el script de configuración
mysql -u root -p < database_setup.sql
```

#### Opción B: Configuración manual
```sql
-- Crear la base de datos FLVEHI
CREATE DATABASE IF NOT EXISTS FLVEHI
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE FLVEHI;

-- Crear la tabla principal de usuarios
CREATE TABLE IF NOT EXISTS flveh_s002 (
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
  updated_by INT,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_role (role),
  INDEX idx_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Configurar variables de entorno
```bash
# Backend
cd backend
cp env.example .env
```

Editar el archivo `.env` con tus credenciales:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (FLVEHI)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=FLVEHI

# JWT Configuration
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Instalar dependencias
```bash
# Instalar todas las dependencias (backend + frontend)
npm run install-all
```

### 5. Levantar la aplicación
```bash
# Levantar todo (backend + frontend)
npm run dev
```

## 🗄️ Estructura de la Base de Datos FLVEHI

### Tabla Principal: `flveh_s002` (Usuarios)
- **id**: Identificador único del usuario
- **username**: Nombre de usuario único
- **email**: Email único del usuario
- **password**: Contraseña hasheada
- **full_name**: Nombre completo
- **role**: Rol del usuario (admin, user, manager)
- **status**: Estado del usuario (active, inactive, suspended)
- **company_id**: ID de la empresa (opcional)
- **department**: Departamento del usuario (opcional)
- **phone**: Teléfono del usuario (opcional)
- **last_login**: Último acceso al sistema
- **created_at**: Fecha de creación
- **updated_at**: Fecha de última actualización

### Tabla: `tasks` (Tareas)
- **id**: Identificador único de la tarea
- **title**: Título de la tarea
- **description**: Descripción detallada
- **status**: Estado (pending, in_progress, completed, cancelled)
- **priority**: Prioridad (low, medium, high, urgent)
- **due_date**: Fecha de vencimiento
- **assigned_to**: Usuario asignado (referencia a flveh_s002)
- **created_by**: Usuario que creó la tarea (referencia a flveh_s002)

## 🔐 Usuario por Defecto

El sistema incluye un usuario administrador por defecto:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@fleetsmart.com
- **Rol**: admin

**⚠️ Importante**: Cambiar esta contraseña en producción.

## 📱 Cómo Usar la Aplicación

### 1. Registro de Usuario
- Ir a `/register`
- Completar el formulario con nombre, usuario, email y contraseña
- Los datos se almacenan en la tabla `flveh_s002` de la base de datos `FLVEHI`

### 2. Inicio de Sesión
- Ir a `/login`
- Usar las credenciales registradas
- El sistema verifica contra la tabla `flveh_s002`

### 3. Dashboard Principal
- Acceso a los 5 módulos principales
- Navegación por la estructura de la aplicación

## 🚀 Scripts Disponibles

```bash
# Instalar todas las dependencias
npm run install-all

# Levantar todo (backend + frontend)
npm run dev

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend

# Construir para producción
npm run build

# Levantar solo backend en producción
npm run start:backend
```

## 🔧 Solución de Problemas

### Error de Conexión a MySQL
- Verificar que MySQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos `FLVEHI` exista

### Error de Tabla
- Ejecutar `database_setup.sql`
- Verificar que la tabla `flveh_s002` exista

### Error de Autenticación
- Verificar que `JWT_SECRET` esté configurado
- Verificar que el usuario exista en `flveh_s002`

## 📞 Soporte

Para soporte técnico o reportar problemas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**FleetSmart** - Sistema integral de gestión de flotas de vehículos 