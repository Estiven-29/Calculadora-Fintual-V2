import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
const Index = () => {
  const {
    user
  } = useAuth();
  return <Layout>
      <div className="page-transition">
        <section className="mx-auto max-w-6xl px-4 py-6 md:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Calculadora Financiera</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Herramientas financieras para calcular intereses, anualidades y más
            </p>
          </div>

          {!user && <div className="mb-12 p-6 bg-financial-accent/20 border border-financial-accent/20 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-3">¡Inicia sesión para usar todas las herramientas!</h2>
              <p className="mb-4"></p>
              <div className="flex justify-center gap-4">
                <Link to="/login" className="px-6 py-3 bg-financial-accent hover:bg-financial-accent/80 transition-colors rounded-lg font-medium">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="px-6 py-3 bg-financial-navy hover:bg-financial-navy/80 transition-colors rounded-lg font-medium">
                  Registrarse
                </Link>
              </div>
            </div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Interés Simple</CardTitle>
                <CardDescription>
                  Calcula intereses con la modalidad simple
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-6">
                  Calcula montos futuros, tasas de interés o periodos basados en el método de interés simple.
                </p>
                <div className="bg-financial-slate/20 p-4 rounded-lg mb-2">
                  <div className="text-sm text-blue-300 mb-1">Fórmula:</div>
                  <div className="font-mono">I = P × r × t</div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={user ? "/interes-simple" : "/login"} state={!user ? {
                from: "/interes-simple"
              } : undefined} className="w-full btn-primary text-center">
                  Calcular Interés Simple
                </Link>
              </CardFooter>
            </Card>

            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Interés Compuesto</CardTitle>
                <CardDescription>
                  Calcula intereses con capitalización
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-6">
                  Calcula montos futuros, tasas de interés o periodos basados en el método de interés compuesto.
                </p>
                <div className="bg-financial-slate/20 p-4 rounded-lg mb-2">
                  <div className="text-sm text-blue-300 mb-1">Fórmula:</div>
                  <div className="font-mono">A = P(1 + r)^t</div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={user ? "/interes-compuesto" : "/login"} state={!user ? {
                from: "/interes-compuesto"
              } : undefined} className="w-full btn-primary text-center">
                  Calcular Interés Compuesto
                </Link>
              </CardFooter>
            </Card>

            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Anualidades</CardTitle>
                <CardDescription>
                  Calcula pagos periódicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-6">
                  Calcula valores presentes, futuros, pagos, periodos o tasas de interés para series de pagos periódicos.
                </p>
                <div className="bg-financial-slate/20 p-4 rounded-lg mb-2">
                  <div className="text-sm text-blue-300 mb-1">Tipos:</div>
                  <div>Ordinarias y Anticipadas</div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={user ? "/anualidades" : "/login"} state={!user ? {
                from: "/anualidades"
              } : undefined} className="w-full btn-primary text-center">
                  Calcular Anualidades
                </Link>
              </CardFooter>
            </Card>

            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Tasa de Interés</CardTitle>
                <CardDescription>
                  Calcula tasas de interés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-6">
                  Determina la tasa de interés necesaria para alcanzar un monto futuro deseado en un periodo de tiempo.
                </p>
                <div className="bg-financial-slate/20 p-4 rounded-lg mb-2">
                  <div className="text-sm text-blue-300 mb-1">Calculadora:</div>
                  <div>Simple y Compuesta</div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={user ? "/tasa-interes" : "/login"} state={!user ? {
                from: "/tasa-interes"
              } : undefined} className="w-full btn-primary text-center">
                  Calcular Tasa de Interés
                </Link>
              </CardFooter>
            </Card>

            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Solicitar Préstamo</CardTitle>
                <CardDescription>
                  Simula y solicita préstamos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-6">
                  Simula diferentes tipos de préstamos y envía tu solicitud para que sea evaluada.
                </p>
                <div className="bg-financial-slate/20 p-4 rounded-lg mb-2">
                  <div className="text-sm text-blue-300 mb-1">Tipos de amortización:</div>
                  <div>Francés, Alemán y Americano</div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={user ? "/solicitar-prestamo" : "/login"} state={!user ? {
                from: "/solicitar-prestamo"
              } : undefined} className="w-full btn-primary text-center">
                  Solicitar Préstamo
                </Link>
              </CardFooter>
            </Card>

            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Mis Préstamos</CardTitle>
                <CardDescription>
                  Consulta tus préstamos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-6">
                  Revisa el estado de tus solicitudes de préstamos y consulta los detalles de cada uno.
                </p>
                <div className="bg-financial-slate/20 p-4 rounded-lg mb-2">
                  <div className="text-sm text-blue-300 mb-1">Acciones:</div>
                  <div>Consultar estado y detalles</div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={user ? "/mis-prestamos" : "/login"} state={!user ? {
                from: "/mis-prestamos"
              } : undefined} className="w-full btn-primary text-center">
                  Ver Mis Préstamos
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </Layout>;
};
export default Index;