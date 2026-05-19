import React, { useState } from 'react';
import {
  Search, Filter, DollarSign, TrendingUp, Users, Calendar,
  X, Plus, Eye, Trash2, CheckCircle,
  Clock, AlertCircle, XCircle, Building2,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

type DealStatus = 'Due Diligence' | 'Term Sheet' | 'Negotiation' | 'Closed' | 'Passed';
type DealStage  = 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C';

interface Deal {
  id: number;
  startup: { name: string; logo: string; industry: string; };
  amount: string;
  equity: string;
  status: DealStatus;
  stage: DealStage;
  lastActivity: string;
  notes?: string;
}

const INITIAL_DEALS: Deal[] = [
  {
    id: 1,
    startup: { name: 'TechWave AI', logo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', industry: 'FinTech' },
    amount: '$1.5M', equity: '15%', status: 'Due Diligence', stage: 'Series A',
    lastActivity: '2024-02-15', notes: 'Strong traction. Reviewing financials.',
  },
  {
    id: 2,
    startup: { name: 'GreenLife Solutions', logo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', industry: 'CleanTech' },
    amount: '$2M', equity: '20%', status: 'Term Sheet', stage: 'Seed',
    lastActivity: '2024-02-10', notes: 'Term sheet sent. Awaiting founder response.',
  },
  {
    id: 3,
    startup: { name: 'HealthPulse', logo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', industry: 'HealthTech' },
    amount: '$800K', equity: '12%', status: 'Negotiation', stage: 'Pre-seed',
    lastActivity: '2024-02-05', notes: 'Negotiating equity and board seat.',
  },
  {
    id: 4,
    startup: { name: 'EduSpark', logo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', industry: 'EdTech' },
    amount: '$500K', equity: '10%', status: 'Closed', stage: 'Seed',
    lastActivity: '2024-01-20', notes: 'Deal closed. Funds transferred.',
  },
];

const STATUS_CONFIG: Record<DealStatus, { color: string; icon: React.ReactNode }> = {
  'Due Diligence': { color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: <Search size={12} /> },
  'Term Sheet':    { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Clock size={12} /> },
  'Negotiation':   { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <AlertCircle size={12} /> },
  'Closed':        { color: 'bg-green-50 text-green-700 border-green-200',    icon: <CheckCircle size={12} /> },
  'Passed':        { color: 'bg-red-50 text-red-700 border-red-200',          icon: <XCircle size={12} /> },
};

// ─── Shared overlay class (matches CalendarPage) ──────────────────────────────
const OVERLAY = 'fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30';

// ─── Add Deal Modal ───────────────────────────────────────────────────────────
const AddDealModal: React.FC<{ onClose: () => void; onAdd: (d: Omit<Deal, 'id'>) => void }> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    startupName: '', industry: '', amount: '', equity: '',
    status: 'Due Diligence' as DealStatus, stage: 'Seed' as DealStage, notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.startupName.trim()) e.startupName = 'Required';
    if (!form.industry.trim())    e.industry    = 'Required';
    if (!form.amount.trim())      e.amount      = 'Required';
    if (!form.equity.trim())      e.equity      = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd({
      startup: {
        name: form.startupName,
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.startupName)}&background=random&size=64`,
        industry: form.industry,
      },
      amount: form.amount.startsWith('$') ? form.amount : `$${form.amount}`,
      equity: form.equity.endsWith('%') ? form.equity : `${form.equity}%`,
      status: form.status, stage: form.stage,
      lastActivity: new Date().toISOString().slice(0, 10),
      notes: form.notes,
    });
    onClose();
  };

  const inputCls = (field: string) =>
    `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400
     ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  return (
    <div className={OVERLAY}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Add New Deal</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Startup Name *</label>
              <input className={inputCls('startupName')} placeholder="e.g. TechWave AI" value={form.startupName} onChange={e => set('startupName', e.target.value)} />
              {errors.startupName && <p className="text-red-500 text-xs mt-1">{errors.startupName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Industry *</label>
              <input className={inputCls('industry')} placeholder="e.g. FinTech" value={form.industry} onChange={e => set('industry', e.target.value)} />
              {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Stage</label>
              <select className={inputCls('stage')} value={form.stage} onChange={e => set('stage', e.target.value)}>
                {(['Pre-seed','Seed','Series A','Series B','Series C'] as DealStage[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Investment Amount *</label>
              <input className={inputCls('amount')} placeholder="e.g. $500K" value={form.amount} onChange={e => set('amount', e.target.value)} />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Equity % *</label>
              <input className={inputCls('equity')} placeholder="e.g. 15%" value={form.equity} onChange={e => set('equity', e.target.value)} />
              {errors.equity && <p className="text-red-500 text-xs mt-1">{errors.equity}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(STATUS_CONFIG) as DealStatus[]).map(s => (
                  <button key={s} type="button" onClick={() => set('status', s)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center
                      ${form.status === s ? STATUS_CONFIG[s].color + ' ring-2 ring-offset-1 ring-primary-400' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea className={inputCls('notes') + ' resize-none'} rows={3} placeholder="Any notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button fullWidth onClick={handleSubmit} leftIcon={<Plus size={16} />}>Add Deal</Button>
        </div>
      </div>
    </div>
  );
};

// ─── Deal Detail Modal ────────────────────────────────────────────────────────
const DealDetailModal: React.FC<{
  deal: Deal;
  onClose: () => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: DealStatus) => void;
}> = ({ deal, onClose, onDelete, onStatusChange }) => (
  <div className={OVERLAY}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar src={deal.startup.logo} alt={deal.startup.name} size="sm" />
          <div>
            <h3 className="font-bold text-gray-900">{deal.startup.name}</h3>
            <p className="text-xs text-gray-400">{deal.startup.industry} · {deal.stage}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Investment', value: deal.amount, icon: <DollarSign size={16} /> },
            { label: 'Equity',     value: deal.equity,  icon: <TrendingUp size={16} /> },
            { label: 'Stage',      value: deal.stage,   icon: <Building2 size={16} /> },
          ].map(m => (
            <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <div className="flex justify-center text-primary-600 mb-1">{m.icon}</div>
              <p className="text-xs text-gray-500">{m.label}</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{m.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Current Status</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(STATUS_CONFIG) as DealStatus[]).map(s => (
              <button key={s} onClick={() => onStatusChange(deal.id, s)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center
                  ${deal.status === s ? STATUS_CONFIG[s].color + ' ring-2 ring-offset-1 ring-primary-400' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {deal.notes && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-1">Notes</p>
            <p className="text-sm text-gray-600">{deal.notes}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar size={13} />
          Last activity: {new Date(deal.lastActivity).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
        <button onClick={() => { onDelete(deal.id); onClose(); }}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded-xl transition-colors">
          <Trash2 size={15} /> Delete Deal
        </button>
        <div className="flex-1" />
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<DealStatus[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const toggleStatus = (s: DealStatus) => setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const filteredDeals = deals.filter(d => {
    const matchSearch = searchQuery === '' || d.startup.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.startup.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(d.status);
    return matchSearch && matchStatus;
  });

  const handleAddDeal    = (nd: Omit<Deal,'id'>) => { setDeals(prev => [{ ...nd, id: Date.now() }, ...prev]); showToast('Deal added!'); };
  const handleDeleteDeal = (id: number)           => { setDeals(prev => prev.filter(d => d.id !== id)); showToast('Deal removed.'); };
  const handleStatusChange = (id: number, status: DealStatus) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    if (selectedDeal?.id === id) setSelectedDeal(prev => prev ? { ...prev, status } : prev);
    showToast(`Status → ${status}`);
  };

  const totalAmount = deals.filter(d => d.status !== 'Passed').reduce((sum, d) => {
    const n = parseFloat(d.amount.replace(/[$MK,]/g, ''));
    return sum + n * (d.amount.includes('M') ? 1_000_000 : d.amount.includes('K') ? 1_000 : 1);
  }, 0);
  const fmtTotal = totalAmount >= 1_000_000 ? `$${(totalAmount/1_000_000).toFixed(1)}M` : `$${(totalAmount/1_000).toFixed(0)}K`;

  return (
    <div className="space-y-6 animate-fade-in">

      {toast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl animate-fade-in">
          <CheckCircle size={15} className="text-green-400" /> {toast}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Deals</h1>
          <p className="text-gray-600">Track and manage your investment pipeline</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>Add Deal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Investment',    value: fmtTotal,                                                             icon: <DollarSign size={20} />, bg: 'bg-primary-100',   ic: 'text-primary-600' },
          { label: 'Active Deals',        value: deals.filter(d => d.status !== 'Closed' && d.status !== 'Passed').length, icon: <TrendingUp size={20} />, bg: 'bg-secondary-100', ic: 'text-secondary-600' },
          { label: 'Portfolio Companies', value: deals.filter(d => d.status === 'Closed').length,                      icon: <Users size={20} />,     bg: 'bg-accent-100',    ic: 'text-accent-600' },
          { label: 'Total Deals',         value: deals.length,                                                          icon: <Calendar size={20} />,  bg: 'bg-green-100',     ic: 'text-green-600' },
        ].map(s => (
          <Card key={s.label}><CardBody>
            <div className="flex items-center">
              <div className={`p-3 ${s.bg} rounded-lg mr-3`}><span className={s.ic}>{s.icon}</span></div>
              <div><p className="text-sm text-gray-600">{s.label}</p><p className="text-lg font-semibold text-gray-900">{s.value}</p></div>
            </div>
          </CardBody></Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Input placeholder="Search deals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} startAdornment={<Search size={18} />} fullWidth />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400 flex-shrink-0" />
          {(Object.keys(STATUS_CONFIG) as DealStatus[]).map(s => (
            <button key={s} onClick={() => toggleStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                ${selectedStatuses.includes(s) ? STATUS_CONFIG[s].color : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'}`}>
              {s}
            </button>
          ))}
          {selectedStatuses.length > 0 && (
            <button onClick={() => setSelectedStatuses([])} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader><h2 className="text-lg font-medium text-gray-900">Deals <span className="ml-2 text-sm text-gray-400 font-normal">({filteredDeals.length})</span></h2></CardHeader>
        <CardBody className="p-0">
          {filteredDeals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Startup','Amount','Equity','Status','Stage','Last Activity','Actions'].map(h => (
                      <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h==='Actions'?'text-right':'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDeals.map(deal => (
                    <tr key={deal.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar src={deal.startup.logo} alt={deal.startup.name} size="sm" />
                          <div><p className="text-sm font-semibold text-gray-900">{deal.startup.name}</p><p className="text-xs text-gray-400">{deal.startup.industry}</p></div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap"><p className="text-sm font-medium text-gray-900">{deal.amount}</p></td>
                      <td className="px-5 py-4 whitespace-nowrap"><p className="text-sm text-gray-700">{deal.equity}</p></td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[deal.status].color}`}>
                          {STATUS_CONFIG[deal.status].icon}{deal.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap"><p className="text-sm text-gray-700">{deal.stage}</p></td>
                      <td className="px-5 py-4 whitespace-nowrap"><p className="text-sm text-gray-400">{new Date(deal.lastActivity).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</p></td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedDeal(deal)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors">
                            <Eye size={13} /> View Details
                          </button>
                          <button onClick={() => handleDeleteDeal(deal.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><DollarSign size={24} className="text-gray-400" /></div>
              <p className="text-gray-600 font-medium">No deals found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search or add a new deal</p>
              <button onClick={() => setShowAddModal(true)} className="mt-4 flex items-center gap-2 mx-auto text-sm text-primary-600 hover:text-primary-700 font-medium">
                <Plus size={16} /> Add your first deal
              </button>
            </div>
          )}
        </CardBody>
      </Card>

      {showAddModal && <AddDealModal onClose={() => setShowAddModal(false)} onAdd={handleAddDeal} />}
      {selectedDeal && <DealDetailModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} onDelete={handleDeleteDeal} onStatusChange={handleStatusChange} />}
    </div>
  );
};