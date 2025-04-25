
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

type LocationState = {
  from?: {
    pathname: string;
  };
};

const LoginPage = () => {
  const [emailOrCedula, setEmailOrCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = (location.state as LocationState)?.from?.pathname || '/';

  // If user is already logged in, redirect
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', emailOrCedula);
      const success = await login(emailOrCedula, password);
      if (success) {
        console.log('Login successful, redirecting to:', from);
        // Redirect to the page they were trying to access
        navigate(from, { replace: true });
      } else {
        setError('Credenciales inválidas. Intente nuevamente.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-financial-midnight px-4 py-12 sm:px-6 lg:px-8">
      <div className="financial-card w-full max-w-md p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Ingresa a tu cuenta para utilizar todas las funcionalidades
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="emailOrCedula" className="block text-sm font-medium mb-1">
                Correo Electrónico o Cédula
              </label>
              <Input
                id="emailOrCedula"
                name="emailOrCedula"
                type="text"
                autoComplete="email"
                required
                value={emailOrCedula}
                onChange={(e) => setEmailOrCedula(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-white/60">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-financial-accent hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
