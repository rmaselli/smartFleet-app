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
  Bike,
  Image
} from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';
import API_CONFIG from '../../config/api';
import { getEnvConfig } from '../../config/environment';


const Pilotos = () => {
  const { user } = useAuth();
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPiloto, setEditingPiloto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pilotoToDelete, setPilotoToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id_empresa: 1,
    id_sede: 1,
    nombres: '',
    placa_id: '',
    apellidos: '',
    fe_nacimiento: '',
    direccion: '',
    telefono: '',
    num_dpi: '',
    fe_vence_dpi: '',
    num_licencia: '',
    fe_vence_licencia: '',
    fe_ingreso: '',
    //viajes: '',
    estado: 'ACT',
    horas_conducidas: '',
    ingreso_bruto: '',
    observaciones: '',
    foto: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const breadcrumbItems = [
    { id: 'catalogos', label: 'Catálogos', path: '/catalogos' },
    //{ id: 'vehiculos', label: 'Vehículos', path: '/catalogos/vehiculos' },
    { id: 'pilotos', label: 'Pilotos', path: '/catalogos/pilotos' }
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

  // Cargar Pilotos
  const loadPilotos = async () => {
    setLoading(true);
    try {
      console.log('🚀 Cargando pilotos desde:', API_CONFIG.PILOTOS.LIST);
      const response = await axiosInstance.get(API_CONFIG.PILOTOS.LIST);
      console.log('✅ Respuesta de pilotos:', response.data);
      
      if (response.data.success) {
        setPilotos(response.data.data);
        console.log(`📊 ${response.data.data.length} pilotos cargados`);
      } else {
        console.warn('⚠️ Respuesta sin éxito:', response.data);
        setPilotos([]);
      }
    } catch (error) {
      console.error('❌ Error cargando pilotos:', error);
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
      
      setPilotos([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar pilotos al montar el componente
  useEffect(() => {
    loadPilotos();
  }, []);

  // Filtrar pilotos
  const filteredPilotos = pilotos.filter(piloto => {
    const matchesSearch = piloto.num_dpi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         piloto.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         piloto.nombres?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || piloto.estado === filterStatus;
    //const matchesType = filterType === 'all' || piloto.tipo_vehiculo === filterType;
    
    return matchesSearch && matchesStatus;// && matchesType;
  });

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.id_sede) errors.id_sede = 'La sede es requerida';
    if (!formData.nombres.trim()) errors.nombres = 'Los nombres son requeridos';
    if (!formData.apellidos.trim()) errors.apellidos = 'Los apellidos son requeridos';
    if (!formData.fe_nacimiento.trim()) errors.fe_nacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.direccion.trim()) errors.direccion = 'La dirección es requerida';
    if (!formData.telefono.trim()) errors.telefono = 'El teléfono es requerido';
    if (!formData.num_dpi.trim()) errors.num_dpi = 'El número de DPI es requerido';
    if (!formData.fe_vence_dpi.trim()) errors.fe_vence_dpi = 'La fecha de vencimiento del DPI es requerida';
    if (!formData.num_licencia.trim()) errors.num_licencia = 'El número de licencia es requerido';
    if (!formData.fe_vence_licencia.trim()) errors.fe_vence_licencia = 'La fecha de vencimiento de la licencia es requerida';
    if (!formData.estado) errors.estado = 'El estado es requerido';
    
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
      nombres: '',
      apellidos: '',
      fe_nacimiento: '',
      direccion: '',
      telefono: '',
      num_dpi: '',
      fe_vence_dpi: '',
      num_licencia: '',
      fe_vence_licencia: '',
      fe_ingreso: '',
      //viajes: '',
      estado: 'ACT',
      horas_conducidas: '',
      ingreso_bruto: '',
      observaciones: '',
      foto: ''
    });
    setFormErrors({});
    setEditingPiloto(null);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const openEditForm = (piloto) => {
    setFormData({
      id_empresa: piloto.id_empresa || 1,
      id_sede: piloto.id_sede || 1,
      nombres: piloto.nombres || '',
      apellidos: piloto.apellidos || '',
      fe_nacimiento: piloto.fe_nacimiento || '',
      direccion: piloto.direccion || '',
      telefono: piloto.telefono || '',
      num_dpi: piloto.num_dpi || '',
      fe_vence_dpi: piloto.fe_vence_dpi || '',
      num_licencia: piloto.num_licencia || '',
      fe_vence_licencia: piloto.fe_vence_licencia || '',
      fe_ingreso: piloto.fe_ingreso || '',
      horas_conducidas: piloto.horas_conducidas || '',
      ingreso_bruto: piloto.ingreso_bruto || '',
      observaciones: piloto.observaciones || '',
      foto: piloto.foto 
    });
    setFormErrors({});
    setEditingPiloto(piloto);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const openImageForm = (piloto) => {
    setFormData({
      id_empresa: piloto.id_empresa || 1,
      id_sede: piloto.id_sede || 1
    });
  };

  // Cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setEditingPiloto(null);
    setFormData({
      id_empresa: 1,
      id_sede: 1,
      nombres: '',
      apellidos: '',
      fe_nacimiento: '',
      direccion: '',
      telefono: '',
      num_dpi: '',
      fe_vence_dpi: '',
      num_licencia: '',
      fe_vence_licencia: '',
      fe_ingreso: '',
      //viajes: '',
      estado: 'ACT',
      horas_conducidas: '',
      ingreso_bruto: '',
      observaciones: '',
      foto: ''
    });
    setFormErrors({});
  };

  // Guardar piloto
  const savePiloto = async () => {
    console.log('<<Entra>>', formData);
    if (!validateForm()) return;

    try {
      console.log('🚀 Guardando piloto:', formData);
      
        if (editingPiloto) {
        // Actualizar
        console.log('📝 Actualizando piloto ID:', editingPiloto.id_piloto);
        const response = await axiosInstance.put(API_CONFIG.PILOTOS.UPDATE(editingPiloto.id_piloto), formData);
        console.log('✅ Piloto actualizado:', response.data);
        
        if (response.data.success) {
          alert('Piloto actualizado exitosamente');
          await loadPilotos();
          closeForm();
        }
      } else {
        // Crear nuevo
        console.log('🆕 Creando nuevo piloto');
        const response = await axiosInstance.post(API_CONFIG.PILOTOS.CREATE, formData);
        console.log('✅ Piloto creado:', response.data);
        
        if (response.data.success) {
          alert('Piloto creado exitosamente');
          await loadPilotos();
          closeForm();
        }
      }
    } catch (error) {
      console.error('❌ Error guardando piloto:', error);
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
  const deletePiloto = async (id) => {
    try {
      const response = await axiosInstance.delete(API_CONFIG.PILOTOS.DELETE(id));
      if (response.data.success) {
        await loadPilotos();
      }
    } catch (error) {
      console.error('Error deleting piloto:', error);
    }
  };

  // Mostrar confirmación de eliminación
  const showDeleteConfirmation = (piloto) => {
    setPilotoToDelete(piloto);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (pilotoToDelete) {
      await deletePiloto(pilotoToDelete.id_piloto);
      setShowDeleteConfirm(false);
      setPilotoToDelete(null);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPilotoToDelete(null);
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
              Catálogo de Pilotos
            </h1>
            <p className="text-slate-600">
              Administra la información de todos los pilotos de la flota
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
                onClick={loadPilotos}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Cargando...' : 'Recargar Pilotos'}
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
            <span>Nuevo Piloto</span>
          </button>
        </div>

        {/* SECCIÓN 1: FORMULARIO DE CAPTURA */}
        {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingPiloto ? 'Editar Piloto' : 'Nuevo Piloto'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Foto
              </label>
              <input type="file" name="foto" onChange={handleFormChange} className="input" />
              {formErrors.foto && (
                <p className="text-red-500 text-sm mt-1">{formErrors.foto}</p>
              )}
            </div>


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


              {/* Nombres */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombres *
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleFormChange}
                  className={`input ${formErrors.nombres ? 'border-red-500' : ''}`}
                  placeholder="Juan"
                />
                {formErrors.nombres && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.nombres}</p>
                )}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                    name="apellidos"
                  value={formData.apellidos}
                  onChange={handleFormChange}
                  className={`input ${formErrors.apellidos ? 'border-red-500' : ''}`}
                  placeholder="Perez"
                />
                {formErrors.apellidos && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.apellidos}</p>
                )}
              </div>



              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="fe_nacimiento"
                    value={formData.fe_nacimiento}
                    onChange={handleFormChange}
                    dateFormat="dd/mm/yyyy"
                    className={`input ${formErrors.fe_nacimiento ? 'border-red-500' : ''} pr-10`}
                    max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {formErrors.fe_nacimiento && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fe_nacimiento}</p>
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
                />
                {formErrors.direccion && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.direccion}</p>
                )}
              </div>

              {/* Teléfono */}
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
                />
                {formErrors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.telefono}</p>
                )}
              </div>

              {/* DPI */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  DPI *
                </label>
                <input
                  type="text"
                  name="num_dpi"
                  value={formData.num_dpi}
                  onChange={handleFormChange}
                  className={`input ${formErrors.num_dpi ? 'border-red-500' : ''}`}
                />
                {formErrors.num_dpi && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.num_dpi}</p>
                )}
              </div>

              {/* Fecha de Vencimiento del DPI */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vencimiento DPI *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="fe_vence_dpi"
                    value={formData.fe_vence_dpi}
                    onChange={handleFormChange}
                    dateFormat="dd/mm/yyyy"
                    className={`input ${formErrors.fe_vence_dpi ? 'border-red-500' : ''} pr-10`}
                    min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {formErrors.fe_vence_dpi && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fe_vence_dpi}</p>
                )}
              </div>

              {/* Numero de Licencia */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Licencia *
                </label>
                <input
                  type="text"
                  name="num_licencia"
                  value={formData.num_licencia}
                  onChange={handleFormChange}
                  className={`input ${formErrors.num_licencia ? 'border-red-500' : ''}`}
                />
                {formErrors.num_licencia && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.num_dpi}</p>
                )}
              </div>

              {/* Fecha de Vencimiento de la Licencia */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vencimiento Licencia *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="fe_vence_licencia"
                    value={formData.fe_vence_licencia}
                    onChange={handleFormChange}
                    dateFormat="DD/MM/YYYY"
                    className={`input ${formErrors.fe_vence_licencia ? 'border-red-500' : ''} pr-10`}
                    min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {formErrors.fe_vence_licencia && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fe_vence_licencia}</p>
                )}
              </div>

              {/* Fecha de Ingreso del Piloto */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Ingreso *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="fe_ingreso"
                    value={formData.fe_ingreso}
                    onChange={handleFormChange}
                    dateFormat="DD/MM/YYYY"
                    className={`input ${formErrors.fe_ingreso ? 'border-red-500' : ''} pr-10`}                    
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {formErrors.fe_ingreso && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.fe_ingreso}</p>
                )}
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

              {/* Horas Conducidas */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Horas Conducidas
                </label>
                <input
                  type="number"
                  name="horas_conducidas"
                  value={formData.horas_conducidas || 0}
                  onChange={handleFormChange}
                  className="input"
                  readOnly
                  min="0"
                />
              </div>

              {/* Ingreso Bruto */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ingreso Bruto
                </label>
                <input
                  type="number"
                  name="ingreso_bruto"
                  value={formData.ingreso_bruto || 0}
                  onChange={handleFormChange}
                  className="input"
                  readOnly
                  min="0"
                />
              </div>              


              {/* Viajes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Viajes
                </label>
                <input
                  type="number"
                  name="viajes"
                  value={formData.viajes || 0}
                  onChange={handleFormChange}
                  className="input"
                  readOnly
                  min="0"
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

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={closeForm}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={savePiloto}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingPiloto ? 'Actualizar' : 'Guardar'}</span>
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
                placeholder="Buscar por DPI, apellidos, nombres..."
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
              onClick={loadPilotos}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
                  </button>
              </div>

          {/* Tabla de pilotos */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Piloto
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
                        <span className="text-sm font-medium text-gray-900">Cargando pilotos...</span>
                        <span className="text-xs text-gray-500">Verificando conexión con el servidor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPilotos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <User className="h-12 w-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">No se encontraron pilotos</span>
                        <span className="text-xs text-gray-500">Intenta ajustar los filtros o agregar un nuevo piloto</span>
                        <button
                          onClick={openNewForm}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Piloto
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPilotos.map((piloto) => (
                    <tr key={piloto.id_piloto} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600 fill-blue-600" />
                </div>
              </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {piloto.nombres} {piloto.apellidos}
                </div>
                            <div className="text-sm text-slate-500">
                              {piloto.num_dpi}
                </div>
              </div>
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          <div>DPI: {piloto.num_dpi }</div>
                          <div>Licencia: {piloto.num_licencia}</div>
                         {/* {vehicle.color && <div>Color: {vehicle.color}</div>} */}
                         {/* {vehicle.kilometraje && <div>KM: {vehicle.kilometraje.toLocaleString()}</div>} */}
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(piloto.estado)}`}>
                          {getStatusText(piloto.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {piloto.fe_registro ? new Date(piloto.fe_registro).toLocaleDateString(getEnvConfig('DATE_FORMAT')) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(piloto)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Editar"
                          >
                           <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => showDeleteConfirmation(piloto)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Eliminar"
                          >
                          <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openImageForm(piloto)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Foto"
                          >
                          <Image className="h-4 w-4" />
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
            Mostrando {filteredPilotos.length} de {pilotos.length} pilotos
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
              ¿Estás seguro de que quieres eliminar el piloto "{pilotoToDelete?.id_piloto}"?
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

export default Pilotos; 