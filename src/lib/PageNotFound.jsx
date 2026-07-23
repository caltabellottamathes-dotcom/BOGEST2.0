import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <span className="font-heading text-8xl md:text-9xl font-bold text-primary/20">404</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground -mt-4 mb-4">
          Pagina niet gevonden
        </h1>
        <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Terug naar home
        </Link>
      </div>
    </div>
  );
}