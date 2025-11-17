'use client';

import { useState, useEffect } from 'react';
import { supabase, type Appointment, type Barber, type Service } from '@/lib/supabase';
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

type AppointmentWithDetails = Appointment & {
  barber?: Barber;
  service?: Service;
};

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().slice(0, 10) // yyyy-MM-dd
  );
  const [filterBarber, setFilterBarber] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filterDate, filterBarber]);

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
      .eq('date', filterDate)
      .neq('status', 'cancelled') // 👈 NO mostrar turnos cancelados
      .order('time');

    if (filterBarber !== 'all') {
      query = query.eq('barber_id', filterBarber);
    }

    const { data: appointmentsData } = await query;

    if (appointmentsData) {
      setAppointments(appointmentsData as AppointmentWithDetails[]);
    }

    setLoading(false);
  };

const updateStatus = async (
  id: string,
  status: 'pending' | 'completed' | 'cancelled'
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

//Pego facu
const cancelAppointment = async (id: string) => {
  const confirmDelete = window.confirm('¿Seguro que querés cancelar este turno?');
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

//Fin Pego facu



  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    window.location.reload();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { icon: Clock, color: 'text-yellow-500', label: 'Pendiente' },
      completed: { icon: CheckCircle2, color: 'text-green-500', label: 'Realizada' },
      cancelled: { icon: XCircle, color: 'text-red-500', label: 'Cancelada' },
    };

    const badge = badges[status as keyof typeof badges];
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
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-card border border-primary/20 rounded-lg">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay reservas para este día</p>
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
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-accent">
                      {appointment.time}
                    </span>
                    {getStatusBadge(appointment.status)}
                  </div>

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
                    variant={appointment.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => updateStatus(appointment.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 border-green-600"
                  >
                    <CheckCircle2 size={16} className="mr-1" />
                    Realizada
                  </Button>

                  <Button
                    size="sm"
                    variant={appointment.status === 'pending' ? 'default' : 'outline'}
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
