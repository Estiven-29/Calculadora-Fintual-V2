
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { User, Phone, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Perfil = () => {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);
  
  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Acceso no autorizado</h2>
            <p className="text-white/70">Debes iniciar sesión para ver tu perfil</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name,
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Error al actualizar perfil');
        return;
      }
      
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar perfil');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Layout>
      <div className="page-transition max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-white/70">Revisa y actualiza tu información personal</p>
        </div>
        
        <div className="financial-card p-6">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-financial-slate flex items-center justify-center">
              <User size={40} className="text-white/80" />
            </div>
          </div>
          
          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Nombre Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-white/50" />
                    <div className="bg-financial-navy border border-white/10 text-white px-4 py-2.5 rounded-lg">
                      {user.name}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="input-field"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-white/50" />
                    <div className="bg-financial-navy border border-white/10 text-white px-4 py-2.5 rounded-lg">
                      {user.phone || 'No especificado'}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Cédula</label>
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-white/50" />
                  <div className="bg-financial-navy border border-white/10 text-white px-4 py-2.5 rounded-lg">
                    {user.cedula}
                  </div>
                </div>
                <div className="text-xs text-white/60">La cédula no se puede modificar</div>
              </div>
              
              {isEditing ? (
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Actualizando...' : 'Actualizar perfil'}
                  </button>
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Editar perfil
                </button>
              )}
            </div>
          </form>
          
          <div className="mt-8 text-center text-xs text-white/50">
            Cuenta creada: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
