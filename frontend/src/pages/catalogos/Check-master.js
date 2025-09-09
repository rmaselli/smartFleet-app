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


const CheckMaster = () => {
  const { user } = useAuth();
  const [checkMaster, setCheckMaster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCheckMaster, setEditingCheckMaster] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [checkMasterToDelete, setCheckMasterToDelete] = useState(null);
  const [pilotos, setPilotos] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    id_empresa: 1,  
    tipo_check: '',
    tipo_vehiculo: 1,
    desc_check: '',
    id_piloto_default: 1,
    cod_abreviado: '',
    estado: 'ACT',
    observaciones: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const breadcrumbItems = [
    { id: 'catalogos', label: 'Catálogos', path: '/catalogos' },
    { id: 'check-master', label: 'Check Master', path: '/catalogos/check-master' }
  ];

  // Estados disponibles
  const estados = [
    { value: 'ACT', label: 'Activo' },
    { value: 'SUP', label: 'Suplente' },
    { value: 'TMP', label: 'Temporal' },
    { value: 'MED', label: 'Suspension Medica' },
    { value: 'RET', label: 'Retiro' },
    { value: 'TER', label: 'Terminado' }
  ];

  // Tipos de check master
  const tiposCheckMaster = [
    'Preventivo',
    'Correctivo'
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

  // Cargar Check Master
  const loadCheckMaster = async () => {
    setLoading(true);
    try {
      console.log('🚀 Cargando check-master desde:', API_CONFIG.CHECK_MASTER.LIST);
      const response = await axiosInstance.get(API_CONFIG.CHECK_MASTER.LIST);
      console.log('✅ Respuesta de check-master:', response.data);
      
      if (response.data.success) {
        setCheckMaster(response.data.data);
        console.log(`📊 ${response.data.data.length} check-master cargados`);
      } else {
        console.warn('⚠️ Respuesta sin éxito:', response.data);
        setCheckMaster([]);
      }
    } catch (error) {
      console.error('❌ Error cargando check-master:', error);
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
      
      setCheckMaster([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar check master al montar el componente
  useEffect(() => {
    loadCheckMaster();
  }, []);

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

  
    // Cargar vehículos al montar el componente
    useEffect(() => {
      loadCheckMaster();
      loadPilotos();
      loadTiposVehiculos();
    }, []);

  // Filtrar check-master
  const filteredCheckMaster = checkMaster.filter(checkMaster => {
    const matchesSearch = checkMaster.desc_check?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkMaster.tipo_check?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || checkMaster.desc_check === filterStatus;
    const matchesType = filterType === 'all' || checkMaster.tipo_check === filterType;
    
    return matchesSearch && matchesStatus;// && matchesType;
  });

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.desc_check.trim()) errors.desc_check = 'El nombre de la check-master es requerido';
    if (!formData.tipo_check.trim()) errors.tipo_check = 'El tipo de check master es requerido';
    if (!formData.cod_abreviado.trim()) errors.cod_abreviado = 'El código abreviado es requerido';

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
      tipo_check: '',
      desc_check: '',
      tipo_vehiculo: 1,
      id_piloto_default: 1,
      cod_abreviado: 'XYZ',
      estado: 'ACT',
      observaciones: ''
    });
    setFormErrors({});
    setEditingCheckMaster(null);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const openEditForm = (checkMaster) => {
    setFormData({
      id_empresa: checkMaster.id_empresa || 1,
      tipo_vehiculo: checkMaster.tipo_vehiculo || 1,
      tipo_check: checkMaster.tipo_check || '',
      desc_check: checkMaster.desc_check || '',
      id_piloto_default: checkMaster.id_piloto_default || 1,
      cod_abreviado: checkMaster.cod_abreviado || 'XYZ',
      estado: checkMaster.estado || 'ACT',
      observaciones: checkMaster.observaciones || ''
    });
    setFormErrors({});
    setEditingCheckMaster(checkMaster);
    setShowForm(true);
  };

  const Alert = ({ message, type }) => {
    const alertStyles = {
      success: "bg-green-100 text-green-800 border-green-300",
      error: "bg-red-100 text-red-800 border-red-300",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
      info: "bg-blue-100 text-blue-800 border-blue-300",
    };
  };


  // Cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setEditingCheckMaster(null);
    setFormData({
      id_empresa: 1,
      tipo_check: '',
      desc_check: '',
      id_piloto_default:1,
      estado: 'ACT',
      tipo_vehiculo: 1,
      cod_abreviado: 'XYZ',
      observaciones: ''
    });
    setFormErrors({});
  };

  // Guardar Check Master
    const saveCheckMaster = async () => {
    console.log('<<Entra>>', formData);
    if (!validateForm()) return;

    try {
      console.log('🚀 Guardando check master:', formData);
      
        if (editingCheckMaster) {
        // Actualizar
        console.log('📝 Actualizando check master ID:', editingCheckMaster.id_check);
        const response = await axiosInstance.put(API_CONFIG.CHECK_MASTER.UPDATE(editingCheckMaster.id_check), formData);
        console.log('✅ Check master actualizada:', response.data);
        
        if (response.data.success) {
          alert('Check master actualizada exitosamente');
          await loadCheckMaster();
          closeForm();
        }
      } else {
        // Crear nuevo
        console.log('🆕 Creando nuevo check master');
        const response = await axiosInstance.post(API_CONFIG.CHECK_MASTER.CREATE, formData);
        console.log('✅ Check master creada:', response.data);
        
        if (response.data.success) {
          //alert('Check master creada exitosamente');
          Alert({ message: 'Check master creada exitosamente', type: 'success' });
          await loadCheckMaster();
          closeForm();
        }
      }
    } catch (error) {
      console.error('❌ Error guardando check master:', error);
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

  // Eliminar check master
  const deleteCheckMaster = async (id) => {
    try {
      const response = await axiosInstance.delete(API_CONFIG.CHECK_MASTER.DELETE(id));
      if (response.data.success) {
        await loadCheckMaster();
      }
    } catch (error) {
      console.error('Error deleting check master:', error);
    }
  };

  // Mostrar confirmación de eliminación
  const showDeleteConfirmation = (checkMaster) => {
    setCheckMasterToDelete(checkMaster);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (checkMasterToDelete) {
      await deleteCheckMaster(checkMasterToDelete.id_check);
      setShowDeleteConfirm(false);
      setCheckMasterToDelete(null);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCheckMasterToDelete(null);
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
              Catálogo de Check Master
            </h1>
            <p className="text-slate-600">
              Administra la información de todas las check master de la flota
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
                onClick={loadCheckMaster}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Cargando...' : 'Recargar Check Master'}
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
            <span>Nueva Check Master</span>
          </button>
        </div>

        {/* SECCIÓN 1: FORMULARIO DE CAPTURA */}
        {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingCheckMaster ? 'Editar Check Master' : 'Nueva Check Master'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">



              {/* Tipo de Check Master */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Check Master *
                </label>
                <select
                  name="tipo_check"
                  value={formData.tipo_check  }
                  onChange={handleFormChange}
                  className={`input ${formErrors.tipo_check ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccione un tipo de check master</option>
                  {tiposCheckMaster.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* Descripcion del Check Master  */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción de la Check Master *
                </label>
                <input
                  type="text"
                  name="desc_check"
                  value={formData.desc_check}
                  onChange={handleFormChange}
                  className={`input ${formErrors.desc_check ? 'border-red-500' : ''}`}
                  placeholder="Check Master de Guatemala"
                />
                {formErrors.desc_check && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.desc_check}</p>
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

              {/* Piloto default */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Piloto Default
                </label>
                <select
                  name="id_piloto_default"
                  value={formData.id_piloto_default || ''}
                  onChange={handleFormChange}
                  className="input"
                >
                  <option value="">Seleccionar piloto default</option>
                  {pilotos.map(piloto => (
                    <option key={piloto.id_piloto} value={piloto.id_piloto}>
                      {piloto.nombres} {piloto.apellidos} - {piloto.num_dpi}
                    </option>
                  ))}
                </select>
              </div>


              {/* Código abreviado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código Abreviado
                </label>
                <input
                  type="text"
                  name="cod_abreviado"
                  value={formData.cod_abreviado}
                  onChange={handleFormChange}
                  className="input"
                />
                {formErrors.cod_abreviado && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cod_abreviado}</p>
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
                onClick={saveCheckMaster}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingCheckMaster ? 'Actualizar' : 'Guardar'}</span>
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
                placeholder="Buscar por Check Master, Tipo de Check Master..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input max-w-xs"
            >
              <option value="all">Todos los tipos</option>
              {tiposCheckMaster.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>

            <button
              onClick={loadCheckMaster}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
                  </button>
              </div>

          {/* Tabla de Check Master */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Check Master
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tipo de Check Master
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
                        <span className="text-sm font-medium text-gray-900">Cargando check master...</span>
                        <span className="text-xs text-gray-500">Verificando conexión con el servidor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCheckMaster.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <User className="h-12 w-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">No se encontraron check master</span>
                        <span className="text-xs text-gray-500">Intenta ajustar los filtros o agregar una nueva Check Master</span>
                        <button
                          onClick={openNewForm}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Check Master
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCheckMaster.map((checkMaster) => (
                    <tr key={checkMaster.id_check} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600 fill-blue-600" />
                </div>
              </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {checkMaster.desc_check}
                </div>
                            <div className="text-sm text-slate-500">
                              {checkMaster.tipo_check}
                </div>
              </div>
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          <div>Tp: {checkMaster.tipo_check }</div>
                         { checkMaster.cod_abreviado && <div>Cód Abrev: {checkMaster.cod_abreviado}</div>} 
                         {/* {vehicle.kilometraje && <div>KM: {vehicle.kilometraje.toLocaleString()}</div>} */}
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(checkMaster.estado)}`}>
                          {getStatusText(checkMaster.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {checkMaster.fe_registro ? new Date(checkMaster.fe_registro).toLocaleDateString(getEnvConfig('DATE_FORMAT')) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(checkMaster)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Editar"
                          >
                  <Edit className="h-4 w-4" />
                </button>
                          <button
                            onClick={() => showDeleteConfirmation(checkMaster)}
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
            Mostrando {filteredCheckMaster.length} de {checkMaster.length} check master
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
              ¿Estás seguro de que quieres eliminar la check master "{checkMasterToDelete?.id_check}"?
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

export default CheckMaster; 