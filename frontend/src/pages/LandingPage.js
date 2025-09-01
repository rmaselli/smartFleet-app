import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Shield, 
  Database, 
  Settings, 
  Package, 
  Search,
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  Lock,
  BookOpen,
  Workflow,
  Wrench,
  FileText
} from 'lucide-react';

const LandingPage = () => {
  const mainModules = [
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: "Seguridad",
      description: "Gestión de usuarios, roles, log de cambios y tokens de acceso",
      features: ["Usuarios / Roles", "Log de cambios", "Tokens de seguridad"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100"
    },
    {
      icon: <Database className="h-12 w-12 text-green-600" />,
      title: "Catálogos",
      description: "Administración centralizada de empresas, vehículos, pilotos y más",
      features: ["Empresas", "Vehículos", "Pilotos", "Clientes", "Sedes/Talleres"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100"
    },
    {
      icon: <Workflow className="h-12 w-12 text-purple-600" />,
      title: "Procesos",
      description: "Automatización de vales de combustible, salidas y servicios",
      features: ["Vales de Combustible", "Salidas", "Servicios", "Repuestos"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100"
    },
    {
      icon: <Wrench className="h-12 w-12 text-orange-600" />,
      title: "Repuestos",
      description: "Control de inventario y gestión de cambio de pilotos",
      features: ["Cambio Pilotos", "Ingreso de Repuestos", "Inventario"],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100"
    },
    {
      icon: <FileText className="h-12 w-12 text-indigo-600" />,
      title: "Consultas",
      description: "Reportes detallados y análisis de datos del sistema",
      features: ["Ajustes Inventario", "Vehículos", "Repuestos", "Servicios", "Pilotos"],
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-100"
    }
  ];

  const stats = [
    { number: "500+", label: "Vehículos Gestionados" },
    { number: "50+", label: "Clientes Activos" },
    { number: "1000+", label: "Servicios Mensuales" },
    { number: "99.9%", label: "Uptime del Sistema" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FleetSmart
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#modules" className="text-slate-600 hover:text-blue-600 transition-colors">
                Módulos
              </a>
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                Características
              </a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">
                Acerca de
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Gestión Profesional de
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Flotas de Vehículos
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Sistema integral con 5 módulos principales: Seguridad, Catálogos, Procesos, 
              Repuestos y Consultas. Optimiza la administración de tu flota con tecnología avanzada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2"
              >
                <span>Empezar Gratis</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a href="#modules" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-lg flex items-center space-x-2">
                <span>Explorar Módulos</span>
                <CheckCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Main Modules Section */}
      <section id="modules" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Módulos Principales
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nuestro sistema está organizado en 5 módulos principales que cubren todos los aspectos 
              de la gestión de flotas de manera integral y profesional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {mainModules.map((module, index) => (
              <div key={index} className={`${module.bgColor} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 group`}>
                <div className={`${module.iconBg} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {module.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {module.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {module.description}
                </p>
                
                <div className="space-y-2">
                  {module.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm text-slate-700">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${module.color}`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Link
                    to="/register"
                    className={`inline-flex items-center space-x-2 text-sm font-medium bg-gradient-to-r ${module.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
                  >
                    <span>Explorar {module.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Números que Hablan por Sí Mismos
            </h3>
            <p className="text-slate-600">
              Empresas que confían en FleetSmart para gestionar sus operaciones
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Características Avanzadas
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tecnología de vanguardia para la gestión profesional de flotas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 group">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Seguridad Empresarial
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Autenticación JWT, roles y permisos granulares, auditoría completa de cambios
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-green-200 group">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Catálogos Inteligentes
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Gestión centralizada de datos maestros con validaciones y relaciones
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-purple-200 group">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <Workflow className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Procesos Automatizados
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Flujos de trabajo inteligentes para operaciones diarias
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-orange-200 group">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Control de Repuestos
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Inventario inteligente con alertas y gestión de stock
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-200 group">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Reportes Avanzados
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Consultas personalizables y análisis de datos en tiempo real
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-teal-200 group">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Analytics en Tiempo Real
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Métricas y KPIs para optimizar operaciones y reducir costos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Optimizar tu Flota?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Accede a todos los módulos: Seguridad, Catálogos, Procesos, Repuestos y Consultas
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center space-x-2"
          >
            <span>Comenzar Ahora</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FleetSmart</span>
              </div>
              <p className="text-slate-400">
                La solución integral para la gestión profesional de flotas de vehículos.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Módulos</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#modules" className="hover:text-white transition-colors">Seguridad</a></li>
                <li><a href="#modules" className="hover:text-white transition-colors">Catálogos</a></li>
                <li><a href="#modules" className="hover:text-white transition-colors">Procesos</a></li>
                <li><a href="#modules" className="hover:text-white transition-colors">Repuestos</a></li>
                <li><a href="#modules" className="hover:text-white transition-colors">Consultas</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 FleetSmart. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 