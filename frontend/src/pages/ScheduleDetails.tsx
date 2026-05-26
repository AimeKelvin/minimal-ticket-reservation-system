import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SeatMap } from '../components/booking/SeatMap';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../api/client';
import { Clock, MapPin, Info, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fmtTime = (value?: string) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtDate = (value?: string) => value ? new Date(value).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—';
const fmtDuration = (start?: string, end?: string) => {
  if (!start || !end) return 'Direct trip';
  const mins = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
  return `${Math.floor(mins / 60)}h ${(mins % 60).toString().padStart(2, '0')}m`;
};

export function ScheduleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<any>(null);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [scheduleRes, seatsRes] = await Promise.all([
          api.get(`/search/schedules/${id}`),
          api.get(`/search/schedules/${id}/seats`)
        ]);
        setSchedule(scheduleRes.data?.data?.schedule);
        const seats = seatsRes.data?.data?.seats ?? [];
        setReservedSeats(seats.filter((seat: any) => !seat.available).map((seat: any) => String(seat.seat_number)));
      } catch (error) {
        toast.error('Schedule not found');
        navigate('/search');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats((prev) => prev.includes(seatId) ? prev.filter((current) => current !== seatId) : [seatId]);
  };

  const totalPrice = useMemo(() => selectedSeats.length * Number(schedule?.price ?? 0), [selectedSeats.length, schedule]);

  const handleContinue = async () => {
    if (!user) {
      toast('Please log in to continue booking', { icon: '🔒' });
      navigate('/login', { state: { from: location } });
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error('Please select one seat');
      return;
    }
    setIsBooking(true);
    try {
      await api.post('/tickets', {
        schedule_id: Number(id),
        seat_number: Number(selectedSeats[0]),
        customer_name: user.fullname
      });
      toast.success('Booking confirmed!');
      navigate('/tickets');
    } catch (error) {
      setIsBooking(false);
    }
  };

  if (isLoading || !schedule) {
    return <div className="min-h-screen flex flex-col bg-canvas"><Navbar /><div className="flex-grow flex items-center justify-center"><div className="animate-pulse flex flex-col items-center"><div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" /><p className="text-ink-muted">Loading trip details...</p></div></div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Trip Details</h1>
          <p className="text-ink-muted flex items-center gap-2">{schedule.source} <ArrowRight size={16} /> {schedule.destination}<span className="mx-2">•</span>{fmtDate(schedule.departure_time)}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
                  <div><Badge variant="outline" className="mb-3 bg-canvas"><ShieldCheck size={14} className="mr-1.5 text-accent" />Verified Operator</Badge><h3 className="text-xl font-semibold text-ink">Bus Information</h3><p className="text-ink-muted mt-1">Plate: {schedule.plate_number} • {schedule.total_seat} seats</p></div>
                  <div className="text-right"><p className="text-sm text-ink-muted mb-1">Duration</p><p className="font-semibold text-ink flex items-center justify-end gap-1.5"><Clock size={16} className="text-accent" />{fmtDuration(schedule.departure_time, schedule.arrival_time)}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><h4 className="font-medium text-ink flex items-center gap-2 mb-4"><MapPin size={18} className="text-accent" /> Boarding</h4><div className="pl-6 border-l-2 border-border-strong space-y-4"><div><p className="font-semibold text-ink text-lg">{fmtTime(schedule.departure_time)}</p><p className="text-ink-muted">{schedule.source} Main Terminal</p></div><div className="bg-canvas p-3 rounded-lg text-sm text-ink-muted flex items-start gap-2"><Info size={16} className="shrink-0 mt-0.5 text-accent" />Please arrive 30 minutes before departure for boarding.</div></div></div>
                  <div><h4 className="font-medium text-ink flex items-center gap-2 mb-4"><MapPin size={18} className="text-ink-muted" /> Drop-off</h4><div className="pl-6 border-l-2 border-transparent space-y-4"><div><p className="font-semibold text-ink text-lg">{fmtTime(schedule.arrival_time)}</p><p className="text-ink-muted">{schedule.destination} Central Station</p></div></div></div>
                </div>
              </CardContent>
            </Card>
            <SeatMap totalSeats={Number(schedule.total_seat)} reservedSeats={reservedSeats} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} maxSelectable={1} />
            <Card><CardContent className="p-8"><h3 className="text-lg font-semibold text-ink mb-6">Travel Policies</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="flex items-start gap-3"><CheckCircle2 size={20} className="text-success shrink-0 mt-0.5" /><div><h4 className="font-medium text-ink mb-1">Luggage Allowance</h4><p className="text-sm text-ink-muted">One large bag up to 20kg and one small carry-on per passenger.</p></div></div><div className="flex items-start gap-3"><CheckCircle2 size={20} className="text-success shrink-0 mt-0.5" /><div><h4 className="font-medium text-ink mb-1">Cancellation</h4><p className="text-sm text-ink-muted">Free cancellation before departure from your ticket page.</p></div></div></div></CardContent></Card>
          </div>
          <div className="w-full lg:w-96 flex-shrink-0"><div className="sticky top-24"><Card><CardContent className="p-6"><h3 className="text-lg font-semibold text-ink mb-6">Booking Summary</h3><div className="space-y-4 mb-6 pb-6 border-b border-border"><div className="flex justify-between text-sm"><span className="text-ink-muted">Price per seat</span><span className="font-medium text-ink">{new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(Number(schedule.price))}</span></div><div className="flex justify-between text-sm"><span className="text-ink-muted">Seats selected</span><span className="font-medium text-ink">{selectedSeats.length}</span></div>{selectedSeats.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{selectedSeats.map((seat) => <Badge key={seat} variant="outline" className="bg-canvas">Seat {seat}</Badge>)}</div>}</div><div className="flex justify-between items-end mb-8"><span className="text-ink font-medium">Total Amount</span><span className="text-2xl font-bold text-ink">{new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(totalPrice)}</span></div><Button className="w-full h-12 text-base" size="lg" disabled={selectedSeats.length === 0 || isBooking} isLoading={isBooking} onClick={handleContinue}>{selectedSeats.length === 0 ? 'Select a seat' : 'Confirm Booking'}</Button><p className="text-xs text-center text-ink-subtle mt-4">By clicking confirm, you agree to SwiftWheels travel terms.</p></CardContent></Card></div></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
