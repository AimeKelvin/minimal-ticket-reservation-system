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
                
                Trusted by 5 passengers
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



      
      </main>
    </div>);

}