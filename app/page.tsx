import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { BarbersSection } from '@/components/sections/barbers-section';
import { ServicesSection } from '@/components/sections/services-section';
import { BookingSection } from '@/components/sections/booking-section';
import { GallerySection } from '@/components/sections/gallery-section';
import { ContactSection } from '@/components/sections/contact-section';

export default function Home() {
  return (
    <main className="min-h-screen">
      
      {/* Inicio */}
      <section id="inicio">
        <HeroSection />
      </section>

      {/* Sobre */}
      <section id="sobre">
        <AboutSection />
      </section>

      {/* Barberos */}
      <section id="barberos">
        <BarbersSection />
      </section>

      {/* Servicios */}
      <section id="servicios">
        <ServicesSection />
      </section>

      {/* Reservar */}
      <section id="reservar">
        <BookingSection />
      </section>

      {/* Galería */}
      <section id="galeria">
        <GallerySection />
      </section>

      {/* Contacto */}
      <section id="contacto">
        <ContactSection />
      </section>

    </main>
  );
}
