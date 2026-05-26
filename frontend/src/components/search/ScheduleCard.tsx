import React from 'react';
import { Clock, Users, Wifi, Usb, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface ScheduleCardProps { schedule: any; }

const fmtTime = (value?: string) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtDuration = (start?: string, end?: string) => {
  if (!start || !end) return 'Direct trip';
  const mins = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
};

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const source = schedule.source ?? schedule.route?.source;
  const destination = schedule.destination ?? schedule.route?.destination;
  const plateNumber = schedule.plate_number ?? schedule.bus?.plate_number;
  const price = Number(schedule.price ?? schedule.route?.price ?? 0);
  const totalSeats = Number(schedule.total_seat ?? schedule.total_seats ?? schedule.bus?.total_seat ?? 0);
  const availableSeats = Number(schedule.available_seats ?? totalSeats);
  const departureTime = fmtTime(schedule.departure_time);
  const arrivalTime = fmtTime(schedule.arrival_time);
  const duration = fmtDuration(schedule.departure_time, schedule.arrival_time);
  const isLowSeats = availableSeats <= 5;
  const isSoldOut = availableSeats === 0;

  return (
    <Card hoverable className="overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <Badge variant="outline" className="bg-canvas"><ShieldCheck size={14} className="mr-1.5 text-accent" />Verified Operator</Badge>
              <span className="text-sm font-medium text-ink-muted">Bus: {plateNumber}</span>
            </div>
            <div className="flex items-start gap-6 mb-6">
              <div className="flex flex-col items-center justify-between h-20 mt-1">
                <div className="w-3 h-3 rounded-full border-2 border-accent bg-white z-10" />
                <div className="w-0.5 h-full bg-border-strong border-dashed border-l-2 border-border-strong my-1" />
                <div className="w-3 h-3 rounded-full border-2 border-ink bg-white z-10" />
              </div>
              <div className="flex-1 space-y-6">
                <div><div className="flex items-baseline gap-3"><h3 className="text-2xl font-bold text-ink">{departureTime}</h3><span className="text-lg font-medium text-ink-muted">{source}</span></div><p className="text-sm text-ink-subtle mt-1">Main Bus Terminal</p></div>
                <div><div className="flex items-baseline gap-3"><h3 className="text-2xl font-bold text-ink">{arrivalTime}</h3><span className="text-lg font-medium text-ink-muted">{destination}</span></div><p className="text-sm text-ink-subtle mt-1">Central Station</p></div>
              </div>
              <div className="hidden sm:flex flex-col items-end text-right"><div className="flex items-center text-ink-muted text-sm mb-1"><Clock size={14} className="mr-1.5" />{duration}</div><div className="text-xs text-ink-subtle">Direct trip</div></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="text-ink-muted bg-canvas border-none"><Wifi size={12} className="mr-1.5" /> Free WiFi</Badge>
              <Badge variant="default" className="text-ink-muted bg-canvas border-none"><Usb size={12} className="mr-1.5" /> USB Charging</Badge>
              <Badge variant="default" className="text-ink-muted bg-canvas border-none"><Users size={12} className="mr-1.5" /> {totalSeats} seats</Badge>
            </div>
          </div>
          <div className="bg-canvas border-t md:border-t-0 md:border-l border-border p-6 flex flex-col justify-between md:w-64">
            <div className="text-right md:text-left mb-6 md:mb-0"><p className="text-sm text-ink-muted mb-1">Price per seat</p><h4 className="text-3xl font-bold text-ink mb-2">{new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(price)}</h4>{isSoldOut ? <Badge variant="danger" className="w-fit">Sold Out</Badge> : <p className={`text-sm font-medium ${isLowSeats ? 'text-warning' : 'text-success'}`}>{availableSeats} seats available</p>}</div>
            <Link to={`/schedule/${schedule.schedule_id}`} className={isSoldOut ? 'pointer-events-none' : ''}><Button className="w-full" size="lg" disabled={isSoldOut} variant={isSoldOut ? 'secondary' : 'primary'}>{isSoldOut ? 'Unavailable' : 'Choose Seats'}</Button></Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
