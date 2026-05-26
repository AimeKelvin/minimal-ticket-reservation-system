import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
export function FiltersSidebar() {
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">Filters</h3>

          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-ink mb-3">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" className="h-10" />
                <span className="text-ink-muted">-</span>
                <Input type="number" placeholder="Max" className="h-10" />
              </div>
            </div>

            {/* Departure Time */}
            <div className="border-t border-border pt-6">
              <label className="block text-sm font-medium text-ink mb-3">
                Departure Time
              </label>
              <div className="space-y-3">
                {[
                'Morning (06:00 - 11:59)',
                'Afternoon (12:00 - 17:59)',
                'Evening (18:00 - 23:59)'].
                map((time) =>
                <label
                  key={time}
                  className="flex items-center gap-3 cursor-pointer group">
                  
                    <div className="relative flex items-center justify-center w-5 h-5 border border-border-strong rounded bg-white group-hover:border-accent transition-colors">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="hidden peer-checked:block w-3 h-3 bg-accent rounded-sm" />
                    </div>
                    <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">
                      {time}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="border-t border-border pt-6">
              <label className="block text-sm font-medium text-ink mb-3">
                Amenities
              </label>
              <div className="space-y-3">
                {[
                'Free WiFi',
                'USB Charging',
                'Air Conditioning',
                'Extra Legroom'].
                map((amenity) =>
                <label
                  key={amenity}
                  className="flex items-center gap-3 cursor-pointer group">
                  
                    <div className="relative flex items-center justify-center w-5 h-5 border border-border-strong rounded bg-white group-hover:border-accent transition-colors">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="hidden peer-checked:block w-3 h-3 bg-accent rounded-sm" />
                    </div>
                    <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">
                      {amenity}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

}