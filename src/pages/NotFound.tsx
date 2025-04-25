
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-financial-midnight p-6">
      <div className="financial-card p-8 w-full max-w-md text-center">
        <div className="text-[80px] font-bold text-financial-accent opacity-80 mb-2">404</div>
        <h1 className="text-2xl font-bold mb-4">Página no encontrada</h1>
        <p className="text-white/70 mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/" className="btn-primary inline-block">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
