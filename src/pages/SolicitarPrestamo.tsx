
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  calcularAmortizacionFrancesa, 
  calcularAmortizacionAlemana,
  calcularAmortizacionAmericana,
  CuotaAmortizacion 
} from '@/services/calculosFinancieros';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import PrestamoForm from '@/components/prestamos/PrestamoForm';
import TablaAmortizacion from '@/components/prestamos/TablaAmortizacion';
import ResumenPrestamo from '@/components/prestamos/ResumenPrestamo';

const SolicitarPrestamo = () => {
  const [formData, setFormData] = useState({
    monto: '',
    tasaInteres: '',
    plazo: '',
    tipoPlazo: 'meses',
    tipoAmortizacion: 'frances',
  });
  
  const [tablaAmortizacion, setTablaAmortizacion] = useState<CuotaAmortizacion[]>([]);
  const [cuotaMensual, setCuotaMensual] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calcularPrestamo = () => {
    const monto = parseFloat(formData.monto);
    const tasaInteres = parseFloat(formData.tasaInteres) / 100;
    const plazo = parseInt(formData.plazo);
    
    if (isNaN(monto) || isNaN(tasaInteres) || isNaN(plazo)) {
      toast.error("Por favor, complete todos los campos correctamente.");
      return;
    }
    
    // Convertir el plazo a meses si está en años
    const plazoMeses = formData.tipoPlazo === 'anos' ? plazo * 12 : plazo;
    
    // Calcular la tabla de amortización según el tipo seleccionado
    let tabla: CuotaAmortizacion[] = [];
    
    switch(formData.tipoAmortizacion) {
      case 'frances':
        tabla = calcularAmortizacionFrancesa(monto, tasaInteres, plazoMeses);
        break;
      case 'aleman':
        tabla = calcularAmortizacionAlemana(monto, tasaInteres, plazoMeses);
        break;
      case 'americano':
        tabla = calcularAmortizacionAmericana(monto, tasaInteres, plazoMeses);
        break;
      default:
        tabla = calcularAmortizacionFrancesa(monto, tasaInteres, plazoMeses);
    }
    
    setTablaAmortizacion(tabla);
    
    // Establecer la cuota mensual
    if (tabla.length > 0) {
      setCuotaMensual(tabla[0].cuota);
    }
    
    toast.success("Se ha calculado el plan de amortización correctamente.");
  };

  const solicitarPrestamo = async () => {
    if (!user) {
      toast.error("Debe iniciar sesión para solicitar un préstamo");
      return;
    }

    if (!cuotaMensual) {
      toast.error("Debe calcular el préstamo antes de solicitarlo");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const monto = parseFloat(formData.monto);
      const tasaInteres = parseFloat(formData.tasaInteres);
      const plazo = parseInt(formData.plazo);
      
      if (isNaN(monto) || isNaN(tasaInteres) || isNaN(plazo)) {
        toast.error("Por favor, complete todos los campos correctamente.");
        return;
      }
      
      console.log('Solicitando préstamo con usuario ID:', user.id);
      
      // Insertar préstamo en Supabase
      const { data, error } = await supabase.from('loans').insert({
        user_id: user.id,
        monto: monto,
        tasa_interes: tasaInteres,
        plazo: plazo,
        tipo_plazo: formData.tipoPlazo,
        tipo_amortizacion: formData.tipoAmortizacion,
        cuota_mensual: cuotaMensual,
        estado: 'En revisión',
        fecha_solicitud: new Date().toISOString()
      });

      if (error) {
        console.error('Error al guardar el préstamo:', error);
        toast.error(`Error al procesar su solicitud: ${error.message}`);
        return;
      }

      toast.success("Su solicitud de préstamo ha sido recibida y está en proceso de revisión.");
      
      // Redirigir a Mis Préstamos después de un breve retraso
      setTimeout(() => {
        navigate('/mis-prestamos');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error en la solicitud:', error);
      toast.error(error.message || "Ocurrió un error al procesar su solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-transition max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Solicitar Préstamo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="financial-card md:col-span-1">
            <CardHeader>
              <CardTitle>Parámetros del Préstamo</CardTitle>
              <CardDescription>
                Ingrese los datos para calcular su préstamo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrestamoForm 
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                calcularPrestamo={calcularPrestamo}
              />
            </CardContent>
          </Card>
          
          <Card className="financial-card md:col-span-2">
            <CardHeader>
              <CardTitle>Plan de Amortización</CardTitle>
              <CardDescription>
                Detalles del préstamo y tabla de pagos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cuotaMensual !== null && (
                <ResumenPrestamo 
                  cuotaMensual={cuotaMensual} 
                  tablaAmortizacion={tablaAmortizacion}
                  monto={formData.monto}
                  solicitarPrestamo={solicitarPrestamo}
                  isSubmitting={isSubmitting}
                />
              )}
              
              <TablaAmortizacion tablaAmortizacion={tablaAmortizacion} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SolicitarPrestamo;
