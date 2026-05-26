import React, { useEffect, useMemo, useState } from 'react';
import { FleetSidebar } from '../../components/layout/FleetSidebar';
import { FleetTopbar } from '../../components/layout/FleetTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import toast from 'react-hot-toast';

export function FleetBuses() {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ plate_number: '', total_seat: 45, status: 'active' });

  const loadBuses = async () => {
    const res = await api.get('/fleet/buses');
    setBuses(res.data?.data?.buses ?? []);
  };
  useEffect(() => { loadBuses(); }, []);

  const filtered = useMemo(() => buses.filter((bus) => bus.plate_number.toLowerCase().includes(searchQuery.toLowerCase())), [buses, searchQuery]);
  const saveBus = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/fleet/buses', { ...form, total_seat: Number(form.total_seat) });
    toast.success('Bus created');
    setIsOpen(false);
    setForm({ plate_number: '', total_seat: 45, status: 'active' });
    await loadBuses();
  };
  const deleteBus = async (id: number) => {
    if (!confirm('Delete this bus?')) return;
    await api.delete(`/fleet/buses/${id}`);
    toast.success('Bus deleted');
    await loadBuses();
  };

  return (
    <div className="min-h-screen flex bg-canvas"><FleetSidebar /><div className="flex-1 flex flex-col min-w-0"><FleetTopbar /><main className="flex-1 p-8 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"><div><h1 className="text-2xl font-bold text-ink">Buses Management</h1><p className="text-ink-muted mt-1">Manage your fleet, track maintenance, and view assignments.</p></div><Button onClick={() => setIsOpen(true)}><Plus size={18} className="mr-2" />Add New Bus</Button></div>
      <Card><div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-t-2xl"><div className="w-full sm:w-72 relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-subtle"><Search size={16} /></div><input type="text" placeholder="Search by plate number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-canvas/50 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-colors" /></div></div>
        <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-border bg-canvas/30"><th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Plate Number</th><th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Capacity</th><th className="px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th><th className="px-6 py-4 text-right text-xs font-semibold text-ink-muted uppercase tracking-wider">Actions</th></tr></thead><tbody className="divide-y divide-border bg-white">{filtered.map((bus) => <tr key={bus.bus_id} className="hover:bg-canvas/50 transition-colors"><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-canvas border border-border flex items-center justify-center font-mono text-xs font-bold text-ink">{String(bus.plate_number).split(' ')[0]}</div><span className="font-medium text-ink">{bus.plate_number}</span></div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">{bus.total_seat} Seats</td><td className="px-6 py-4 whitespace-nowrap"><Badge variant={bus.status === 'active' ? 'success' : 'warning'} className="capitalize">{bus.status}</Badge></td><td className="px-6 py-4 whitespace-nowrap text-right"><button onClick={() => deleteBus(bus.bus_id)} className="text-ink-subtle hover:text-danger p-2 rounded-lg hover:bg-danger-soft transition-colors"><Trash2 size={18} /></button></td></tr>)}{filtered.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-ink-muted">No buses found.</td></tr>}</tbody></table></div></Card>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}><form onSubmit={saveBus} className="bg-white rounded-2xl border border-border p-6 shadow-card-hover space-y-4"><h2 className="text-xl font-semibold text-ink">Add Bus</h2><Input label="Plate number" value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} required /><Input label="Total seats" type="number" value={form.total_seat} onChange={(e) => setForm({ ...form, total_seat: Number(e.target.value) })} required min={1} max={80} /><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm"><option value="active">Active</option><option value="maintenance">Maintenance</option><option value="retired">Retired</option></select><Button type="submit" className="w-full">Save bus</Button></form></Modal>
    </main></div></div>
  );
}
