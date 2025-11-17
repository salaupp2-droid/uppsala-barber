import { BookingForm } from '@/components/booking-form';

export function BookingSection() {
  return (
    <section id="reservar" className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            Reservar Turno
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8 neon-border" />
          <p className="text-lg text-muted-foreground">
            Elige tu barbero, fecha y horario preferido
          </p>
        </div>

        <div className="bg-card border border-primary/20 rounded-lg p-8 neon-border">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
