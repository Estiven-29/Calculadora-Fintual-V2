
import React from 'react';
import { Button } from '@/components/ui/button';
import { CuotaAmortizacion, formatCurrency } from '@/services/calculosFinancieros';

interface ResumenPrestamoProps {
  cuotaMensual: number | null;
  tablaAmortizacion: CuotaAmortizacion[];
  monto: string;
  solicitarPrestamo: () => void;
  isSubmitting: boolean;
}

const ResumenPrestamo: React.FC<ResumenPrestamoProps> = ({
  cuotaMensual,
  tablaAmortizacion,
  monto,
  solicitarPrestamo,
  isSubmitting
}) => {
  if (cuotaMensual === null) return null;
  
  return (
    <div className="mb-6">
      <div className="text-center p-4 bg-financial-slate/30 rounded-lg mb-4">
        <h3 className="text-lg text-white/70 mb-2">Cuota Mensual:</h3>
        <p className="text-3xl font-bold text-financial-accent">
          {formatCurrency(cuotaMensual)}
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
          <p className="text-sm text-white/60">Monto Total</p>
          <p className="font-medium">{formatCurrency(parseFloat(monto))}</p>
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
      
      <Button 
        onClick={solicitarPrestamo} 
        className="w-full mb-6 btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Procesando..." : "Solicitar Préstamo"}
      </Button>
    </div>
  );
};

export default ResumenPrestamo;
