import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axiosInstance, { setAuthToken, clearAuthToken, clearAllConfig } from '../utils/axiosConfig';
import API_CONFIG from '../config/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'), // Verificar si hay token al inicializar
  loading: true,
  error: null,
  success: null
};

const authReducer = (state, action) => {


  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null, success: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        success: action.payload.message || 'Operation successful'
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
        success: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        success: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_SUCCESS':
      return { ...state, success: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults when token changes
  useEffect(() => {
    console.log('🔐 AuthContext: Token changed, updating Axios config...');
    
    if (state.token) {
      // Verificar que el token no sea demasiado largo
      if (state.token.length > 8000) {
        console.warn('🔐 Token JWT demasiado largo, limpiando...');
        dispatch({ type: 'LOGOUT' });
        return;
      }
      
      // Configurar header de autorización
      setAuthToken(state.token);
      console.log('🔐 AuthContext: Axios token configured');
      
    } else {
      clearAuthToken();
      console.log('🔐 AuthContext: Axios token cleared');
    }
  }, [state.token]);

  // Sincronizar estado con localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log('🔐 AuthContext: Token changed in localStorage');
        const newToken = e.newValue;
        
        if (newToken && newToken !== state.token) {
          console.log('🔐 AuthContext: Updating state with new token from localStorage');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: state.user,
              token: newToken
            }
          });
        } else if (!newToken && state.token) {
          console.log('🔐 AuthContext: Token removed from localStorage, logging out');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state.token, state.user]);

  // Check if user is authenticated on app load
  useEffect(() => {
    console.log('🔐 AuthContext: Checking authentication on mount...');
    console.log('🔐 AuthContext: Initial token:', state.token);
    
    const checkAuth = async () => {
      if (state.token) {
        try {
          console.log('🔐 AuthContext: Token found, verifying with server...');
          dispatch({ type: 'AUTH_START' });
          
          const response = await axiosInstance.get(API_CONFIG.AUTH.PROFILE);
          console.log('🔐 AuthContext: Profile response:', response.data);
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.user,
              token: state.token
            }
          });
          
          console.log('🔐 AuthContext: Authentication verified successfully');
        } catch (error) {
          console.error('🔐 AuthContext: Token verification failed:', error);
          
          // Si el token es inválido, limpiarlo
          if (error.response?.status === 401) {
            console.warn('🔐 AuthContext: Token expired, clearing...');
            localStorage.removeItem('token');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Token expirado o inválido' });
          } else {
            dispatch({ type: 'AUTH_FAILURE', payload: 'Error verificando autenticación' });
          }
        }
      } else {
        console.log('🔐 AuthContext: No token found, user not authenticated');
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []); // Solo se ejecuta al montar el componente

  const login = async (username, password) => {
    try {
      console.log('🔐 AuthContext: Starting login...');
      console.log('🔐 AuthContext: Username:', username);
      console.log('🔐 AuthContext: Password provided:', password ? 'Yes' : 'No');
      console.log('🔐 AuthContext: API URL:', API_CONFIG.AUTH.LOGIN);
      console.log('🔐 AuthContext: Base URL:', API_CONFIG.BASE_URL);
      
      dispatch({ type: 'AUTH_START' });
      
      console.log('🔐 AuthContext: Making API call to /api/auth/login');
      const response = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, { username, password });
      console.log('🔐 AuthContext: API response received:', response);
      console.log('🔐 AuthContext: Response status:', response.status);
      console.log('🔐 AuthContext: Response data:', response.data);
      console.log('🔐 AuthContext: Response headers:', response.headers);
      
      // Verificar que la respuesta contenga el token
      if (!response.data.token) {
        console.error('🔐 AuthContext: Response data structure:', {
          hasToken: !!response.data.token,
          tokenType: typeof response.data.token,
          tokenValue: response.data.token,
          fullResponse: response.data
        });
        throw new Error('Respuesta del servidor no contiene token');
      }
      
      // Guardar token en localStorage ANTES de dispatch
      localStorage.setItem('token', response.data.token);
      console.log('🔐 AuthContext: Token saved to localStorage');
      
      // Configurar token en Axios
      setAuthToken(response.data.token);
      console.log('🔐 AuthContext: Token configured in Axios');
      
      // Dispatch del estado
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: response.data
      });
      
      console.log('🔐 AuthContext: Login successful, user authenticated');
      console.log('🔐 AuthContext: Current state after login:', {
        token: response.data.token,
        user: response.data.user,
        isAuthenticated: true
      });
      
      return { success: true };
    } catch (error) {
      console.error('🔐 AuthContext: Login error:', error);
      console.error('🔐 AuthContext: Error type:', error.constructor.name);
      console.error('🔐 AuthContext: Error message:', error.message);
      console.error('🔐 AuthContext: Error stack:', error.stack);
      
      if (error.response) {
        console.error('🔐 AuthContext: Error response status:', error.response.status);
        console.error('🔐 AuthContext: Error response data:', error.response.data);
        console.error('🔐 AuthContext: Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('🔐 AuthContext: Error request:', error.request);
        console.error('🔐 AuthContext: No response received from server');
      } else {
        console.error('🔐 AuthContext: Error setting up request:', error.message);
      }
      
      const message = error.response?.data?.error || error.message || 'Error al iniciar sesión';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: message
      });
      
      console.log('🔐 AuthContext: Login failed, returning error:', message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔐 AuthContext: Starting registration...');
      dispatch({ type: 'AUTH_START' });
      
      console.log('🔐 AuthContext: Making API call to /api/auth/register');
      const response = await axiosInstance.post(API_CONFIG.AUTH.REGISTER, userData);
      console.log('🔐 AuthContext: API response received:', response.data);
      
      // Verificar que la respuesta contenga el token
      if (!response.data.token) {
        throw new Error('Respuesta del servidor no contiene token');
      }
      
      // Guardar token en localStorage ANTES de dispatch
      localStorage.setItem('token', response.data.token);
      console.log('🔐 AuthContext: Token saved to localStorage');
      
      // Configurar token en Axios
      setAuthToken(response.data.token);
      console.log('🔐 AuthContext: Token configured in Axios');
      
      // Dispatch del estado
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: response.data
      });
      
      console.log('🔐 AuthContext: Registration successful, user authenticated');
      console.log('🔐 AuthContext: Current state after registration:', {
        token: response.data.token,
        user: response.data.user,
        isAuthenticated: true
      });
      
      return { success: true };
    } catch (error) {
      console.error('🔐 AuthContext: Registration error:', error);
      console.error('🔐 AuthContext: Error response:', error.response?.data);
      
      const message = error.response?.data?.error || error.message || 'Error al registrarse';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: message
      });
      
      console.log('🔐 AuthContext: Registration failed, returning error:', message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    console.log('🔐 AuthContext: Logging out user...');
    
    // Limpiar token de Axios
    clearAuthToken();
    console.log('🔐 AuthContext: Axios token cleared');
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🔐 AuthContext: LocalStorage cleared');
    
    // Limpiar completamente la configuración
    clearAllConfig();
    console.log('🔐 AuthContext: All config cleared');
    
    // Dispatch del estado
    dispatch({ type: 'LOGOUT' });
    console.log('🔐 AuthContext: Logout completed');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const clearSuccess = () => {
    dispatch({ type: 'CLEAR_SUCCESS' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    clearSuccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 