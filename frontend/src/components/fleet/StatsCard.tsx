import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../ui/Button';
interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ElementType;
}
export function StatsCard({ title, value, trend, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-ink-muted">{title}</p>
          <div className="p-2 bg-canvas rounded-lg">
            <Icon size={18} className="text-ink-subtle" />
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <h4 className="text-2xl font-bold text-ink">{value}</h4>
          {trend !== undefined &&
          <span
            className={cn(
              'flex items-center text-xs font-medium',
              trend >= 0 ? 'text-success' : 'text-danger'
            )}>
            
              {trend >= 0 ?
            <ArrowUpRight size={14} className="mr-0.5" /> :

            <ArrowDownRight size={14} className="mr-0.5" />
            }
              {Math.abs(trend)}%
            </span>
          }
        </div>
      </CardContent>
    </Card>);

}