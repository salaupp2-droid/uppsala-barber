'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase, type Media } from '@/lib/supabase';

export function GallerySection() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setItems(data);
      }

      setLoading(false);
    };

    loadMedia();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 neon-text text-center">
          Galería de trabajos
        </h2>

        {loading ? (
          <p className="text-center text-muted-foreground">Cargando galería...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aún no hay imágenes cargadas en la galería.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-xl overflow-hidden border border-primary/20 bg-card"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={item.url}
                    alt={item.description || 'Trabajo de la barbería'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {item.description && (
                  <div className="p-2 text-xs text-center text-muted-foreground">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
