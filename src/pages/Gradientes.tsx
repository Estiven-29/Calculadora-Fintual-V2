
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Toggle } from '@/components/ui/toggle';
import { 
  calcularSerieGradienteAritmetico,
  calcularSerieGradienteGeometrico,
  calcularCuotaInicialDesdeValorPresenteGradienteAritmetico,
  calcularCuotaInicialDesdeValorPresenteGradienteGeometrico,
  calcularCuotaInicialDesdeValorFuturoGradienteAritmetico,
  calcularCuotaInicialDesdeValorFuturoGradienteGeometrico,
  ResultadoGradiente,
  formatCurrency 
} from '@/services/calculosFinancieros';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, ChevronUp, Info, Calculator, TrendingUp, TrendingDown, Percent } from 'lucide-react';

const Gradientes = () => {
  const [formData, setFormData] = useState({
    cuotaInicial: '',
    gradiente: '',
    tasaInteres: '',
    periodos: '',
    tipoGradiente: 'aritmetico',
    valorPresente: '',
    valorFuturo: '',
    tipoCalculo: 'serie', // 'serie', 'valorPresente', 'valorFuturo'
    unidadTiempo: 'meses', // 'años' o 'meses'
    sistemaCapitalizacion: 'mensual' // 'mensual', 'trimestral', 'semestral', 'anual'
  });

  const [resultado, setResultado] = useState<ResultadoGradiente | null>(null);
  const [expandido, setExpandido] = useState(false);
  const isMobile = useIsMobile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calcular = () => {
    try {
      const tasaInteres = parseFloat(formData.tasaInteres) / 100;
      let periodos = parseInt(formData.periodos);
      
      if (isNaN(tasaInteres) || periodos <= 0) {
        toast.error("Por favor, ingrese valores válidos para la tasa de interés y períodos.");
        return;
      }

      // Convertir periodos si es necesario
      if (formData.unidadTiempo === 'años') {
        periodos = periodos * 12; // Convertir años a meses para el cálculo
      }

      let resultado: ResultadoGradiente | null = null;

      // Calcular según el tipo de cálculo seleccionado
      if (formData.tipoCalculo === 'serie') {
        const cuotaInicial = parseFloat(formData.cuotaInicial);
        const gradiente = parseFloat(formData.gradiente);
        
        if (isNaN(cuotaInicial) || isNaN(gradiente)) {
          toast.error("Por favor, ingrese valores válidos para la cuota inicial y el gradiente.");
          return;
        }
        
        if (formData.tipoGradiente === 'aritmetico') {
          resultado = calcularSerieGradienteAritmetico(
            cuotaInicial, 
            gradiente, 
            periodos, 
            tasaInteres, 
            formData.sistemaCapitalizacion
          );
        } else {
          // Para gradiente geométrico, el gradiente es una tasa en porcentaje
          resultado = calcularSerieGradienteGeometrico(
            cuotaInicial, 
            gradiente / 100, 
            periodos, 
            tasaInteres, 
            formData.sistemaCapitalizacion
          );
        }
      } 
      else if (formData.tipoCalculo === 'valorPresente') {
        const valorPresente = parseFloat(formData.valorPresente);
        const gradiente = parseFloat(formData.gradiente);
        
        if (isNaN(valorPresente) || isNaN(gradiente)) {
          toast.error("Por favor, ingrese valores válidos para el valor presente y el gradiente.");
          return;
        }
        
        let cuotaInicial: number;
        
        if (formData.tipoGradiente === 'aritmetico') {
          cuotaInicial = calcularCuotaInicialDesdeValorPresenteGradienteAritmetico(
            valorPresente, gradiente, tasaInteres, periodos
          );
          resultado = calcularSerieGradienteAritmetico(
            cuotaInicial, 
            gradiente, 
            periodos, 
            tasaInteres, 
            formData.sistemaCapitalizacion
          );
        } else {
          cuotaInicial = calcularCuotaInicialDesdeValorPresenteGradienteGeometrico(
            valorPresente, gradiente / 100, tasaInteres, periodos
          );
          resultado = calcularSerieGradienteGeometrico(
            cuotaInicial, 
            gradiente / 100, 
            periodos, 
            tasaInteres, 
            formData.sistemaCapitalizacion
          );
        }
      }
      else if (formData.tipoCalculo === 'valorFuturo') {
        const valorFuturo = parseFloat(formData.valorFuturo);
        const gradiente = parseFloat(formData.gradiente);
        
        if (isNaN(valorFuturo) || isNaN(gradiente)) {
          toast.error("Por favor, ingrese valores válidos para el valor futuro y el gradiente.");
          return;
        }
        
        let cuotaInicial: number;
        
        if (formData.tipoGradiente === 'aritmetico') {
          cuotaInicial = calcularCuotaInicialDesdeValorFuturoGradienteAritmetico(
            valorFuturo, gradiente, tasaInteres, periodos
          );
          resultado = calcularSerieGradienteAritmetico(
            cuotaInicial, 
            gradiente, 
            periodos, 
            tasaInteres, 
            formData.sistemaCapitalizacion
          );
        } else {
          cuotaInicial = calcularCuotaInicialDesdeValorFuturoGradienteGeometrico(
            valorFuturo, gradiente / 100, tasaInteres, periodos
          );
          resultado = calcularSerieGradienteGeometrico(
            cuotaInicial, 
            gradiente / 100, 
            periodos, 
            tasaInteres, 
            formData.sistemaCapitalizacion
          );
        }
      }

      setResultado(resultado);
      toast.success("Cálculo realizado con éxito");
    } catch (error) {
      console.error('Error en el cálculo de gradientes:', error);
      toast.error("Error en el cálculo. Por favor revise los valores ingresados.");
    }
  };

  // Determinar el número de filas a mostrar basado en si está expandido o es móvil
  const filasAMostrar = (resultado?.cuotas) 
    ? (expandido ? resultado.cuotas.length : (isMobile ? 5 : 10)) 
    : 0;

  // Obtener el texto descriptivo para la unidad de tiempo
  const getDescripcionPeriodos = () => {
    return formData.unidadTiempo === 'años' 
      ? 'Número de años' 
      : 'Número de meses';
  };

  // Función para obtener la descripción adecuada del gradiente según el tipo
  const getDescripcionGradiente = () => {
    return formData.tipoGradiente === 'aritmetico'
      ? 'Monto constante que se suma en cada período'
      : 'Porcentaje de crecimiento en cada período';
  };

  // Función para obtener el placeholder adecuado para el gradiente
  const getPlaceholderGradiente = () => {
    return formData.tipoGradiente === 'aritmetico' 
      ? "Ej: 100000" 
      : "Ej: 5";
  };

  return (
    <Layout>
      <div className="page-transition max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Cálculo de Gradientes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="financial-card md:col-span-1">
            <CardHeader>
              <CardTitle>Parámetros del Gradiente</CardTitle>
              <CardDescription>
                Ingrese los datos para calcular la serie con gradiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="serie" className="mb-6">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="serie" onClick={() => handleSelectChange('tipoCalculo', 'serie')}>
                    Serie
                  </TabsTrigger>
                  <TabsTrigger value="valorPresente" onClick={() => handleSelectChange('tipoCalculo', 'valorPresente')}>
                    Valor Presente
                  </TabsTrigger>
                  <TabsTrigger value="valorFuturo" onClick={() => handleSelectChange('tipoCalculo', 'valorFuturo')}>
                    Valor Futuro
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="serie">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cuotaInicial">Cuota Inicial (C₁)</Label>
                      <Input
                        id="cuotaInicial"
                        name="cuotaInicial"
                        type="number"
                        placeholder="Ej: 1000000"
                        value={formData.cuotaInicial}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="valorPresente">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="valorPresente">Valor Presente (PV)</Label>
                      <Input
                        id="valorPresente"
                        name="valorPresente"
                        type="number"
                        placeholder="Ej: 10000000"
                        value={formData.valorPresente}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="valorFuturo">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="valorFuturo">Valor Futuro (FV)</Label>
                      <Input
                        id="valorFuturo"
                        name="valorFuturo"
                        type="number"
                        placeholder="Ej: 20000000"
                        value={formData.valorFuturo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gradiente">Gradiente (G)</Label>
                  <Input
                    id="gradiente"
                    name="gradiente"
                    type="number"
                    placeholder={getPlaceholderGradiente()}
                    value={formData.gradiente}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    {getDescripcionGradiente()}
                  </p>
                </div>
                
                <div>
                  <Label className="mb-2 block">Tipo de Gradiente</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      type="button"
                      variant={formData.tipoGradiente === 'aritmetico' ? 'finance' : 'outline'} 
                      onClick={() => handleSelectChange('tipoGradiente', 'aritmetico')}
                      className="w-full"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Aritmético (G)
                    </Button>
                    <Button 
                      type="button"
                      variant={formData.tipoGradiente === 'geometrico' ? 'finance' : 'outline'} 
                      onClick={() => handleSelectChange('tipoGradiente', 'geometrico')}
                      className="w-full"
                    >
                      <Percent className="h-4 w-4 mr-2" />
                      Geométrico (g%)
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tasaInteres">Tasa de Interés (i%)</Label>
                  <Input
                    id="tasaInteres"
                    name="tasaInteres"
                    type="number"
                    placeholder="Ej: 12"
                    value={formData.tasaInteres}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Tasa de interés periódica, no anual
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="periodos">{getDescripcionPeriodos()} (n)</Label>
                  <Input
                    id="periodos"
                    name="periodos"
                    type="number"
                    placeholder="Ej: 12"
                    value={formData.periodos}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mt-2">
                  <Label className="mb-2 block">Unidad de tiempo</Label>
                  <RadioGroup 
                    value={formData.unidadTiempo} 
                    onValueChange={(value) => handleSelectChange('unidadTiempo', value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="meses" id="meses" />
                      <Label htmlFor="meses">Meses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="años" id="años" />
                      <Label htmlFor="años">Años</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="sistemaCapitalizacion" className="mb-2 block">Sistema de Capitalización</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      type="button"
                      variant={formData.sistemaCapitalizacion === 'mensual' ? 'gradient' : 'outline'} 
                      onClick={() => handleSelectChange('sistemaCapitalizacion', 'mensual')}
                      className="w-full text-xs mb-2"
                    >
                      Mensual
                    </Button>
                    <Button 
                      type="button"
                      variant={formData.sistemaCapitalizacion === 'trimestral' ? 'gradient' : 'outline'} 
                      onClick={() => handleSelectChange('sistemaCapitalizacion', 'trimestral')}
                      className="w-full text-xs mb-2"
                    >
                      Trimestral
                    </Button>
                    <Button 
                      type="button"
                      variant={formData.sistemaCapitalizacion === 'semestral' ? 'gradient' : 'outline'} 
                      onClick={() => handleSelectChange('sistemaCapitalizacion', 'semestral')}
                      className="w-full text-xs"
                    >
                      Semestral
                    </Button>
                    <Button 
                      type="button"
                      variant={formData.sistemaCapitalizacion === 'anual' ? 'gradient' : 'outline'} 
                      onClick={() => handleSelectChange('sistemaCapitalizacion', 'anual')}
                      className="w-full text-xs"
                    >
                      Anual
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Frecuencia de capitalización de intereses
                  </p>
                </div>
                
                <Button onClick={calcular} variant="finance" className="w-full">
                  <Calculator className="mr-2 h-4 w-4" /> Calcular Gradiente
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="financial-card md:col-span-2">
            <CardHeader>
              <CardTitle>Resultados del Gradiente</CardTitle>
              <CardDescription>
                Detalles de la serie con gradiente {formData.tipoGradiente === 'aritmetico' ? 'aritmético' : 'geométrico'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resultado && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Cuota Inicial (C₁)</p>
                      <p className="font-medium">{formatCurrency(resultado.cuotaInicial)}</p>
                    </div>
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Valor Presente (PV)</p>
                      <p className="font-medium">{formatCurrency(resultado.montoPresente)}</p>
                    </div>
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Valor Futuro (FV)</p>
                      <p className="font-medium">{formatCurrency(resultado.montoFuturo)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">TIR (Tasa Interna de Retorno)</p>
                      <p className="font-medium text-financial-accent flex items-center justify-center">
                        <Calculator className="h-4 w-4 mr-2" />
                        {resultado.tir !== undefined ? (resultado.tir * 100).toFixed(2) + '%' : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Sistema de Capitalización</p>
                      <p className="font-medium capitalize">
                        {resultado.sistemaCapitalizacion ? resultado.sistemaCapitalizacion : 'Mensual'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-financial-slate/10 mb-4">
                    <h3 className="font-medium mb-2">Fórmulas Utilizadas:</h3>
                    <div className="text-sm space-y-1">
                      {formData.tipoGradiente === 'aritmetico' ? (
                        <>
                          <p>
                            Valor Presente (PV): C₁ · [(1 - (1 + i)^-n) / i] + G · [((1 - (1 + i)^-n) / i²) - (n(1 + i)^-n / i)]
                          </p>
                          <p>
                            Valor Futuro (FV): PV · (1 + i)^n
                          </p>
                          <p>
                            TIR: Tasa que hace que el valor presente de los flujos sea igual a la inversión inicial
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            Valor Presente (PV): C₁ · [1 - ((1 + g) / (1 + i))^n] / (i - g), para i ≠ g
                          </p>
                          <p>
                            Valor Futuro (FV): PV · (1 + i)^n
                          </p>
                          <p>
                            TIR: Tasa que hace que el valor presente de los flujos sea igual a la inversión inicial
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-financial-slate/30">
                          <TableHead className="p-2 text-left">Período</TableHead>
                          <TableHead className="p-2 text-right">Monto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultado.cuotas.slice(0, filasAMostrar).map((cuota) => (
                          <TableRow key={cuota.numeroCuota} className="border-b border-white/5">
                            <TableCell className="p-2">{cuota.numeroCuota}</TableCell>
                            <TableCell className="p-2 text-right">{formatCurrency(cuota.monto)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {resultado.cuotas.length > (isMobile ? 5 : 10) && (
                      <div className="mt-2 flex justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs" 
                          onClick={() => setExpandido(!expandido)}
                        >
                          {expandido ? (
                            <div className="flex items-center">
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Mostrar menos
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Ver todos los {resultado.cuotas.length} períodos
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {!resultado && (
                <div className="text-center p-12 text-gray-500">
                  <p>Complete los parámetros y haga clic en "Calcular Gradiente" para ver los resultados.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Gradientes;
