
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  calcularMontoFuturoSimple, 
  calcularTasaInteresSimple, 
  calcularTiempoSimple,
  convertirTiempoAAnios,
  convertirTiempoAMeses,
  formatCurrency,
  formatearTiempo
} from '@/services/calculosFinancieros';
import { toast } from 'sonner';

type CalculationType = 'montoFuturo' | 'tasaInteres' | 'tiempo';

interface ResultadoDetalles {
  montoFuturo?: number;
  capital?: number;
  interes?: number;
  tasa?: number;
  periodo?: string;
  explicacion?: string;
}

const InteresSimple = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('montoFuturo');
  const [capital, setCapital] = useState<string>('1000000');
  const [tasaInteres, setTasaInteres] = useState<string>('0.05');
  const [montoFuturo, setMontoFuturo] = useState<string>('');
  const [anos, setAnos] = useState<string>('1');
  const [meses, setMeses] = useState<string>('0');
  const [dias, setDias] = useState<string>('0');
  const [resultado, setResultado] = useState<ResultadoDetalles | null>(null);

  const handleCalcular = () => {
    try {
      const capitalNum = parseFloat(capital);
      const tasaInteresNum = parseFloat(tasaInteres);
      const anosNum = parseInt(anos) || 0;
      const mesesNum = parseInt(meses) || 0;
      const diasNum = parseInt(dias) || 0;
      const montoFuturoNum = parseFloat(montoFuturo);
      
      // Validar inputs
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
      let resultadoDetalles: ResultadoDetalles = {};
      
      // Convertir el tiempo a años para los cálculos
      const tiempoEnAnos = convertirTiempoAAnios(anosNum, mesesNum, diasNum);
      const tiempoFormateado = formatearTiempo(anosNum, mesesNum, diasNum);
      
      switch (calculationType) {
        case 'montoFuturo':
          resultadoCalculo = calcularMontoFuturoSimple(capitalNum, tasaInteresNum, tiempoEnAnos);
          const interesGenerado = resultadoCalculo - capitalNum;
          
          resultadoDetalles = {
            montoFuturo: resultadoCalculo,
            capital: capitalNum,
            interes: interesGenerado,
            tasa: tasaInteresNum * 100,
            periodo: tiempoFormateado,
            explicacion: `Un capital inicial de ${formatCurrency(capitalNum)}, a una tasa de interés simple anual del ${(tasaInteresNum * 100).toFixed(2)}%, durante ${tiempoFormateado}, generará un monto final de ${formatCurrency(resultadoCalculo)}.`
          };
          break;
          
        case 'tasaInteres':
          resultadoCalculo = calcularTasaInteresSimple(capitalNum, montoFuturoNum, tiempoEnAnos);
          const interesGeneradoTasa = montoFuturoNum - capitalNum;
          
          resultadoDetalles = {
            montoFuturo: montoFuturoNum,
            capital: capitalNum,
            interes: interesGeneradoTasa,
            tasa: resultadoCalculo * 100,
            periodo: tiempoFormateado,
            explicacion: `Para que un capital inicial de ${formatCurrency(capitalNum)} se convierta en ${formatCurrency(montoFuturoNum)} en ${tiempoFormateado}, se requiere una tasa de interés simple anual del ${(resultadoCalculo * 100).toFixed(2)}%.`
          };
          break;
          
        case 'tiempo':
          resultadoCalculo = calcularTiempoSimple(capitalNum, montoFuturoNum, tasaInteresNum);
          const interesGeneradoTiempo = montoFuturoNum - capitalNum;
          
          // Convertir a años, meses y días
          const anosResult = Math.floor(resultadoCalculo);
          const mesesDecimal = (resultadoCalculo - anosResult) * 12;
          const mesesResult = Math.floor(mesesDecimal);
          const diasResult = Math.round((mesesDecimal - mesesResult) * 30);
          
          const tiempoCalculadoFormateado = formatearTiempo(anosResult, mesesResult, diasResult);
          
          resultadoDetalles = {
            montoFuturo: montoFuturoNum,
            capital: capitalNum,
            interes: interesGeneradoTiempo,
            tasa: tasaInteresNum * 100,
            periodo: tiempoCalculadoFormateado,
            explicacion: `Para que un capital inicial de ${formatCurrency(capitalNum)} se convierta en ${formatCurrency(montoFuturoNum)} a una tasa de interés simple anual del ${(tasaInteresNum * 100).toFixed(2)}%, se requiere un periodo de ${tiempoCalculadoFormateado}.`
          };
          break;
      }
      
      setResultado(resultadoDetalles);
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
    setResultado(null);
    toast('Formulario reiniciado', {
      description: 'Todos los campos han sido restablecidos.'
    });
  };

   return (
    <Layout>
      <div className="page-transition max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interés Simple</h1>
          <p className="text-white/70">
            Calcula montos futuros, tasas de interés o periodos de tiempo utilizando el método de interés simple.
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
          <h2 className="text-xl font-bold mb-4">Calculadora de Interés Simple</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm text-white/80 break-words w-full">Capital Inicial</label>
              <input
                type="number"
                className="input-field"
                placeholder="Ingrese el capital inicial"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
              />
              <div className="text-xs text-white/60">El monto inicial de la inversión o préstamo</div>
            </div>
            
            {calculationType !== 'tasaInteres' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80 break-words w-full">Tasa de Interés Anual</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="Ingrese la tasa de interés (decimal)"
                  value={tasaInteres}
                  onChange={(e) => setTasaInteres(e.target.value)}
                />
                <div className="text-xs text-white/60">Ingresa como decimal (ej: 0.05 para 5%)</div>
              </div>
            )}
            
            {calculationType !== 'montoFuturo' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80 break-words w-full">Monto Futuro</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ingrese el monto futuro"
                  value={montoFuturo}
                  onChange={(e) => setMontoFuturo(e.target.value)}
                />
                <div className="text-xs text-white/60">El valor final después de aplicar el interés</div>
              </div>
            )}
            
            {calculationType !== 'tiempo' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80 break-words w-full">Tiempo</label>
                <div className="grid grid-cols-3 gap-2">
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
                    <div className="text-3xl font-bold text-white">{formatCurrency(resultado.montoFuturo || 0)}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-4 bg-financial-slate/20 rounded-md">
                      <div className="text-sm text-white/50">Interés Generado</div>
                      <div className="text-xl font-bold text-white">{formatCurrency(resultado.interes || 0)}</div>
                    </div>
                    
                    <div className="p-4 bg-financial-slate/20 rounded-md">
                      <div className="text-sm text-white/50">Tasa de Interés</div>
                      <div className="text-xl font-bold text-white">{resultado.tasa?.toFixed(2)}%</div>
                    </div>
                    
                    <div className="p-4 bg-financial-slate/20 rounded-md">
                      <div className="text-sm text-white/50">Periodo de Tiempo</div>
                      <div className="text-xl font-bold text-white">{resultado.periodo}</div>
                    </div>
                  </div>
                  
                  {resultado.explicacion && (
                    <div className="mt-5 p-4 bg-financial-slate/10 rounded-md">
                      <div className="text-sm text-white/50 mb-1">Explicación:</div>
                      <div className="text-white/90">{resultado.explicacion}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InteresSimple;
