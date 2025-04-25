
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  ArrowRightLeft, 
  Calendar, 
  DollarSign,
  Percent,
  Info,
  BarChart2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, convertirTiempoAAnios, convertirTiempoAMeses } from '@/services/calculosFinancieros';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SistemaCapitalizacion = {
  nombre: string;
  descripcion: string;
  formula: string;
  color: string;
  calcular: (capital: number, tasaInteres: number, periodos: number, frecuencia?: number, tiempoInicial?: number) => number[];
};

type ResultadoComparacion = {
  sistema: string;
  periodos: number[];
  valores: number[];
  color: string;
  montoFinal: number;
};

type UnidadTiempo = 'anios' | 'meses';

const SistemasCapitalizacion = () => {
  const [capital, setCapital] = useState<string>('1000000');
  const [tasaInteres, setTasaInteres] = useState<string>('12');
  const [periodos, setPeriodos] = useState<string>('12');
  const [unidadTiempo, setUnidadTiempo] = useState<UnidadTiempo>('anios');
  const [frecuencia, setFrecuencia] = useState<string>('4');
  const [tiempoInicial, setTiempoInicial] = useState<string>('3');
  const [unidadTiempoInicial, setUnidadTiempoInicial] = useState<UnidadTiempo>('anios');
  const [resultados, setResultados] = useState<ResultadoComparacion[]>([]);

  // Sistemas de capitalización disponibles
  const sistemasCapitalizacion: SistemaCapitalizacion[] = [
    {
      nombre: 'Simple',
      descripcion: 'El interés se calcula siempre sobre el capital inicial',
      formula: 'M = C(1 + r×t)',
      color: '#4F46E5',
      calcular: (capital, tasaInteres, periodos) => {
        const tasaDecimal = tasaInteres / 100;
        const valores: number[] = [];
        
        for (let i = 0; i <= periodos; i++) {
          const monto = capital * (1 + tasaDecimal * i);
          valores.push(monto);
        }
        
        return valores;
      }
    },
    {
      nombre: 'Compuesto',
      descripcion: 'El interés se capitaliza periódicamente',
      formula: 'M = C(1 + r)^t',
      color: '#06B6D4',
      calcular: (capital, tasaInteres, periodos) => {
        const tasaDecimal = tasaInteres / 100;
        const valores: number[] = [];
        
        for (let i = 0; i <= periodos; i++) {
          const monto = capital * Math.pow(1 + tasaDecimal, i);
          valores.push(monto);
        }
        
        return valores;
      }
    },
    {
      nombre: 'Continuo',
      descripcion: 'Capitalización en tiempo continuo',
      formula: 'M = C×e^(r×t)',
      color: '#10B981',
      calcular: (capital, tasaInteres, periodos) => {
        const tasaDecimal = tasaInteres / 100;
        const valores: number[] = [];
        
        for (let i = 0; i <= periodos; i++) {
          const monto = capital * Math.exp(tasaDecimal * i);
          valores.push(monto);
        }
        
        return valores;
      }
    },
    {
      nombre: 'Periódico',
      descripcion: 'Capitalización varias veces por período',
      formula: 'M = C(1 + r/n)^(n×t)',
      color: '#F59E0B',
      calcular: (capital, tasaInteres, periodos, frecuencia = 4) => {
        const tasaDecimal = tasaInteres / 100;
        const valores: number[] = [];
        
        for (let i = 0; i <= periodos; i++) {
          const monto = capital * Math.pow(1 + tasaDecimal / frecuencia, i * frecuencia);
          valores.push(monto);
        }
        
        return valores;
      }
    },
    {
      nombre: 'Anticipado',
      descripcion: 'Interés pagado al inicio del período',
      formula: 'M = C(1 + r)^(t+1)',
      color: '#EC4899',
      calcular: (capital, tasaInteres, periodos) => {
        const tasaDecimal = tasaInteres / 100;
        const valores: number[] = [];
        
        for (let i = 0; i <= periodos; i++) {
          const monto = capital * Math.pow(1 + tasaDecimal, i + 1);
          valores.push(monto);
        }
        
        return valores;
      }
    },
    {
      nombre: 'Diferido',
      descripcion: 'Capitalización que empieza después de un tiempo inicial',
      formula: 'M = C(1 + r)^(t-t₀)',
      color: '#8B5CF6',
      calcular: (capital, tasaInteres, periodos, frecuencia = 4, tiempoInicial = 3) => {
        const tasaDecimal = tasaInteres / 100;
        const valores: number[] = [];
        
        for (let i = 0; i <= periodos; i++) {
          // Si el tiempo es menor al diferimiento, el valor es igual al capital
          if (i < tiempoInicial) {
            valores.push(capital);
          } else {
            const tiempoEfectivo = i - tiempoInicial;
            const monto = capital * Math.pow(1 + tasaDecimal, tiempoEfectivo);
            valores.push(monto);
          }
        }
        
        return valores;
      }
    }
  ];

  // Función para convertir tiempo según la unidad seleccionada
  const convertirTiempo = (valor: number, unidad: UnidadTiempo): number => {
    if (unidad === 'anios') {
      return valor; // Ya está en años, no necesita conversión
    } else {
      return valor / 12; // Convertir meses a años
    }
  };

  // Realizar la comparación de sistemas
  const compararSistemas = () => {
    try {
      const capitalNum = parseFloat(capital);
      const tasaInteresNum = parseFloat(tasaInteres);
      const periodosNum = parseInt(periodos);
      const frecuenciaNum = parseInt(frecuencia);
      const tiempoInicialNum = parseInt(tiempoInicial);
      
      if (isNaN(capitalNum) || isNaN(tasaInteresNum) || isNaN(periodosNum) || 
          isNaN(frecuenciaNum) || isNaN(tiempoInicialNum)) {
        toast.error("Por favor, ingrese valores numéricos válidos");
        return;
      }
      
      if (capitalNum <= 0 || tasaInteresNum <= 0 || periodosNum <= 0 || 
          frecuenciaNum <= 0 || tiempoInicialNum < 0) {
        toast.error("Los valores deben ser mayores que cero (tiempo inicial puede ser cero)");
        return;
      }
      
      // Convertir periodos según la unidad de tiempo
      const periodosEnAnios = convertirTiempo(periodosNum, unidadTiempo);
      const tiempoInicialEnAnios = convertirTiempo(tiempoInicialNum, unidadTiempoInicial);
      
      // Calcular resultados para cada sistema
      const nuevosResultados: ResultadoComparacion[] = sistemasCapitalizacion.map(sistema => {
        // Crear una escala de periodos basada en la unidad de tiempo seleccionada
        const periodosArray = Array.from({ length: periodosNum + 1 }, (_, i) => i);
        
        // Calcular valores con periodos convertidos a años para los cálculos internos
        const valoresArray = sistema.calcular(
          capitalNum, 
          tasaInteresNum, 
          periodosEnAnios, 
          frecuenciaNum,
          tiempoInicialEnAnios
        );
        
        return {
          sistema: sistema.nombre,
          periodos: periodosArray,
          valores: valoresArray,
          color: sistema.color,
          montoFinal: valoresArray[valoresArray.length - 1]
        };
      });
      
      setResultados(nuevosResultados);
      toast.success("Comparación de sistemas realizada");
    } catch (error) {
      console.error('Error en la comparación:', error);
      toast.error("Error en los cálculos. Revise los valores ingresados.");
    }
  };

  // Preparar datos para gráfico
  const prepararDatosGrafico = () => {
    if (resultados.length === 0) return [];
    
    const datos = [];
    const numPeriodos = resultados[0].periodos.length;
    
    for (let i = 0; i < numPeriodos; i++) {
      const punto: any = { 
        periodo: i,
        etiqueta: `${i} ${unidadTiempo === 'anios' ? 'años' : 'meses'}`
      };
      
      resultados.forEach(resultado => {
        // Verificar si el valor es finito
        if (isFinite(resultado.valores[i])) {
          punto[resultado.sistema] = resultado.valores[i];
        } else {
          punto[resultado.sistema] = null;
        }
      });
      
      datos.push(punto);
    }
    
    return datos;
  };

  const datosGrafico = prepararDatosGrafico();

  return (
    <Layout>
      <div className="page-transition max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Sistemas de Capitalización</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="financial-card md:col-span-1">
            <CardHeader>
              <CardTitle>Parámetros de Comparación</CardTitle>
              <CardDescription>
                Ingrese los datos para comparar diferentes sistemas de capitalización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-financial-slate/10 mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Sistemas comparados:
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {sistemasCapitalizacion.map((sistema) => (
                      <div key={sistema.nombre} className="flex items-start space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full mt-1.5" 
                          style={{ backgroundColor: sistema.color }}
                        />
                        <div>
                          <p className="font-medium">{sistema.nombre}</p>
                          <p className="text-xs text-gray-400">{sistema.descripcion}</p>
                          <p className="text-sm text-financial-accent mt-1">{sistema.formula}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="capital">Capital Inicial (C)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="capital"
                      type="number"
                      value={capital}
                      onChange={(e) => setCapital(e.target.value)}
                      placeholder="Ej: 1000000"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tasaInteres">Tasa de Interés (r%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="tasaInteres"
                      type="number"
                      value={tasaInteres}
                      onChange={(e) => setTasaInteres(e.target.value)}
                      placeholder="Ej: 12"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="periodos">Número de Períodos</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="periodos"
                        type="number"
                        value={periodos}
                        onChange={(e) => setPeriodos(e.target.value)}
                        placeholder="Ej: 12"
                        className="pl-8"
                      />
                    </div>
                    <Select 
                      value={unidadTiempo} 
                      onValueChange={(value) => setUnidadTiempo(value as UnidadTiempo)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anios">Años</SelectItem>
                        <SelectItem value="meses">Meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="frecuencia">Frecuencia de Capitalización (n)</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="frecuencia"
                      type="number"
                      value={frecuencia}
                      onChange={(e) => setFrecuencia(e.target.value)}
                      placeholder="Ej: 4"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Para capitalización periódica</p>
                </div>
                
                <div>
                  <Label htmlFor="tiempoInicial">Tiempo Inicial (t₀)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 relative">
                      <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="tiempoInicial"
                        type="number"
                        value={tiempoInicial}
                        onChange={(e) => setTiempoInicial(e.target.value)}
                        placeholder="Ej: 3"
                        className="pl-8"
                      />
                    </div>
                    <Select 
                      value={unidadTiempoInicial} 
                      onValueChange={(value) => setUnidadTiempoInicial(value as UnidadTiempo)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anios">Años</SelectItem>
                        <SelectItem value="meses">Meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Para capitalización diferida</p>
                </div>
                
                <Button onClick={compararSistemas} variant="finance" className="w-full">
                  <ArrowRightLeft className="mr-2 h-4 w-4" /> Comparar Sistemas
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="financial-card md:col-span-2">
            <CardHeader>
              <CardTitle>Resultados de la Comparación</CardTitle>
              <CardDescription>
                Gráfico y detalles de los diferentes sistemas de capitalización
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resultados.length > 0 ? (
                <div>
                  <div className="p-4 bg-financial-slate/20 rounded-lg mb-6">
                    <h3 className="text-lg font-medium mb-4">Valor Final por Sistema</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {resultados.map((resultado) => (
                        <div key={resultado.sistema} className="p-3 rounded-lg bg-financial-slate/30 text-center">
                          <div 
                            className="w-3 h-3 rounded-full mx-auto mb-1" 
                            style={{ backgroundColor: resultado.color }}
                          />
                          <p className="text-sm text-white/60">{resultado.sistema}</p>
                          <p className="font-medium">
                            {isFinite(resultado.montoFinal) 
                              ? formatCurrency(resultado.montoFinal) 
                              : 'Infinito'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={datosGrafico}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A3042" />
                        <XAxis 
                          dataKey="etiqueta" 
                          label={{ 
                            value: unidadTiempo === 'anios' ? 'Años' : 'Meses', 
                            position: 'insideBottomRight', 
                            offset: -10 
                          }} 
                        />
                        <YAxis 
                          tickFormatter={(value) => 
                            value >= 1000000 
                              ? `${(value / 1000000).toFixed(1)}M` 
                              : value >= 1000 
                                ? `${(value / 1000).toFixed(1)}K` 
                                : value.toFixed(0)
                          } 
                        />
                        <Tooltip 
                          formatter={(value: any) => [formatCurrency(value), 'Monto']}
                          labelFormatter={(label) => `Período ${label}`}
                        />
                        <Legend />
                        {resultados.map((resultado) => (
                          <Line
                            key={resultado.sistema}
                            type="monotone"
                            dataKey={resultado.sistema}
                            stroke={resultado.color}
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-financial-slate/30">
                          <TableHead className="p-2 text-left">
                            {unidadTiempo === 'anios' ? 'Año' : 'Mes'}
                          </TableHead>
                          {resultados.map((resultado) => (
                            <TableHead key={resultado.sistema} className="p-2 text-right">
                              {resultado.sistema}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {datosGrafico.map((punto) => (
                          <TableRow key={punto.periodo} className="border-b border-white/5">
                            <TableCell className="p-2">{punto.periodo}</TableCell>
                            {resultados.map((resultado) => (
                              <TableCell key={resultado.sistema} className="p-2 text-right">
                                {isFinite(punto[resultado.sistema]) 
                                  ? formatCurrency(punto[resultado.sistema]) 
                                  : '∞'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 text-gray-500">
                  <BarChart2 className="mx-auto h-12 w-12 opacity-20 mb-4" />
                  <p>Complete los parámetros y haga clic en "Comparar Sistemas" para ver los resultados.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SistemasCapitalizacion;
