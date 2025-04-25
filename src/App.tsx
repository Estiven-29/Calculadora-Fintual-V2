import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InteresSimple from "./pages/InteresSimple";
import InteresCompuesto from "./pages/InteresCompuesto";
import Anualidades from "./pages/Anualidades";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Perfil from "./pages/Perfil";
import TasaInteres from "./pages/TasaInteres";
import SolicitarPrestamo from "./pages/SolicitarPrestamo";
import MisPrestamos from "./pages/MisPrestamos";
import Gradientes from "./pages/Gradientes";
import AmortizacionAvanzada from "./pages/AmortizacionAvanzada";
import SeriesTIR from "./pages/SeriesTIR";
import SistemasCapitalizacion from "./pages/SistemasCapitalizacion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeProvider>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/interes-simple" element={
                <ProtectedRoute>
                  <InteresSimple />
                </ProtectedRoute>
              } />
              <Route path="/interes-compuesto" element={
                <ProtectedRoute>
                  <InteresCompuesto />
                </ProtectedRoute>
              } />
              <Route path="/anualidades" element={
                <ProtectedRoute>
                  <Anualidades />
                </ProtectedRoute>
              } />
              <Route path="/gradientes" element={
                <ProtectedRoute>
                  <Gradientes />
                </ProtectedRoute>
              } />
              <Route path="/amortizacion-avanzada" element={
                <ProtectedRoute>
                  <AmortizacionAvanzada />
                </ProtectedRoute>
              } />
              <Route path="/tasa-interes" element={
                <ProtectedRoute>
                  <TasaInteres />
                </ProtectedRoute>
              } />
              <Route path="/series-tir" element={
                <ProtectedRoute>
                  <SeriesTIR />
                </ProtectedRoute>
              } />
              <Route path="/sistemas-capitalizacion" element={
                <ProtectedRoute>
                  <SistemasCapitalizacion />
                </ProtectedRoute>
              } />
              <Route path="/solicitar-prestamo" element={
                <ProtectedRoute>
                  <SolicitarPrestamo />
                </ProtectedRoute>
              } />
              <Route path="/mis-prestamos" element={
                <ProtectedRoute>
                  <MisPrestamos />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
