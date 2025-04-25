import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Percent, 
  TrendingUp, 
  Calculator, 
  Clock,
  User,
  LogOut,
  CreditCard,
  BarChart2,
  Sliders,
  ArrowUp,
  Database
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const isDark = theme === 'dark';

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className={`h-screen ${isDark ? 'bg-financial-navy' : 'bg-white'} flex flex-col w-64 overflow-hidden`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Calculator className="text-financial-accent" size={24} />
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>FinTual</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col">
        <div className="space-y-1 px-3">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? "nav-item active" : "nav-item"
            }
            end
          >
            <Home size={20} />
            <span>Inicio</span>
          </NavLink>
          
          <NavLink 
            to="/interes-simple" 
            className={({ isActive }) => 
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Percent size={20} />
            <span>Interés Simple</span>
          </NavLink>
          
          <NavLink 
            to="/interes-compuesto" 
            className={({ isActive }) => 
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <TrendingUp size={20} />
            <span>Interés Compuesto</span>
          </NavLink>
          
          <NavLink 
            to="/anualidades" 
            className={({ isActive }) => 
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Clock size={20} />
            <span>Anualidades</span>
          </NavLink>

          <NavLink 
            to="/gradientes" 
            className={({ isActive }) => 
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <ArrowUp size={20} />
            <span>Gradientes</span>
          </NavLink>

          <NavLink 
            to="/series-tir" 
            className={({ isActive }) => 
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <BarChart2 size={20} />
            <span>Series y TIR</span>
          </NavLink>

          <NavLink 
            to="/sistemas-capitalizacion" 
            className={({ isActive }) => 
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Database size={20} />
            <span>Sistemas Capitalización</span>
          </NavLink>
        </div>

        {/* Préstamos Section */}
        <div className="mt-6 px-3">
          <h2 className={`px-3 text-xs font-semibold ${isDark ? 'text-white/50' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
            Préstamos
          </h2>
          <div className="space-y-1">
            <NavLink 
              to="/solicitar-prestamo" 
              className={({ isActive }) => 
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <CreditCard size={20} />
              <span>Solicitar Préstamo</span>
            </NavLink>
            
            <NavLink 
              to="/amortizacion-avanzada" 
              className={({ isActive }) => 
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Sliders size={20} />
              <span>Amortización Avanzada</span>
            </NavLink>
            
            <NavLink 
              to="/mis-prestamos" 
              className={({ isActive }) => 
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <BarChart2 size={20} />
              <span>Mis Préstamos</span>
            </NavLink>
          </div>
        </div>
        
        <div className="flex-1"></div> {/* Spacer */}
      </nav>
      
      {/* User Footer */}
      {user && (
        <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-100'} p-4`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-financial-slate' : 'bg-gray-100'} flex items-center justify-center`}>
              <User size={16} className={isDark ? "text-white/80" : "text-gray-700"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>{user.name}</p>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'} truncate`}>{user.cedula}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <NavLink 
              to="/perfil" 
              className={`flex items-center justify-center gap-1 text-center text-xs px-2 py-1.5 rounded border ${
                isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User size={12} />
              <span>Perfil</span>
            </NavLink>
            
            <button 
              onClick={handleLogout}
              className={`flex items-center justify-center gap-1 text-center text-xs px-2 py-1.5 rounded border ${
                isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LogOut size={12} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
