import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCall } from '../../context/CallContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { TourTooltip } from '../tour/TourTooltip';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { callStatus, isPiP } = useCall();

  const isCallActive = callStatus === 'connected' && isPiP;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg, #faf8ff 0%, #f3f0ff 50%, #faf5ff 100%)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="min-h-screen flex flex-col m-0 p-0"
      style={{ background: 'linear-gradient(135deg, #faf8ff 0%, #f0ebff 50%, #fdf4ff 100%)' }}
    >
      {/* Tour tooltip renders on top of everything */}
      <TourTooltip />

      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isCallActive={isCallActive} />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: 'transparent' }}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};