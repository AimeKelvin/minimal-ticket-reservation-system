import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('customer' | 'fleetmanager')[];
}
export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>);

  }
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect based on role or to home if not logged in
    if (user?.role === 'fleetmanager') return <Navigate to="/fleet" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}