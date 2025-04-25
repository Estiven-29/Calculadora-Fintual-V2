import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  name: string;
  email: string;
  cedula: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  login: (emailOrCedula: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Error retrieving user information');
          } else if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              cedula: profile.cedula,
              phone: profile.phone
            });
          }
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          setTimeout(async () => {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (error) {
              console.error('Error fetching user profile:', error);
            } else if (profile) {
              setUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                cedula: profile.cedula,
                phone: profile.phone
              });
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (emailOrCedula: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const isEmail = emailOrCedula.includes('@');
      
      if (isEmail) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrCedula,
          password
        });
        
        if (error) {
          console.error('Login error:', error);
          toast.error('Credenciales incorrectas');
          return false;
        }
        
        toast.success('¡Bienvenido de vuelta!');
        return true;
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('cedula', emailOrCedula)
          .single();
        
        if (profileError || !profileData) {
          console.error('Cedula not found:', emailOrCedula);
          toast.error('Cédula no encontrada');
          return false;
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: profileData.email,
          password
        });
        
        if (error) {
          console.error('Login error:', error);
          toast.error('Credenciales incorrectas');
          return false;
        }
        
        toast.success('¡Bienvenido de vuelta!');
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            cedula: userData.cedula,
            phone: userData.phone
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Error al registrar usuario');
        return false;
      }
      
      toast.success('¡Registro exitoso!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Error al registrar usuario');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut({
      scope: 'local'
    });
    
    if (error) {
      console.error('Logout error:', error);
      toast.error('Error al cerrar sesión');
    } else {
      toast.success('Sesión cerrada');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
