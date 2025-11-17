'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { supabase, type Service } from '@/lib/supabase';

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true });

      if (!error && data) {
        setServices(data as Service[]);
      } else {
        console.error('Error cargando servicios:', error);
      }

      setLoading(false);
    };

    loadServices();
  }, []);

  const formatPrice = (price: number) => {
    return `Gs. ${price.toLocaleString('es-PY')}`;
  };

  return (
    <section id="servicios" className="py-20 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Servicios</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Todos nuestros servicios incluyen atención personalizada.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Cargando servicios...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No hay servicios cargados en este momento.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="relative bg-card border border-primary/20 rounded-2xl p-6 hover:neon-border transition-all shadow-lg shadow-primary/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckCircle2 size={18} />
                  </span>
                </div>

                <div className="mt-6 pt-4 border-t border-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Desde</p>
                  <p className="text-2xl font-bold text-accent">
                    {formatPrice(service.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
