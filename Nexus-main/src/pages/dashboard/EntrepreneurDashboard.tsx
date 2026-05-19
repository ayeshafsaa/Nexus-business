import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Bell, Calendar, TrendingUp, AlertCircle,
  PlusCircle, CheckCircle, XCircle, Clock, MessageCircle,
  Building2, DollarSign, MapPin, Star, Wallet, ArrowDownLeft,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = 'pending' | 'accepted' | 'rejected';

interface CollabRequest {
  id: string;
  investorId: string;
  investorName: string;
  investorAvatar: string;
  investorCompany: string;
  investorLocation: string;
  investorFocus: string[];
  ticketSize: string;
  message: string;
  date: string;
  status: RequestStatus;
  rating: number;
}

interface RecommendedInvestor {
  id: string;
  name: string;
  avatar: string;
  company: string;
  focus: string[];
  ticketSize: string;
  location: string;
  rating: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_REQUESTS: CollabRequest[] = [
  {
    id: 'req1',
    investorId: 'inv-michael-chen',
    investorName: 'Michael Chen',
    investorAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    investorCompany: 'Sequoia Capital',
    investorLocation: 'San Francisco, CA',
    investorFocus: ['SaaS', 'AI/ML', 'FinTech'],
    ticketSize: '$500K – $2M',
    message: "I've been following your startup's progress closely and I'm really impressed by your traction in the B2B SaaS space. I'd love to set up a call to explore a potential investment opportunity and learn more about your roadmap.",
    date: '2 hours ago',
    status: 'pending',
    rating: 4.8,
  },
  {
    id: 'req2',
    investorId: 'inv-sarah-williams',
    investorName: 'Sarah Williams',
    investorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    investorCompany: 'Andreessen Horowitz',
    investorLocation: 'Menlo Park, CA',
    investorFocus: ['HealthTech', 'Biotech', 'AI'],
    ticketSize: '$1M – $5M',
    message: "Your solution addresses a critical gap in the healthcare market. Our portfolio has several companies that could benefit from partnerships with you. Would love to connect and discuss potential collaboration.",
    date: 'Yesterday',
    status: 'pending',
    rating: 4.9,
  },
  {
    id: 'req3',
    investorId: 'inv-james-patel',
    investorName: 'James Patel',
    investorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    investorCompany: 'Y Combinator',
    investorLocation: 'Mountain View, CA',
    investorFocus: ['EdTech', 'Consumer', 'Marketplace'],
    ticketSize: '$250K – $1M',
    message: "We've invested in several companies in your space and have deep expertise we'd like to share. Your team's background is exceptional and we think we can add significant value beyond capital.",
    date: '3 days ago',
    status: 'accepted',
    rating: 4.7,
  },
  {
    id: 'req4',
    investorId: 'inv-aisha-kamara',
    investorName: 'Aisha Kamara',
    investorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    investorCompany: 'Tiger Global',
    investorLocation: 'New York, NY',
    investorFocus: ['E-commerce', 'Logistics', 'PropTech'],
    ticketSize: '$2M – $10M',
    message: "Your platform's growth metrics are outstanding. We're looking to lead a Series A in this space and believe you're the right team to back. Let's talk.",
    date: '5 days ago',
    status: 'rejected',
    rating: 4.5,
  },
];

const RECOMMENDED_INVESTORS: RecommendedInvestor[] = [
  {
    id: 'inv1',
    name: 'David Nguyen',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    company: 'Lightspeed Ventures',
    focus: ['SaaS', 'B2B', 'AI'],
    ticketSize: '$500K – $3M',
    location: 'San Francisco, CA',
    rating: 4.6,
  },
  {
    id: 'inv2',
    name: 'Priya Sharma',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    company: 'Accel Partners',
    focus: ['FinTech', 'SaaS', 'Consumer'],
    ticketSize: '$1M – $5M',
    location: 'Palo Alto, CA',
    rating: 4.8,
  },
  {
    id: 'inv3',
    name: 'Robert Kim',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
    company: 'Bessemer Venture',
    focus: ['Cloud', 'Security', 'DevTools'],
    ticketSize: '$2M – $8M',
    location: 'Redwood City, CA',
    rating: 4.7,
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const map = {
    pending:  { label: 'Pending',  className: 'bg-amber-100 text-amber-700 border border-amber-200' },
    accepted: { label: 'Accepted', className: 'bg-green-100 text-green-700 border border-green-200' },
    rejected: { label: 'Declined', className: 'bg-red-100  text-red-700  border border-red-200'  },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>{label}</span>
  );
};

// ─── Collaboration Request Card ───────────────────────────────────────────────

const RequestCard: React.FC<{
  request: CollabRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ request, onAccept, onReject }) => (
  <div className={`rounded-xl border p-4 transition-all ${
    request.status === 'pending'
      ? 'bg-white border-gray-200 shadow-sm'
      : request.status === 'accepted'
      ? 'bg-green-50 border-green-200'
      : 'bg-gray-50 border-gray-200 opacity-75'
  }`}>
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={request.investorAvatar}
          alt={request.investorName}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{request.investorName}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Building2 size={11} /> {request.investorCompany}
              <span className="mx-1">·</span>
              <MapPin size={11} /> {request.investorLocation}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={request.status} />
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={11} /> {request.date}
            </span>
          </div>
        </div>

        {/* Focus tags */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {request.investorFocus.map(f => (
            <span key={f} className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
          <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <DollarSign size={10} /> {request.ticketSize}
          </span>
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star size={10} fill="currentColor" /> {request.rating}
          </span>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mt-2.5 leading-relaxed line-clamp-2">
          "{request.message}"
        </p>

        {/* Actions */}
        {request.status === 'pending' && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onAccept(request.id)}
              className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <CheckCircle size={14} /> Accept
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <XCircle size={14} /> Decline
            </button>
            <Link
              to={`/messages?userId=${request.investorId}`}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium px-4 py-2 rounded-lg transition-colors ml-auto"
            >
              <MessageCircle size={14} /> Message
            </Link>
          </div>
        )}

        {request.status === 'accepted' && (
          <div className="flex gap-2 mt-3">
            <Link
              to={`/messages?userId=${request.investorId}`}
              className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <MessageCircle size={14} /> Send Message
            </Link>
            <Link
              to="/calendar"
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Calendar size={14} /> Schedule Meeting
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ─── Recommended Investor Card ────────────────────────────────────────────────

const InvestorMiniCard: React.FC<{ investor: RecommendedInvestor }> = ({ investor }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
    <img
      src={investor.avatar}
      alt={investor.name}
      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 truncate">{investor.name}</p>
      <p className="text-xs text-gray-500 truncate">{investor.company}</p>
      <div className="flex gap-1 mt-1 flex-wrap">
        {investor.focus.slice(0, 2).map(f => (
          <span key={f} className="text-xs bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full">{f}</span>
        ))}
      </div>
    </div>
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      <span className="text-xs text-amber-600 font-medium flex items-center gap-0.5">
        <Star size={10} fill="currentColor" /> {investor.rating}
      </span>
      <Link
        to="/investors"
        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
      >
        View →
      </Link>
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const { wallet } = usePayment();
  const [requests, setRequests] = useState<CollabRequest[]>(INITIAL_REQUESTS);
  const [activeFilter, setActiveFilter] = useState<'all' | RequestStatus>('all');

  if (!user) return null;

  const pendingCount  = requests.filter(r => r.status === 'pending').length;
  const acceptedCount = requests.filter(r => r.status === 'accepted').length;

  const handleAccept = (id: string) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));

  const handleReject = (id: string) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));

  const filteredRequests = activeFilter === 'all'
    ? requests
    : requests.filter(r => r.status === activeFilter);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name} 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening with your startup today</p>
        </div>
        <Link to="/investors" data-tour="find-investors-btn">
           <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
         </Link>
      </div>

     {/* Stats cards */}
     <div data-tour="dashboard-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Wallet Balance */}
        <Card data-tour="wallet-balance" className="lg:col-span-1 bg-gradient-to-br from-violet-600 to-purple-700 border-0 shadow-lg shadow-violet-200">
          <CardBody>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-violet-200 text-xs font-medium">Wallet Balance</span>
                <Wallet size={16} className="text-violet-300" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(wallet.balance)}
              </h3>
              <Link
                to="/payments"
                className="inline-flex items-center gap-1 text-violet-200 hover:text-white text-xs font-medium transition-colors"
              >
                <ArrowDownLeft size={11} /> View Payments →
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-2xl font-bold text-primary-900">{pendingCount}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-50 border border-purple-100">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users size={20} className="text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Connections</p>
                <h3 className="text-2xl font-bold text-purple-900">{acceptedCount}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-blue-50 border border-blue-100">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar size={20} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Upcoming Meetings</p>
                <h3 className="text-2xl font-bold text-blue-900">2</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-green-50 border border-green-100">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Profile Views</p>
                <h3 className="text-2xl font-bold text-green-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card data-tour="collab-requests">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Collaboration Requests</h2>
                  {pendingCount > 0 && (
                    <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {pendingCount} new
                    </span>
                  )}
                </div>

                {/* Filter pills */}
                <div className="flex gap-1.5">
                  {(['all', 'pending', 'accepted', 'rejected'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize
                        ${activeFilter === f
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {f === 'all' ? `All (${requests.length})` : f}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardBody>
              {filteredRequests.length > 0 ? (
                <div className="space-y-3">
                  {filteredRequests.map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                    <AlertCircle size={22} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No {activeFilter !== 'all' ? activeFilter : ''} requests</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {activeFilter === 'pending'
                      ? 'All caught up! No pending requests.'
                      : 'Nothing to show for this filter.'}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">

          {/* Recommended investors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Recommended Investors</h2>
                <Link to="/investors" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardBody className="space-y-1 pt-0">
              {RECOMMENDED_INVESTORS.map(investor => (
                <InvestorMiniCard key={investor.id} investor={investor} />
              ))}
            </CardBody>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardBody className="space-y-2 pt-0">
              {[
                { label: 'Update Your Profile',    icon: <Building2 size={15} />,    to: `/profile/entrepreneur/${user.id}` },
                { label: 'Browse Investors',        icon: <Users size={15} />,         to: '/investors' },
                { label: 'Schedule a Meeting',      icon: <Calendar size={15} />,      to: '/calendar' },
                { label: 'View Messages',           icon: <MessageCircle size={15} />, to: '/messages' },
              ].map(action => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-primary-50 hover:text-primary-700 text-gray-600 text-sm font-medium transition-colors border border-transparent hover:border-primary-100"
                >
                  {action.icon}
                  {action.label}
                </Link>
              ))}
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
};``