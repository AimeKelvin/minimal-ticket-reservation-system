import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bus,
  LayoutDashboard,
  Route,
  CalendarDays,
  Users,
  Settings,
  LogOut } from
'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../ui/Button';
export function FleetSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navItems = [
  {
    name: 'Overview',
    path: '/fleet',
    icon: LayoutDashboard
  },
  {
    name: 'Buses',
    path: '/fleet/buses',
    icon: Bus
  },
  {
    name: 'Routes',
    path: '/fleet/routes',
    icon: Route
  },
  {
    name: 'Schedules',
    path: '/fleet/schedules',
    icon: CalendarDays
  }];

  return (
    <aside className="w-64 bg-white border-r border-border h-screen flex flex-col sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link to="/fleet" className="flex items-center gap-2 group">
          <div className="bg-ink text-white p-1.5 rounded-lg">
            <Bus size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-ink">
            FleetManager
          </span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-4 px-2">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive ?
                'bg-canvas text-ink' :
                'text-ink-muted hover:text-ink hover:bg-canvas/50'
              )}>
              
              <item.icon
                size={18}
                className={isActive ? 'text-ink' : 'text-ink-subtle'} />
              
              {item.name}
            </Link>);

        })}
      </div>

      <div className="p-4 border-t border-border space-y-1">
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-ink-muted hover:text-danger hover:bg-danger-soft transition-colors">
          
          <LogOut size={18} className="text-ink-subtle" />
          Sign out
        </button>
      </div>
    </aside>);

}