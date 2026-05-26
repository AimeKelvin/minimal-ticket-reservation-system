import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { TicketCard } from '../components/tickets/TicketCard';
import { DigitalTicket } from '../components/tickets/DigitalTicket';
import { Modal } from '../components/ui/Modal';
import { api } from '../api/client';
import { Ticket, Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
export function MyTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/tickets/my');
        // Sort by booking time descending
        const rows = res.data?.data?.tickets ?? [];
        const sorted = rows.sort((a: any, b: any) => new Date(b.reserved_at).getTime() - new Date(a.reserved_at).getTime());
        setTickets(sorted);
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);
  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    const isPast = new Date(ticket.departure_time) < new Date();
    if (filter === 'upcoming') return !isPast && ticket.status === 'reserved';
    if (filter === 'past') return isPast || ticket.status === 'cancelled';
    return true;
  });
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">My Tickets</h1>
            <p className="text-ink-muted">
              Manage your upcoming trips and view past bookings.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-border shadow-sm">
            {(['all', 'upcoming', 'past'] as const).map((f) =>
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-canvas text-ink shadow-sm border border-border-strong' : 'text-ink-muted hover:text-ink hover:bg-canvas/50'}`}>
              
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ?
          <>
              <LoadingSkeleton className="h-24 w-full" />
              <LoadingSkeleton className="h-24 w-full" />
              <LoadingSkeleton className="h-24 w-full" />
            </> :
          filteredTickets.length > 0 ?
          filteredTickets.map((ticket) =>
          <TicketCard
            key={ticket.ticket_id}
            ticket={ticket}
            onClick={() => setSelectedTicket(ticket)} />

          ) :

          <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-soft mt-8">
              <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4 text-ink-muted">
                <Ticket size={32} />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">
                No tickets found
              </h3>
              <p className="text-ink-muted mb-6 max-w-md mx-auto">
                You don't have any {filter !== 'all' ? filter : ''} tickets at
                the moment. Ready for your next journey?
              </p>
              <Button onClick={() => window.location.href = '/search'}>
                Book a Trip
              </Button>
            </div>
          }
        </div>
      </main>

      <Footer />

      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)}>
        {selectedTicket && <DigitalTicket ticket={selectedTicket} />}
      </Modal>
    </div>);

}