import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../api/client';
import { RWANDA_CITIES } from '../../api/cities';

export function SearchBox() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<string[]>(RWANDA_CITIES);
  const [source, setSource] = useState('Kigali');
  const [destination, setDestination] = useState('Musanze');
  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);

    api.get('/search/cities')
      .then((res) => {
        const apiCities = res.data?.data?.cities;
        if (Array.isArray(apiCities) && apiCities.length > 0) setCities(apiCities);
      })
      .catch(() => setCities(RWANDA_CITIES));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('source', source);
    params.append('destination', destination);
    params.append('date', date);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card-hover p-4 md:p-6 border border-border w-full max-w-5xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
        <div className="w-full md:flex-1 relative">
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2 ml-1">From</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-subtle"><MapPin size={18} /></div>
            <select value={source} onChange={(e) => setSource(e.target.value)} required className="w-full h-14 pl-11 pr-10 rounded-xl border border-border bg-canvas/50 text-ink text-base font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer">
              {cities.map((city) => <option key={`src-${city}`} value={city} disabled={city === destination}>{city}</option>)}
            </select>
          </div>
        </div>

        <div className="w-full md:flex-1 relative">
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2 ml-1">To</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-subtle"><MapPin size={18} /></div>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} required className="w-full h-14 pl-11 pr-10 rounded-xl border border-border bg-canvas/50 text-ink text-base font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer">
              {cities.map((city) => <option key={`dst-${city}`} value={city} disabled={city === source}>{city}</option>)}
            </select>
          </div>
        </div>

        <div className="w-full md:flex-1 relative">
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2 ml-1">Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-subtle"><Calendar size={18} /></div>
            <input type="date" required value={date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDate(e.target.value)} className="w-full h-14 pl-11 pr-4 rounded-xl border border-border bg-canvas/50 text-ink text-base font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer" />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full md:w-auto h-14 px-8 text-base font-semibold">
          <Search size={20} className="mr-2" /> Search
        </Button>
      </form>
    </div>
  );
}
