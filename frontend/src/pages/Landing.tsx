import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SearchBox } from '../components/search/SearchBox';
import { ShieldCheck, Clock, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
export function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Subtle background pattern/illustration */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse">
                  
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1" />
                  
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge
                variant="success"
                className="mb-6 px-3 py-1 text-sm bg-accent-soft text-accent-ink border-accent/20">
                
                Trusted by 50,000+ passengers
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-ink mb-6 leading-[1.1]">
                Book reliable bus trips across Rwanda
              </h1>
              <p className="text-lg text-ink-muted leading-relaxed">
                Experience premium travel with our verified operators. Instant
                digital tickets, guaranteed seats, and on-time departures.
              </p>
            </div>

            <div className="transform -translate-y-2">
              <SearchBox />
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-y border-border bg-white py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
              <div>
                <p className="text-3xl font-bold text-ink mb-1">120+</p>
                <p className="text-sm font-medium text-ink-muted uppercase tracking-wider">
                  Daily Trips
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-ink mb-1">15</p>
                <p className="text-sm font-medium text-ink-muted uppercase tracking-wider">
                  Cities Served
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-ink mb-1">50k+</p>
                <p className="text-sm font-medium text-ink-muted uppercase tracking-wider">
                  Tickets Booked
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-ink mb-1">98%</p>
                <p className="text-sm font-medium text-ink-muted uppercase tracking-wider">
                  On-time Rate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-24 bg-canvas">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-ink mb-3">
                  Popular Destinations
                </h2>
                <p className="text-ink-muted">
                  Explore our most traveled routes across the country.
                </p>
              </div>
              <Link
                to="/search"
                className="hidden md:flex items-center text-accent font-medium hover:text-accent-hover transition-colors">
                
                View all routes <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
              {
                city: 'Kigali',
                routes: 24,
                price: '3,000'
              },
              {
                city: 'Huye',
                routes: 12,
                price: '3,000'
              },
              {
                city: 'Musanze',
                routes: 18,
                price: '2,500'
              },
              {
                city: 'Rubavu',
                routes: 15,
                price: '4,000'
              },
              {
                city: 'Nyagatare',
                routes: 8,
                price: '4,500'
              },
              {
                city: 'Rusizi',
                routes: 6,
                price: '12,000'
              }].
              map((dest) =>
              <Link key={dest.city} to={`/search?destination=${dest.city}`}>
                  <Card
                  hoverable
                  className="group cursor-pointer border-transparent hover:border-border transition-all">
                  
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-ink mb-1 group-hover:text-accent transition-colors">
                          {dest.city}
                        </h3>
                        <p className="text-sm text-ink-muted">
                          {dest.routes} daily routes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-ink-subtle mb-1">From</p>
                        <p className="font-semibold text-ink">
                          RWF {dest.price}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Why SwiftWheels */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-ink mb-4">
                Why choose SwiftWheels?
              </h2>
              <p className="text-ink-muted">
                We've built a platform that prioritizes your time, comfort, and
                safety above all else.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-accent-soft rounded-2xl flex items-center justify-center mb-6 text-accent">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">
                  Verified Operators
                </h3>
                <p className="text-ink-muted leading-relaxed">
                  We only partner with licensed, highly-rated bus operators to
                  ensure a safe and comfortable journey.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-accent-soft rounded-2xl flex items-center justify-center mb-6 text-accent">
                  <Clock size={32} />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">
                  On-time Guarantee
                </h3>
                <p className="text-ink-muted leading-relaxed">
                  Real-time schedule tracking and strict departure policies mean
                  you'll never be left waiting.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-accent-soft rounded-2xl flex items-center justify-center mb-6 text-accent">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">
                  Instant Digital Tickets
                </h3>
                <p className="text-ink-muted leading-relaxed">
                  No more printing. Book in seconds and show your digital
                  boarding pass right from your phone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-canvas border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-ink mb-12 text-center">
              What our passengers say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
              {
                name: 'Sarah M.',
                role: 'Frequent Traveler',
                quote:
                'Booking a trip to Musanze used to be a hassle. Now I do it in 2 minutes on my phone. The digital ticket is a game changer.'
              },
              {
                name: 'David K.',
                role: 'Business Consultant',
                quote:
                'I rely on SwiftWheels for my weekly trips to Huye. The on-time departures and comfortable seats make working on the go easy.'
              },
              {
                name: 'Aline U.',
                role: 'Student',
                quote:
                'The interface is so clean and easy to use. I love being able to pick my exact seat before I even get to the bus park.'
              }].
              map((t, i) =>
              <Card key={i} className="bg-white">
                  <CardContent className="p-8">
                    <div className="flex text-warning mb-4">
                      {[...Array(5)].map((_, j) =>
                    <Star key={j} size={16} fill="currentColor" />
                    )}
                    </div>
                    <p className="text-ink-muted mb-6 leading-relaxed">
                      "{t.quote}"
                    </p>
                    <div>
                      <p className="font-semibold text-ink">{t.name}</p>
                      <p className="text-sm text-ink-subtle">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>);

}