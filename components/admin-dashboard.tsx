'use client';

import { useState, useEffect } from 'react';
import {
  supabase,
  type Appointment,
  type Barber,
  type Service,
} from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, CheckCircle2, XCircle, Clock, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type AppointmentWithDetails = Appointment & {
  barber?: Barber;
  service?: Service;
};

// 👉 HORARIOS usados para bloquear todo el día
const ALL_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().slice(0, 10) // yyyy-MM-dd
  );
  const [filterBarber, setFilterBarber] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAllDates, setShowAllDates] = useState(false);

  // 🔹 Cargar datos (usa fecha / todas las fechas / barbero)
  const loadData = async () => {
    setLoading(true);

    const { data: barbersData } = await supabase
      .from('barbers')
      .select('*')
      .order('name');

    if (barbersData) setBarbers(barbersData);

    let query = supabase
      .from('appointments')
      .select('*, barber:barbers(*), service:services(*)')
      .neq('status', 'cancelled'); // no mostrar cancelados

    if (!showAllDates) {
      // solo la fecha seleccionada
      query = query.eq('date', filterDate).order('time');
    } else {
      // todas las fechas, ordenadas por fecha y hora
      query = query
        .order('date', { ascending: true })
        .order('time', { ascending: true });
    }

    if (filterBarber !== 'all') {
      query = query.eq('barber_id', filterBarber);
    }

    const { data: appointmentsData } = await query;

    if (appointmentsData) {
      setAppointments(appointmentsData as AppointmentWithDetails[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // ahora también escucha showAllDates
  }, [filterDate, filterBarber, showAllDates]);

  const updateStatus = async (
    id: string,
    status: 'pending' | 'completed' | 'cancelled' | 'blocked'
  ) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error al actualizar estado:', error);
        alert('No se pudo actualizar el estado: ' + error.message);
        return;
      }

      await loadData();
    } catch (err: any) {
      console.error('Error inesperado al actualizar estado:', err);
      alert('Error inesperado al actualizar el turno.');
    }
  };

  // Cancelar turno (borrarlo)
  const cancelAppointment = async (id: string) => {
    const confirmDelete = window.confirm(
      '¿Seguro que querés cancelar este turno?'
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error al cancelar turno:', error);
        alert('No se pudo cancelar el turno: ' + error.message);
        return;
      }

      await loadData();
    } catch (err: any) {
      console.error('Error inesperado al cancelar turno:', err);
      alert('Error inesperado al cancelar el turno.');
    }
  };

  // 👉 Bloquear TODO el día para el barbero seleccionado
  const handleBlockFullDay = async () => {
    if (!filterDate) {
      alert('Primero elegí una fecha.');
      return;
    }

    if (!filterBarber || filterBarber === 'all') {
      alert('Tenés que elegir un barbero específico para bloquear el día.');
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que querés reservar/bloquear todas las horas libres del ${filterDate} para este barbero?`
    );
    if (!confirmar) return;

    try {
      setLoading(true);

      // 1) Ver qué horarios ya tienen turno (cualquier estado excepto cancelado)
      const { data: existing, error: existingError } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', filterDate)
        .eq('barber_id', filterBarber)
        .neq('status', 'cancelled');

      if (existingError) {
        console.error(existingError);
        alert('Error al cargar turnos existentes.');
        setLoading(false);
        return;
      }

      const takenTimes = new Set(existing?.map((a) => a.time));

      // 2) Crear filas para todos los horarios libres
      const rowsToInsert = ALL_TIME_SLOTS.filter(
        (time) => !takenTimes.has(time)
      ).map((time) => ({
        barber_id: filterBarber,
        service_id: null, // Podés usar un servicio por defecto si querés
        client_name: 'Bloqueado',
        client_phone: '',
        client_instagram: '',
        date: filterDate,
        time,
        comment: 'Día bloqueado por admin',
        status: 'blocked', // nuevo estado para distinguir estas reservas
      }));

      if (rowsToInsert.length === 0) {
        alert('Todos los horarios ya estaban ocupados para ese día.');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('appointments')
        .insert(rowsToInsert);

      if (insertError) {
        console.error(insertError);
        alert('No se pudieron bloquear todos los horarios.');
        setLoading(false);
        return;
      }

      alert('Se reservaron/bloquearon todas las horas libres de ese día.');
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Error inesperado al bloquear el día.');
    } finally {
      setLoading(false);
    }
  };

  // 👉 Liberar TODAS las reservas "bloqueadas" de ese día y barbero
  const handleUnblockFullDay = async () => {
    if (!filterDate) {
      alert('Primero elegí una fecha.');
      return;
    }

    if (!filterBarber || filterBarber === 'all') {
      alert('Tenés que elegir un barbero específico para liberar el día.');
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que querés liberar todas las horas bloqueadas del ${filterDate} para este barbero?`
    );
    if (!confirmar) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('date', filterDate)
        .eq('barber_id', filterBarber)
        .eq('status', 'blocked');

      if (error) {
        console.error(error);
        alert('No se pudieron liberar las horas bloqueadas.');
        setLoading(false);
        return;
      }

      alert('Se liberaron todas las horas bloqueadas para ese día.');
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Error inesperado al liberar el día.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    window.location.reload();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { icon: Clock, color: 'text-yellow-500', label: 'Pendiente' },
      completed: {
        icon: CheckCircle2,
        color: 'text-green-500',
        label: 'Realizada',
      },
      cancelled: { icon: XCircle, color: 'text-red-500', label: 'Cancelada' },
      blocked: { icon: XCircle, color: 'text-pink-500', label: 'Bloqueado' },
    };

    const badge = badges[status as keyof typeof badges];

    if (!badge) {
      // Por si llega algún estado raro
      return <span className="text-muted-foreground">{status}</span>;
    }

    const Icon = badge.icon;

    return (
      <span className={`flex items-center gap-1 ${badge.color}`}>
        <Icon size={16} />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold neon-text">Panel de Reservas</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut size={18} className="mr-2" />
          Cerrar sesión
        </Button>
      </div>

      <div className="bg-card border border-primary/20 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha</label>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              disabled={showAllDates}
              className={showAllDates ? 'opacity-50 cursor-not-allowed' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Barbero</label>
            <Select value={filterBarber} onValueChange={setFilterBarber}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 🔘 Switch para ver todas las fechas */}
        <div className="mt-4 flex items-center gap-2">
          <Switch
            id="showAllDates"
            checked={showAllDates}
            onCheckedChange={setShowAllDates}
          />
          <label
            htmlFor="showAllDates"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Ver todas las reservas (todas las fechas)
          </label>
        </div>

        {/* 👉 Botones para bloquear / liberar el día */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 md:justify-end">
          <Button
            disabled={
              loading ||
              showAllDates ||
              !filterDate ||
              !filterBarber ||
              filterBarber === 'all'
            }
            onClick={handleBlockFullDay}
          >
            Reservar todo el día
          </Button>
          <Button
            variant="outline"
            disabled={
              loading ||
              showAllDates ||
              !filterDate ||
              !filterBarber ||
              filterBarber === 'all'
            }
            onClick={handleUnblockFullDay}
          >
            Liberar todo el día
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-card border border-primary/20 rounded-lg">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {showAllDates
              ? 'No hay reservas registradas'
              : 'No hay reservas para este día'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-card border border-primary/20 rounded-lg p-6 hover:neon-border transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-bold text-accent">
                      {appointment.time}
                    </span>
                    {getStatusBadge(appointment.status)}
                  </div>

                  {showAllDates && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Fecha: {appointment.date}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Cliente:</span>{' '}
                      <span className="font-semibold">
                        {appointment.client_name}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Teléfono:</span>{' '}
                      {appointment.client_phone}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Barbero:</span>{' '}
                      {appointment.barber?.name}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Servicio:</span>{' '}
                      {appointment.service?.name}
                    </p>
                    {appointment.client_instagram && (
                      <p>
                        <span className="text-muted-foreground">Instagram:</span>{' '}
                        {appointment.client_instagram}
                      </p>
                    )}
                  </div>

                  {appointment.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Comentario:</span>{' '}
                      {appointment.comment}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant={
                      appointment.status === 'completed' ? 'default' : 'outline'
                    }
                    onClick={() => updateStatus(appointment.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 border-green-600"
                  >
                    <CheckCircle2 size={16} className="mr-1" />
                    Realizada
                  </Button>

                  <Button
                    size="sm"
                    variant={
                      appointment.status === 'pending' ? 'default' : 'outline'
                    }
                    onClick={() => updateStatus(appointment.id, 'pending')}
                  >
                    <Clock size={16} className="mr-1" />
                    Pendiente
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cancelAppointment(appointment.id)}
                  >
                    <XCircle size={16} className="mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
