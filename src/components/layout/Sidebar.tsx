import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWalkthrough } from '../../context/WalkthroughContext';
import { entrepreneurTourSteps, investorTourSteps } from '../../data/tourSteps';
import {
  Home, Building2, CircleDollarSign, Users, MessageCircle,
  Bell, FileText, Settings, HelpCircle, Calendar, Video,
  CreditCard, ShieldCheck, Map, Menu, X,
} from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  isCallActive?: boolean;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  dataTour?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, dataTour, badge, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    data-tour={dataTour}
    className={({ isActive }) =>
      `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
        isActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`
    }
  >
    <span className="relative mr-3 flex-shrink-0">
      {icon}
      {badge}
    </span>
    <span className="text-sm font-medium">{text}</span>
  </NavLink>
);

const CallActiveBadge: React.FC = () => (
  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" title="Call in progress" />
);

// ─── Inner sidebar content (shared by desktop + mobile drawer) ────────────────

const SidebarContent: React.FC<{ isCallActive: boolean; onItemClick?: () => void }> = ({
  isCallActive,
  onItemClick,
}) => {
  const { user } = useAuth();
  const { startTour } = useWalkthrough();

  if (!user) return null;

  const videoCallIcon = (
    <span className="relative">
      <Video size={20} />
      {isCallActive && <CallActiveBadge />}
    </span>
  );

  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />,            text: 'Dashboard',      dataTour: 'sidebar-dashboard' },
    { to: '/dashboard/my-startup',   icon: <Building2 size={20} />,       text: 'My Startup',     dataTour: 'sidebar-startup' },
    { to: '/investors',              icon: <CircleDollarSign size={20} />, text: 'Find Investors', dataTour: 'sidebar-investors' },
    { to: '/messages',               icon: <MessageCircle size={20} />,    text: 'Messages',       dataTour: 'sidebar-messages' },
    { to: '/notifications',          icon: <Bell size={20} />,             text: 'Notifications',  dataTour: 'sidebar-notifications' },
    { to: '/documents',              icon: <FileText size={20} />,         text: 'Documents',      dataTour: 'sidebar-documents' },
    { to: '/calendar',               icon: <Calendar size={20} />,         text: 'Calendar',       dataTour: 'sidebar-calendar' },
    { to: '/video-call',             icon: videoCallIcon,                  text: 'Video Call',     dataTour: 'sidebar-videocall' },
    { to: '/payments',               icon: <CreditCard size={20} />,       text: 'Payments',       dataTour: 'sidebar-payments' },
    { to: '/security',               icon: <ShieldCheck size={20} />,      text: 'Security',       dataTour: 'sidebar-security' },
  ];

  const investorItems = [
    { to: '/dashboard/investor',     icon: <Home size={20} />,             text: 'Dashboard',      dataTour: 'sidebar-dashboard' },
    { to: '/dashboard/my-portfolio', icon: <CircleDollarSign size={20} />, text: 'My Portfolio',   dataTour: 'sidebar-portfolio' },
    { to: '/entrepreneurs',          icon: <Users size={20} />,            text: 'Find Startups',  dataTour: 'sidebar-startups' },
    { to: '/messages',               icon: <MessageCircle size={20} />,    text: 'Messages',       dataTour: 'sidebar-messages' },
    { to: '/notifications',          icon: <Bell size={20} />,             text: 'Notifications',  dataTour: 'sidebar-notifications' },
    { to: '/deals',                  icon: <FileText size={20} />,         text: 'Deals',          dataTour: 'sidebar-deals' },
    { to: '/calendar',               icon: <Calendar size={20} />,         text: 'Calendar',       dataTour: 'sidebar-calendar' },
    { to: '/video-call',             icon: videoCallIcon,                  text: 'Video Call',     dataTour: 'sidebar-videocall' },
    { to: '/payments',               icon: <CreditCard size={20} />,       text: 'Payments',       dataTour: 'sidebar-payments' },
    { to: '/security',               icon: <ShieldCheck size={20} />,      text: 'Security',       dataTour: 'sidebar-security' },
  ];

  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />,   text: 'Settings', dataTour: 'sidebar-settings' },
    { to: '/help',     icon: <HelpCircle size={20} />, text: 'Help & Support', dataTour: 'sidebar-help' },
  ];

  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
  const tourSteps = user.role === 'entrepreneur' ? entrepreneurTourSteps : investorTourSteps;

  return (
    <div className="h-full flex flex-col" data-tour="sidebar">

      {isCallActive && (
        <div className="mx-3 mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <p className="text-xs font-medium text-red-600 truncate">Call in progress</p>
        </div>
      )}

      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              to={item.to}
              icon={item.icon}
              text={item.text}
              dataTour={item.dataTour}
              onClick={onItemClick}
            />
          ))}
        </div>

        <div className="mt-8 px-3">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h3>
          <div className="mt-2 space-y-1">
            {commonItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
                dataTour={item.dataTour}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>

        {/* Start Tour button */}
        <div className="mt-6 px-3">
          <button
            data-tour="start-tour-btn"
            onClick={() => {
              onItemClick?.();
              startTour(tourSteps);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-md bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 text-violet-700 hover:from-violet-100 hover:to-purple-100 transition-all text-sm font-medium group"
          >
            <Map size={16} className="text-violet-500 group-hover:scale-110 transition-transform" />
            <span>Start Guided Tour</span>
            <span className="ml-auto text-xs bg-violet-200 text-violet-700 px-1.5 py-0.5 rounded-full">New</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-white/60 rounded-md p-3">
          <p className="text-xs text-gray-600">Need assistance?</p>
          <h4 className="text-sm font-medium text-gray-900 mt-1">Contact Support</h4>
          <a
            href="mailto:support@businessnexus.com"
            className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
          >
            support@businessnexus.com
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export const Sidebar: React.FC<SidebarProps> = ({ isCallActive = false }) => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <div className="w-64 bg-white/60 backdrop-blur-sm h-full border-r border-gray-200 hidden md:block flex-shrink-0">
        <SidebarContent isCallActive={isCallActive} />
      </div>

      {/* ── Mobile: hamburger button (shown only on small screens) ─ */}
      <button
        className="md:hidden fixed bottom-5 left-5 z-[9990] w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-full shadow-xl flex items-center justify-center"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* backdrop */}
          <div
            className="md:hidden fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* drawer panel */}
          <div className="md:hidden fixed left-0 top-0 bottom-0 z-[9991] w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <span className="font-bold text-gray-900">Business Nexus</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent
              isCallActive={isCallActive}
              onItemClick={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}
    </>
  );
};