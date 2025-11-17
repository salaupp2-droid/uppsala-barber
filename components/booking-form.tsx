'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase, type Barber, type Service } from '@/lib/supabase';
import { Loader2, CheckCircle2, MessageCircle } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function BookingForm() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientInstagram: '',
    serviceId: '',
    comment: '',
  });

  useEffect(() => {
    loadBarbers();
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      loadAvailableTimes();
    }
  }, [selectedBarber, selectedDate]);

  const loadBarbers = async () => {
    const { data } = await supabase.from('barbers').select('*').order('name');
    if (data) setBarbers(data);
  };

  const loadServices = async () => {
    const { data } = await supabase.from('services').select('*').order('price');
    if (data) setServices(data);
  };

  const loadAvailableTimes = async () => {
    if (!selectedBarber || !selectedDate) return;

    const allTimes = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
    ];

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    // 1) Traer turnos que NO estén cancelados para ese barbero y esa fecha
    const { data: appointments } = await supabase
      .from('appointments')
      .select('time')
      .eq('barber_id', selectedBarber)
      .eq('date', dateStr)
      .neq('status', 'cancelled');

    const bookedTimes = appointments?.map((a) => a.time) || [];

    // 2) Filtrar horarios ocupados
    let available = allTimes.filter((time) => !bookedTimes.includes(time));

    // 3) Si la fecha es HOY, sacar horarios que ya pasaron
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');

    if (dateStr === todayStr) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      available = available.filter((time) => {
        const [hStr, mStr] = time.split(':');
        const h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        const minutes = h * 60 + m;

        // solo mostrar horarios futuros
        return minutes > currentMinutes;
      });
    }

    setAvailableTimes(available);
    setSelectedTime('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          barber_id: selectedBarber,
          service_id: formData.serviceId,
          client_name: formData.clientName,
          client_phone: formData.clientPhone,
          client_instagram: formData.clientInstagram || null,
          date: format(selectedDate!, 'yyyy-MM-dd'),
          time: selectedTime,
          comment: formData.comment || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      setBookedAppointment(data);
    } catch (error) {
      alert('Error al crear la reserva. Por favor, intenta nuevamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (success && bookedAppointment) {
    const barber = barbers.find((b) => b.id === selectedBarber);
    const whatsappMessage = encodeURIComponent(
      `Hola ${barber?.name}, hice una reserva desde la web para el día ${format(
        selectedDate!,
        'dd/MM/yyyy',
        { locale: es }
      )} a las ${selectedTime}.`
    );

    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">Reserva Confirmada</h3>
        <p className="text-muted-foreground mb-2">
          Tu turno con <span className="text-primary font-semibold">{barber?.name}</span>
        </p>
        <p className="text-muted-foreground mb-8">
          {format(selectedDate!, "EEEE, d 'de' MMMM", { locale: es })} a las {selectedTime}
        </p>

        <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
          <a
            href={`https://wa.me/${barber?.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <MessageCircle size={20} />
            Confirmar por WhatsApp
          </a>
        </Button>

        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSuccess(false);
            setFormData({
              clientName: '',
              clientPhone: '',
              clientInstagram: '',
              serviceId: '',
              comment: '',
            });
            setSelectedBarber('');
            setSelectedDate(undefined);
            setSelectedTime('');
          }}
        >
          Hacer otra reserva
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="barber">Barbero *</Label>
          <Select value={selectedBarber} onValueChange={setSelectedBarber} required>
            <SelectTrigger id="barber">
              <SelectValue placeholder="Selecciona un barbero" />
            </SelectTrigger>
            <SelectContent>
              {barbers.map((barber) => (
                <SelectItem key={barber.id} value={barber.id}>
                  {barber.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Servicio *</Label>
          <Select
            value={formData.serviceId}
            onValueChange={(value) =>
              setFormData({ ...formData, serviceId: value })
            }
            required
          >
            <SelectTrigger id="service">
              <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedBarber && (
        <div className="space-y-2">
          <Label>Fecha *</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) =>
              startOfDay(date) < startOfDay(new Date())
            }
            className="rounded-md border border-input"
            locale={es}
          />
        </div>
      )}

      {selectedDate && availableTimes.length > 0 && (
        <div className="space-y-2">
          <Label>Horario disponible *</Label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {availableTimes.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? 'default' : 'outline'}
                className={selectedTime === time ? 'neon-glow' : ''}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && availableTimes.length === 0 && (
        <p className="text-yellow-500 text-sm">
          No hay horarios disponibles para esta fecha. Intenta con otro día.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Tu nombre *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone">WhatsApp *</Label>
          <Input
            id="clientPhone"
            type="tel"
            placeholder="+595..."
            value={formData.clientPhone}
            onChange={(e) =>
              setFormData({ ...formData, clientPhone: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientInstagram">Instagram (opcional)</Label>
        <Input
          id="clientInstagram"
          placeholder="@tu_usuario"
          value={formData.clientInstagram}
          onChange={(e) =>
            setFormData({ ...formData, clientInstagram: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comentario (opcional)</Label>
        <Textarea
          id="comment"
          placeholder="Algún detalle especial sobre tu corte..."
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          rows={3}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full neon-glow bg-primary hover:bg-primary/80 font-bold"
        disabled={loading || !selectedTime}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Reservando...
          </>
        ) : (
          'Confirmar Reserva'
        )}
      </Button>
    </form>
  );
}
