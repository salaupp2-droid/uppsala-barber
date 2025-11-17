'use client';

import { useEffect, useState } from 'react';
import { supabase, type Barber } from '@/lib/supabase';
import { BarberCard } from '@/components/barber-card';

export function BarbersSection() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBarbers = async () => {
      const { data } = await supabase
        .from('barbers')
        .select('*')
        .order('name');
      if (data) setBarbers(data);
      setLoading(false);
    };

    loadBarbers();
  }, []);

  return (
    <section id="barberos" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-4 neon-text">
          Nuestros Barberos
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Conocé al equipo que lleva tu estilo al siguiente nivel.
        </p>

        {/* Loading */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Cargando barberos...
          </p>
        )}

        {/* Grid de barberos */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {barbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
