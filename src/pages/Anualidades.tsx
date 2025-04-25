
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import {
  calcularValorPresenteAnualidad,
  calcularValorFuturoAnualidad,
  calcularPagoDesdeValorPresente,
  calcularPagoDesdeValorFuturo,
  calcularPeriodosDesdeValorPresente,
  calcularPeriodosDesdeValorFuturo,
  calcularTasaInteresDesdeValorPresente,
  calcularTasaInteresDesdeValorFuturo,
  formatCurrency
} from '@/services/calculosAnualidades';

type CalculationType = 'valorPresente' | 'valorFuturo' | 'pago' | 'periodos' | 'tasaInteres';
type AnualidadMode = 'ordinaria' | 'anticipada';

interface ResultadoDetalles {
  principal?: number;
  valorFinal?: number;
  interes?: number;
  tasa?: number;
  periodo?: string;
  explicacion?: string;
}

const Anualidades = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('valorFuturo');
  const [anualidadMode, setAnualidadMode] = useState<AnualidadMode>('ordinaria');
  const [pago, setPago] = useState<string>('1000000');
  const [tasaInteres, setTasaInteres] = useState<string>('0.05');
  const [periodos, setPeriodos] = useState<string>('10');
  const [valorPresente, setValorPresente] = useState<string>('');
  const [valorFuturo, setValorFuturo] = useState<string>('');
  const [resultado, setResultado] = useState<ResultadoDetalles | null>(null);

  const handleCalcular = () => {
    try {
      const pagoNum = parseFloat(pago);
      const tasaInteresNum = parseFloat(tasaInteres);
      const periodosNum = parseInt(periodos);
      const valorPresenteNum = parseFloat(valorPresente);
      const valorFuturoNum = parseFloat(valorFuturo);
      
      // Factor para anualidad anticipada (si es necesario)
      const factorAnticipada = anualidadMode === 'anticipada' ? (1 + tasaInteresNum) : 1;
      
      // Validar inputs según el tipo de cálculo
      if (calculationType !== 'pago' && pagoNum <= 0) {
        throw new Error('El pago debe ser mayor a cero');
      }
      
      if (calculationType !== 'tasaInteres' && tasaInteresNum <= 0) {
        throw new Error('La tasa de interés debe ser mayor a cero');
      }
      
      if (calculationType !== 'periodos' && periodosNum <= 0) {
        throw new Error('El número de periodos debe ser mayor a cero');
      }
      
      // Verificar que se proporcione un valor presente o futuro válido cuando se calculan pagos, periodos o tasa
      if (['pago', 'periodos', 'tasaInteres'].includes(calculationType) && 
          valorPresenteNum <= 0 && valorFuturoNum <= 0) {
        throw new Error('Debe proporcionar un valor presente o futuro válido');
      }
      
      let resultadoCalculo: number;
      let resultadoDetalles: ResultadoDetalles = {};
      
      switch (calculationType) {
        case 'valorPresente':
          resultadoCalculo = calcularValorPresenteAnualidad(pagoNum * factorAnticipada, tasaInteresNum, periodosNum);
          resultadoDetalles = {
            valorFinal: resultadoCalculo,
            principal: pagoNum * periodosNum,
            interes: resultadoCalculo - (pagoNum * periodosNum),
            tasa: tasaInteresNum * 100,
            periodo: periodosTransformados(periodosNum),
            explicacion: `Una anualidad ${anualidadMode === 'ordinaria' ? 'ordinaria' : 'anticipada'} con un pago periódico de ${formatCurrency(pagoNum)}, a una tasa de interés del ${(tasaInteresNum * 100).toFixed(2)}%, durante ${periodosTransformados(periodosNum)}, tendrá un valor presente de ${formatCurrency(resultadoCalculo)}.`
          };
          break;
          
        case 'valorFuturo':
          resultadoCalculo = calcularValorFuturoAnualidad(pagoNum * factorAnticipada, tasaInteresNum, periodosNum);
          resultadoDetalles = {
            valorFinal: resultadoCalculo,
            principal: pagoNum * periodosNum,
            interes: resultadoCalculo - (pagoNum * periodosNum),
            tasa: tasaInteresNum * 100,
            periodo: periodosTransformados(periodosNum),
            explicacion: `Una anualidad ${anualidadMode === 'ordinaria' ? 'ordinaria' : 'anticipada'} con un pago periódico de ${formatCurrency(pagoNum)}, a una tasa de interés del ${(tasaInteresNum * 100).toFixed(2)}%, durante ${periodosTransformados(periodosNum)}, acumulará un valor futuro de ${formatCurrency(resultadoCalculo)}.`
          };
          break;
          
        case 'pago':
          if (valorPresenteNum > 0) {
            resultadoCalculo = calcularPagoDesdeValorPresente(valorPresenteNum, tasaInteresNum, periodosNum);
            resultadoCalculo = resultadoCalculo / factorAnticipada; // Ajustar para anualidad anticipada
            resultadoDetalles = {
              valorFinal: resultadoCalculo,
              principal: valorPresenteNum,
              tasa: tasaInteresNum * 100,
              periodo: periodosTransformados(periodosNum),
              explicacion: `Para una anualidad ${anualidadMode === 'ordinaria' ? 'ordinaria' : 'anticipada'} con un valor presente de ${formatCurrency(valorPresenteNum)}, a una tasa de interés del ${(tasaInteresNum * 100).toFixed(2)}%, durante ${periodosTransformados(periodosNum)}, el pago periódico será de ${formatCurrency(resultadoCalculo)}.`
            };
          } else {
            resultadoCalculo = calcularPagoDesdeValorFuturo(valorFuturoNum, tasaInteresNum, periodosNum);
            resultadoCalculo = resultadoCalculo / factorAnticipada; // Ajustar para anualidad anticipada
            resultadoDetalles = {
              valorFinal: resultadoCalculo,
              principal: valorFuturoNum,
              tasa: tasaInteresNum * 100,
              periodo: periodosTransformados(periodosNum),
              explicacion: `Para una anualidad ${anualidadMode === 'ordinaria' ? 'ordinaria' : 'anticipada'} con un valor futuro de ${formatCurrency(valorFuturoNum)}, a una tasa de interés del ${(tasaInteresNum * 100).toFixed(2)}%, durante ${periodosTransformados(periodosNum)}, el pago periódico será de ${formatCurrency(resultadoCalculo)}.`
            };
          }
          break;
          
        case 'periodos':
          if (valorPresenteNum > 0) {
            resultadoCalculo = calcularPeriodosDesdeValorPresente(valorPresenteNum, pagoNum * factorAnticipada, tasaInteresNum);
            resultadoDetalles = {
              valorFinal: resultadoCalculo,
              principal: valorPresenteNum,
              tasa: tasaInteresNum * 100,
              explicacion: `Para una anualidad ${anualidadMode === 'ordinaria' ? 'ordinaria' : 'anticipada'} con un valor presente de ${formatCurrency(valorPresenteNum)}, un pago periódico de ${formatCurrency(pagoNum)}, a una tasa de interés del ${(tasaInteresNum * 100).toFixed(2)}%, se requerirán aproximadamente ${resultadoCalculo.toFixed(2)} periodos.`
            };
          } else {
            resultadoCalculo = calcularPeriodosDesdeValorFuturo(valorFuturoNum, pagoNum * factorAnticipada, tasaInteresNum);
            resultadoDetalles = {
              valorFinal: resultadoCalculo,
              principal: valorFuturoNum,
              tasa: tasaInteresNum * 100,
              explicacion: `Para una anualidad ${anualidadMode === 'ordinaria' ? 'ordinaria' : 'anticipada'} con un valor futuro de ${formatCurrency(valorFuturoNum)}, un pago periódico de ${formatCurrency(pagoNum)}, a una tasa de interés del ${(tasaInteresNum * 100).toFixed(2)}%, se requerirán aproximadamente ${resultadoCalculo.toFixed(2)} periodos.`
            };
          }
          break;
          
        case 'tasaInteres':
          if (valorPresenteNum > 0) {
            resultadoCalculo = calcularTasaInteresDesdeValorPresente(valorPresenteNum, pagoNum * factorAnticipada, periodosNum);
            resultadoDetalles = {
              valorFinal: resultadoCalculo * 100,
              principal: valorPresenteNum,
              periodo: periodosTransformados(periodosNum),
              explicacion: `Para una anualidad ${anualidadMode === 'ordinaria' ? 'ordinaria' : 'anticipada'} con un valor presente de ${formatCurrency(valorPresenteNum)}, un pago periódico de ${formatCurrency(pagoNum)}, durante ${periodosTransformados(periodosNum)}, la tasa de interés es aproximadamente ${(resultadoCalculo * 100).toFixed(2)}%.`
            };
          } else {
            resultadoCalculo = calcularTasaInteresDesdeValorFuturo(valorFuturoNum, pagoNum * factorAnticipada, periodosNum);
            resultadoDetalles = {
              valorFinal: resultadoCalculo * 100,
              principal: valorFuturoNum,
              periodo: periodosTransformados(periodosNum),
              explicacion: `Para una anualidad ${anualidadMode === 'ordinaria' ? 'ordinaria' : 'anticipada'} con un valor futuro de ${formatCurrency(valorFuturoNum)}, un pago periódico de ${formatCurrency(pagoNum)}, durante ${periodosTransformados(periodosNum)}, la tasa de interés es aproximadamente ${(resultadoCalculo * 100).toFixed(2)}%.`
            };
          }
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

  const periodosTransformados = (periodosNum: number): string => {
    if (periodosNum === 1) return "1 año";
    if (periodosNum < 1) return `${Math.round(periodosNum * 12)} meses`;
    return `${periodosNum} años`;
  };

  const resetForm = () => {
    setPago('1000000');
    setTasaInteres('0.05');
    setPeriodos('10');
    setValorPresente('');
    setValorFuturo('');
    setResultado(null);
    toast('Formulario reiniciado', {
      description: 'Todos los campos han sido restablecidos.'
    });
  };

  return (
    <Layout>
      <div className="page-transition max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Anualidades</h1>
          <p className="text-white/70">
            Calcula valores presentes, futuros, pagos, periodos o tasas de interés para anualidades.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <button
            className={`p-3 rounded-xl transition-all ${
              calculationType === 'valorPresente' 
                ? 'bg-financial-accent text-white font-medium' 
                : 'bg-financial-slate/60 hover:bg-financial-slate/80'
            }`}
            onClick={() => setCalculationType('valorPresente')}
          >
            <div className="text-center">
              <div className="font-medium mb-1">Valor Presente</div>
            </div>
          </button>
          
          <button
            className={`p-3 rounded-xl transition-all ${
              calculationType === 'valorFuturo' 
                ? 'bg-financial-accent text-white font-medium' 
                : 'bg-financial-slate/60 hover:bg-financial-slate/80'
            }`}
            onClick={() => setCalculationType('valorFuturo')}
          >
            <div className="text-center">
              <div className="font-medium mb-1">Valor Futuro</div>
            </div>
          </button>
          
          <button
            className={`p-3 rounded-xl transition-all ${
              calculationType === 'pago' 
                ? 'bg-financial-accent text-white font-medium' 
                : 'bg-financial-slate/60 hover:bg-financial-slate/80'
            }`}
            onClick={() => setCalculationType('pago')}
          >
            <div className="text-center">
              <div className="font-medium mb-1">Pago</div>
            </div>
          </button>
          
          <button
            className={`p-3 rounded-xl transition-all ${
              calculationType === 'periodos' 
                ? 'bg-financial-accent text-white font-medium' 
                : 'bg-financial-slate/60 hover:bg-financial-slate/80'
            }`}
            onClick={() => setCalculationType('periodos')}
          >
            <div className="text-center">
              <div className="font-medium mb-1">Periodos</div>
            </div>
          </button>
          
          <button
            className={`p-3 rounded-xl transition-all ${
              calculationType === 'tasaInteres' 
                ? 'bg-financial-accent text-white font-medium' 
                : 'bg-financial-slate/60 hover:bg-financial-slate/80'
            }`}
            onClick={() => setCalculationType('tasaInteres')}
          >
            <div className="text-center">
              <div className="font-medium mb-1">Tasa Interés</div>
            </div>
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Tipo de anualidad:</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`p-3 rounded-xl transition-all ${
                anualidadMode === 'ordinaria' 
                  ? 'bg-financial-accent text-white font-medium' 
                  : 'bg-financial-slate/60 hover:bg-financial-slate/80'
              }`}
              onClick={() => setAnualidadMode('ordinaria')}
            >
              <div className="text-center">
                <div className="font-medium">Ordinaria (fin de periodo)</div>
              </div>
            </button>
            
            <button
              className={`p-3 rounded-xl transition-all ${
                anualidadMode === 'anticipada' 
                  ? 'bg-financial-accent text-white font-medium' 
                  : 'bg-financial-slate/60 hover:bg-financial-slate/80'
              }`}
              onClick={() => setAnualidadMode('anticipada')}
            >
              <div className="text-center">
                <div className="font-medium">Anticipada (inicio de periodo)</div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="financial-card p-6">
          <h2 className="text-xl font-bold mb-4">Calculadora de Anualidades</h2>
          
          <div className="space-y-4">
            {calculationType !== 'pago' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Pago periódico</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ingrese el pago por periodo"
                  value={pago}
                  onChange={(e) => setPago(e.target.value)}
                />
                <div className="text-xs text-white/60">El monto que se paga en cada periodo</div>
              </div>
            )}
            
            {calculationType !== 'tasaInteres' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Tasa de Interés por periodo</label>
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
            
            {calculationType !== 'periodos' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Número de periodos</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ingrese el número de periodos"
                  value={periodos}
                  onChange={(e) => setPeriodos(e.target.value)}
                />
                <div className="text-xs text-white/60">La cantidad de pagos a realizar</div>
              </div>
            )}
            
            {calculationType !== 'valorPresente' && (calculationType === 'pago' || calculationType === 'periodos' || calculationType === 'tasaInteres') && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Valor Presente (opcional si proporciona Valor Futuro)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ingrese el valor presente"
                  value={valorPresente}
                  onChange={(e) => setValorPresente(e.target.value)}
                />
                <div className="text-xs text-white/60">El valor actual de la anualidad</div>
              </div>
            )}
            
            {calculationType !== 'valorFuturo' && (calculationType === 'pago' || calculationType === 'periodos' || calculationType === 'tasaInteres') && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-white/80">Valor Futuro (opcional si proporciona Valor Presente)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ingrese el valor futuro"
                  value={valorFuturo}
                  onChange={(e) => setValorFuturo(e.target.value)}
                />
                <div className="text-xs text-white/60">El valor final de la anualidad</div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 pt-4">
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
              <div className="mt-6 animate-fade-in">
                <h3 className="text-xl font-bold mb-3 text-white">Resultado</h3>
                
                <div className="bg-financial-navy/80 rounded-lg overflow-hidden mb-4">
                  <div className="p-4">
                    {/* Primera fila - valor principal calculado */}
                    <div className="text-blue-300 text-sm mb-1">
                      {calculationType === 'valorPresente' ? 'Valor Presente' : 
                       calculationType === 'valorFuturo' ? 'Valor Futuro' : 
                       calculationType === 'pago' ? 'Pago Periódico' : 
                       calculationType === 'periodos' ? 'Número de Periodos' : 'Tasa de Interés'}
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {calculationType === 'tasaInteres' 
                        ? `${resultado.valorFinal?.toFixed(2)}%` 
                        : calculationType === 'periodos'
                          ? resultado.valorFinal?.toFixed(2)
                          : formatCurrency(resultado.valorFinal || 0)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Interés generado (si aplica) */}
                  {(calculationType === 'valorPresente' || calculationType === 'valorFuturo') && (
                    <div className="bg-financial-navy/50 rounded-lg p-4">
                      <div className="text-blue-300 text-sm mb-1">Interés Generado</div>
                      <div className="text-xl font-bold">{formatCurrency(resultado.interes || 0)}</div>
                    </div>
                  )}
                  
                  {/* Tasa de interés */}
                  {calculationType !== 'tasaInteres' && (
                    <div className="bg-financial-navy/50 rounded-lg p-4">
                      <div className="text-blue-300 text-sm mb-1">Tasa de Interés</div>
                      <div className="text-xl font-bold">{resultado.tasa?.toFixed(2)}%</div>
                    </div>
                  )}
                  
                  {/* Periodo de tiempo */}
                  {calculationType !== 'periodos' && resultado.periodo && (
                    <div className="bg-financial-navy/50 rounded-lg p-4">
                      <div className="text-blue-300 text-sm mb-1">Periodo de Tiempo</div>
                      <div className="text-xl font-bold">{resultado.periodo}</div>
                    </div>
                  )}
                </div>
                
                {/* Explicación */}
                {resultado.explicacion && (
                  <div className="bg-financial-navy/30 rounded-lg p-4">
                    <div className="text-sm font-medium mb-1">Explicación:</div>
                    <div className="text-sm opacity-90">{resultado.explicacion}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Anualidades;
