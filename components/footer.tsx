import { Instagram } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-black border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LOGO + INFO */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="/logo-uppsala.png"
                  alt="UPPSALA"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              </div>
              <span className="text-lg font-bold">UPPSALA BARBER</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Temple of the Gods
            </p>
            <p className="text-sm text-muted-foreground">
              Encarnación - Tomás R. Pereira
            </p>
          </div>

          {/* ENLACES */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <nav className="space-y-2">
              <a href="#sobre" className="block text-sm hover:text-primary transition-colors">
                Sobre nosotros
              </a>
              <a href="#barberos" className="block text-sm hover:text-primary transition-colors">
                Nuestros barberos
              </a>
              <a href="#servicios" className="block text-sm hover:text-primary transition-colors">
                Servicios
              </a>
              <a href="#reservar" className="block text-sm hover:text-primary transition-colors">
                Reservar turno
              </a>
            </nav>
          </div>

          {/* REDES */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes sociales</h3>
            <div className="space-y-3">

              <a
                href="https://www.instagram.com/uppsala_enc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
              >
                <Instagram size={18} />
                <span>@uppsala_enc</span>
              </a>

              <a
                href="https://www.instagram.com/hug0._mrt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
              >
                <Instagram size={18} />
                <span>@hug0._mrt (Hugo)</span>
              </a>

              <a
                href="https://www.instagram.com/miguel_barb3r_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
              >
                <Instagram size={18} />
                <span>@miguel_barb3r_ (Miguel)</span>
              </a>

            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-8 pt-8 border-t border-primary/20 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UPPSALA BARBER. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
