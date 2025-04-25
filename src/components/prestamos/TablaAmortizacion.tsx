
import React, { useState } from 'react';
import { CuotaAmortizacion, formatCurrency } from '@/services/calculosFinancieros';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowLeftRight } from 'lucide-react';

interface TablaAmortizacionProps {
  tablaAmortizacion: CuotaAmortizacion[];
}

const TablaAmortizacion: React.FC<TablaAmortizacionProps> = ({ tablaAmortizacion }) => {
  const isMobile = useIsMobile();
  const [expandido, setExpandido] = useState(false);
  const [mostrarTodo, setMostrarTodo] = useState(false);
  
  if (tablaAmortizacion.length === 0) return null;
  
  // Determinar el número de filas a mostrar basado en si está expandido o es móvil
  const filasAMostrar = expandido ? tablaAmortizacion.length : (isMobile ? 5 : 10);
  
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-financial-slate/30">
              <TableHead className="py-2 text-left">Cuota</TableHead>
              <TableHead className="py-2 text-right">Pago</TableHead>
              {(mostrarTodo || !isMobile) && <TableHead className="py-2 text-right">Capital</TableHead>}
              {(mostrarTodo || !isMobile) && <TableHead className="py-2 text-right">Interés</TableHead>}
              <TableHead className="py-2 text-right">Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tablaAmortizacion.slice(0, filasAMostrar).map((row) => (
              <TableRow key={row.numeroCuota} className="border-b border-white/5">
                <TableCell className="py-2">{row.numeroCuota}</TableCell>
                <TableCell className="py-2 text-right">{formatCurrency(row.cuota)}</TableCell>
                {(mostrarTodo || !isMobile) && <TableCell className="py-2 text-right">{formatCurrency(row.capital)}</TableCell>}
                {(mostrarTodo || !isMobile) && <TableCell className="py-2 text-right">{formatCurrency(row.interes)}</TableCell>}
                <TableCell className="py-2 text-right">{formatCurrency(row.saldo)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {isMobile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={() => setMostrarTodo(!mostrarTodo)}
          >
            <div className="flex items-center">
              <ArrowLeftRight className="h-4 w-4 mr-1" />
              {mostrarTodo ? "Mostrar menos columnas" : "Mostrar todas las columnas"}
            </div>
          </Button>
        )}
        
        {tablaAmortizacion.length > (isMobile ? 5 : 10) && (
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
                Ver todas las {tablaAmortizacion.length} cuotas
              </div>
            )}
          </Button>
        )}
      </div>
      
      {isMobile && !mostrarTodo && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Desliza horizontalmente o usa el botón para ver más detalles
        </div>
      )}
    </div>
  );
};

export default TablaAmortizacion;
