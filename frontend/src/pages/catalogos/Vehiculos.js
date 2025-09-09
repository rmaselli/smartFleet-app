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


const Vehiculos = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [pilotos, setPilotos] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    id_empresa: 1,
    id_sede: 1,
    marca_vehiculo: '',
    placa_id: '',
    modelo: '',
    anio_vehiculo: new Date().getFullYear(),
    tipo_vehiculo: 1,
    estado: 'ACT',
    color: '',
    motor: '',
    chasis: '',
    kilometraje: 0,
    tipo_combustible: 'Gasolina',
    capacidad_carga: '',
    id_piloto: 1,
    fe_compra: '',
    fecha_proximo_servicio: '',
    gasto_total_servicios: '',
    //ultima_lectura: '',
    observaciones: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const breadcrumbItems = [
    { id: 'catalogos', label: 'Catálogos', path: '/catalogos' },
    { id: 'vehiculos', label: 'Vehículos', path: '/catalogos/vehiculos' }
  ];

  // Estados disponibles
  const estados = [
    { value: 'ACT', label: 'Activo' },
    { value: 'MNT', label: 'En Mantenimiento' },
    { value: 'INA', label: 'Inactivo' },
    { value: 'REP', label: 'En Reparación' },
    { value: 'VND', label: 'Vendido' },
    { value: 'MES', label: 'Mal estado ' }
  ];

  // Tipos de vehículo
  const tiposVehiculo = [
    'Pickup',
    'Camión',
    'Furgón',
    'Sedán',
    'SUV',
    'Motocicleta',
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

  // Control de servicio
  const controlServicio = [
    'Kilometraje',
    'Tiempo'
  ];

  // Cargar vehículos
  const loadVehicles = async () => {
    setLoading(true);
    try {
      console.log('🚀 Cargando vehículos desde:', API_CONFIG.VEHICULOS.LIST);
      const response = await axiosInstance.get(API_CONFIG.VEHICULOS.LIST);
      console.log('✅ Respuesta de vehículos:', response.data);
      
      if (response.data.success) {
        setVehicles(response.data.data);
        console.log(`📊 ${response.data.data.length} vehículos cargados`);
      } else {
        console.warn('⚠️ Respuesta sin éxito:', response.data);
        setVehicles([]);
      }
    } catch (error) {
      console.error('❌ Error cargando vehículos:', error);
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
      
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar pilotos
  const loadPilotos = async () => {
    try {
      const response = await axiosInstance.get(API_CONFIG.PILOTOS.LIST);
      if (response.data.success) {
        setPilotos(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando pilotos:', error);
    }
  };

  // Cargar vehículos al montar el componente
  useEffect(() => {
    loadVehicles();
    loadPilotos();
    loadTiposVehiculos();
  }, []);


  // Cargar tipos de vehículos
  const loadTiposVehiculos = async () => {
    try {
      const response = await axiosInstance.get(API_CONFIG.TIPOS_VEHICULOS.LIST);
      if (response.data.success) {
        setTiposVehiculos(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando tipos de vehículos:', error);
    }
  };
  
  // Filtrar vehículos
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.placa_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.marca_vehiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || vehicle.estado === filterStatus;
    const matchesType = filterType === 'all' || vehicle.tipo_vehiculo === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.id_sede) errors.id_sede = 'La sede es requerida';
    if (!formData.placa_id.trim()) errors.placa_id = 'La placa es requerida';
    if (!formData.marca_vehiculo.trim()) errors.marca_vehiculo = 'La marca es requerida';
    if (!formData.modelo.trim()) errors.modelo = 'El modelo es requerido';
    if (!formData.anio_vehiculo) errors.anio_vehiculo = 'El año es requerido';
    if (!formData.tipo_vehiculo.trim()) errors.tipo_vehiculo = 'El tipo de vehículo es requerido';
    if (!formData.estado) errors.estado = 'El estado es requerido';
    //if (formData.umbral_servicio<101 || formData.umbral_servicio<0) errors.umbral_servicio = 'El umbral de servicio debe ser 0 a 100';
    
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

  // Abrir formulario para nuevo vehículo
  const openNewForm = () => {
    setFormData({
      id_empresa: 1,
      id_sede: 1,
      marca_vehiculo: '',
      placa_id: '',
      modelo: '',
      anio_vehiculo: new Date().getFullYear(),
      tipo_vehiculo: '',
      estado: 'ACT',
      color: '',
      motor: '',
      chasis: '',
      kilometraje: '',
      tipo_combustible: '',
      capacidad_carga: '',
      id_piloto: 1,
      fe_compra: '',
      ultima_lectura: '',
      observaciones: '',
      fe_registro: ''
    });
    setFormErrors({});
    setEditingVehicle(null);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const openEditForm = (vehicle) => {
    setFormData({
      id_empresa: vehicle.id_empresa || 1,
      id_sede: vehicle.id_sede || 1,
      marca_vehiculo: vehicle.marca_vehiculo || '',
      placa_id: vehicle.placa_id || '',
      modelo: vehicle.modelo || '',
      anio_vehiculo: vehicle.anio_vehiculo || new Date().getFullYear(),
      tipo_vehiculo: vehicle.tipo_vehiculo || '',
      estado: vehicle.estado || 'ACT',
      color: vehicle.color || '',
      motor: vehicle.motor || '',
      chasis: vehicle.chasis || '',
      kilometraje: vehicle.kilometraje || '',
      tipo_combustible: vehicle.tipo_combustible || '',
      capacidad_carga: vehicle.capacidad_carga || '',
      id_piloto: vehicle.id_piloto,
      fe_compra: vehicle.fe_compra || '',
      ultima_lectura: vehicle.ultima_lectura || '',
      observaciones: vehicle.observaciones || '',
      fe_registro: vehicle.fe_registro || '',
      fe_modificacion: vehicle.fe_modificacion || ''  
    });
    setFormErrors({});
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  // Cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
    setFormData({
      id_empresa: 1,
      id_sede: 1,
      marca_vehiculo: '',
      placa_id: '',
      modelo: '',
      anio_vehiculo: new Date().getFullYear(),
      tipo_vehiculo: '',
      estado: 'ACT',
      color: '',
      motor: '',
      chasis: '',
      kilometraje: '',
      tipo_combustible: '',
      capacidad_carga: '',
      id_piloto: 1,
      fe_compra: '',
      ultima_lectura: '',
      observaciones: ''
    });
    setFormErrors({});
  };

  // Guardar vehículo
  const saveVehicle = async () => {
    if (!validateForm()) return;

    try {
      console.log('🚀 Guardando vehículo:', formData);
      
      if (editingVehicle) {
        // Actualizar
        console.log('📝 Actualizando vehículo ID:', editingVehicle.id_vehiculo);
        const response = await axiosInstance.put(API_CONFIG.VEHICULOS.UPDATE(editingVehicle.id_vehiculo), formData);
        console.log('✅ Vehículo actualizado:', response.data);
        
        if (response.data.success) {
          alert('Vehículo actualizado exitosamente');
          await loadVehicles();
          closeForm();
        }
      } else {
        // Crear nuevo
        console.log('🆕 Creando nuevo vehículo');
        const response = await axiosInstance.post(API_CONFIG.VEHICULOS.CREATE, formData);
        console.log('✅ Vehículo creado:', response.data);
        
        if (response.data.success) {
          alert('Vehículo creado exitosamente');
          await loadVehicles();
          closeForm();
        }
      }
    } catch (error) {
      console.error('❌ Error guardando vehículo:', error);
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

  // Eliminar vehículo
  const deleteVehicle = async (id) => {
    try {
      const response = await axiosInstance.delete(API_CONFIG.VEHICULOS.DELETE(id));
      if (response.data.success) {
        await loadVehicles();
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  // Mostrar confirmación de eliminación
  const showDeleteConfirmation = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (vehicleToDelete) {
      await deleteVehicle(vehicleToDelete.id_vehiculo);
      setShowDeleteConfirm(false);
      setVehicleToDelete(null);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setVehicleToDelete(null);
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACT':
        return 'bg-green-100 text-green-800';
      case 'MNT':
        return 'bg-yellow-100 text-yellow-800';
      case 'INA':
        return 'bg-red-100 text-red-800';
      case 'REP':
        return 'bg-orange-100 text-orange-800';
      case 'VND':
        return 'bg-red-100 text-red-800';
      case 'MES':
        return 'bg-gray-100 text-fuchsia-800';
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
              Catálogo de Vehículos
            </h1>
            <p className="text-slate-600">
              Administra la información de todos los vehículos de la flota
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
                onClick={loadVehicles}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Cargando...' : 'Recargar Vehículos'}
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
            <span>Nuevo Vehículo</span>
          </button>
        </div>

        {/* SECCIÓN 1: FORMULARIO DE CAPTURA */}
        {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


              {/* Sede */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sede *
                </label>
                <input
                  type="number"
                  name="id_sede"
                  value={formData.id_sede}
                  onChange={handleFormChange}
                  className={`input ${formErrors.id_sede ? 'border-red-500' : ''}`}
                  placeholder="1"
                />
                {formErrors.id_sede && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.id_sede}</p>
                )}
              </div>


              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  name="marca_vehiculo"
                  value={formData.marca_vehiculo}
                  onChange={handleFormChange}
                  className={`input ${formErrors.marca_vehiculo ? 'border-red-500' : ''}`}
                  placeholder="Toyota"
                />
                {formErrors.marca_vehiculo && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.marca_vehiculo}</p>
                )}
              </div>

              {/* Placa */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Placa *
                </label>
                <input
                  type="text"
                  name="placa_id"
                  value={formData.placa_id}
                  onChange={handleFormChange}
                  className={`input ${formErrors.placa_id ? 'border-red-500' : ''}`}
                  placeholder="ABC-123"
                />
                {formErrors.placa_id && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.placa_id}</p>
                )}
              </div>



              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleFormChange}
                  className={`input ${formErrors.modelo ? 'border-red-500' : ''}`}
                  placeholder="Hilux"
                />
                {formErrors.modelo && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.modelo}</p>
                )}
              </div>

              {/* Año */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Año *
                </label>
                <input
                  type="number"
                  name="anio_vehiculo"
                  value={formData.anio_vehiculo}
                  onChange={handleFormChange}
                  className={`input ${formErrors.anio_vehiculo ? 'border-red-500' : ''}`}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                {formErrors.anio_vehiculo && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.anio_vehiculo}</p>
                )}
              </div>

              {/* Tipo de Vehículo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Vehículo
                </label>
                <select
                  name="tipo_vehiculo"
                  value={formData.tipo_vehiculo || ''}
                  onChange={handleFormChange}
                  className="input"
                >
                  <option value="">Seleccionar tipo de vehículo</option>
                  {tiposVehiculos.map(TipoVehiculo => (
                    <option key={TipoVehiculo.id_tipo_vehiculo} value={TipoVehiculo.id_tipo_vehiculo}>
                      {TipoVehiculo.desc_tipo_vehiculo} - {TipoVehiculo.id_tipo_vehiculo}
                    </option>
                  ))}
                </select>
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

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="Blanco"
                />
              </div>

              {/* Motor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motor
                </label>
                <input
                  type="text"
                  name="motor"
                  value={formData.motor}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="2.4L"
                />
              </div>

              {/* Chasis */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Chasis
                </label>
                <input
                  type="text"
                  name="chasis"
                  value={formData.chasis}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="Número de chasis"
                />
              </div>

              {/* Kilometraje */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kilometraje
                </label>
                <input
                  type="number"
                  name="kilometraje"
                  value={formData.kilometraje}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Control de servicio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Control de servicio
                </label>
                <select
                  name="control_servicio"
                  value={formData.control_servicio}
                  onChange={handleFormChange}
                  className="input"
                >
                  <option  defaultValue={controlServicio[0]} value={controlServicio[0]}>Kilometraje</option>
                  {controlServicio.map(control_servicio => (
                    <option key={control_servicio} value={control_servicio}>{control_servicio}</option>
                  ))}
                </select>
              </div>


              {/* Piloto */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Piloto
                </label>
                <select
                  name="id_piloto"
                  value={formData.id_piloto}
                  onChange={handleFormChange}
                  className="input"
                >
                  <option value="">Seleccionar piloto</option>
                  {pilotos.map(piloto => (
                    <option key={piloto.id_piloto} value={piloto.id_piloto}>
                      {piloto.nombres} {piloto.apellidos} - {piloto.num_dpi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha de Compra */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Compra
                </label>
                <input type="date" name="fe_compra" value={formData.fe_compra} onChange={handleFormChange} className="input" />
              </div>

              {/* Combustible */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Combustible
                </label>
                <select
                  name="tipo_combustible"
                  value={formData.tipo_combustible}
                  onChange={handleFormChange}
                  className="input"
                >
                  <option value="">Seleccionar combustible</option>
                  {combustibles.map(tipo_combustible => (
                    <option key={tipo_combustible} value={tipo_combustible}>{tipo_combustible}</option>
                  ))}
                </select>
              </div>

              {/* Capacidad de Carga */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Capacidad de Carga
                </label>
                <input
                  type="text"
                  name="capacidad_carga"
                  value={formData.capacidad_carga}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="1000 kg"
                />
              </div>

              {/* Umbral de Servicio */}
              

              <div>
                <label className="block text-red-500 text-sm font-medium text-slate-700 mb-2">
                  % Umbral de Servicio
                </label>
                <input
                  type="number"
                  name="umbral_servicio"
                  value={formData.umbral_servicio}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="95"
                />
              </div>

              {/* Ultima Lectura */}
              {/* {formData.ultima_lectura} */}
              <div>
                <label className="block text-sm mb-2 text-red-500 font-bold">
                  Ultima Lectura
                  </label>
                <input
                  type="number"
                  name="ultima_lectura"
                  value={formData.ultima_lectura}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="1000"
                  readOnly
                />
              </div>

              {/* Ultimo KM Taller */}
              <div>
                <label className="block text-sm mb-2 text-red-500 font-bold">
                  Ultimo KM Taller
                  </label>
                <input
                  type="number"
                  name="ultimo_km_taller"
                  value={formData.ultimo_km_taller}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="1000"
                  readOnly
                />
              </div>


              {/* Ultimo Servicio Taller */}
              <div>
                <label className="block text-sm mb-2 text-red-500 font-bold">
                  Ultimo Servicio Taller
                  </label>
                <input
                  type="text"
                  name="ultimo_servicio_taller"
                  value={formData.ultimo_servicio_taller}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="2020-09-01"
                  readOnly
                />
              </div>


              {/* Fecha proximo servicio */}
              <div>
                <label className="block text-sm mb-2 text-red-500 font-bold">
                  Fecha Proximo Servicio
                  </label>
                <input
                  type="date"
                  name="fecha_proximo_servicio"
                  value={formData.fecha_proximo_servicio}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="2025-10-10"
                  readOnly
                />
              </div>

              {/* Gasto Total Servicio */}
              <div>
                <label className="block text-sm mb-2 text-red-500 font-bold">
                  Gasto Total Servicios
                  </label>
                <input
                  type="number"
                  name="gasto_total"
                  value={formData.gasto_total}
                  onChange={handleFormChange}
                  className="input"
                  placeholder="1000"
                  readOnly
                />
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

            {/* Datos Footer, que serán datos acumulativos, calculados  */}
            Fe/Registro: {formData.fe_registro} & Fe/Modificacion: {formData.fe_modificacion}
            
            
            
            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={closeForm}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={saveVehicle}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingVehicle ? 'Actualizar' : 'Guardar'}</span>
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
                placeholder="Buscar por placa, marca, modelo..."
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

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input max-w-xs"
            >
              <option value="all">Todos los tipos</option>
              {tiposVehiculo.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>

            <button
              onClick={loadVehicles}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
                  </button>
              </div>

          {/* Tabla de vehículos */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Especificaciones
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
                        <span className="text-sm font-medium text-gray-900">Cargando vehículos...</span>
                        <span className="text-xs text-gray-500">Verificando conexión con el servidor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Truck className="h-12 w-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">No se encontraron vehículos</span>
                        <span className="text-xs text-gray-500">Intenta ajustar los filtros o agregar un nuevo vehículo</span>
                        <button
                          onClick={openNewForm}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Vehículo
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id_vehiculo} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              {vehicle.tipo_vehiculo === 'Motocicleta' ? <Bike className="h-6 w-6 text-red-800" /> : <Truck className="h-6 w-6 text-blue-600 fill-blue-600" />}
                </div>
              </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {vehicle.placa_id}
                </div>
                            <div className="text-sm text-slate-500">
                              {vehicle.marca_vehiculo} {vehicle.modelo}
                </div>
              </div>
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          <div>Año: {vehicle.anio_vehiculo }</div>
                          <div>Tipo: {vehicle.tipo_vehiculo}</div>
                          {vehicle.color && <div>Color: {vehicle.color}</div>}
                          {vehicle.kilometraje && <div>KM: {vehicle.kilometraje.toLocaleString()}</div>}
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.estado)}`}>
                          {getStatusText(vehicle.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {vehicle.fe_registro ? new Date(vehicle.fe_registro).toLocaleDateString(getEnvConfig('DATE_FORMAT')) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(vehicle)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Editar"
                          >
                  <Edit className="h-4 w-4" />
                </button>
                          <button
                            onClick={() => showDeleteConfirmation(vehicle)}
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
            Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
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
              ¿Estás seguro de que quieres eliminar el vehículo "{vehicleToDelete?.placa}"?
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

export default Vehiculos; 