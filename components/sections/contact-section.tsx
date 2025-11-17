import { MapPin, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export async function ContactSection() {
  // Cargar barberos correctamente
  const { data: barbers, error } = await supabase
    .from('barbers')
    .select('*')
    .order('name');

  // Si Supabase falla, evitar que la sección quede vacía
  const fallbackBarbers = [
    {
      id: 1,
      name: "Hugo",
      whatsapp: "+595993385530",
      instagram: "https://instagram.com/hug0._mrt",
    },
    {
      id: 2,
      name: "Miguel",
      whatsapp: "+595976854267",
      instagram: "https://instagram.com/miguel_barb3r_",
    }
  ];

  const contacts = barbers?.length ? barbers : fallbackBarbers;

  return (
    <section id="contacto" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            Contacto
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto neon-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* IZQUIERDA */}
          <div className="space-y-8">
            
            {/* Ubicación */}
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 shrink-0">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Ubicación</h3>
                <p className="text-muted-foreground">
                  Encarnación - Tomás R. Pereira
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <h3 className="text-xl font-bold mb-4">WhatsApp</h3>
              <div className="space-y-3">
                {contacts.map((barber) => (
                  <Button
                    key={barber.id}
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${barber.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle size={20} />
                      WhatsApp con {barber.name}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <h3 className="text-xl font-bold mb-4">Redes Sociales</h3>
              <div className="space-y-3">
                {/* Instagram principal */}
                <Button
                  variant="outline"
                  className="w-full justify-start border-primary/30 hover:bg-primary/10"
                  asChild
                >
                  <a
                    href="https://www.instagram.com/uppsala_enc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Instagram size={20} />
                    @uppsala_enc
                  </a>
                </Button>

                {/* Instagram barberos */}
                {contacts.map((barber) => (
                  <Button
                    key={barber.id}
                    variant="outline"
                    className="w-full justify-start border-primary/30 hover:bg-primary/10"
                    asChild
                  >
                    <a
                      href={barber.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Instagram size={20} />
                      {barber.instagram.split('/').pop()} ({barber.name})
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* DERECHA: MAPA ARREGLADO */}
          <div className="bg-card border border-primary/20 rounded-lg overflow-hidden neon-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7109.671!2d-55.8667!3d-27.3333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDIwJzAwLjAiUyA1NcKwNTInMDAuMCJX!5e0!3m2!1ses!2spy!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
