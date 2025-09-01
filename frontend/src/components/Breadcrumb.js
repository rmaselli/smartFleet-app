import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
      <Link
        to="/dashboard"
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-150"
      >
        <Home className="h-4 w-4" />
        <span>Inicio</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          {index === items.length - 1 ? (
            <span className="text-slate-900 font-medium">{item.label}</span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-blue-600 transition-colors duration-150"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 