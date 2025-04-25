
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, Phone, CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cedula, setCedula] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !cedula) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register({
        name,
        email,
        password,
        cedula,
        phone
      });
      
      if (success) {
        setShowConfirmation(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-financial-midnight">
        <div className="max-w-md w-full my-8">
          <div className="financial-card p-6 sm:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">¡Registro Exitoso!</h1>
              <Mail className="mx-auto my-6 text-financial-accent" size={64} />
              <p className="text-white/80 mb-4">
                Te hemos enviado un correo de confirmación a <strong>{email}</strong>
              </p>
              <p className="text-white/70 mb-6">
                Por favor revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login" className="btn-primary">
                  Ir a Iniciar Sesión
                </Link>
                <Link to="/" className="btn-secondary">
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-financial-midnight">
      <div className="max-w-md w-full my-4 sm:my-8">
        <Link to="/" className="text-white/70 hover:text-white flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span>Volver al inicio</span>
        </Link>
        
        <div className="financial-card p-4 sm:p-8">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl font-bold mb-2">Crear Cuenta</h1>
            <p className="text-white/70">Regístrate para acceder a todas las funciones</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Nombre Completo*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                    <User size={18} />
                  </span>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full pl-10 pr-4 py-3 bg-financial-navy border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-accent/30"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  Correo Electrónico*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-10 pr-4 py-3 bg-financial-navy border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-accent/30"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cedula" className="block text-sm font-medium text-white/80 mb-1">
                  Cédula*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                    <CreditCard size={18} />
                  </span>
                  <input
                    id="cedula"
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="1234567890"
                    className="w-full pl-10 pr-4 py-3 bg-financial-navy border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-accent/30"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">
                  Teléfono (opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                    <Phone size={18} />
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="300 123 4567"
                    className="w-full pl-10 pr-4 py-3 bg-financial-navy border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-accent/30"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                  Contraseña*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                    <Lock size={18} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-financial-navy border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-accent/30"
                    required
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">Mínimo 8 caracteres</p>
              </div>
              
              <button 
                type="submit"
                className="w-full btn-primary py-3"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? 'Cargando...' : 'Crear Cuenta'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-white/70">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-financial-accent font-medium hover:text-financial-accent/80">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
