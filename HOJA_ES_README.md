# Hoja de Salida - Sistema de Validación de Items

## 📋 Descripción

Sistema completo de validación de items para la salida de vehículos, implementado siguiendo el patrón maestro-detalle con tres secciones principales:

1. **Encabezado**: Selección de cliente (UBR/DYA), piloto, vehículo, kilometraje y observaciones
2. **Items a Validar**: Lista de items pendientes de revisar con botón "Pass"
3. **Items Revisados**: Lista de items ya revisados con opciones de quitar y agregar anotaciones

## 🏗️ Arquitectura

### Backend
- **Rutas**: `backend/routes/operaciones/HojaES/index.js`
- **APIs**: `/api/hoja-es/*`
- **Base de datos**: Tablas FLVEH_T001 (maestro) y FLVEH_T002 (detalle)

### Frontend
- **Página principal**: `frontend/src/pages/operaciones/HojaES/index.js`
- **Componentes**: `frontend/src/components/HojasES/`
  - `HeaderSection.js` - Sección de encabezado
  - `ItemsList.js` - Lista de items a validar
  - `ItemsRevisados.js` - Lista de items revisados
  - `ModalAnotaciones.js` - Modal para agregar anotaciones

## 🚀 Funcionalidades Implementadas

### ✅ Encabezado
- Selección de cliente (UBR/DYA) con botones visuales
- Dropdown de pilotos desde tabla FLVEH_M004
- Dropdown de vehículos desde tabla FLVEH_M001
- Campo de kilometraje con validación automática
- Campo de observaciones multilínea

### ✅ Validaciones
- Campos requeridos (piloto, vehículo, kilometraje)
- Validación de kilometraje (no puede ser menor al actual del vehículo)
- Carga automática del kilometraje actual al seleccionar vehículo

### ✅ Gestión de Items
- **Carga automática** de items desde tabla `FLVEHI.FLVEH_M007`
- Mover items de "Items a Validar" a "Items Revisados" (botón Pass)
- Regresar items de "Items Revisados" a "Items a Validar" (botón Quitar)
- Agregar anotaciones a items revisados
- Indicador visual para items con anotaciones (fondo amarillo)
- **Preservación del `id_check`** para inserción correcta en `FLVEH_T002`

### ✅ Persistencia de Datos
- Guardado en tabla FLVEH_T001 (datos maestros de la hoja)
- Guardado en tabla FLVEH_T002 (detalle de items revisados)
- Relación por llave compuesta (id_hoja, id_empresa)

### ✅ Interfaz de Usuario
- Diseño responsivo con Tailwind CSS
- Colores y estilos según especificación
- Estados de carga y validación
- Modal para anotaciones
- Botones de acción (Listo! / Cancelar)

## 🛠️ Instalación y Uso

### 1. Backend
```bash
cd backend
npm install
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Acceso
Navegar a: `http://localhost:3001/operaciones/salidas/hoja-es`

## 📊 Estructura de Base de Datos

### Tabla FLVEH_T001 (Maestro)
```sql
- id_hoja (autogenerada)
- id_empresa (default: 1)
- id_cliente (UBR o DYA)
- id_piloto (seleccionado)
- id_vehiculo (seleccionado)
- placa_id (del vehículo)
- lectura_km_num (kilometraje ingresado)
- observaciones
- fe_registro, fe_modificacion
- estado (ACT)
```

### Tabla FLVEH_T002 (Detalle)
```sql
- id_hoja (relacionada con T001)
- id_empresa (default: 1)
- id_check (item del checklist)
- anotacion (comentarios del usuario)
- id_usuario (usuario que revisa)
- fe_registro, fe_modificacion
- estado (ACT)
```

## 🔧 APIs Disponibles

### GET Endpoints
- `GET /api/hoja-es/items` - Obtener items de checklist
- `GET /api/hoja-es/pilotos` - Obtener pilotos disponibles
- `GET /api/hoja-es/vehiculos` - Obtener vehículos disponibles
- `GET /api/hoja-es/vehiculo/:id/kilometraje` - Obtener kilometraje de vehículo
- `GET /api/hoja-es/hojas` - Obtener hojas existentes
- `GET /api/hoja-es/hoja/:id/items` - Obtener items de una hoja

### POST Endpoints
- `POST /api/hoja-es/hoja` - Crear nueva hoja de salida
- `POST /api/hoja-es/item-revisado` - Agregar item revisado

## 🎨 Diseño Visual

El diseño sigue exactamente la especificación proporcionada:
- **Header**: Fondo gris oscuro con botones de cliente
- **Items a Validar**: Panel lila con botones verdes "Pass"
- **Items Revisados**: Panel rosa con botones rojos "Quitar" y morados "Observ"
- **Botones de acción**: Verde "Listo!" y rojo "Cancelar"
- **Items con anotaciones**: Fondo amarillo para indicar observaciones

## 🧪 Pruebas

Ejecutar script de prueba:
```bash
cd backend
node test_hoja_es.js
```

## 📝 Notas Técnicas

- **Autenticación**: Requiere usuario autenticado
- **Validación**: Frontend y backend
- **Responsive**: Diseño adaptativo para móviles y desktop
- **Estado**: Manejo de estado local con React hooks
- **API**: Axios para comunicación con backend
- **Estilos**: Tailwind CSS para diseño consistente

## 🔄 Flujo de Trabajo

1. Usuario selecciona cliente (UBR/DYA)
2. Selecciona piloto y vehículo
3. Sistema carga kilometraje actual del vehículo
4. Usuario ingresa nuevo kilometraje (validado)
5. Usuario revisa items moviendo de "Items a Validar" a "Items Revisados"
6. Opcionalmente agrega anotaciones a items revisados
7. Al presionar "Listo!", se guardan los datos en las tablas correspondientes
8. Sistema resetea el formulario para nueva entrada

¡La implementación está completa y lista para usar! 🎉
