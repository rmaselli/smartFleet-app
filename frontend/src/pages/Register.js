import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus, Phone, Building, Users } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    department: '',
    company_id: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register, error, success, clearError, clearSuccess } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'El nombre completo es requerido';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && formData.phone.length < 7) {
      newErrors.phone = 'El teléfono debe tener al menos 7 dígitos';
    }

    // Company ID validation (optional but if provided, must be positive integer)
    if (formData.company_id && (isNaN(formData.company_id) || parseInt(formData.company_id) < 1)) {
      newErrors.company_id = 'El ID de empresa debe ser un número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear specific field error
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    
    // Clear global error and success messages
    if (error) clearError();
    if (success) clearSuccess();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone || null,
      department: formData.department || null,
      company_id: formData.company_id || null
    };
    
    console.log('🚀 Attempting to register user:', userData);
    
    try {
      const result = await register(userData);
      console.log('📝 Registration result:', result);
      
      if (result.success) {
        console.log('✅ Registration successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('❌ Registration failed:', result.error);
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a FleetSmart hoy mismo
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="full_name" className="form-label">
                Nombre Completo *
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className={`input ${errors.full_name ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Ingresa tu nombre completo"
                value={formData.full_name}
                onChange={handleChange}
              />
              {errors.full_name && (
                <p className="form-error">{errors.full_name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Usuario *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`input ${errors.username ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Elige un nombre de usuario"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="form-error">{errors.username}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`input ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Ingresa tu email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <Phone className="inline h-4 w-4 mr-2" />
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`input ${errors.phone ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="+57 300 123 4567"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="form-error">{errors.phone}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                <Users className="inline h-4 w-4 mr-2" />
                Departamento
              </label>
              <input
                id="department"
                name="department"
                type="text"
                className={`input ${errors.department ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Ej: Operaciones, Mantenimiento"
                value={formData.department}
                onChange={handleChange}
              />
              {errors.department && (
                <p className="form-error">{errors.department}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="company_id" className="form-label">
                <Building className="inline h-4 w-4 mr-2" />
                ID de Empresa
              </label>
              <input
                id="company_id"
                name="company_id"
                type="number"
                className={`input ${errors.company_id ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="1"
                value={formData.company_id}
                onChange={handleChange}
              />
              {errors.company_id && (
                <p className="form-error">{errors.company_id}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`input pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Crea una contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`input pr-10 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <span>Crear Cuenta</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 