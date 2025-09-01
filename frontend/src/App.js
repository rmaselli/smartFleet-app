import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import MainDashboard from './pages/MainDashboard';
import Dashboard from './pages/Dashboard';
import CatalogosIndex from './pages/catalogos/CatalogosIndex';
import Vehiculos from './pages/catalogos/Vehiculos';
import Pilotos from './pages/catalogos/Pilotos';
import UsuariosRoles from './pages/seguridad/UsuariosRoles';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, loading } = useAuth();




  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <MainDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/tasks" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        {/* Rutas de Catálogos */}
        <Route 
          path="/catalogos" 
          element={isAuthenticated ? <CatalogosIndex /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/catalogos/vehiculos" 
          element={isAuthenticated ? <Vehiculos /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/catalogos/pilotos" 
          element={isAuthenticated ? <Pilotos /> : <Navigate to="/login" />} 
        />
        {/* Rutas de Seguridad */}
        <Route 
          path="/seguridad/usuarios-roles" 
          element={isAuthenticated ? <UsuariosRoles /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App; 