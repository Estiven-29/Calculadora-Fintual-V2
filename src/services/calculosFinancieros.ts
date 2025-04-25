export interface CuotaAmortizacion {
  numeroCuota: number;
  cuota: number;
  interes: number;
  capital: number;
  saldo: number;
}

export interface ResultadoInteresSimple {
  montoInicial: number;
  tasaInteres: number;
  tiempo: number;
  montoFinal: number;
  interesGanado: number;
}

export interface ResultadoInteresCompuesto {
  montoInicial: number;
  tasaInteres: number;
  periodos: number;
  montoFinal: number;
  interesTotal: number;
}

export interface Cuota {
  numeroCuota: number;
  monto: number;
}

export interface ResultadoGradiente {
  cuotaInicial: number;
  gradiente: number;
  periodos: number;
  tasaInteres: number;
  montoPresente: number;
  montoFuturo: number;
  cuotas: Cuota[];
  tir?: number;
  sistemaCapitalizacion?: string;
}

export const convertirTiempoAAnios = (anos: number, meses: number, dias: number): number => {
  return anos + meses / 12 + dias / 365;
};

export const convertirTiempoAMeses = (anos: number, meses: number, dias: number): number => {
  return anos * 12 + meses + dias / 30;
};

export const formatearTiempo = (anos: number, meses: number, dias: number): string => {
  const partes = [];
  if (anos > 0) partes.push(`${anos} año${anos !== 1 ? 's' : ''}`);
  if (meses > 0) partes.push(`${meses} mes${meses !== 1 ? 'es' : ''}`);
  if (dias > 0) partes.push(`${dias} día${dias !== 1 ? 's' : ''}`);
  return partes.join(', ');
};

/**
 * Interés Simple - Calcular monto futuro
 * F = P(1 + i*t)
 */
export const calcularMontoFuturoSimple = (
  capital: number,
  tasaInteres: number,
  tiempo: number
): number => {
  return capital * (1 + tasaInteres * tiempo);
};

/**
 * Interés Simple - Calcular tasa de interés
 * i = (F - P) / (P * t)
 */
export const calcularTasaInteresSimple = (
  capital: number,
  montoFuturo: number,
  tiempo: number
): number => {
  return (montoFuturo - capital) / (capital * tiempo);
};

/**
 * Interés Simple - Calcular tiempo
 * t = (F - P) / (P * i)
 */
export const calcularTiempoSimple = (
  capital: number,
  montoFuturo: number,
  tasaInteres: number
): number => {
  return (montoFuturo - capital) / (capital * tasaInteres);
};

/**
 * Calcula el interés simple.
 * is = c * i * t
 * @param montoInicial
 * @param tasaInteres
 * @param tiempo
 */
export const calcularInteresSimple = (
  montoInicial: number,
  tasaInteres: number,
  tiempo: number
): ResultadoInteresSimple => {
  const interesGanado = montoInicial * tasaInteres * tiempo;
  const montoFinal = montoInicial + interesGanado;

  return {
    montoInicial,
    tasaInteres,
    tiempo,
    montoFinal,
    interesGanado,
  };
};

/**
 * Interés Compuesto - Calcular monto futuro
 * F = P(1 + i/m)^(m*n)
 * donde m es la frecuencia de capitalización
 */
export const calcularMontoFuturoCompuesto = (
  capital: number,
  tasaInteres: number,
  periodos: number,
  frecuencia: number = 1
): number => {
  return capital * Math.pow(1 + tasaInteres / frecuencia, periodos * frecuencia);
};

/**
 * Interés Compuesto - Calcular tasa de interés
 * i = m * ((F/P)^(1/(m*n)) - 1)
 * donde m es la frecuencia de capitalización
 */
export const calcularTasaInteresCompuesto = (
  capital: number,
  montoFuturo: number,
  periodos: number,
  frecuencia: number = 1
): number => {
  return frecuencia * (Math.pow(montoFuturo / capital, 1 / (periodos * frecuencia)) - 1);
};

/**
 * Interés Compuesto - Calcular tiempo
 * n = ln(F/P) / (m * ln(1 + i/m))
 * donde m es la frecuencia de capitalización
 */
export const calcularTiempoCompuesto = (
  capital: number,
  montoFuturo: number,
  tasaInteres: number,
  frecuencia: number = 1
): number => {
  return Math.log(montoFuturo / capital) / (frecuencia * Math.log(1 + tasaInteres / frecuencia));
};

/**
 * Calcula el interés compuesto.
 * cf = c0 * (1 + i)^n
 * @param montoInicial
 * @param tasaInteres
 * @param periodos
 */
export const calcularInteresCompuesto = (
  montoInicial: number,
  tasaInteres: number,
  periodos: number
): ResultadoInteresCompuesto => {
  const montoFinal = montoInicial * Math.pow(1 + tasaInteres, periodos);
  const interesTotal = montoFinal - montoInicial;

  return {
    montoInicial,
    tasaInteres,
    periodos,
    montoFinal,
    interesTotal,
  };
};

/**
 * Formatea un número a formato de moneda (COP).
 * @param amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Cálculo de amortización con sistema francés (cuota fija)
 */
export const calcularAmortizacionFrancesa = (
  monto: number,
  tasaInteres: number,
  plazo: number
): CuotaAmortizacion[] => {
  const tabla: CuotaAmortizacion[] = [];
  
  // Cálculo de la cuota fija
  const cuotaFija = (monto * tasaInteres * Math.pow(1 + tasaInteres, plazo)) / 
                    (Math.pow(1 + tasaInteres, plazo) - 1);
  
  let saldoPendiente = monto;
  
  for (let i = 1; i <= plazo; i++) {
    // Cálculo del interés para este período
    const interesPeriodo = saldoPendiente * tasaInteres;
    
    // Cálculo del capital amortizado en este período
    const capitalAmortizado = cuotaFija - interesPeriodo;
    
    // Actualización del saldo pendiente
    saldoPendiente -= capitalAmortizado;
    
    // En el último período, aseguramos que el saldo sea exactamente cero
    if (i === plazo) {
      saldoPendiente = 0;
    }
    
    // Añadir fila a la tabla de amortización
    tabla.push({
      numeroCuota: i,
      cuota: cuotaFija,
      interes: interesPeriodo,
      capital: capitalAmortizado,
      saldo: saldoPendiente
    });
  }
  
  return tabla;
};

/**
 * Cálculo de amortización con sistema alemán (capital fijo)
 */
export const calcularAmortizacionAlemana = (
  monto: number,
  tasaInteres: number,
  plazo: number
): CuotaAmortizacion[] => {
  const tabla: CuotaAmortizacion[] = [];
  
  // Cálculo del capital fijo a amortizar en cada período
  const capitalFijo = monto / plazo;
  let saldoPendiente = monto;
  
  for (let i = 1; i <= plazo; i++) {
    // Cálculo del interés para este período
    const interesPeriodo = saldoPendiente * tasaInteres;
    
    // Cálculo de la cuota para este período (capital fijo + interés)
    const cuotaPeriodo = capitalFijo + interesPeriodo;
    
    // Actualización del saldo pendiente
    saldoPendiente -= capitalFijo;
    
    // En el último período, aseguramos que el saldo sea exactamente cero
    if (i === plazo) {
      saldoPendiente = 0;
    }
    
    // Añadir fila a la tabla de amortización
    tabla.push({
      numeroCuota: i,
      cuota: cuotaPeriodo,
      interes: interesPeriodo,
      capital: capitalFijo,
      saldo: saldoPendiente
    });
  }
  
  return tabla;
};

/**
 * Cálculo de amortización con sistema americano
 */
export const calcularAmortizacionAmericana = (
  monto: number,
  tasaInteres: number,
  plazo: number
): CuotaAmortizacion[] => {
  const tabla: CuotaAmortizacion[] = [];
  
  // En el sistema americano, solo se pagan intereses hasta el último período
  const interesPeriodo = monto * tasaInteres;
  
  for (let i = 1; i <= plazo; i++) {
    let capital = 0;
    let cuota = interesPeriodo;
    let saldo = monto;
    
    // En el último período se paga todo el capital
    if (i === plazo) {
      capital = monto;
      cuota = monto + interesPeriodo;
      saldo = 0;
    }
    
    // Añadir fila a la tabla de amortización
    tabla.push({
      numeroCuota: i,
      cuota: cuota,
      interes: interesPeriodo,
      capital: capital,
      saldo: saldo
    });
  }
  
  return tabla;
};

/**
 * Cálculo de amortización con períodos de gracia
 */
export const calcularAmortizacionConPeriodosGracia = (
  monto: number,
  tasaInteres: number,
  plazoTotal: number,
  periodosGracia: number,
  tipoAmortizacion: 'frances' | 'aleman' | 'americano'
): CuotaAmortizacion[] => {
  const tabla: CuotaAmortizacion[] = [];
  const plazoAmortizacion = plazoTotal - periodosGracia;
  
  if (plazoAmortizacion <= 0) {
    throw new Error('El número de períodos de gracia no puede ser mayor o igual al plazo total');
  }
  
  // Períodos de gracia: se pagan solo intereses
  for (let i = 1; i <= periodosGracia; i++) {
    const interesPeriodo = monto * tasaInteres;
    
    tabla.push({
      numeroCuota: i,
      cuota: interesPeriodo,
      interes: interesPeriodo,
      capital: 0,
      saldo: monto
    });
  }
  
  // Períodos de amortización según el sistema elegido
  let tablaAmortizacion: CuotaAmortizacion[] = [];
  
  switch (tipoAmortizacion) {
    case 'frances':
      tablaAmortizacion = calcularAmortizacionFrancesa(monto, tasaInteres, plazoAmortizacion);
      break;
    case 'aleman':
      tablaAmortizacion = calcularAmortizacionAlemana(monto, tasaInteres, plazoAmortizacion);
      break;
    case 'americano':
      tablaAmortizacion = calcularAmortizacionAmericana(monto, tasaInteres, plazoAmortizacion);
      break;
  }
  
  // Ajustar los números de cuota y añadir al resultado final
  for (let i = 0; i < tablaAmortizacion.length; i++) {
    const cuota = tablaAmortizacion[i];
    cuota.numeroCuota = periodosGracia + i + 1;
    tabla.push(cuota);
  }
  
  return tabla;
};

/**
 * Calcula el valor presente de un gradiente aritmético
 */
export const calcularSerieGradienteAritmetico = (
  cuotaInicial: number,
  gradiente: number,
  periodos: number,
  tasaInteres: number,
  sistemaCapitalizacion: string = 'mensual'
): ResultadoGradiente => {
  const cuotas: { numeroCuota: number; monto: number }[] = [];
  
  // Calcular cada cuota de la serie
  for (let i = 0; i < periodos; i++) {
    const monto = cuotaInicial + i * gradiente;
    cuotas.push({
      numeroCuota: i + 1,
      monto,
    });
  }
  
  // Ajustar tasa de interés según el sistema de capitalización
  let tasaEfectiva = tasaInteres;
  if (sistemaCapitalizacion === 'trimestral') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/3) - 1;
  } else if (sistemaCapitalizacion === 'semestral') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/6) - 1;
  } else if (sistemaCapitalizacion === 'anual') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/12) - 1;
  }
  
  // Calcular valor presente
  let montoPresente = 0;
  
  if (tasaEfectiva === 0) {
    // Caso especial cuando la tasa de interés es cero
    montoPresente = cuotaInicial * periodos + gradiente * (periodos * (periodos - 1)) / 2;
  } else {
    // Fórmula corregida para el gradiente aritmético
    const factorAnualidad = (1 - Math.pow(1 + tasaEfectiva, -periodos)) / tasaEfectiva;
    const factorGradiente = (1/tasaEfectiva) * (factorAnualidad - (periodos / Math.pow(1 + tasaEfectiva, periodos)));
    montoPresente = cuotaInicial * factorAnualidad + gradiente * factorGradiente;
  }
  
  // Calcular valor futuro
  const montoFuturo = montoPresente * Math.pow(1 + tasaEfectiva, periodos);
  
  // Calcular TIR (Tasa Interna de Retorno)
  const tir = calcularTIR(cuotas.map(c => c.monto), montoPresente);
  
  return {
    cuotaInicial,
    gradiente,
    periodos,
    tasaInteres,
    montoPresente,
    montoFuturo,
    cuotas,
    tir,
    sistemaCapitalizacion
  };
};

/**
 * Calcula el valor futuro de un gradiente aritmético
 */
export const calcularSerieGradienteAritmeticoFuturo = (
  cuotaInicial: number,
  gradiente: number,
  periodos: number,
  tasaInteres: number,
  sistemaCapitalizacion: string = 'mensual'
): ResultadoGradiente => {
  const cuotas: { numeroCuota: number; monto: number }[] = [];
  
  // Calcular cada cuota de la serie
  for (let i = 0; i < periodos; i++) {
    const monto = cuotaInicial + i * gradiente;
    cuotas.push({
      numeroCuota: i + 1,
      monto,
    });
  }
  
  // Ajustar tasa de interés según el sistema de capitalización
  let tasaEfectiva = tasaInteres;
  if (sistemaCapitalizacion === 'trimestral') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/3) - 1;
  } else if (sistemaCapitalizacion === 'semestral') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/6) - 1;
  } else if (sistemaCapitalizacion === 'anual') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/12) - 1;
  }
  
  // Calcular valor futuro directamente
  let montoFuturo = 0;
  
  if (tasaEfectiva === 0) {
    // Caso especial cuando la tasa de interés es cero
    montoFuturo = cuotaInicial * periodos + gradiente * (periodos * (periodos - 1)) / 2;
  } else {
    // Fórmula para calcular directamente el valor futuro
    const factorAnualidad = (Math.pow(1 + tasaEfectiva, periodos) - 1) / tasaEfectiva;
    const factorGradiente = (1/tasaEfectiva) * (factorAnualidad - periodos);
    montoFuturo = cuotaInicial * factorAnualidad + gradiente * factorGradiente;
  }
  
  // Calcular valor presente a partir del valor futuro
  const montoPresente = montoFuturo / Math.pow(1 + tasaEfectiva, periodos);
  
  // Calcular TIR (Tasa Interna de Retorno)
  const tir = calcularTIR(cuotas.map(c => c.monto), montoPresente);
  
  return {
    cuotaInicial,
    gradiente,
    periodos,
    tasaInteres,
    montoPresente,
    montoFuturo,
    cuotas,
    tir,
    sistemaCapitalizacion
  };
};

/**
 * Calcula el valor presente de un gradiente geométrico
 */
export const calcularSerieGradienteGeometrico = (
  cuotaInicial: number,
  tasaGradiente: number,
  periodos: number,
  tasaInteres: number,
  sistemaCapitalizacion: string = 'mensual'
): ResultadoGradiente => {
  const cuotas: { numeroCuota: number; monto: number }[] = [];
  
  // Calcular cada cuota de la serie
  for (let i = 0; i < periodos; i++) {
    const monto = cuotaInicial * Math.pow(1 + tasaGradiente, i);
    cuotas.push({
      numeroCuota: i + 1,
      monto,
    });
  }
  
  // Ajustar tasa de interés según el sistema de capitalización
  let tasaEfectiva = tasaInteres;
  if (sistemaCapitalizacion === 'trimestral') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/3) - 1;
  } else if (sistemaCapitalizacion === 'semestral') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/6) - 1;
  } else if (sistemaCapitalizacion === 'anual') {
    tasaEfectiva = Math.pow(1 + tasaInteres, 1/12) - 1;
  }
  
  // Calcular valor presente
  let montoPresente = 0;
  
  if (tasaEfectiva === tasaGradiente) {
    // Caso especial cuando la tasa de interés es igual a la tasa de crecimiento
    montoPresente = cuotaInicial * periodos / (1 + tasaEfectiva);
  } else {
    // Fórmula general
    montoPresente = cuotaInicial * (1 - Math.pow((1 + tasaGradiente) / (1 + tasaEfectiva), periodos)) / (tasaEfectiva - tasaGradiente);
  }
  
  // Calcular valor futuro
  let montoFuturo = 0;
  
  if (tasaEfectiva === tasaGradiente) {
    // Caso especial cuando la tasa de interés es igual a la tasa de crecimiento
    montoFuturo = cuotaInicial * periodos * Math.pow(1 + tasaEfectiva, periodos - 1);
  } else {
    // Fórmula directa para el valor futuro
    montoFuturo = cuotaInicial * (Math.pow(1 + tasaEfectiva, periodos) - Math.pow(1 + tasaGradiente, periodos)) / (tasaEfectiva - tasaGradiente);
  }
  
  // Calcular TIR (Tasa Interna de Retorno)
  const tir = calcularTIR(cuotas.map(c => c.monto), montoPresente);
  
  return {
    cuotaInicial,
    gradiente: tasaGradiente,
    periodos,
    tasaInteres,
    montoPresente,
    montoFuturo,
    cuotas,
    tir,
    sistemaCapitalizacion
  };
};

/**
 * Calcula la cuota inicial desde un valor presente para un gradiente aritmético
 */
export const calcularCuotaInicialDesdeValorPresenteGradienteAritmetico = (
  valorPresente: number,
  gradiente: number,
  tasaInteres: number,
  periodos: number
): number => {
  if (tasaInteres === 0) {
    // Caso especial cuando la tasa de interés es cero
    return (valorPresente - gradiente * (periodos * (periodos - 1)) / 2) / periodos;
  }
  
  const factorAnualidad = (1 - Math.pow(1 + tasaInteres, -periodos)) / tasaInteres;
  const factorGradiente = (1/tasaInteres) * (factorAnualidad - (periodos / Math.pow(1 + tasaInteres, periodos)));
  
  return (valorPresente - gradiente * factorGradiente) / factorAnualidad;
};

/**
 * Calcula la cuota inicial desde un valor presente para un gradiente geométrico
 */
export const calcularCuotaInicialDesdeValorPresenteGradienteGeometrico = (
  valorPresente: number,
  tasaGradiente: number,
  tasaInteres: number,
  periodos: number
): number => {
  if (tasaInteres === tasaGradiente) {
    // Caso especial cuando la tasa de interés es igual a la tasa de crecimiento
    return valorPresente * (1 + tasaInteres) / periodos;
  }
  
  return valorPresente * (tasaInteres - tasaGradiente) / (1 - Math.pow((1 + tasaGradiente) / (1 + tasaInteres), periodos));
};

/**
 * Calcula la cuota inicial desde un valor futuro para un gradiente aritmético
 */
export const calcularCuotaInicialDesdeValorFuturoGradienteAritmetico = (
  valorFuturo: number,
  gradiente: number,
  tasaInteres: number,
  periodos: number
): number => {
  if (tasaInteres === 0) {
    // Caso especial cuando la tasa de interés es cero
    return (valorFuturo - gradiente * (periodos * (periodos - 1)) / 2) / periodos;
  }
  
  const factorAnualidad = (Math.pow(1 + tasaInteres, periodos) - 1) / tasaInteres;
  const factorGradiente = (1/tasaInteres) * (factorAnualidad - periodos);
  
  return (valorFuturo - gradiente * factorGradiente) / factorAnualidad;
};

/**
 * Calcula la cuota inicial desde un valor futuro para un gradiente geométrico
 */
export const calcularCuotaInicialDesdeValorFuturoGradienteGeometrico = (
  valorFuturo: number,
  tasaGradiente: number,
  tasaInteres: number,
  periodos: number
): number => {
  if (tasaInteres === tasaGradiente) {
    // Caso especial cuando la tasa de interés es igual a la tasa de crecimiento
    return valorFuturo / (periodos * Math.pow(1 + tasaInteres, periodos - 1));
  }
  
  return valorFuturo * (tasaInteres - tasaGradiente) / (Math.pow(1 + tasaInteres, periodos) - Math.pow(1 + tasaGradiente, periodos));
};

/**
 * Calcula la Tasa Interna de Retorno (TIR) para una serie de flujos de efectivo
 * @param flujos Array de flujos de efectivo (positivos para ingresos, negativos para egresos)
 * @param montoInicial Inversión inicial (valor negativo)
 * @returns La tasa interna de retorno como decimal
 */
export const calcularTIR = (
  flujos: number[],
  montoInicial: number
): number => {
  // Función para calcular el VAN con una tasa determinada
  const calcularVAN = (tasa: number): number => {
    let van = -montoInicial; // Inversión inicial como negativo
    
    for (let i = 0; i < flujos.length; i++) {
      van += flujos[i] / Math.pow(1 + tasa, i + 1);
    }
    
    return van;
  };
  
  // Método de bisección para encontrar la TIR
  let tasaMin = -0.99; // Límite inferior (-99%)
  let tasaMax = 2.0;  // Límite superior (200%)
  let tasaMid = 0;
  let vanMid = 0;
  const precision = 0.0001;
  const maxIteraciones = 100;
  
  // Si todos los flujos son negativos o cero, no hay TIR
  const hayFlujoPositivo = flujos.some(flujo => flujo > 0);
  if (!hayFlujoPositivo) {
    return 0; // No hay TIR válida
  }
  
  // Iteración para encontrar la TIR
  for (let i = 0; i < maxIteraciones; i++) {
    tasaMid = (tasaMin + tasaMax) / 2;
    vanMid = calcularVAN(tasaMid);
    
    if (Math.abs(vanMid) < precision) {
      // Encontramos la TIR con la precisión deseada
      break;
    }
    
    if (vanMid > 0) {
      tasaMin = tasaMid;
    } else {
      tasaMax = tasaMid;
    }
  }
  
  return tasaMid;
};
