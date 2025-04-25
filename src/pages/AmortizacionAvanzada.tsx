
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  calcularAmortizacionFrancesa,
  calcularAmortizacionAlemana,
  calcularAmortizacionAmericana,
  calcularAmortizacionConPeriodosGracia,
  CuotaAmortizacion,
  formatCurrency
} from '@/services/calculosFinancieros';
import { toast } from 'sonner';
import TablaAmortizacion from '@/components/prestamos/TablaAmortizacion';
import { useIsMobile } from '@/hooks/use-mobile';

const AmortizacionAvanzada = () => {
  const [formData, setFormData] = useState({
    monto: '',
    tasaInteres: '',
    plazo: '',
    tipoPlazo: 'meses',
    tipoAmortizacion: 'frances',
    periodosGracia: '0',
    tipoPeriodosGracia: 'sin-gracia' // 'sin-gracia', 'parcial', 'total'
  });
  
  const [tablaAmortizacion, setTablaAmortizacion] = useState<CuotaAmortizacion[]>([]);
  const [cuotaMensual, setCuotaMensual] = useState<number | null>(null);
  const isMobile = useIsMobile();

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

  const calcularAmortizacion = () => {
    try {
      const monto = parseFloat(formData.monto);
      const tasaInteres = parseFloat(formData.tasaInteres) / 100;
      const plazo = parseInt(formData.plazo);
      const periodosGracia = parseInt(formData.periodosGracia);
      
      if (isNaN(monto) || isNaN(tasaInteres) || isNaN(plazo)) {
        toast.error("Por favor, complete todos los campos correctamente.");
        return;
      }
      
      // Convertir el plazo a meses si está en años
      const plazoMeses = formData.tipoPlazo === 'anos' ? plazo * 12 : plazo;
      
      let tabla: CuotaAmortizacion[] = [];
      
      if (formData.tipoPeriodosGracia === 'sin-gracia') {
        // Sin periodos de gracia, usar métodos estándar
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
      } else {
        // Con periodos de gracia
        tabla = calcularAmortizacionConPeriodosGracia(
          monto, 
          tasaInteres,
          plazoMeses,
          periodosGracia,
          formData.tipoAmortizacion as 'frances' | 'aleman' | 'americano'
        );
      }
      
      setTablaAmortizacion(tabla);
      
      // Establecer la cuota mensual
      if (tabla.length > 0) {
        setCuotaMensual(tabla[0].cuota);
      }
      
      toast.success("Se ha calculado el plan de amortización correctamente.");
    } catch (error) {
      console.error('Error en el cálculo de amortización:', error);
      toast.error("Error en el cálculo. Por favor revise los valores ingresados.");
    }
  };

  return (
    <Layout>
      <div className="page-transition max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Amortización Avanzada</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="financial-card md:col-span-1">
            <CardHeader>
              <CardTitle>Parámetros del Préstamo</CardTitle>
              <CardDescription>
                Ingrese los datos para calcular la amortización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="monto">Monto a Financiar</Label>
                  <Input 
                    id="monto"
                    name="monto"
                    type="number" 
                    placeholder="Ej: 10000000" 
                    value={formData.monto}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tasaInteres">Tasa de Interés (%)</Label>
                  <Input 
                    id="tasaInteres"
                    name="tasaInteres"
                    type="number" 
                    placeholder="Ej: 12" 
                    value={formData.tasaInteres}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tasa de interés periódica, no anual
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="plazo">Plazo</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      id="plazo"
                      name="plazo"
                      type="number" 
                      placeholder="Ej: 36" 
                      value={formData.plazo}
                      onChange={handleInputChange}
                    />
                    <Select 
                      value={formData.tipoPlazo} 
                      onValueChange={(value) => handleSelectChange('tipoPlazo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meses">Meses</SelectItem>
                        <SelectItem value="anos">Años</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tipoAmortizacion">Tipo de Amortización</Label>
                  <Select 
                    value={formData.tipoAmortizacion} 
                    onValueChange={(value) => handleSelectChange('tipoAmortizacion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frances">Francés (Cuota Fija)</SelectItem>
                      <SelectItem value="aleman">Alemán (Capital Fijo)</SelectItem>
                      <SelectItem value="americano">Americano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tipoPeriodosGracia">Períodos de Gracia</Label>
                  <Select 
                    value={formData.tipoPeriodosGracia} 
                    onValueChange={(value) => handleSelectChange('tipoPeriodosGracia', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin-gracia">Sin períodos de gracia</SelectItem>
                      <SelectItem value="parcial">Con períodos de gracia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.tipoPeriodosGracia !== 'sin-gracia' && (
                  <div>
                    <Label htmlFor="periodosGracia">Número de Períodos de Gracia</Label>
                    <Input 
                      id="periodosGracia"
                      name="periodosGracia"
                      type="number" 
                      placeholder="Ej: 6" 
                      value={formData.periodosGracia}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                
                <Button onClick={calcularAmortizacion} className="w-full">
                  Calcular Amortización
                </Button>
              </div>
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
                <div className="mb-6">
                  <div className="text-center p-4 bg-financial-slate/30 rounded-lg mb-4">
                    <h3 className="text-lg text-white/70 mb-2">Primera Cuota:</h3>
                    <p className="text-3xl font-bold text-financial-accent">
                      {formatCurrency(cuotaMensual)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Monto Total</p>
                      <p className="font-medium">{formatCurrency(parseFloat(formData.monto))}</p>
                    </div>
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Interés Total</p>
                      <p className="font-medium">
                        {formatCurrency(
                          tablaAmortizacion.reduce((sum, row) => sum + row.interes, 0)
                        )}
                      </p>
                    </div>
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Total a Pagar</p>
                      <p className="font-medium">
                        {formatCurrency(
                          tablaAmortizacion.reduce((sum, row) => sum + row.cuota, 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {tablaAmortizacion.length > 0 && (
                <TablaAmortizacion tablaAmortizacion={tablaAmortizacion} />
              )}
              
              {tablaAmortizacion.length === 0 && (
                <div className="text-center p-12 text-gray-500">
                  <p>Complete los parámetros y haga clic en "Calcular Amortización" para ver los resultados.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AmortizacionAvanzada;
