import React from 'react';
import { cn } from '../ui/Button';
import { Users } from 'lucide-react';

interface SeatMapProps {
  totalSeats: number;
  reservedSeats: Array<string | number>;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  maxSelectable?: number;
}

export function SeatMap({
  totalSeats,
  reservedSeats,
  selectedSeats,
  onSeatSelect,
  maxSelectable = 1
}: SeatMapProps) {
  const reservedSet = new Set(reservedSeats.map(String));

  const rows = Math.ceil(totalSeats / 4);

  const seatRows = Array.from({ length: rows }, (_, rowIndex) => {
    const start = rowIndex * 4 + 1;
    return [start, start + 1, 'AISLE', start + 2, start + 3];
  });

  const handleSeatClick = (seatId: string) => {
    if (reservedSet.has(seatId)) return;

    // Already selected = unselect
    if (selectedSeats.includes(seatId)) {
      onSeatSelect(seatId);
      return;
    }

    // Parent replaces old seat with new seat
    if (maxSelectable === 1) {
      onSeatSelect(seatId);
      return;
    }

    // Multiple-seat selection
    if (selectedSeats.length < maxSelectable) {
      onSeatSelect(seatId);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-8 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <h3 className="text-lg font-semibold text-ink">Select your seat</h3>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-canvas border border-border-strong" />
            <span className="text-ink-muted">Available</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent border border-accent" />
            <span className="text-ink-muted">Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-border-strong border border-border-strong opacity-50" />
            <span className="text-ink-muted">Reserved</span>
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto">
        <div className="w-full h-16 border-2 border-border rounded-t-[3rem] mb-8 relative flex items-center justify-center bg-canvas">
          <Users className="text-ink-subtle" size={24} />

          <div className="absolute right-6 top-4 w-8 h-8 border-2 border-border rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-border rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          {seatRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-between items-center">
              {row.map((seat, colIndex) => {
                if (seat === 'AISLE') {
                  return (
                    <div
                      key={`aisle-${rowIndex}`}
                      className="w-8 flex items-center justify-center text-xs text-ink-subtle font-medium"
                    >
                      {rowIndex + 1}
                    </div>
                  );
                }

                const seatNumber = Number(seat);

                if (seatNumber > totalSeats) {
                  return <div key={`empty-${rowIndex}-${colIndex}`} className="w-12 h-12" />;
                }

                const seatId = String(seatNumber);
                const isReserved = reservedSet.has(seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    type="button"
                    disabled={isReserved}
                    onClick={() => handleSeatClick(seatId)}
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 border',
                      isReserved &&
                        'bg-border-strong border-border-strong text-ink-subtle opacity-50 cursor-not-allowed',
                      !isReserved &&
                        !isSelected &&
                        'bg-canvas border-border-strong text-ink hover:border-accent hover:bg-accent-soft cursor-pointer',
                      isSelected &&
                        'bg-accent border-accent text-accent-ink shadow-md transform scale-105 cursor-pointer'
                    )}
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}