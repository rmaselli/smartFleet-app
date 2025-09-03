import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MainNavigation from '../../components/MainNavigation';
import Breadcrumb from '../../components/Breadcrumb';


//estos son los componentes de debug que se han comentado por el momento
//ya que si se habilitan, se puede ver que la conexión a la API esta funcionando correctamente
//pero se debe habilitar para poder hacer pruebas de debug

//import ApiStatus from '../../components/ApiStatus';
//import HeadersDebug from '../../components/HeadersDebug';
//import ConnectionTest from '../../components/ConnectionTest';
//import AuthDebug from '../../components/AuthDebug';
//import LoginDebug from '../../components/LoginDebug';

import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  Save,
  X,
  RefreshCw,
  Bike
} from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';
import API_CONFIG from '../../config/api';
import { getEnvConfig } from '../../config/environment';


const Clientes = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id_empresa: 1,
    cod_cliente: 1,
    cod_alterno: '',
    cod_abreviado: '',
    tipo_cliente: '',
    nombre: '',
    razon_social: '',
    nit: '',
    direccion: '',
    email: '',
    telefono: '',
    contacto1: '',
    contacto2: '',
    tel_contacto1: '',
    tel_contacto2: '',
    estado: 'ACT',
    observaciones: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const breadcrumbItems = [
    { id: 'catalogos', label: 'Catálogos', path: '/catalogos' },
    //{ id: 'vehiculos', label: 'Vehículos', path: '/catalogos/vehiculos' },
    { id: 'clientes', label: 'Clientes', path: '/catalogos/clientes' }
  ];

  // Estados disponibles
  const estados = [
    { value: 'ACT', label: 'Activo' },
    { value: 'SUS', label: 'Suspendido' },
    { value: 'CAN', label: 'Cancelado' },
    { value: 'BLQ', label: 'Bloqueado' },
    { value: 'TER', label: 'Terminado' }
  ];

  // Tipos de cliente
  const tiposCliente = [
    'Taller',
    'Flotilla',
    'Otro'
  ];

  // Combustibles
  const combustibles = [
    'Gasolina',
    'Diesel',
    'Eléctrico',
    'Híbrido',
    'Gas Natural',
    'Otro'
  ];

  // Cargar Clientes
  const loadClientes = async () => {
    setLoading(true);
    try {
      console.log('🚀 Cargando clientes desde:', API_CONFIG.CLIENTES.LIST);
      const response = await axiosInstance.get(API_CONFIG.CLIENTES.LIST);
      console.log('✅ Respuesta de clientes:', response.data);
      
      if (response.data.success) {
        setClientes(response.data.data);
        console.log(`📊 ${response.data.data.length} clientes cargados`);
      } else {
        console.warn('⚠️ Respuesta sin éxito:', response.data);
        setClientes([]);
      }
    } catch (error) {
      console.error('❌ Error cargando clientes:', error);
      console.error('📋 Detalles del error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      // Mostrar mensaje de error más específico
      if (error.response?.status === 401) {
        alert('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 500) {
        alert('Error del servidor. Por favor, intenta más tarde.');
      } else if (error.code === 'ECONNABORTED') {
        alert('Timeout de conexión. Verifica tu conexión a internet.');
      } else if (!error.response) {
        alert('Error de conexión. Verifica que el servidor esté funcionando.');
      } else {
        alert(`Error ${error.response.status}: ${error.response.data?.error || 'Error desconocido'}`);
      }
      
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClientes();
  }, []);

  // Filtrar Clientes
  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch =
                         cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.razon_social?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || cliente.estado === filterStatus;
    //const matchesType = filterType === 'all' || piloto.tipo_vehiculo === filterType;
    
    return matchesSearch && matchesStatus;// && matchesType;
  });

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.cod_cliente) errors.cod_cliente = 'El código de cliente es requerido';
    if (!formData.cod_alterno || !formData.cod_alterno.trim()) errors.cod_alterno = 'El código alterno es requerido';
    if (!formData.cod_abreviado || !formData.cod_abreviado.trim()) errors.cod_abreviado = 'El código abreviado es requerido';
    if (!formData.tipo_cliente || !formData.tipo_cliente.trim()) errors.tipo_cliente = 'El tipo de cliente es requerido';
    if (!formData.nombre || !formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.razon_social || !formData.razon_social.trim()) errors.razon_social = 'La razón social es requerida';
    if (!formData.nit || !formData.nit.trim()) errors.nit = 'El NIT es requerido';
    if (!formData.direccion || !formData.direccion.trim()) errors.direccion = 'La dirección es requerida';
    if (!formData.email || !formData.email.trim()) errors.email = 'El email es requerido';
    if (!formData.telefono || !formData.telefono.trim()) errors.telefono = 'El teléfono es requerido';
    if (!formData.contacto1 || !formData.contacto1.trim()) errors.contacto1 = 'El contacto 1 es requerido';
    if (!formData.contacto2 || !formData.contacto2.trim()) errors.contacto2 = 'El contacto 2 es requerido';
    if (!formData.tel_contacto1 || !formData.tel_contacto1.trim()) errors.tel_contacto1 = 'El teléfono de contacto 1 es requerido';
    if (!formData.tel_contacto2 || !formData.tel_contacto2.trim()) errors.tel_contacto2 = 'El teléfono de contacto 2 es requerido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Abrir formulario para nuevo cliente
  const openNewForm = () => {
    setFormData({
      id_empresa: 1,
      cod_cliente: 1,
      cod_alterno: '',
      cod_abreviado: '',
      tipo_cliente: '',
      nombre: '',
      razon_social: '',
      nit: '',
      direccion: '',
      email: '',
      telefono: '',
      contacto1: '',
      contacto2: '',
      tel_contacto1: '',
      tel_contacto2: '',
      estado: 'ACT',
      observaciones: ''      
    });
    setFormErrors({});
    setEditingCliente(null);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const openEditForm = (cliente) => {
    setFormData({
      id_empresa: cliente.id_empresa || 1,
      cod_cliente: cliente.cod_cliente || '',
      cod_alterno: cliente.cod_alterno || '',
      cod_abreviado: cliente.cod_abreviado || '',
      tipo_cliente: cliente.tipo_cliente || '',
      nombre: cliente.nombre || '',
      razon_social: cliente.razon_social || '',
      nit: cliente.nit || '',
      direccion: cliente.direccion || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      contacto1: cliente.contacto1 || '',
      contacto2: cliente.contacto2 || '',
      tel_contacto1: cliente.tel_contacto1 || '',
      tel_contacto2: cliente.tel_contacto2 || '',
      observaciones: cliente.observaciones || ''
    });
    setFormErrors({});
    setEditingCliente(cliente);
    setShowForm(true);
  };

  // Cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setEditingCliente(null);
    setFormData({
      id_empresa: 1,
      cod_cliente: 1,
      cod_alterno: '',
      cod_abreviado: '',
      tipo_cliente: '',
      nombre: '',
      razon_social: '',
      nit: '',
      direccion: '',
      email: '',
      telefono: '',
      contacto1: '',
      contacto2: '',
      tel_contacto1: '',
      tel_contacto2: '',
      estado: 'ACT',
      observaciones: ''
    });
    setFormErrors({});
  };

  // Guardar cliente
  const saveCliente = async () => {
    console.log('<<Entra>>', formData);
    if (!validateForm()) return;

    try {
      console.log('🚀 Guardando cliente:', formData);
      
        if (editingCliente) {
        // Actualizar
        console.log('📝 Actualizando cliente ID:', editingCliente.id_cliente);
        const response = await axiosInstance.put(API_CONFIG.CLIENTES.UPDATE(editingCliente.id_cliente), formData);
        console.log('✅ Cliente actualizado:', response.data);
        
        if (response.data.success) {
          alert('Cliente actualizado exitosamente');
          await loadClientes();
          closeForm();
        }
      } else {
        // Crear nuevo
        console.log('🆕 Creando nuevo cliente');
        const response = await axiosInstance.post(API_CONFIG.CLIENTES.CREATE, formData);
        console.log('✅ Cliente creado:', response.data);
        
        if (response.data.success) {
          alert('Cliente creado exitosamente');
          await loadClientes();
          closeForm();
        }
      }
    } catch (error) {
      console.error('❌ Error guardando cliente:', error);
      console.error('📋 Detalles del error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      // Mostrar mensaje de error más específico
      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.error || 'Datos inválidos';
        alert(`Error de validación: ${errorMsg}`);
      } else if (error.response?.status === 401) {
        alert('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 500) {
        alert('Error del servidor. Por favor, intenta más tarde.');
      } else if (error.code === 'ECONNABORTED') {
        alert('Timeout de conexión. Verifica tu conexión a internet.');
      } else if (!error.response) {
        alert('Error de conexión. Verifica que el servidor esté funcionando.');
      } else {
        alert(`Error ${error.response.status}: ${error.response.data?.error || 'Error desconocido'}`);
      }
    }
  };

  // Eliminar cliente
  const deleteCliente = async (id) => {
    try {
      const response = await axiosInstance.delete(API_CONFIG.CLIENTES.DELETE(id));
      if (response.data.success) {
        await loadClientes();
      }
    } catch (error) {
      console.error('Error deleting cliente:', error);
    }
  };

  // Mostrar confirmación de eliminación
  const showDeleteConfirmation = (cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (clienteToDelete) {
      await deleteCliente(clienteToDelete.id_cliente);
      setShowDeleteConfirm(false);
      setClienteToDelete(null);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setClienteToDelete(null);
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACT':
        return 'bg-green-100 text-green-800';
      case 'SUP':
        return 'bg-yellow-100 text-purple-800';
      case 'TMP':
        return 'bg-red-100 text-red-800';
      case 'TER':
        return 'bg-orange-100 text-red-800';
      case 'MED':
        return 'bg-orange-100 text-yellow-800';
      case 'RET':
        return 'bg-orange-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status) => {
    const estado = estados.find(e => e.value === status);
    return estado ? estado.label : 'Desconocido';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Catálogo de Clientes
            </h1>
            <p className="text-slate-600">
              Administra la información de todos los clientes de la flota
            </p>

            {/* Aqui muestra el status de la API            */}
            {/*
            <div className="mt-2">
              <ApiStatus />
            </div>
            */}

            {/* Aqui muestra el status de los headers */}
            {/*
            <div className="mt-2">
              <HeadersDebug />
            </div>
            */}
            
            {/* Aqui muestra el status de la conexión */}
            <div className="mt-2">
              <button
                onClick={loadClientes}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Cargando...' : 'Recargar Clientes'}
              </button>
            </div>

            {/* Aqui muestra el status de la conexión */}
            {/*
            <div className="mt-2">
              <ConnectionTest />
            </div>
            */}

            {/* Aqui muestra el status de la autenticación */}
            {/*
            <div className="mt-2">
              <AuthDebug />
            </div>
            */}

            {/* Aqui muestra el status de la conexión */}
            {/*
            <div className="mt-2">
              <LoginDebug />
            </div>
            */}
          </div>
          
          <button 
            onClick={openNewForm}
            className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>

        {/* SECCIÓN 1: FORMULARIO DE CAPTURA */}
        {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Empresa *
                </label>
                <input
                  type="number"
                  name="id_empresa"
                  value={formData.id_empresa}
                  onChange={handleFormChange}
                  className={`input ${formErrors.id_empresa ? 'border-red-500' : ''}`}
                  placeholder="1"
                />
                {formErrors.id_empresa && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.id_empresa}</p>
                )}
              </div>


              {/* Código de Cliente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código de Cliente *
                </label>
                <input
                  type="number"
                  name="cod_cliente"
                  value={formData.cod_cliente}
                  onChange={handleFormChange}
                  className={`input ${formErrors.cod_cliente ? 'border-red-500' : ''}`}
                  placeholder="CLI001"
                />
                {formErrors.cod_cliente && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cod_cliente}</p>
                )}
              </div>

              {/* Código Alterno */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código Alterno *
                </label>
                <input
                  type="text"
                  name="cod_alterno"
                  value={formData.cod_alterno}
                  onChange={handleFormChange}
                  className={`input ${formErrors.cod_alterno ? 'border-red-500' : ''}`}
                  placeholder="ALT001"
                />
                {formErrors.cod_alterno && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cod_alterno}</p>
                )}
              </div>

              {/* Código Abreviado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código Abreviado *
                </label>
                <input
                  type="text"
                  name="cod_abreviado"
                  value={formData.cod_abreviado}
                  onChange={handleFormChange}
                  className={`input ${formErrors.cod_abreviado ? 'border-red-500' : ''}`}
                  placeholder="ABR001"
                />
              </div>  


              {/* Tipo de Cliente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Cliente *
                </label>
                <input
                  type="text"
                  name="tipo_cliente"
                  value={formData.tipo_cliente}
                  onChange={handleFormChange}
                  className={`input ${formErrors.tipo_cliente ? 'border-red-500' : ''}`}
                  placeholder="Taller"
                />
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleFormChange}
                  className={`input ${formErrors.nombre ? 'border-red-500' : ''}`}
                  placeholder="Empresa ABC S.A."
                />
              </div>

              {/* Razón Social */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Razón Social *
                </label>
                <input
                  type="text"
                  name="razon_social"
                  value={formData.razon_social}
                  onChange={handleFormChange}
                  className={`input ${formErrors.razon_social ? 'border-red-500' : ''}`}
                  placeholder="Empresa ABC Sociedad Anónima"
                />
                {formErrors.razon_social && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.razon_social}</p>
                )}
              </div>

               {/* NIT */}
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  NIT *
                </label>
                <input
                  type="text"
                  name="nit"
                  value={formData.nit}
                  onChange={handleFormChange}
                  className={`input ${formErrors.nit ? 'border-red-500' : ''}`}
                  placeholder="1234567890"
                />
                {formErrors.nit && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.nit}</p>
                )}
              </div>


                {/* Dirección */}
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleFormChange}
                  className={`input ${formErrors.direccion ? 'border-red-500' : ''}`}
                  placeholder="Calle 123, Ciudad, País"
                />
                {formErrors.direccion && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.direccion}</p>
                )}
              </div>

                {/* email */}
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className={`input ${formErrors.email ? 'border-red-500' : ''}`}
                  placeholder="contacto@empresa.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>


                {/* teléfono */}
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleFormChange}
                  className={`input ${formErrors.telefono ? 'border-red-500' : ''}`}
                  placeholder="+57 300 123 4567"
                />
              </div>

              {/* Contacto 1 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contacto 1 *
                </label>
                <input
                  type="text"
                  name="contacto1"
                  value={formData.contacto1}
                  onChange={handleFormChange}
                  className={`input ${formErrors.contacto1 ? 'border-red-500' : ''}`}
                  placeholder="Juan Pérez"
                />
              </div>

              {/* Contacto 2 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contacto 2 *
                </label>
                <input
                  type="text"
                  name="contacto2"
                  value={formData.contacto2}
                  onChange={handleFormChange}
                  className={`input ${formErrors.contacto2 ? 'border-red-500' : ''}`}
                  placeholder="María García"
                />
              </div>

              {/* Teléfono de contacto 1 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono de Contacto 1 *
                </label>
                <input
                  type="text"
                  name="tel_contacto1"
                  value={formData.tel_contacto1}
                  onChange={handleFormChange}
                  className={`input ${formErrors.tel_contacto1 ? 'border-red-500' : ''}`}
                  placeholder="+57 300 123 4567"
                />
              </div>              
              
              {/* Teléfono de contacto 2 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono de Contacto 2 *
                </label>
                <input
                  type="text"
                  name="tel_contacto2"
                  value={formData.tel_contacto2}
                  onChange={handleFormChange}
                  className={`input ${formErrors.tel_contacto2 ? 'border-red-500' : ''}`}
                  placeholder="+57 300 987 6543"
                />
              </div>


              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado *
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleFormChange}
                  className={`input ${formErrors.estado ? 'border-red-500' : ''}`}
                >
                  {estados.map(estado => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
                {formErrors.estado && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.estado}</p>
                )}
              </div>



            </div>


            {/* Observaciones */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleFormChange}
                rows="3"
                className="input w-full"
                placeholder="Observaciones adicionales..."
              />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={closeForm}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={saveCliente}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingCliente ? 'Actualizar' : 'Guardar'}</span>
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: LISTADO DE REGISTROS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {/* Filtros y búsqueda */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código de cliente, nombre, razón social..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input max-w-xs"
            >
              <option value="all">Todos los estados</option>
              {estados.map(estado => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>


            <button
              onClick={loadClientes}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
                  </button>
              </div>

          {/* Tabla de clientes */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Razón Social
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Cargando clientes...</span>
                        <span className="text-xs text-gray-500">Verificando conexión con el servidor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <User className="h-12 w-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">No se encontraron clientes</span>
                        <span className="text-xs text-gray-500">Intenta ajustar los filtros o agregar un nuevo cliente</span>
                        <button
                          onClick={openNewForm}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Cliente
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map((cliente) => (
                    <tr key={cliente.id_cliente} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600 fill-blue-600" />
                </div>
              </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {cliente.nombre} {cliente.razon_social}
                </div>
                            <div className="text-sm text-slate-500">
                              {cliente.nit}
                </div>
              </div>
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          <div>Rzn Social: {cliente.razon_social }</div>
                          <div>NIT: {cliente.nit}</div>
                         {/* {vehicle.color && <div>Color: {vehicle.color}</div>} */}
                         {/* {vehicle.kilometraje && <div>KM: {vehicle.kilometraje.toLocaleString()}</div>} */}
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cliente.estado)}`}>
                          {getStatusText(cliente.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {cliente.fe_registro ? new Date(cliente.fe_registro).toLocaleDateString(getEnvConfig('DATE_FORMAT')) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(cliente)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Editar"
                          >
                  <Edit className="h-4 w-4" />
                </button>
                          <button
                            onClick={() => showDeleteConfirmation(cliente)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Eliminar"
                          >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>

          {/* Información de registros */}
          <div className="mt-4 text-sm text-slate-500">
            Mostrando {filteredClientes.length} de {clientes.length} clientes
            </div>
          </div>
      </main>

      {/* Confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-slate-700 mb-6">
              ¿Estás seguro de que quieres eliminar el cliente "{clienteToDelete?.id_cliente}"?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes; 