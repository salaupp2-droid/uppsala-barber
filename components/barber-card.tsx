'use client';

import Image from 'next/image';
import type { Barber } from '@/lib/supabase';

interface BarberCardProps {
  barber: Barber;
}

export function BarberCard({ barber }: BarberCardProps) {
  return (
    <div className="bg-card border border-primary/30 rounded-3xl p-6 md:p-8 hover:neon-border transition-all flex flex-col">
      {/* FOTO */}
      <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 relative">
        <Image
          src={barber.photo_url || '/barbers/hugo.png'}
          alt={barber.name}
          fill
          className="object-cover rounded-full border-4 border-primary/60 shadow-[0_0_30px_rgba(255,0,255,0.4)]"
        />
      </div>

      {/* NOMBRE */}
      <h3 className="text-xl md:text-2xl font-bold text-center mb-2">
        {barber.name}
      </h3>

      {/* BIO */}
      <p className="text-sm md:text-base text-muted-foreground text-center mb-3">
        {barber.bio}
      </p>

      {/* INSTAGRAM */}
      {barber.instagram && (
        <p className="text-sm text-center mt-auto">
          <span className="text-muted-foreground">Instagram: </span>
          <a
            href={`https://instagram.com/${barber.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {barber.instagram}
          </a>
        </p>
      )}
    </div>
  );
}
