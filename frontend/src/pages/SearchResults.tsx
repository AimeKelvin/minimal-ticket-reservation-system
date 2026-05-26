import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ScheduleCard } from '../components/search/ScheduleCard';
import { FiltersSidebar } from '../components/search/FiltersSidebar';
import { ScheduleCardSkeleton } from '../components/ui/LoadingSkeleton';
import { api } from '../api/client';
import { MapPin, Calendar, ArrowRight, SearchX } from 'lucide-react';
import { Button } from '../components/ui/Button';
export function SearchResults() {
  const [searchParams] = useSearchParams();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const source = searchParams.get('source');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/search/routes', {
          params: {
            source,
            destination,
            date
          }
        });
        // Simulate network delay for premium loading feel
        setTimeout(() => {
          setSchedules(res.data?.data?.schedules ?? []);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch schedules', error);
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, [source, destination, date]);
  const formattedDate = date ?
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }) :
  'All Dates';
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      {/* Search Header */}
      <div className="bg-white border-b border-border pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-ink mb-2">
                <span>{source || 'Anywhere'}</span>
                <ArrowRight className="text-ink-muted" size={24} />
                <span>{destination || 'Anywhere'}</span>
              </div>
              <div className="flex items-center gap-4 text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span>{schedules.length} trips found</span>
                </div>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline">Modify Search</Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 hidden md:block">
            <FiltersSidebar />
          </div>

          {/* Results */}
          <div className="flex-1 space-y-6">
            {isLoading ?
            <>
                <ScheduleCardSkeleton />
                <ScheduleCardSkeleton />
                <ScheduleCardSkeleton />
              </> :
            schedules.length > 0 ?
            schedules.map((schedule) =>
            <ScheduleCard key={schedule.schedule_id} schedule={schedule} />
            ) :

            <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-soft">
                <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4 text-ink-muted">
                  <SearchX size={32} />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-2">
                  No trips found
                </h3>
                <p className="text-ink-muted mb-6 max-w-md mx-auto">
                  We couldn't find any schedules matching your search criteria.
                  Try adjusting your dates or destinations.
                </p>
                <Link to="/">
                  <Button>Search Again</Button>
                </Link>
              </div>
            }
          </div>
        </div>
      </main>

      <Footer />
    </div>);

}