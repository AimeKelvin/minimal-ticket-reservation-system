import React, { useEffect, useState } from 'react';
import { FleetSidebar } from '../../components/layout/FleetSidebar';
import { FleetTopbar } from '../../components/layout/FleetTopbar';
import { StatsCard } from '../../components/fleet/StatsCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/Card';
import { Bus, Ticket, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Badge } from '../../components/ui/Badge';
export function FleetDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/fleet/overview');
        setStats(res.data?.data?.overview ?? {});
      } catch (error) {
        console.error('Failed to fetch fleet stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="min-h-screen flex bg-canvas">
      <FleetSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <FleetTopbar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink">Dashboard Overview</h1>
            <p className="text-ink-muted mt-1">
              Monitor your fleet's performance and daily operations.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ?
            Array(4).
            fill(0).
            map((_, i) =>
            <LoadingSkeleton key={i} className="h-32 rounded-2xl" />
            ) :

            <>
                <StatsCard
                title="Total Revenue"
                value={new Intl.NumberFormat('rw-RW', {
                  style: 'currency',
                  currency: 'RWF',
                  maximumFractionDigits: 0
                }).format(stats?.revenue || 0)}
                trend={12.5}
                icon={TrendingUp} />
              
                <StatsCard
                title="Active Schedules"
                value={stats?.active_schedules || 0}
                trend={4.2}
                icon={Ticket} />
              
              </>
            }
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle>Today's Departures</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {[
                  {
                    time: '08:00',
                    route: 'Kigali → Huye',
                    bus: 'RAD 123 A',
                    status: 'On Time',
                    occupancy: 85
                  },
                  {
                    time: '09:30',
                    route: 'Kigali → Musanze',
                    bus: 'RAD 456 B',
                    status: 'Boarding',
                    occupancy: 95
                  },
                  {
                    time: '10:00',
                    route: 'Kigali → Rubavu',
                    bus: 'RAD 789 C',
                    status: 'Scheduled',
                    occupancy: 40
                  },
                  {
                    time: '14:00',
                    route: 'Kigali → Nyagatare',
                    bus: 'RAE 222 E',
                    status: 'Scheduled',
                    occupancy: 15
                  }].
                  map((trip, i) =>
                  <div
                    key={i}
                    className="p-4 flex items-center justify-between hover:bg-canvas/50 transition-colors">
                    
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-canvas border border-border flex flex-col items-center justify-center">
                          <span className="text-xs font-semibold text-ink">
                            {trip.time}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-ink">{trip.route}</p>
                          <p className="text-sm text-ink-muted">
                            Bus: {trip.bus}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium text-ink">
                            {trip.occupancy}%
                          </p>
                          <p className="text-xs text-ink-muted">Occupancy</p>
                        </div>
                        <Badge
                        variant={
                        trip.status === 'Boarding' ? 'warning' : 'default'
                        }
                        className="w-24 justify-center">
                        
                          {trip.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>);

}