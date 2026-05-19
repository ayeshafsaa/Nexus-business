import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Banknote,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  Wallet,
  Zap,
  Shield,
  Building2,
  User,
} from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { Transaction, TransactionType, TransactionStatus } from '../../data/payments';

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

function statusBadge(status: TransactionStatus) {
  if (status === 'completed')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 size={10} /> Completed
      </span>
    );
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={10} /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
      <XCircle size={10} /> Failed
    </span>
  );
}

function typeIcon(type: TransactionType, isCredit: boolean) {
  const base = 'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0';
  if (type === 'deposit')
    return (
      <div className={`${base} bg-emerald-100`}>
        <ArrowDownLeft size={16} className="text-emerald-600" />
      </div>
    );
  if (type === 'withdraw')
    return (
      <div className={`${base} bg-rose-100`}>
        <ArrowUpRight size={16} className="text-rose-600" />
      </div>
    );
  if (type === 'funding')
    return (
      <div className={`${base} bg-violet-100`}>
        <Zap size={16} className="text-violet-600" />
      </div>
    );
  return (
    <div className={`${base} ${isCredit ? 'bg-blue-100' : 'bg-slate-100'}`}>
      <ArrowLeftRight size={16} className={isCredit ? 'text-blue-600' : 'text-slate-500'} />
    </div>
  );
}

// ─── modal ────────────────────────────────────────────────────────────────────
type ModalMode = 'deposit' | 'withdraw' | 'transfer' | 'fund' | null;

interface ActionModalProps {
  mode: ModalMode;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

const MOCK_USERS = [
  { id: 'entrepreneur1', name: 'Alex Rivera', role: 'Entrepreneur', company: 'TechVenture AI' },
  { id: 'entrepreneur2', name: 'Priya Kapoor', role: 'Entrepreneur', company: 'GreenLeap' },
  { id: 'investor2', name: 'James Patel', role: 'Investor', company: 'Peak Capital' },
];

const MOCK_DEALS = [
  { id: 'deal_001', name: 'TechVenture AI — Seed Round', entrepreneur: 'Alex Rivera', entrepreneurId: 'entrepreneur1', target: 100000 },
  { id: 'deal_002', name: 'GreenLeap — Series A', entrepreneur: 'Priya Kapoor', entrepreneurId: 'entrepreneur2', target: 250000 },
];

function ActionModal({ mode, onClose, onSuccess }: ActionModalProps) {
  const { deposit, withdraw, transfer, fundDeal, wallet } = usePayment();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0].id);
  const [selectedDeal, setSelectedDeal] = useState(MOCK_DEALS[0].id);
  const [error, setError] = useState('');

  if (!mode) return null;

  const deal = MOCK_DEALS.find(d => d.id === selectedDeal)!;
  const user = MOCK_USERS.find(u => u.id === selectedUser)!;

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Enter a valid amount'); return; }

    if (mode === 'deposit') {
      deposit(amt, note || undefined);
      onSuccess(`${fmt(amt)} deposited successfully`);
    } else if (mode === 'withdraw') {
      const ok = withdraw(amt, note || undefined);
      if (!ok) { setError('Insufficient balance'); return; }
      onSuccess(`${fmt(amt)} withdrawn successfully`);
    } else if (mode === 'transfer') {
      if (amt > wallet.balance) { setError('Insufficient balance'); return; }
      transfer(user.id, user.name, amt, note || undefined);
      onSuccess(`${fmt(amt)} sent to ${user.name}`);
    } else if (mode === 'fund') {
      if (amt > wallet.balance) { setError('Insufficient balance'); return; }
      fundDeal(deal.entrepreneurId, deal.entrepreneur, amt, deal.id, deal.name);
      onSuccess(`${fmt(amt)} funding submitted for "${deal.name}"`);
    }
  };

  const titles: Record<NonNullable<ModalMode>, string> = {
    deposit: 'Deposit Funds',
    withdraw: 'Withdraw Funds',
    transfer: 'Transfer to User',
    fund: 'Fund a Deal',
  };

  const presets = [500, 1000, 5000, 10000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-5">
          <h2 className="text-white text-lg font-semibold">{titles[mode]}</h2>
          <p className="text-violet-200 text-sm mt-0.5">
            Balance: <span className="font-bold text-white">{fmt(wallet.balance)}</span>
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* amount */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">$</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
            {/* quick presets */}
            <div className="flex gap-2 mt-2">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-500 font-medium transition-colors"
                >
                  ${p >= 1000 ? p / 1000 + 'k' : p}
                </button>
              ))}
            </div>
          </div>

          {/* user select (transfer) */}
          {mode === 'transfer' && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Send To</label>
              <div className="space-y-2">
                {MOCK_USERS.map(u => (
                  <label
                    key={u.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedUser === u.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="user"
                      value={u.id}
                      checked={selectedUser === u.id}
                      onChange={() => setSelectedUser(u.id)}
                      className="accent-violet-600"
                    />
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                      <User size={14} className="text-violet-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.role} · {u.company}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* deal select (fund) */}
          {mode === 'fund' && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Select Deal</label>
              <div className="space-y-2">
                {MOCK_DEALS.map(d => (
                  <label
                    key={d.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedDeal === d.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deal"
                      value={d.id}
                      checked={selectedDeal === d.id}
                      onChange={() => setSelectedDeal(d.id)}
                      className="accent-violet-600"
                    />
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Zap size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{d.name}</div>
                      <div className="text-xs text-slate-500">Target: {fmt(d.target)} · {d.entrepreneur}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* note */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a memo..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm">
              <XCircle size={14} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold hover:opacity-90 transition-opacity shadow-md shadow-violet-200"
            >
              Confirm
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Shield size={11} /> Secured by 256-bit encryption · Simulation only
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const { wallet } = usePayment();
  const [modal, setModal] = useState<ModalMode>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSuccess = (msg: string) => {
    setModal(null);
    showToast(msg);
  };

  // stats derived from transactions
  const totalIn = wallet.transactions
    .filter(t => ['deposit', 'funding'].includes(t.type) && t.receiverId === wallet.userId)
    .reduce((s, t) => s + t.amount, 0);

  const totalOut = wallet.transactions
    .filter(t => ['withdraw', 'transfer', 'funding'].includes(t.type) && t.senderId === wallet.userId)
    .reduce((s, t) => s + t.amount, 0);

  const pending = wallet.transactions.filter(t => t.status === 'pending').length;

  // filter
  const filtered = wallet.transactions.filter(tx => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      tx.sender.toLowerCase().includes(q) ||
      tx.receiver.toLowerCase().includes(q) ||
      tx.note?.toLowerCase().includes(q) ||
      tx.dealName?.toLowerCase().includes(q);
    const matchType = filterType === 'all' || tx.type === filterType;
    const matchStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" /> {toast}
        </div>
      )}

      {modal && <ActionModal mode={modal} onClose={() => setModal(null)} onSuccess={handleSuccess} />}

      {/* page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your wallet and transactions</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
          <Shield size={11} className="text-amber-500" />
          <span className="text-amber-700 font-medium">Simulation Mode</span>
        </div>
      </div>

      {/* wallet card + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* main wallet card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 p-6 text-white shadow-xl shadow-violet-200">
          {/* decorative rings */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/10" />
          <div className="absolute -top-5 -right-5 w-32 h-32 rounded-full border border-white/10" />
          <div className="absolute bottom-0 left-0 w-64 h-32 bg-white/5 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <Wallet size={18} className="text-violet-300" />
              <span className="text-violet-200 text-sm font-medium">Nexus Wallet</span>
              <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">USD</span>
            </div>

            <div className="mb-6">
              <div className="text-violet-200 text-sm mb-1">Available Balance</div>
              <div className="text-5xl font-bold tracking-tight">{fmt(wallet.balance)}</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-violet-300">
              <Building2 size={12} />
              <span>Nexus Financial Services · FDIC Insured (simulated)</span>
            </div>
          </div>
        </div>

        {/* quick stats */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ArrowDownLeft size={18} className="text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Total Received</div>
              <div className="text-lg font-bold text-slate-800">{fmt(totalIn)}</div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <ArrowUpRight size={18} className="text-rose-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Total Sent</div>
              <div className="text-lg font-bold text-slate-800">{fmt(totalOut)}</div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Pending</div>
              <div className="text-lg font-bold text-slate-800">{pending} transaction{pending !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { mode: 'deposit' as ModalMode, label: 'Deposit', icon: ArrowDownLeft, color: 'bg-emerald-500 hover:bg-emerald-600' },
          { mode: 'withdraw' as ModalMode, label: 'Withdraw', icon: ArrowUpRight, color: 'bg-rose-500 hover:bg-rose-600' },
          { mode: 'transfer' as ModalMode, label: 'Transfer', icon: ArrowLeftRight, color: 'bg-blue-500 hover:bg-blue-600' },
          { mode: 'fund' as ModalMode, label: 'Fund Deal', icon: Zap, color: 'bg-violet-600 hover:bg-violet-700' },
        ].map(({ mode, label, icon: Icon, color }) => (
          <button
            key={mode}
            onClick={() => setModal(mode)}
            className={`${color} text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm`}
          >
            <Icon size={17} /> {label}
          </button>
        ))}
      </div>

      {/* transactions */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* table header */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-500" />
            <h2 className="font-semibold text-slate-800">Transaction History</h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-2 md:justify-end">
            {/* search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>

            {/* type filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as any)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-600 bg-white"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
                <option value="transfer">Transfer</option>
                <option value="funding">Funding</option>
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* status filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-600 bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Banknote size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Transaction</th>
                  <th className="text-left px-4 py-3 font-medium">From → To</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(tx => {
                  const isCredit = tx.receiverId === wallet.userId;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* type + note */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {typeIcon(tx.type, isCredit)}
                          <div>
                            <div className="font-medium text-slate-800 capitalize">{tx.type}</div>
                            {(tx.dealName || tx.note) && (
                              <div className="text-xs text-slate-400 truncate max-w-[180px]">
                                {tx.dealName || tx.note}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* sender → receiver */}
                      <td className="px-4 py-3.5">
                        <div className="text-slate-700 truncate max-w-[200px]">
                          <span className="font-medium">{tx.sender}</span>
                          <span className="text-slate-400 mx-1">→</span>
                          <span className="font-medium">{tx.receiver}</span>
                        </div>
                      </td>

                      {/* amount */}
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`font-bold text-base ${
                            isCredit ? 'text-emerald-600' : 'text-slate-800'
                          }`}
                        >
                          {isCredit ? '+' : '-'}{fmt(tx.amount)}
                        </span>
                      </td>

                      {/* status */}
                      <td className="px-4 py-3.5 text-center">{statusBadge(tx.status)}</td>

                      {/* date */}
                      <td className="px-5 py-3.5 text-right text-slate-400 text-xs">
                        <div>{fmtDate(tx.timestamp)}</div>
                        <div>{fmtTime(tx.timestamp)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}