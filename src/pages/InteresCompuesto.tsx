import Layout from '@/components/Layout';
import {
  calcularMontoFuturoCompuesto,
  calcularTasaInteresCompuesto,
  calcularTiempoCompuesto,
  convertirTiempoAAnios,
  convertirTiempoAMeses,
  formatCurrency,
  formatearTiempo
} from '@/services/calculosFinancieros';
import { useState } from 'react';
import { toast } from 'sonner';

type CalculationType = 'montoFuturo' | 'tasaInteres' | 'tiempo';
type FrecuenciaType = 1 | 2 | 4 | 12 | 365;

const InteresCompuesto = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('montoFuturo');
  const [capital, setCapital] = useState<string>('1000000');
  const [tasaInteres, setTasaInteres] = useState<string>('0.05');
  const [montoFuturo, setMontoFuturo] = useState<string>('');
  const [anos, setAnos] = useState<string>('1');
  const [meses, setMeses] = useState<string>('0');
  const [dias, setDias] = useState<string>('0');
  const [frecuencia, setFrecuencia] = useState<FrecuenciaType>(1); // por defecto, anual
  const [resultado, setResultado] = useState<null | {
    montoFuturo: number;
    interesGenerado: number;
    tasaInteres: number;
    capitalizacion: string;
    explicacion: string;
  }>(null);

  const handleCalcular = () => {
    try {
      const capitalNum = parseFloat(capital);
      const tasaInteresNum = parseFloat(tasaInteres);
      const anosNum = parseInt(anos) || 0;
      const mesesNum = parseInt(meses) || 0;
      const diasNum = parseInt(dias) || 0;
      const montoFuturoNum = parseFloat(montoFuturo);
      
      if (capitalNum <= 0) {
        throw new Error('El capital debe ser mayor a cero');
      }
      
      if (calculationType !== 'tasaInteres' && tasaInteresNum <= 0) {
        throw new Error('La tasa de interés debe ser mayor a cero');
      }
      
      if (calculationType !== 'tiempo' && (anosNum < 0 || mesesNum < 0 || diasNum < 0)) {
        throw new Error('El tiempo no puede ser negativo');
      }
      
      if (calculationType === 'tiempo' && montoFuturoNum <= capitalNum) {
        throw new Error('El monto futuro debe ser mayor al capital inicial');
      }
      
      if (calculationType === 'tasaInteres' && montoFuturoNum <= 0) {
        throw new Error('El monto futuro debe ser mayor a cero');
      }
      
      let resultadoCalculo: number;
      
      const getFrecuenciaLabel = (frecValue: FrecuenciaType): string => {
        switch (frecValue) {
          case 1: return 'anual';
          case 2: return 'semestral';
          case 4: return 'trimestral';
          case 12: return 'mensual';
          case 365: return 'diaria';
          default: return 'anual';
        }
      };
      
      const generarExplicacion = (capital: number, tasa: number, tiempo: string, montoFinal: number, frecuencia: FrecuenciaType): string => {
        const tasaMostrar = tasa * 100;
        return `Un capital inicial de ${formatCurrency(capital)}, a una tasa de interés compuesto anual del ${tasaMostrar.toFixed(2)}% con capitalización ${getFrecuenciaLabel(frecuencia)}, durante ${tiempo}, generará un monto final de ${formatCurrency(montoFinal)}.`;
      };
      
      const tiempoFormateado = formatearTiempo(anosNum, mesesNum, diasNum);
      
      switch (calculationType) {
        case 'montoFuturo': {
          let tiempoTotal;
          
          if (frecuencia === 12) {
            tiempoTotal = convertirTiempoAMeses(anosNum, mesesNum, diasNum);
          } else {
            tiempoTotal = convertirTiempoAAnios(anosNum, mesesNum, diasNum);
          }
          
          resultadoCalculo = calcularMontoFuturoCompuesto(capitalNum, tasaInteresNum, tiempoTotal, frecuencia);
          const interesGenerado = resultadoCalculo - capitalNum;
          
          setResultado({
            montoFuturo: resultadoCalculo,
            interesGenerado: interesGenerado,
            tasaInteres: tasaInteresNum * 100,
            capitalizacion: getFrecuenciaLabel(frecuencia),
            explicacion: generarExplicacion(capitalNum, tasaInteresNum, tiempoFormateado, resultadoCalculo, frecuencia)
          });
          break;
        }
          
        case 'tasaInteres': {
          let tiempoTotal;
          
          if (frecuencia === 12) {
            tiempoTotal = convertirTiempoAMeses(anosNum, mesesNum, diasNum);
          } else {
            tiempoTotal = convertirTiempoAAnios(anosNum, mesesNum, diasNum);
          }
          
          resultadoCalculo = calcularTasaInteresCompuesto(capitalNum, montoFuturoNum, tiempoTotal, frecuencia);
          
          const interesGenerado = montoFuturoNum - capitalNum;
          
          setResultado({
            montoFuturo: montoFuturoNum,
            interesGenerado: interesGenerado,
            tasaInteres: resultadoCalculo * 100,
            capitalizacion: getFrecuenciaLabel(frecuencia),
            explicacion: `Para alcanzar ${formatCurrency(montoFuturoNum)} partiendo de un capital de ${formatCurrency(capitalNum)} en ${tiempoFormateado}, se requiere una tasa de interés del ${(resultadoCalculo * 100).toFixed(2)}% con capitalización ${getFrecuenciaLabel(frecuencia)}.`
          });
          break;
        }
          
        case 'tiempo': {
          resultadoCalculo = calcularTiempoCompuesto(capitalNum, montoFuturoNum, tasaInteresNum, frecuencia);
          
          let tiempoAnos, tiempoMeses, tiempoDias;
          
          if (frecuencia === 12) {
            tiempoAnos = Math.floor(resultadoCalculo / 12);
            tiempoMeses = Math.floor(resultadoCalculo % 12);
            tiempoDias = Math.round((resultadoCalculo % 1) * 30);
          } else {
            tiempoAnos = Math.floor(resultadoCalculo);
            tiempoMeses = Math.floor((resultadoCalculo - tiempoAnos) * 12);
            tiempoDias = Math.round(((resultadoCalculo - tiempoAnos) * 12 - tiempoMeses) * 30);
          }
          
          const tiempoCalculadoFormateado = formatearTiempo(tiempoAnos, tiempoMeses, tiempoDias);
          
          const interesGenerado = montoFuturoNum - capitalNum;
          
          setResultado({
            montoFuturo: montoFuturoNum,
            interesGenerado: interesGenerado,
            tasaInteres: tasaInteresNum * 100,
            capitalizacion: getFrecuenciaLabel(frecuencia),
            explicacion: `Para alcanzar ${formatCurrency(montoFuturoNum)} partiendo de un capital de ${formatCurrency(capitalNum)} con una tasa del ${(tasaInteresNum * 100).toFixed(2)}% y capitalización ${getFrecuenciaLabel(frecuencia)}, se requieren ${tiempoCalculadoFormateado}.`
          });
          break;
        }
      }
      
      toast.success('Cálculo realizado con éxito');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error en el cálculo');
      }
      setResultado(null);
    }
  };

  const resetForm = () => {
    setCapital('1000000');
    setTasaInteres('0.05');
    setMontoFuturo('');
    setAnos('1');
    setMeses('0');
    setDias('0');
    setFrecuencia(1);
    setResultado(null);
    toast('Formulario reiniciado', {
      description: 'Todos los campos han sido restablecidos.'
    });
  };

  const frecuenciaLabels: Record<FrecuenciaType, string> = {
    1: 'Anual',
    2: 'Semestral',
    4: 'Trimestral',
    12: 'Mensual',
    365: 'Diaria'
  };

  return (
    <Layout>
      <div className="page-transition max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interés Compuesto</h1>
          <p className="text-white/70">
            Calcula montos futuros, tasas de interés o periodos de tiempo utilizando el método de interés compuesto.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            className={`p-4 rounded-xl transition-all ${
              calculationType === 'montoFuturo' 
                ? 'bg-financial-accent text-white font-medium' 
                : 'bg-financial-slate/60 hover:bg-financial-slate/80'
            }`}
            onClick={() => setCalculationType('montoFuturo')}
          >
            <div className="text-center">
              <div className="font-medium mb-1">Calcular Monto Futuro</div>
              <div className="text-sm opacity-80">A partir de capital, tasa y tiempo</div>
            </div>
          </button>
          
          <button
            className={`p-4 rounded-xl transition-all ${
              calculationType === 'tasaInteres' 
                ? 'bg-financial-accent text-white font-medium' 
                : 'bg-financial-slate/60 hover:bg-financial-slate/80'
            }`}
            onClick={() => setCalculationType('tasaInteres')}
          >
            <div className="text-center">
              <div className="font-medium mb-1">Calcular Tasa de Interés</div>
              <div className="text-sm opacity-80">A partir de valores inicial, final y tiempo</div>
            </div>
          </button>
          
          <button
            className={`p-4 rounded-xl transition-all ${
              calculationType === 'tiempo' 
                ? 'bg-financial-accent text-white font-medium' 
                : 'bg-financial-slate/60 hover:bg-financial-slate/80'
            }`}
            onClick={() => setCalculationType('tiempo')}
          >
            <div className="text-center">
              <div className="font-medium mb-1">Calcular Tiempo</div>
              <div className="text-sm opacity-80">A partir de valores inicial, final y tasa</div>
            </div>
          </button>
        </div>
        
        <div className="financial-card p-6">
          <h2 className="text-xl font-bold mb-4">Calculadora de Interés Compuesto</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 mb-6">
              <label className="text-sm text-white/80">Frecuencia de capitalización</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(frecuenciaLabels).map(([value, label]) => (
                  <button
                    key={value}
                    className={`p-3 rounded-lg text-center transition-all ${
                      frecuencia === Number(value) 
                        ? 'bg-financial-accent text-white font-medium' 
                        : 'bg-financial-slate/40 hover:bg-financial-slate/60'
                    }`}
                    onClick={() => setFrecuencia(Number(value) as FrecuenciaType)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm text-white/80">Capital Inicial</label>
              <input
                type="number"
                className="input-field w-full"
                placeholder="Ingrese el capital inicial"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
              />
              <div className="text-xs text-white/60">El monto inicial de la inversión o préstamo</div>
            </div>
            
            {calculationType !== 'tasaInteres' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Tasa de Interés Anual</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field w-full"
                  placeholder="Ingrese la tasa de interés (decimal)"
                  value={tasaInteres}
                  onChange={(e) => setTasaInteres(e.target.value)}
                />
                <div className="text-xs text-white/60">Ingresa como decimal (ej: 0.05 para 5%)</div>
              </div>
            )}
            
            {calculationType !== 'montoFuturo' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Monto Futuro</label>
                <input
                  type="number"
                  className="input-field w-full"
                  placeholder="Ingrese el monto futuro"
                  value={montoFuturo}
                  onChange={(e) => setMontoFuturo(e.target.value)}
                />
                <div className="text-xs text-white/60">El valor final después de aplicar el interés</div>
              </div>
            )}
            
           {calculationType !== 'tiempo' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Tiempo</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      className="input-field w-full"
                      placeholder="Años"
                      value={anos}
                      onChange={(e) => setAnos(e.target.value)}
                    />
                    <div className="text-xs text-white/60 mt-1">Años</div>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="input-field w-full"
                      placeholder="Meses"
                      value={meses}
                      onChange={(e) => setMeses(e.target.value)}
                    />
                    <div className="text-xs text-white/60 mt-1">Meses</div>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="input-field w-full"
                      placeholder="Días"
                      value={dias}
                      onChange={(e) => setDias(e.target.value)}
                    />
                    <div className="text-xs text-white/60 mt-1">Días</div>
                  </div>
                </div>
                <div className="text-xs text-white/60">Especifica el periodo de tiempo</div>
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleCalcular}
                className="btn-primary"
              >
                Calcular
              </button>
              <button 
                onClick={resetForm}
                className="btn-secondary"
              >
                Reiniciar
              </button>
            </div>
            
            {resultado && (
              <div className="mt-6 rounded-lg overflow-hidden animate-fade-in">
                <div className="p-5 bg-financial-midnight">
                  <h3 className="text-lg font-medium text-white/70 mb-1">Resultado</h3>
                </div>
                
                <div className="bg-financial-midnight/80 p-5">
                  <div className="mb-5">
                    <div className="text-sm text-white/50">Monto Futuro</div>
                    <div className="text-3xl font-bold text-white">{formatCurrency(resultado.montoFuturo)}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-4 bg-financial-slate/20 rounded-md">
                      <div className="text-sm text-white/50">Interés Generado</div>
                      <div className="text-xl font-bold text-white">{formatCurrency(resultado.interesGenerado)}</div>
                    </div>
                    
                    <div className="p-4 bg-financial-slate/20 rounded-md">
                      <div className="text-sm text-white/50">Tasa de Interés</div>
                      <div className="text-xl font-bold text-white">{resultado.tasaInteres.toFixed(2)}%</div>
                    </div>
                    
                    <div className="p-4 bg-financial-slate/20 rounded-md">
                      <div className="text-sm text-white/50">Capitalización</div>
                      <div className="text-xl font-bold text-white capitalize">{resultado.capitalizacion}</div>
                    </div>
                  </div>
                  
                  <div className="mt-5 p-4 bg-financial-slate/10 rounded-md">
                    <div className="text-sm text-white/50 mb-1">Explicación:</div>
                    <div className="text-white/90">{resultado.explicacion}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InteresCompuesto;
