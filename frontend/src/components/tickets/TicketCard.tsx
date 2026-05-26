import React from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface TicketCardProps { ticket: any; onClick: () => void; }
const fmtTime = (value?: string) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtDate = (value?: string) => value ? new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—';
const fmtDuration = (start?: string, end?: string) => {
  if (!start || !end) return 'Direct';
  const mins = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
  return `${Math.floor(mins / 60)}h ${(mins % 60).toString().padStart(2, '0')}m`;
};

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <Card hoverable className="cursor-pointer group" onClick={onClick}>
      <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="bg-canvas rounded-xl p-3 text-center min-w-[86px] border border-border">
            <p className="text-xs text-ink-muted uppercase font-medium mb-1">{fmtDate(ticket.departure_time).split(',')[0]}</p>
            <p className="text-lg font-bold text-ink">{fmtTime(ticket.departure_time)}</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={ticket.status === 'reserved' ? 'success' : ticket.status === 'cancelled' ? 'danger' : 'default'} className="text-[10px] px-2 py-0">{String(ticket.status).toUpperCase()}</Badge>
              <span className="text-xs text-ink-subtle font-mono">#{ticket.ticket_code ?? ticket.ticket_id}</span>
            </div>
            <h4 className="text-base font-semibold text-ink flex items-center gap-2">{ticket.source}<ChevronRight size={14} className="text-ink-muted" />{ticket.destination}</h4>
            <p className="text-sm text-ink-muted mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><MapPin size={12} /> Seat {ticket.seat_number}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {fmtDuration(ticket.departure_time, ticket.arrival_time)}</span>
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto flex justify-end"><Button variant="ghost" className="group-hover:bg-accent-soft group-hover:text-accent transition-colors">View Ticket</Button></div>
      </CardContent>
    </Card>
  );
}
