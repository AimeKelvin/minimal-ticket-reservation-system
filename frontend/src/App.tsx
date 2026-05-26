import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate } from
'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SearchResults } from './pages/SearchResults';
import { ScheduleDetails } from './pages/ScheduleDetails';
import { MyTickets } from './pages/MyTickets';
import { FleetDashboard } from './pages/fleet/FleetDashboard';
import { FleetBuses } from './pages/fleet/FleetBuses';
import { FleetRoutes } from './pages/fleet/FleetRoutes';
import { FleetSchedules } from './pages/fleet/FleetSchedules';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleGuard } from './routes/RoleGuard';
// We will import pages here as we build them
const PlaceholderPage = ({ title }: {title: string;}) =>
<div className="flex min-h-screen items-center justify-center bg-canvas text-ink">
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-ink-muted">This page is under construction.</p>
    </div>
  </div>;

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/schedule/:id" element={<ScheduleDetails />} />

          {/* Protected Customer Routes */}
          <Route
            path="/tickets"
            element={
            <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            } />
          

          {/* Fleet Manager Routes */}
          <Route
            path="/fleet"
            element={
            <RoleGuard allowedRoles={['fleetmanager']}>
                <FleetDashboard />
              </RoleGuard>
            } />
          
          <Route
            path="/fleet/buses"
            element={
            <RoleGuard allowedRoles={['fleetmanager']}>
                <FleetBuses />
              </RoleGuard>
            } />
          


          <Route
            path="/fleet/routes"
            element={
            <RoleGuard allowedRoles={['fleetmanager']}>
                <FleetRoutes />
              </RoleGuard>
            } />

          <Route
            path="/fleet/schedules"
            element={
            <RoleGuard allowedRoles={['fleetmanager']}>
                <FleetSchedules />
              </RoleGuard>
            } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster
        position="top-center"
        toastOptions={{
          className:
          '!bg-card !text-ink !border !border-border !shadow-card-hover !rounded-xl',
          duration: 4000
        }} />
      
    </AuthProvider>);

}