
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/services/calculosFinancieros';
import { toast } from 'sonner';

type Loan = {
  id: string;
  monto: number;
  tasa_interes: number;
  plazo: number;
  tipo_plazo: string;
  tipo_amortizacion: string;
  cuota_mensual: number;
  fecha_solicitud: string;
  estado: string;
  fecha_aprobacion: string | null;
}

const MisPrestamos = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .order('fecha_solicitud', { ascending: false });

        if (error) {
          throw error;
        }

        setLoans(data || []);
      } catch (error) {
        console.error('Error fetching loans:', error);
        toast.error('Error al cargar los préstamos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprobado':
        return 'bg-green-500';
      case 'Rechazado':
        return 'bg-red-500';
      case 'En revisión':
      default:
        return 'bg-yellow-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="page-transition max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mis Préstamos</h1>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-pulse text-financial-accent">Cargando préstamos...</div>
          </div>
        ) : loans.length === 0 ? (
          <Card className="financial-card">
            <CardContent className="p-8 text-center">
              <p className="text-lg mb-4">No tiene préstamos solicitados</p>
              <a href="/solicitar-prestamo" className="btn-primary inline-block">
                Solicitar un préstamo
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {loans.map(loan => (
              <Card key={loan.id} className="financial-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Préstamo por {formatCurrency(loan.monto)}</CardTitle>
                      <CardDescription>
                        Solicitado el {formatDate(loan.fecha_solicitud)}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(loan.estado)}`}>
                      {loan.estado}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-financial-slate/20 p-3 rounded-lg">
                      <p className="text-sm text-white/60 mb-1">Cuota mensual</p>
                      <p className="font-medium text-lg">{formatCurrency(loan.cuota_mensual)}</p>
                    </div>
                    <div className="bg-financial-slate/20 p-3 rounded-lg">
                      <p className="text-sm text-white/60 mb-1">Tasa de interés</p>
                      <p className="font-medium text-lg">{loan.tasa_interes}%</p>
                    </div>
                    <div className="bg-financial-slate/20 p-3 rounded-lg">
                      <p className="text-sm text-white/60 mb-1">Plazo</p>
                      <p className="font-medium text-lg">
                        {loan.plazo} {loan.tipo_plazo === 'meses' ? 'meses' : 'años'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-financial-slate/10 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Detalles del préstamo:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <span className="text-white/60">ID del préstamo:</span> {loan.id.substring(0, 8)}...
                      </li>
                      <li>
                        <span className="text-white/60">Tipo de amortización:</span> {loan.tipo_amortizacion}
                      </li>
                      {loan.fecha_aprobacion && (
                        <li>
                          <span className="text-white/60">Fecha de aprobación:</span> {formatDate(loan.fecha_aprobacion)}
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MisPrestamos;
