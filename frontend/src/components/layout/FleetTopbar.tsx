import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export function FleetTopbar() {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-subtle group-focus-within:text-accent transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search buses, routes, or tickets... (Press '/')"
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-canvas/50 text-sm text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white" />
          
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-ink-muted hover:text-ink transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full border border-white" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-ink leading-none mb-1">
              {user?.fullname}
            </p>
            <p className="text-xs text-ink-muted leading-none">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-canvas border border-border flex items-center justify-center">
            <User size={16} className="text-ink-muted" />
          </div>
        </div>
      </div>
    </header>);

}