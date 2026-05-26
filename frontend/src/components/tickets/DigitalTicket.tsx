import React from 'react';
import { QrCode, Bus, Clock, Calendar, User } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface DigitalTicketProps { ticket: any; }
const fmtTime = (value?: string) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtDate = (value?: string) => value ? new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtDuration = (start?: string, end?: string) => {
  if (!start || !end) return 'Direct';
  const mins = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
  return `${Math.floor(mins / 60)}h ${(mins % 60).toString().padStart(2, '0')}m`;
};

export function DigitalTicket({ ticket }: DigitalTicketProps) {
  return (
    <div className="bg-white rounded-2xl shadow-card-hover overflow-hidden border border-border max-w-md mx-auto relative">
      <div className="bg-secondary p-6 text-white flex justify-between items-start">
        <div className="flex items-center gap-2"><div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm"><Bus size={20} className="text-white" /></div><span className="text-xl font-bold tracking-tight">SwiftWheels</span></div>
        <Badge variant={ticket.status === 'reserved' ? 'success' : ticket.status === 'cancelled' ? 'danger' : 'default'} className={ticket.status === 'reserved' ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm' : ''}>{String(ticket.status).toUpperCase()}</Badge>
      </div>
      <div className="p-6 relative">
        <div className="absolute left-0 right-0 -top-3 flex justify-between px-2"><div className="w-6 h-6 bg-canvas rounded-full -ml-5 shadow-inner" /><div className="w-6 h-6 bg-canvas rounded-full -mr-5 shadow-inner" /></div>
        <div className="absolute left-6 right-6 top-0 border-t-2 border-dashed border-border" />
        <div className="flex justify-between items-center mb-8 mt-4">
          <div className="text-center"><h2 className="text-3xl font-bold text-ink mb-1">{String(ticket.source).slice(0, 3).toUpperCase()}</h2><p className="text-sm text-ink-muted">{ticket.source}</p></div>
          <div className="flex-1 px-4 flex flex-col items-center"><div className="w-full h-px bg-border-strong relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-ink-subtle"><Bus size={16} /></div></div><p className="text-xs text-ink-muted mt-2">{fmtDuration(ticket.departure_time, ticket.arrival_time)}</p></div>
          <div className="text-center"><h2 className="text-3xl font-bold text-ink mb-1">{String(ticket.destination).slice(0, 3).toUpperCase()}</h2><p className="text-sm text-ink-muted">{ticket.destination}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
          <div><p className="text-xs text-ink-subtle uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12} /> Date</p><p className="font-semibold text-ink">{fmtDate(ticket.departure_time)}</p></div>
          <div><p className="text-xs text-ink-subtle uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12} /> Departure</p><p className="font-semibold text-ink">{fmtTime(ticket.departure_time)}</p></div>
          <div><p className="text-xs text-ink-subtle uppercase tracking-wider mb-1 flex items-center gap-1"><User size={12} /> Passenger</p><p className="font-semibold text-ink truncate">{ticket.customer_name}</p></div>
          <div><p className="text-xs text-ink-subtle uppercase tracking-wider mb-1 flex items-center gap-1"><Bus size={12} /> Bus Plate</p><p className="font-semibold text-ink">{ticket.plate_number}</p></div>
        </div>
        <div className="bg-canvas rounded-xl p-4 flex items-center justify-between border border-border"><div><p className="text-xs text-ink-subtle uppercase tracking-wider mb-1">Seat</p><p className="text-3xl font-bold text-accent">{ticket.seat_number}</p></div><div className="text-right"><p className="text-xs text-ink-subtle uppercase tracking-wider mb-1">Ticket No.</p><p className="font-mono text-sm font-medium text-ink">{ticket.ticket_code ?? ticket.ticket_id}</p></div></div>
      </div>
      <div className="border-t border-dashed border-border p-6 bg-canvas flex flex-col items-center justify-center"><div className="bg-white p-3 rounded-xl border border-border shadow-sm mb-3"><QrCode size={80} className="text-ink" strokeWidth={1.5} /></div><p className="text-xs text-ink-muted text-center max-w-[200px]">Scan this code at the terminal for boarding</p></div>
    </div>
  );
}
