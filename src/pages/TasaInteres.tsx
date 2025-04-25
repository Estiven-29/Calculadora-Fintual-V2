
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/services/calculosFinancieros';

const TasaInteres = () => {
  const [formData, setFormData] = useState({
    capital: '',
    tiempo: '',
    monto: '',
    tipoInteres: 'simple', // simple o compuesto
  });
  const [resultado, setResultado] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      tipoInteres: value,
    });
  };

  const calcularTasaInteres = () => {
    const capital = parseFloat(formData.capital);
    const tiempo = parseFloat(formData.tiempo);
    const monto = parseFloat(formData.monto);

    if (isNaN(capital) || isNaN(tiempo) || isNaN(monto)) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    let tasa;
    if (formData.tipoInteres === 'simple') {
      // i = (F - P) / (P * t)
      tasa = (monto - capital) / (capital * tiempo);
    } else {
      // i = (F/P)^(1/t) - 1
      tasa = Math.pow(monto / capital, 1 / tiempo) - 1;
    }

    setResultado(tasa);
  };

  return (
    <Layout>
      <div className="page-transition max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cálculo de Tasa de Interés</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="financial-card">
            <CardHeader>
              <CardTitle>Parámetros</CardTitle>
              <CardDescription>
                Ingrese los datos para calcular la tasa de interés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipoInteres">Tipo de Interés</Label>
                  <Select 
                    value={formData.tipoInteres} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de interés" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Interés Simple</SelectItem>
                      <SelectItem value="compuesto">Interés Compuesto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="capital">Capital Inicial (P)</Label>
                  <Input 
                    id="capital"
                    name="capital"
                    type="number" 
                    placeholder="Ej: 1000000" 
                    value={formData.capital}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <Label htmlFor="monto">Monto Final (F)</Label>
                  <Input 
                    id="monto"
                    name="monto"
                    type="number" 
                    placeholder="Ej: 1200000" 
                    value={formData.monto}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tiempo">Tiempo (años)</Label>
                  <Input 
                    id="tiempo"
                    name="tiempo"
                    type="number" 
                    placeholder="Ej: 2" 
                    value={formData.tiempo}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <Button onClick={calcularTasaInteres} className="w-full btn-primary">
                  Calcular Tasa de Interés
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {resultado !== null && (
            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
                <CardDescription>
                  Tasa de interés calculada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-financial-slate/30 rounded-lg">
                  <h3 className="text-lg text-white/70 mb-2">Tasa de Interés:</h3>
                  <p className="text-4xl font-bold text-financial-accent">
                    {(resultado * 100).toFixed(2)}%
                  </p>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Capital</p>
                      <p className="font-medium">{formatCurrency(parseFloat(formData.capital))}</p>
                    </div>
                    <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                      <p className="text-sm text-white/60">Monto Final</p>
                      <p className="font-medium">{formatCurrency(parseFloat(formData.monto))}</p>
                    </div>
                  </div>
                  <div className="bg-financial-slate/20 p-3 rounded-lg text-center">
                    <p className="text-sm text-white/60">Interés Generado</p>
                    <p className="font-medium">{formatCurrency(parseFloat(formData.monto) - parseFloat(formData.capital))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TasaInteres;
