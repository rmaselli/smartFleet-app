import React from 'react';
import { useAuth } from '../context/AuthContext';
import MainNavigation from '../components/MainNavigation';
import { 
  Shield, 
  Database, 
  Settings, 
  Package, 
  Search,
  Users,
  Truck,
  Fuel,
  Wrench,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const MainDashboard = () => {
  const { user } = useAuth();

  const mainSections = [
    {
      id: 'seguridad',
      title: 'Seguridad',
      description: 'Gestión de usuarios, roles y auditoría',
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      color: 'blue',
      stats: {
        total: 25,
        active: 23,
        pending: 2
      },
      path: '/seguridad'
    },
    {
      id: 'catalogos',
      title: 'Catálogos',
      description: 'Administración de datos maestros',
      icon: <Database className="h-8 w-8 text-green-600" />,
      color: 'green',
      stats: {
        total: 150,
        active: 145,
        pending: 5
      },
      path: '/catalogos'
    },
    {
      id: 'Operaciones',
      title: 'Operaciones',
      description: 'Flujos de trabajo automatizados',
      icon: <Settings className="h-8 w-8 text-purple-600" />,
      color: 'purple',
      stats: {
        total: 89,
        active: 75,
        pending: 14
      },
      path: '/operaciones'
    },
    {
      id: 'Procesos',
      title: 'Procesos',
      description: 'Control de inventario y cambios',
      icon: <Package className="h-8 w-8 text-orange-600" />,
      color: 'orange',
      stats: {
        total: 320,
        active: 298,
        pending: 22
      },
      path: '/procesos'
    },
    {
      id: 'consultas',
      title: 'Consultas',
      description: 'Reportes y análisis de datos',
      icon: <Search className="h-8 w-8 text-indigo-600" />,
      color: 'indigo',
      stats: {
        total: 45,
        active: 45,
        pending: 0
      },
      path: '/consultas'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      action: 'Usuario creado',
      description: 'Nuevo usuario "Juan Pérez" agregado al sistema',
      time: 'Hace 5 minutos',
      status: 'success'
    },
    {
      id: 2,
      type: 'vehicle',
      action: 'Vehículo registrado',
      description: 'Vehículo "ABC-123" agregado al catálogo',
      time: 'Hace 15 minutos',
      status: 'success'
    },
    {
      id: 3,
      type: 'service',
      action: 'Servicio programado',
      description: 'Mantenimiento programado para vehículo "XYZ-789"',
      time: 'Hace 1 hora',
      status: 'pending'
    },
    {
      id: 4,
      type: 'fuel',
      action: 'Vale de combustible',
      description: 'Vale aprobado para vehículo "DEF-456"',
      time: 'Hace 2 horas',
      status: 'success'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'vehicle':
        return <Truck className="h-4 w-4 text-green-500" />;
      case 'service':
        return <Wrench className="h-4 w-4 text-purple-500" />;
      case 'fuel':
        return <Fuel className="h-4 w-4 text-orange-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenido, {user?.full_name}
          </h1>
          <p className="text-slate-600">
            Panel de control de FleetSmart - Sistema de Gestión de Flotas
          </p>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mainSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              onClick={() => window.location.href = section.path}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${section.color}-50 group-hover:bg-${section.color}-100 transition-colors duration-200`}>
                  {section.icon}
                </div>
                {/*}
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">
                     {section.stats.total} 
                  </div>
                  <div className="text-sm text-slate-500">Total</div>
                </div>
                */}
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {section.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                {section.description}
              </p>
              
              {/*
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                 
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-600">
                    {section.stats.active} Activos
                  </span>
                </div>
                
                {section.stats.pending > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-slate-600">
                      {section.stats.pending} Pendientes
                    </span>
                  </div>
                )}
                  
              </div>
              */}
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Vehículos</p>
                <p className="text-2xl font-bold text-slate-900">156</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-slate-500 ml-1">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pilotos Activos</p>
                <p className="text-2xl font-bold text-slate-900">89</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+5%</span>
              <span className="text-slate-500 ml-1">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Servicios Hoy</p>
                <p className="text-2xl font-bold text-slate-900">23</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-600">En progreso</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Vales Combustible</p>
                <p className="text-2xl font-bold text-slate-900">45</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Fuel className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">Aprobados</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-150">
                <div className="flex-shrink-0">
                  {getTypeIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-slate-600">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(activity.status)}
                  <span className="text-xs text-slate-500">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard; 