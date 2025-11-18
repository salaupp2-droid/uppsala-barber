import { Scissors, Paintbrush, Sparkles } from 'lucide-react';

export function AboutSection() {
  const features = [
    {
      icon: Scissors,
      title: 'Fades Profesionales',
      description: 'Degradados perfectos con técnica y precisión',
    },
    {
      icon: Paintbrush,
      title: 'Color y Fantasía',
      description: 'Tintes vibrantes y colores únicos',
    },
    {
      icon: Sparkles,
      title: 'Estilo Urbano',
      description: 'Cortes modernos con personalidad',
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            Sobre UPPSALA
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8 neon-border" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos una barbería urbana ubicada en{' '}
            <span className="text-accent font-semibold">
              Encarnación - Tomás R. Pereira
            </span>
            , Especializada en brindarte un asesoramiento previo antes de cada servicio que deseas realizarte. Nuestro
            ambiente combina música, estilo callejero y la mejor vibra para que
            cada visita sea una experiencia única.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card border border-primary/20 rounded-lg p-8 text-center hover:neon-border transition-all duration-300 hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                  <Icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
