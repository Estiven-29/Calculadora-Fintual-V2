
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/services/calculosFinancieros';

type FlujoCaja = {
  periodo: number;
  valor: number;
};

const SeriesTIR = () => {
  const [flujosCaja, setFlujosCaja] = useState<FlujoCaja[]>([
    { periodo: 0, valor: 0 },
    { periodo: 1, valor: 0 },
  ]);
  const [valorPresente, setValorPresente] = useState<number | null>(null);
  const [tir, setTir] = useState<number | null>(null);
  const [expandido, setExpandido] = useState(false);

  // Función para manejar cambios en los valores de flujo de caja
  const handleFlujoCajaChange = (index: number, valor: number) => {
    const nuevosFlujos = [...flujosCaja];
    nuevosFlujos[index].valor = valor;
    setFlujosCaja(nuevosFlujos);
  };

  // Función para agregar un nuevo período
  const agregarPeriodo = () => {
    const ultimoPeriodo = flujosCaja[flujosCaja.length - 1].periodo;
    setFlujosCaja([...flujosCaja, { periodo: ultimoPeriodo + 1, valor: 0 }]);
  };

  // Función para eliminar un período
  const eliminarPeriodo = (index: number) => {
    if (flujosCaja.length <= 2) {
      toast.error("Se necesitan al menos dos períodos para el cálculo");
      return;
    }
    const nuevosFlujos = flujosCaja.filter((_, i) => i !== index);
    setFlujosCaja(nuevosFlujos);
  };

  // Calcular el Valor Presente Neto con una tasa dada
  const calcularVPN = (flujos: FlujoCaja[], tasa: number): number => {
    return flujos.reduce((acumulado, flujo) => {
      const factorDescuento = Math.pow(1 + tasa, flujo.periodo);
      return acumulado + flujo.valor / factorDescuento;
    }, 0);
  };

  // Calcular la Tasa Interna de Retorno (TIR) usando el método de Newton-Raphson
  const calcularTIR = (flujos: FlujoCaja[]): number | null => {
    // Verificar si hay al menos un valor negativo y uno positivo
    const hayNegativo = flujos.some(flujo => flujo.valor < 0);
    const hayPositivo = flujos.some(flujo => flujo.valor > 0);
    
    if (!hayNegativo || !hayPositivo) {
      toast.error("Para calcular la TIR, debe haber al menos un valor negativo (inversión) y un valor positivo (retorno)");
      return null;
    }
    
    let tasa = 0.1; // Tasa inicial
    const maxIteraciones = 100;
    const tolerancia = 0.0001;
    
    for (let i = 0; i < maxIteraciones; i++) {
      const vpn = calcularVPN(flujos, tasa);
      
      // Si el VPN es cercano a cero, hemos encontrado la TIR
      if (Math.abs(vpn) < tolerancia) {
        return tasa;
      }
      
      // Calcular la derivada de la función VPN con respecto a la tasa
      const delta = 0.0001;
      const vpnDelta = calcularVPN(flujos, tasa + delta);
      const derivada = (vpnDelta - vpn) / delta;
      
      // Si la derivada es muy cercana a cero, no podemos continuar
      if (Math.abs(derivada) < 1e-10) break;
      
      // Actualizar la tasa utilizando el método de Newton-Raphson
      const nuevaTasa = tasa - vpn / derivada;
      
      // Si la tasa no cambia significativamente, hemos convergido
      if (Math.abs(nuevaTasa - tasa) < tolerancia) {
        return nuevaTasa;
      }
      
      tasa = nuevaTasa;
    }
    
    toast.error("No se pudo converger a una TIR. Revise los valores de flujo de caja.");
    return null;
  };

  // Realizar cálculos
  const calcular = () => {
    try {
      // Verificar que los flujos de caja tengan valores válidos
      const flujosValidos = flujosCaja.every(flujo => !isNaN(flujo.valor));
      
      if (!flujosValidos) {
        toast.error("Todos los valores de flujo de caja deben ser números válidos");
        return;
      }
      
      // Calcular TIR
      const tirCalculada = calcularTIR(flujosCaja);
      if (tirCalculada !== null) {
        setTir(tirCalculada);
      }
      
      // Calcular Valor Presente con una tasa del 10% (para ejemplo)
      const vpn = calcularVPN(flujosCaja, 0.10);
      setValorPresente(vpn);
      
      toast.success("Cálculos realizados con éxito");
    } catch (error) {
      console.error('Error en cálculos:', error);
      toast.error("Error en los cálculos. Revise los valores ingresados.");
    }
  };

  return (
    <Layout>
      <div className="page-transition max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Series y TIR</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="financial-card md:col-span-1">
            <CardHeader>
              <CardTitle>Flujos de Caja</CardTitle>
              <CardDescription>
                Ingrese los flujos de caja para calcular la TIR y el VPN
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-financial-slate/10 mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Instrucciones:
                  </h3>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li>Ingrese los flujos de caja para cada período</li>
                    <li>El período 0 generalmente representa la inversión inicial (valor negativo)</li>
                    <li>Los períodos siguientes representan los retornos (valores positivos)</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  {flujosCaja.map((flujo, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-20">
                        <Label htmlFor={`periodo-${index}`}>Período {flujo.periodo}</Label>
                        <Input
                          id={`periodo-${index}`}
                          value={flujo.periodo}
                          readOnly
                          className="bg-financial-slate/10"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`valor-${index}`}>Valor</Label>
                        <Input
                          id={`valor-${index}`}
                          type="number"
                          value={flujo.valor === 0 ? '' : flujo.valor}
                          onChange={(e) => handleFlujoCajaChange(index, parseFloat(e.target.value) || 0)}
                          placeholder={index === 0 ? "Ej: -1000000" : "Ej: 250000"}
                        />
                      </div>
                      {index > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="mt-8"
                          onClick={() => eliminarPeriodo(index)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={agregarPeriodo} 
                    className="w-full"
                  >
                    + Agregar Período
                  </Button>
                </div>
                
                <Button onClick={calcular} variant="finance" className="w-full">
                  <Calculator className="mr-2 h-4 w-4" /> Calcular TIR y VPN
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="financial-card md:col-span-2">
            <CardHeader>
              <CardTitle>Resultados del Análisis</CardTitle>
              <CardDescription>
                Tasa Interna de Retorno (TIR) y Valor Presente Neto (VPN)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(tir !== null || valorPresente !== null) ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-financial-slate/20 p-4 rounded-lg text-center">
                      <p className="text-sm text-white/60">Tasa Interna de Retorno (TIR)</p>
                      <p className="text-2xl font-bold text-financial-accent">
                        {tir !== null ? (tir * 100).toFixed(2) + '%' : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-financial-slate/20 p-4 rounded-lg text-center">
                      <p className="text-sm text-white/60">Valor Presente Neto (10%)</p>
                      <p className="text-2xl font-bold">
                        {valorPresente !== null ? formatCurrency(valorPresente) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-financial-slate/10 mb-4">
                    <h3 className="font-medium mb-2">Interpretación:</h3>
                    <div className="text-sm space-y-2">
                      {tir !== null && (
                        <p>
                          Una TIR de {(tir * 100).toFixed(2)}% significa que este es el rendimiento anual que se obtiene por la inversión realizada.
                          {tir > 0.10 ? ' Esta TIR es superior a la tasa de descuento (10%), lo que indica que el proyecto es rentable.' : 
                          ' Esta TIR es inferior a la tasa de descuento (10%), lo que indica que el proyecto no es rentable.'}
                        </p>
                      )}
                      {valorPresente !== null && (
                        <p>
                          El Valor Presente Neto de {formatCurrency(valorPresente)} con una tasa de descuento del 10% 
                          {valorPresente > 0 ? ' es positivo, lo que indica que el proyecto genera valor.' : 
                          ' es negativo, lo que indica que el proyecto destruye valor.'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-financial-slate/30">
                          <TableHead className="p-2 text-left">Período</TableHead>
                          <TableHead className="p-2 text-right">Flujo de Caja</TableHead>
                          <TableHead className="p-2 text-right">Valor Actual</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flujosCaja.map((flujo) => (
                          <TableRow key={flujo.periodo} className="border-b border-white/5">
                            <TableCell className="p-2">{flujo.periodo}</TableCell>
                            <TableCell className="p-2 text-right">{formatCurrency(flujo.valor)}</TableCell>
                            <TableCell className="p-2 text-right">
                              {formatCurrency(flujo.valor / Math.pow(1.10, flujo.periodo))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 text-gray-500">
                  <p>Ingrese los flujos de caja y haga clic en "Calcular TIR y VPN" para ver los resultados.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SeriesTIR;
