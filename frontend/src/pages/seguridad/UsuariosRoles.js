import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MainNavigation from '../../components/MainNavigation';
import Breadcrumb from '../../components/Breadcrumb';
import { 
  Users, 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Calendar,
  User,
  Mail,
  Phone,
  Building
} from 'lucide-react';

const UsuariosRoles = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const breadcrumbItems = [
    { id: 'seguridad', label: 'Seguridad', path: '/seguridad' },
    { id: 'usuarios-roles', label: 'Usuarios / Roles', path: '/seguridad/usuarios-roles' }
  ];

  const users = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      username: 'jperez',
      role: 'admin',
      status: 'active',
      company: 'Empresa Principal',
      phone: '+57 300 123 4567',
      lastLogin: '2024-01-20 14:30',
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@empresa.com',
      username: 'mgarcia',
      role: 'manager',
      status: 'active',
      company: 'Empresa Principal',
      phone: '+57 300 234 5678',
      lastLogin: '2024-01-19 09:15',
      createdAt: '2023-03-20'
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      username: 'clopez',
      role: 'user',
      status: 'active',
      company: 'Empresa Principal',
      phone: '+57 300 345 6789',
      lastLogin: '2024-01-18 16:45',
      createdAt: '2023-06-10'
    },
    {
      id: 4,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@empresa.com',
      username: 'arodriguez',
      role: 'user',
      status: 'inactive',
      company: 'Empresa Principal',
      phone: '+57 300 456 7890',
      lastLogin: '2024-01-10 11:20',
      createdAt: '2023-08-05'
    }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'user':
        return 'Usuario';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
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
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Gestión de Usuarios y Roles
            </h1>
            <p className="text-slate-600">
              Administra usuarios del sistema y sus permisos de acceso
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button className="btn-secondary flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Gestionar Roles</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input max-w-xs"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="manager">Gerentes</option>
              <option value="user">Usuarios</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input max-w-xs"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {user.email}
                          </div>
                          <div className="text-xs text-slate-400">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {user.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900 p-1">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No se encontraron usuarios
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay usuarios registrados en el sistema'
              }
            </p>
            {!searchTerm && filterRole === 'all' && filterStatus === 'all' && (
              <button className="btn-primary">
                Registrar Primer Usuario
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Administradores</p>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Último Acceso</p>
                <p className="text-sm font-bold text-slate-900">Hoy</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsuariosRoles; 