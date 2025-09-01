import React from 'react';
import { useAuth } from '../../context/AuthContext';
import MainNavigation from '../../components/MainNavigation';
import Breadcrumb from '../../components/Breadcrumb';
import { 
  Database, 
  Truck, 
  Users, 
  Building, 
  Wrench, 
  Fuel,
  Package,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CatalogosIndex = () => {
  const { user } = useAuth();

  const breadcrumbItems = [
    { id: 'catalogos', label: 'Catálogos', path: '/catalogos' }
  ];

  const catalogos = [
    {
      id: 'pilotos',
      title: 'Pilotos',
      description: 'Administración de pilotos y conductores',
      icon: <Building className="h-8 w-8 text-purple-600" />,
      path: '/catalogos/pilotos',
      color: 'purple',
      stats: {
        total: 8,
        active: 8,
        inactive: 0
      }
    },

    {
      id: 'empresas',
      title: 'Empresas',
      description: 'Administración de empresas y organizaciones',
      icon: <Building className="h-8 w-8 text-purple-600" />,
      path: '/catalogos/empresas',
      color: 'purple',
      stats: {
        total: 8,
        active: 8,
        inactive: 0
      }
    },

    {
      id: 'vehiculos',
      title: 'Vehículos',
      description: 'Administra la información de todos los vehículos de la flota',
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      path: '/catalogos/vehiculos',
      color: 'blue',
      stats: {
        total: 25,
        active: 23,
        maintenance: 2
      }
    },
    {
      id: 'usuarios',
      title: 'Usuarios y Roles',
      description: 'Gestión de usuarios del sistema y asignación de roles',
      icon: <Users className="h-8 w-8 text-green-600" />,
      path: '/seguridad/usuarios-roles',
      color: 'green',
      stats: {
        total: 15,
        active: 14,
        inactive: 1
      }
    },
    {
      id: 'repuestos',
      title: 'Repuestos',
      description: 'Catálogo de repuestos, piezas y accesorios',
      icon: <Package className="h-8 w-8 text-orange-600" />,
      path: '/catalogos/repuestos',
      color: 'orange',
      stats: {
        total: 150,
        active: 145,
        inactive: 5
      }
    },
    {
      id: 'servicios',
      title: 'Servicios',
      description: 'Tipos de servicios y mantenimientos',
      icon: <Wrench className="h-8 w-8 text-red-600" />,
      path: '/catalogos/servicios',
      color: 'red',
      stats: {
        total: 12,
        active: 12,
        inactive: 0
      }
    },
    {
      id: 'combustibles',
      title: 'Combustibles',
      description: 'Tipos de combustible y proveedores',
      icon: <Fuel className="h-8 w-8 text-yellow-600" />,
      path: '/catalogos/combustibles',
      color: 'yellow',
      stats: {
        total: 5,
        active: 5,
        inactive: 0
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'maintenance':
        return 'Mantenimiento';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Catálogos del Sistema
          </h1>
          <p className="text-slate-600">
            Administra todos los datos maestros y configuraciones del sistema
          </p>
        </div>

        {/* Grid de Catálogos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogos.map((catalogo) => (
            <Link
              key={catalogo.id}
              to={catalogo.path}
              className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
            >
              {/* Header del Catálogo */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    {catalogo.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {catalogo.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {catalogo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="space-y-3 mb-4">
                {catalogo.stats && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-medium text-slate-900">
                      {catalogo.stats.total}
                    </span>
                  </div>
                )}
                {catalogo.stats?.active && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Activos:</span>
                    <span className="font-medium text-green-600">
                      {catalogo.stats.active}
                    </span>
                  </div>
                )}
                {catalogo.stats?.maintenance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Mantenimiento:</span>
                    <span className="font-medium text-yellow-600">
                      {catalogo.stats.maintenance}
                    </span>
                  </div>
                )}
                {catalogo.stats?.inactive && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Inactivos:</span>
                    <span className="font-medium text-red-600">
                      {catalogo.stats.inactive}
                    </span>
                  </div>
                )}
              </div>

              {/* Acción */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600 font-medium">
                    Gestionar
                  </span>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Información Adicional */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Settings className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                ¿Necesitas ayuda con los catálogos?
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                Los catálogos son la base de datos maestra del sistema. Aquí puedes configurar:
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Información de vehículos y flota</li>
                <li>• Usuarios del sistema y sus permisos</li>
                <li>• Configuraciones de empresas y organizaciones</li>
                <li>• Repuestos y componentes del sistema</li>
                <li>• Tipos de servicios y mantenimientos</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CatalogosIndex;

