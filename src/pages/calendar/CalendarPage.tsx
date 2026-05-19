import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  Users,
  Check,
  X,
  Calendar,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';

// ─── Types ──────────────────────────────────────────────────────────────────

type MeetingStatus = 'confirmed' | 'pending' | 'declined';

interface Meeting {
  id: string;
  title: string;
  date: string;       // 'YYYY-MM-DD'
  startTime: string;  // 'HH:MM'
  endTime: string;
  with: string;
  withAvatar: string;
  withRole: 'entrepreneur' | 'investor';
  type: 'video' | 'in-person';
  status: MeetingStatus;
  notes?: string;
}

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Pitch Review Session',
    date: fmt(addDays(today, 1)),
    startTime: '10:00',
    endTime: '11:00',
    with: 'Michael Chen',
    withAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    withRole: 'investor',
    type: 'video',
    status: 'confirmed',
    notes: 'Prepare slide 12 about market sizing.',
  },
  {
    id: 'm2',
    title: 'Investment Deep-Dive',
    date: fmt(addDays(today, 3)),
    startTime: '14:00',
    endTime: '15:30',
    with: 'Sarah Williams',
    withAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    withRole: 'entrepreneur',
    type: 'video',
    status: 'pending',
  },
  {
    id: 'm3',
    title: 'Startup Walkthrough',
    date: fmt(addDays(today, 5)),
    startTime: '09:30',
    endTime: '10:30',
    with: 'James Park',
    withAvatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    withRole: 'entrepreneur',
    type: 'in-person',
    status: 'confirmed',
  },
  {
    id: 'm4',
    title: 'Portfolio Check-in',
    date: fmt(today),
    startTime: '16:00',
    endTime: '16:45',
    with: 'Lisa Tan',
    withAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    withRole: 'investor',
    type: 'video',
    status: 'confirmed',
  },
];

const INITIAL_SLOTS: AvailabilitySlot[] = [
  { id: 's1', date: fmt(addDays(today, 2)), startTime: '09:00', endTime: '12:00' },
  { id: 's2', date: fmt(addDays(today, 4)), startTime: '13:00', endTime: '17:00' },
  { id: 's3', date: fmt(addDays(today, 6)), startTime: '10:00', endTime: '15:00' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function statusColor(s: MeetingStatus): 'success' | 'warning' | 'error' {
  return s === 'confirmed' ? 'success' : s === 'pending' ? 'warning' : 'error';
}

function statusLabel(s: MeetingStatus) {
  return s === 'confirmed' ? 'Confirmed' : s === 'pending' ? 'Pending' : 'Declined';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const MeetingCard: React.FC<{
  meeting: Meeting;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}> = ({ meeting, onAccept, onDecline }) => (
  <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
    <Avatar src={meeting.withAvatar} alt={meeting.with} size="sm" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm font-semibold text-gray-900 truncate">{meeting.title}</p>
        <Badge variant={statusColor(meeting.status)} size="sm" rounded>
          {statusLabel(meeting.status)}
        </Badge>
      </div>
      <p className="text-xs text-gray-500 mt-0.5">
        with <span className="text-gray-700 font-medium">{meeting.with}</span>
      </p>
      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={11} /> {meeting.startTime} – {meeting.endTime}
        </span>
        <span className="flex items-center gap-1">
          {meeting.type === 'video' ? <Video size={11} /> : <Users size={11} />}
          {meeting.type === 'video' ? 'Video call' : 'In person'}
        </span>
      </div>
      {meeting.notes && (
        <p className="text-xs text-gray-400 mt-1 italic truncate">{meeting.notes}</p>
      )}
    </div>
    {meeting.status === 'pending' && onAccept && onDecline && (
      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={() => onAccept(meeting.id)}
          className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          title="Accept"
        >
          <Check size={13} />
        </button>
        <button
          onClick={() => onDecline(meeting.id)}
          className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
          title="Decline"
        >
          <X size={13} />
        </button>
      </div>
    )}
  </div>
);

// ─── Add Meeting Modal ────────────────────────────────────────────────────────

interface AddMeetingModalProps {
  onClose: () => void;
  onAdd: (m: Omit<Meeting, 'id' | 'status'>) => void;
  initialDate: string;
}

const AddMeetingModal: React.FC<AddMeetingModalProps> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    date: 'initialDate',
    startTime: '09:00',
    endTime: '10:00',
    with: '',
    withAvatar: 'https://ui-avatars.com/api/?name=New+User&background=random',
    withRole: 'entrepreneur' as 'entrepreneur' | 'investor',
    type: 'video' as 'video' | 'in-person',
    notes: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title || !form.with) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Schedule Meeting</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Meeting title"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={form.type}
                onChange={e => set('type', e.target.value)}
              >
                <option value="video">Video call</option>
                <option value="in-person">In person</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start time</label>
              <input
                type="time"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={form.startTime}
                onChange={e => set('startTime', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End time</label>
              <input
                type="time"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={form.endTime}
                onChange={e => set('endTime', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Participant name</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Their name"
              value={form.with}
              onChange={e => set('with', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Their role</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              value={form.withRole}
              onChange={e => set('withRole', e.target.value)}
            >
              <option value="entrepreneur">Entrepreneur</option>
              <option value="investor">Investor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              rows={2}
              placeholder="Any preparation notes..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button fullWidth onClick={handleSubmit} disabled={!form.title || !form.with}>
            Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Add Availability Modal ───────────────────────────────────────────────────

interface AddSlotModalProps {
  onClose: () => void;
  onAdd: (s: Omit<AvailabilitySlot, 'id'>) => void;
  initialDate: string;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({ onClose, onAdd,initialDate }) => {
  const [form, setForm] = useState({ date: initialDate, startTime: '09:00', endTime: '17:00' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Add Availability</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
              <input
                type="time"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={form.startTime}
                onChange={e => set('startTime', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
              <input
                type="time"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={form.endTime}
                onChange={e => set('endTime', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button fullWidth onClick={() => { onAdd(form); onClose(); }}>Add Slot</Button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string>(fmt(today));
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [slots, setSlots] = useState<AvailabilitySlot[]>(INITIAL_SLOTS);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'availability'>('upcoming');

  // ── Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calDays: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // ── Meeting helpers
  const meetingsOnDay = (dateStr: string) =>
    meetings.filter(m => m.date === dateStr);

  const hasAvailabilityOnDay = (dateStr: string) =>
    slots.some(s => s.date === dateStr);

  const pendingMeetings = meetings.filter(m => m.status === 'pending');
  const upcomingMeetings = meetings
    .filter(m => m.status === 'confirmed' && m.date >= fmt(today))
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const selectedMeetings = meetingsOnDay(selectedDate).sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const handleAccept = (id: string) =>
    setMeetings(ms => ms.map(m => m.id === id ? { ...m, status: 'confirmed' } : m));

  const handleDecline = (id: string) =>
    setMeetings(ms => ms.map(m => m.id === id ? { ...m, status: 'declined' } : m));

  const handleAddMeeting = (data: Omit<Meeting, 'id' | 'status'>) => {
    setMeetings(ms => [...ms, { ...data, id: 'm' + Date.now(), status: 'confirmed' }]);
  };

  const handleAddSlot = (data: Omit<AvailabilitySlot, 'id'>) => {
    setSlots(sl => [...sl, { ...data, id: 's' + Date.now() }]);
  };

  const handleRemoveSlot = (id: string) => setSlots(sl => sl.filter(s => s.id !== id));

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Calendar</h1>
          <p className="text-gray-500 text-sm mt-0.5">Schedule, manage, and track all your meetings</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Clock size={16} />}
            onClick={() => setShowAddSlot(true)}
          >
            Set Availability
          </Button>
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setShowAddMeeting(true)}
          >
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* ── Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Meetings', value: meetings.length, color: 'bg-primary-50 border-primary-100 text-primary-700' },
          { label: 'Confirmed', value: meetings.filter(m => m.status === 'confirmed').length, color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Pending', value: pendingMeetings.length, color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
          { label: 'Available Slots', value: slots.length, color: 'bg-blue-50 border-blue-100 text-blue-700' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl border p-4 ${stat.color}`}>
            <p className="text-xs font-medium opacity-80">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Calendar widget */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  {MONTHS[month]} {year}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
                      setSelectedDate(fmt(today));
                    }}
                    className="px-3 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardBody className="pb-4">
              {/* Day labels */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((day, idx) => {
                  if (day === null) return <div key={`empty-${idx}`} />;

                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isToday = dateStr === fmt(today);
                  const isSelected = dateStr === selectedDate;
                  const dayMeetings = meetingsOnDay(dateStr);
                  const hasSlot = hasAvailabilityOnDay(dateStr);

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`relative flex flex-col items-center justify-start pt-1.5 pb-1 min-h-[52px] rounded-xl text-sm font-medium transition-all
                        ${isSelected
                          ? 'bg-primary-600 text-white shadow-md'
                          : isToday
                          ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-300'
                          : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      <span>{day}</span>

                      {/* Dots for meetings / availability */}
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                        {dayMeetings.slice(0, 2).map(m => (
                          <span
                            key={m.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected
                                ? 'bg-white opacity-80'
                                : m.status === 'confirmed'
                                ? 'bg-green-500'
                                : m.status === 'pending'
                                ? 'bg-yellow-400'
                                : 'bg-red-400'
                            }`}
                          />
                        ))}
                        {dayMeetings.length > 2 && (
                          <span className={`text-[9px] font-bold leading-none mt-0.5 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            +{dayMeetings.length - 2}
                          </span>
                        )}
                        {hasSlot && !dayMeetings.length && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white opacity-50' : 'bg-blue-400'}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Confirmed</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Pending</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Available</span>
              </div>
            </CardBody>
          </Card>

          {/* ── Selected day panel */}
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900">
                {selectedDate === fmt(today)
                  ? 'Today'
                  : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric',
                    })}
              </h2>
            </CardHeader>
            <CardBody>
              {selectedMeetings.length > 0 ? (
                <div className="space-y-3">
                  {selectedMeetings.map(m => (
                    <MeetingCard
                      key={m.id}
                      meeting={m}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Calendar size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No meetings on this day</p>
                  <button
                    onClick={() => setShowAddMeeting(true)}
                    className="mt-2 text-xs text-primary-600 hover:underline font-medium"
                  >
                    + Schedule a meeting
                  </button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* ── Right sidebar */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {(['upcoming', 'pending', 'availability'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-lg capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {tab === 'pending' && pendingMeetings.length > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-yellow-400 text-white text-[10px] font-bold rounded-full">
                    {pendingMeetings.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Card>
            <CardBody className="space-y-3 max-h-[480px] overflow-y-auto">
              {activeTab === 'upcoming' && (
                upcomingMeetings.length > 0
                  ? upcomingMeetings.map(m => (
                      <MeetingCard key={m.id} meeting={m} />
                    ))
                  : <p className="text-center text-sm text-gray-400 py-8">No upcoming meetings</p>
              )}

              {activeTab === 'pending' && (
                pendingMeetings.length > 0
                  ? pendingMeetings.map(m => (
                      <MeetingCard
                        key={m.id}
                        meeting={m}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                      />
                    ))
                  : <p className="text-center text-sm text-gray-400 py-8">No pending requests</p>
              )}

              {activeTab === 'availability' && (
                <>
                  {slots.length > 0
                    ? slots.map(slot => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 border border-blue-100 bg-blue-50 rounded-xl"
                        >
                          <div>
                            <p className="text-xs font-semibold text-blue-800">
                              {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric',
                              })}
                            </p>
                            <p className="text-xs text-blue-600 mt-0.5">
                              {slot.startTime} – {slot.endTime}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveSlot(slot.id)}
                            className="p-1.5 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))
                    : <p className="text-center text-sm text-gray-400 py-8">No availability slots set</p>
                  }
                  <button
                    onClick={() => setShowAddSlot(true)}
                    className="w-full mt-1 py-2 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                  >
                    + Add availability slot
                  </button>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ── Modals */}
      
     {showAddMeeting && (
     <AddMeetingModal
     onClose={() => setShowAddMeeting(false)}
     onAdd={handleAddMeeting}
    initialDate={selectedDate} 
  />
)}
      {showAddSlot && (
        <AddSlotModal
          onClose={() => setShowAddSlot(false)}
          onAdd={handleAddSlot}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
};