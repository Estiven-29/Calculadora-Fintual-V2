
/**
 * Calcula el valor presente de una anualidad
 * P = A * [(1 - (1 + i)^-n) / i]
 */
export const calcularValorPresenteAnualidad = (
  pago: number,
  tasaInteres: number,
  periodos: number
): number => {
  return pago * ((1 - Math.pow(1 + tasaInteres, -periodos)) / tasaInteres);
};

/**
 * Calcula el valor futuro de una anualidad
 * F = A * [((1 + i)^n - 1) / i]
 */
export const calcularValorFuturoAnualidad = (
  pago: number,
  tasaInteres: number,
  periodos: number
): number => {
  return pago * ((Math.pow(1 + tasaInteres, periodos) - 1) / tasaInteres);
};

/**
 * Calcula el pago de una anualidad dado el valor presente
 * A = P * [i / (1 - (1 + i)^-n)]
 */
export const calcularPagoDesdeValorPresente = (
  valorPresente: number,
  tasaInteres: number,
  periodos: number
): number => {
  return valorPresente * (tasaInteres / (1 - Math.pow(1 + tasaInteres, -periodos)));
};

/**
 * Calcula el pago de una anualidad dado el valor futuro
 * A = F * [i / ((1 + i)^n - 1)]
 */
export const calcularPagoDesdeValorFuturo = (
  valorFuturo: number,
  tasaInteres: number,
  periodos: number
): number => {
  return valorFuturo * (tasaInteres / (Math.pow(1 + tasaInteres, periodos) - 1));
};

/**
 * Calcula el número de periodos dada una anualidad y valor presente
 * n = -ln(1 - P*i/A) / ln(1+i)
 */
export const calcularPeriodosDesdeValorPresente = (
  valorPresente: number,
  pago: number,
  tasaInteres: number
): number => {
  return -Math.log(1 - (valorPresente * tasaInteres) / pago) / Math.log(1 + tasaInteres);
};

/**
 * Calcula el número de periodos dada una anualidad y valor futuro
 * n = ln(1 + F*i/A) / ln(1+i)
 */
export const calcularPeriodosDesdeValorFuturo = (
  valorFuturo: number,
  pago: number,
  tasaInteres: number
): number => {
  return Math.log(1 + (valorFuturo * tasaInteres) / pago) / Math.log(1 + tasaInteres);
};

/**
 * Calcula la tasa de interés dada una anualidad y valor presente 
 * Requiere aproximación numérica - implementación simplificada
 */
export const calcularTasaInteresDesdeValorPresente = (
  valorPresente: number,
  pago: number,
  periodos: number
): number => {
  // Método de aproximación numérica (bisección)
  let tasaMin = 0.0001;
  let tasaMax = 1;
  let tasaMid = (tasaMin + tasaMax) / 2;
  let valorCalculado = 0;
  const precision = 0.0001;
  const maxIteraciones = 100;
  
  for (let i = 0; i < maxIteraciones; i++) {
    tasaMid = (tasaMin + tasaMax) / 2;
    valorCalculado = calcularValorPresenteAnualidad(pago, tasaMid, periodos);
    
    if (Math.abs(valorCalculado - valorPresente) < precision) {
      break;
    }
    
    if (valorCalculado > valorPresente) {
      tasaMin = tasaMid;
    } else {
      tasaMax = tasaMid;
    }
  }
  
  return tasaMid;
};

/**
 * Calcula la tasa de interés dada una anualidad y valor futuro
 * Requiere aproximación numérica - implementación simplificada
 */
export const calcularTasaInteresDesdeValorFuturo = (
  valorFuturo: number,
  pago: number,
  periodos: number
): number => {
  // Método de aproximación numérica (bisección)
  let tasaMin = 0.0001;
  let tasaMax = 1;
  let tasaMid = (tasaMin + tasaMax) / 2;
  let valorCalculado = 0;
  const precision = 0.0001;
  const maxIteraciones = 100;
  
  for (let i = 0; i < maxIteraciones; i++) {
    tasaMid = (tasaMin + tasaMax) / 2;
    valorCalculado = calcularValorFuturoAnualidad(pago, tasaMid, periodos);
    
    if (Math.abs(valorCalculado - valorFuturo) < precision) {
      break;
    }
    
    if (valorCalculado < valorFuturo) {
      tasaMin = tasaMid;
    } else {
      tasaMax = tasaMid;
    }
  }
  
  return tasaMid;
};

// Función para formatear montos a formato de moneda (reutilizada de calculosFinancieros)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
