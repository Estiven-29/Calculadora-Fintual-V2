
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface PrestamoFormProps {
  formData: {
    monto: string;
    tasaInteres: string;
    plazo: string;
    tipoPlazo: string;
    tipoAmortizacion: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  calcularPrestamo: () => void;
}

const PrestamoForm: React.FC<PrestamoFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  calcularPrestamo,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="monto">Monto a Solicitar</Label>
        <Input 
          id="monto"
          name="monto"
          type="number" 
          placeholder="Ej: 10000000" 
          value={formData.monto}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      
      <div>
        <Label htmlFor="tasaInteres">Tasa de Interés Anual (%)</Label>
        <Input 
          id="tasaInteres"
          name="tasaInteres"
          type="number" 
          placeholder="Ej: 12" 
          value={formData.tasaInteres}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      
      <div>
        <Label htmlFor="plazo">Plazo</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            id="plazo"
            name="plazo"
            type="number" 
            placeholder="Ej: 36" 
            value={formData.plazo}
            onChange={handleInputChange}
            className="input-field"
          />
          <Select 
            value={formData.tipoPlazo} 
            onValueChange={(value) => handleSelectChange('tipoPlazo', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meses">Meses</SelectItem>
              <SelectItem value="anos">Años</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="tipoAmortizacion">Tipo de Amortización</Label>
        <Select 
          value={formData.tipoAmortizacion} 
          onValueChange={(value) => handleSelectChange('tipoAmortizacion', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frances">Francés (Cuota Fija)</SelectItem>
            <SelectItem value="aleman">Alemán (Capital Fijo)</SelectItem>
            <SelectItem value="americano">Americano</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={calcularPrestamo} className="w-full btn-primary">
        Calcular Préstamo
      </Button>
    </div>
  );
};

export default PrestamoForm;
