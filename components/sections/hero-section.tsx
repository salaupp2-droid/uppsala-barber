'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64">
                      <Image
              src="/logo-uppsala.png"
              alt="UPPSALA BARBER"
              fill
              className="object-cover rounded-full drop-shadow-[0_0_30px_rgba(255,0,255,0.6)]"
              priority
            />

          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 neon-text tracking-tighter">
          UPPSALA BARBER
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-accent font-bold tracking-wide">
          TEMPLE OF THE GODS
        </p>

        <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
          Especialistas en Fades, Color y Estilo Urbano
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="neon-glow bg-primary hover:bg-primary/80 text-white font-bold text-lg px-8 py-6"
            asChild
          >
            <a href="#reservar">Reservar turno</a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-accent text-accent hover:bg-accent hover:text-black font-bold text-lg px-8 py-6"
            asChild
          >
            <a href="#galeria">Ver trabajos</a>
          </Button>
        </div>
      </div>

      <a
        href="#sobre"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-label="Scroll to about section"
      >
        <ChevronDown size={32} className="text-primary" />
      </a>
    </section>
  );
}
