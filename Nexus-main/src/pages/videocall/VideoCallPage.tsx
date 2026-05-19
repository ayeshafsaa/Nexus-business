import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCall, Participant } from '../../context/CallContext';
import { Avatar } from '../../components/ui/Avatar';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Phone,
  Monitor, MonitorOff, MessageCircle, Users,
  Maximize2, Minimize2, Settings, MoreVertical,
  Volume2, VolumeX, Signal, Wifi, Clock, PictureInPicture2,
  Search, UserPlus, PhoneCall, Video as VideoIcon, X, Check,
} from 'lucide-react';

// ─── All contacts ─────────────────────────────────────────────────────────────

const ALL_CONTACTS: Participant[] = [
  { id: 'p1', name: 'Michael Chen',  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', role: 'investor',      company: 'Sequoia Capital',      isMuted: false, isCameraOff: false, isOnline: true  },
  { id: 'p2', name: 'Sarah Williams', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', role: 'entrepreneur',  company: 'TechFlow Inc.',        isMuted: true,  isCameraOff: false, isOnline: true  },
  { id: 'p3', name: 'James Patel',   avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', role: 'investor',      company: 'Andreessen Horowitz',  isMuted: false, isCameraOff: false, isOnline: false },
  { id: 'p4', name: 'Aisha Kamara',  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', role: 'entrepreneur',  company: 'GreenLeap',            isMuted: false, isCameraOff: false, isOnline: true  },
  { id: 'p5', name: 'David Nguyen',  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', role: 'investor',    company: 'Y Combinator',         isMuted: false, isCameraOff: false, isOnline: false },
  { id: 'p6', name: 'Priya Sharma',  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', role: 'entrepreneur', company: 'MediAI',              isMuted: false, isCameraOff: false, isOnline: true  },
];

// ─── Stage type ───────────────────────────────────────────────────────────────
// 'selecting' → contact list
// 'precall'   → camera preview
// 'active'    → in call
// 'ended'     → call ended screen

type Stage = 'selecting' | 'precall' | 'active' | 'ended';

// ─── Contact Selection Screen ─────────────────────────────────────────────────

const ContactSelectionScreen: React.FC<{
  onStartCall: (selected: Participant[]) => void;
}> = ({ onStartCall }) => {
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter]   = useState<'all' | 'investor' | 'entrepreneur'>('all');

  const filtered = ALL_CONTACTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.role === filter;
    return matchSearch && matchFilter;
  });

  const toggle = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 3 ? [...prev, id] : prev
    );

  const selectedContacts = ALL_CONTACTS.filter(c => selected.includes(c.id));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white text-xl font-bold">New Call</h2>
          {selected.length > 0 && (
            <span className="text-xs text-primary-400 bg-primary-900/40 px-2.5 py-1 rounded-full border border-primary-700/40">
              {selected.length}/3 selected
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm">Select up to 3 people for an individual or group call</p>

        <div className="relative mt-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full bg-gray-800 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-1 focus:ring-primary-500 placeholder-gray-500 border border-gray-700"
            placeholder="Search by name or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          {(['all', 'investor', 'entrepreneur'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'}`}>
              {f === 'all' ? 'All Contacts' : f === 'investor' ? '💰 Investors' : '🚀 Entrepreneurs'}
            </button>
          ))}
        </div>
      </div>

      {/* Selected chips */}
      {selectedContacts.length > 0 && (
        <div className="px-6 py-3 flex gap-2 flex-wrap border-b border-gray-800 bg-gray-800/40">
          {selectedContacts.map(c => (
            <div key={c.id} className="flex items-center gap-1.5 bg-primary-900/50 border border-primary-700/50 text-primary-300 text-xs px-2.5 py-1.5 rounded-full">
              <img src={c.avatar} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{c.name.split(' ')[0]}</span>
              <button onClick={() => toggle(c.id)} className="text-primary-400 hover:text-white ml-0.5"><X size={11} /></button>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {filtered.some(c => c.isOnline) && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1.5">
              Online · {filtered.filter(c => c.isOnline).length}
            </p>
            {filtered.filter(c => c.isOnline).map(c => (
              <ContactRow key={c.id} contact={c} isSelected={selected.includes(c.id)}
                onToggle={() => toggle(c.id)} disabled={selected.length >= 3 && !selected.includes(c.id)} />
            ))}
          </>
        )}
        {filtered.some(c => !c.isOnline) && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1.5 mt-3">
              Offline · {filtered.filter(c => !c.isOnline).length}
            </p>
            {filtered.filter(c => !c.isOnline).map(c => (
              <ContactRow key={c.id} contact={c} isSelected={selected.includes(c.id)}
                onToggle={() => toggle(c.id)} disabled={selected.length >= 3 && !selected.includes(c.id)} />
            ))}
          </>
        )}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users size={36} className="text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No contacts found</p>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="px-6 py-4 border-t border-gray-800 bg-gray-900">
        {selected.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-1">Select at least one contact to start a call</p>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => onStartCall(selectedContacts)}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary-900/40">
              <VideoIcon size={18} />
              {selected.length === 1 ? `Video call ${selectedContacts[0].name.split(' ')[0]}` : `Group call · ${selected.length} people`}
            </button>
            <button onClick={() => onStartCall(selectedContacts)} title="Audio only"
              className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl transition-colors">
              <PhoneCall size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Contact Row ──────────────────────────────────────────────────────────────

const ContactRow: React.FC<{
  contact: Participant; isSelected: boolean; onToggle: () => void; disabled: boolean;
}> = ({ contact, isSelected, onToggle, disabled }) => (
  <button onClick={onToggle} disabled={disabled}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
      ${isSelected ? 'bg-primary-900/40 border border-primary-700/50'
        : disabled   ? 'opacity-40 cursor-not-allowed'
        : 'hover:bg-gray-800 border border-transparent'}`}>
    <div className="relative flex-shrink-0">
      <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${contact.isOnline ? 'bg-green-400' : 'bg-gray-600'}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-medium truncate">{contact.name}</p>
      <p className="text-gray-400 text-xs truncate">{contact.company}</p>
    </div>
    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0
      ${contact.role === 'investor' ? 'bg-amber-900/40 text-amber-400 border border-amber-800/40' : 'bg-blue-900/40 text-blue-400 border border-blue-800/40'}`}>
      {contact.role === 'investor' ? 'Investor' : 'Founder'}
    </span>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
      ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-600'}`}>
      {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
    </div>
  </button>
);

// ─── Chat Panel ───────────────────────────────────────────────────────────────

interface ChatMsg { sender: string; text: string; time: string; }

const ChatPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { sender: 'Michael Chen', text: 'Hi! Ready for the pitch review?', time: '10:01' },
    { sender: 'You',          text: 'Yes, just sharing my screen now.',  time: '10:02' },
  ]);
  const [input, setInput] = useState('');
  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    setMsgs(m => [...m, { sender: 'You', text: input.trim(), time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}` }]);
    setInput('');
  };
  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <span className="text-white font-semibold text-sm">In-call chat</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-lg leading-none">×</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-500 mb-1">{m.sender} · {m.time}</span>
            <div className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] ${m.sender === 'You' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-100'}`}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input className="flex-1 bg-gray-800 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-primary-500 placeholder-gray-500"
          placeholder="Send a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
        <button onClick={send} className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-xl text-sm transition-colors">Send</button>
      </div>
    </div>
  );
};

// ─── Participant Tile ─────────────────────────────────────────────────────────

const ParticipantTile: React.FC<{ participant: Participant }> = ({ participant }) => (
  <div className="relative bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center w-full h-full">
    <div className="absolute inset-0 flex items-center justify-center">
      {participant.isCameraOff ? (
        <div className="flex flex-col items-center gap-3">
          <Avatar src={participant.avatar} alt={participant.name} size="xl" />
          <span className="text-gray-400 text-sm">Camera off</span>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover opacity-60" style={{ filter: 'blur(1px) brightness(0.7)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar src={participant.avatar} alt={participant.name} size="xl" />
          </div>
        </div>
      )}
    </div>
    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black bg-opacity-50 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
      <span className="text-white text-xs font-medium">{participant.name}</span>
      {participant.isMuted && <MicOff size={11} className="text-red-400" />}
    </div>
    <div className="absolute top-3 right-3"><Signal size={14} className="text-green-400" /></div>
  </div>
);

// ─── Control Button ───────────────────────────────────────────────────────────

const CtrlBtn: React.FC<{
  icon: React.ReactNode; label: string; onClick: () => void;
  active?: boolean; danger?: boolean; small?: boolean;
}> = ({ icon, label, onClick, active = true, danger, small }) => (
  <div className="flex flex-col items-center gap-1.5">
    <button onClick={onClick} title={label}
      className={`flex items-center justify-center rounded-full transition-all duration-200 shadow-lg
        ${small ? 'w-10 h-10' : 'w-14 h-14'}
        ${danger ? 'bg-red-500 hover:bg-red-600 text-white'
          : active ? 'bg-gray-700 hover:bg-gray-600 text-white'
          : 'bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-400 ring-1 ring-red-500'}`}>
      {icon}
    </button>
    {!small && <span className="text-gray-400 text-xs">{label}</span>}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export const VideoCallPage: React.FC = () => {
  const { user } = useAuth();
  const {
    callStatus, isMuted, isCameraOff, isScreenSharing, isSpeakerOff,
    mainParticipant, timer, isPiP,
    chosenParticipants, setChosenParticipants,
    toggleMute, toggleCamera, toggleScreenShare, toggleSpeaker,
    setMainParticipant, startCall, endCall, resetCall, enterPiP, exitPiP,
  } = useCall();

  // ── Stage machine ─────────────────────────────────────────────────────────
  const [stage, setStage]           = useState<Stage>('selecting');
  const [callDuration, setCallDuration] = useState('00:00');

  // Watch callStatus to drive stage transitions
  useEffect(() => {
    if (callStatus === 'connected') setStage('active');
    if (callStatus === 'ended')     { setCallDuration(timer); setStage('ended'); }
  }, [callStatus]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Step 1: contacts chosen → store in context (so widget can read them) → precall
  const handleContactsChosen = (selected: Participant[]) => {
    setChosenParticipants(selected);
    setStage('precall');
  };

  // Rejoin: keep same contacts, reset call status to idle, go back to precall
  const handleRejoin = () => {
    resetCall();          // sets callStatus → 'idle'
    setStage('precall');  // show camera preview again with same contacts
  };

  // New Call: clear contacts, reset status, go back to contact selection
  const handleNewCall = () => {
    resetCall();
    setChosenParticipants([]);
    setStage('selecting');
  };

  // Mini button: enter PiP (widget appears, page stays mounted)
  const handleMini = () => enterPiP();

  // ── Derived values ────────────────────────────────────────────────────────
  const activeParticipants = chosenParticipants.length > 0 ? chosenParticipants : [];
  const mainP   = activeParticipants.find(p => p.id === mainParticipant) || activeParticipants[0];
  const otherPs = activeParticipants.filter(p => p.id !== mainParticipant);

  const [isFullscreen, setIsFullscreen]         = useState(false);
  const [showChat, setShowChat]                 = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showControls, setShowControls]         = useState(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (callStatus === 'connected') {
      hideTimeout.current = setTimeout(() => setShowControls(false), 4000);
    }
  };

  useEffect(() => {
    if (callStatus === 'connected') resetControlsTimer();
    else setShowControls(true);
    return () => { if (hideTimeout.current) clearTimeout(hideTimeout.current); };
  }, [callStatus]);

  if (!user) return null;

  // ── Which screen to render ────────────────────────────────────────────────
  const showSelecting = stage === 'selecting';
  const showPrecall   = stage === 'precall' && (callStatus === 'idle' || callStatus === 'calling');
  const showPiP       = stage === 'active'  && callStatus === 'connected' && isPiP;
  const showActive    = stage === 'active'  && callStatus === 'connected' && !isPiP;
  const showEnded     = stage === 'ended';

  return (
    <div
      className={`flex flex-col bg-gray-900 rounded-2xl overflow-hidden transition-all duration-300
        ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[calc(100vh-7rem)]'}`}
      onMouseMove={resetControlsTimer}
    >
      {/* ── Top bar ── */}
      <div className={`flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-800 transition-opacity duration-300
        ${showActive && !showControls ? 'opacity-0' : 'opacity-100'}`}>

        <div className="flex items-center gap-3">
          {/* Back button on precall screen */}
          {showPrecall && (
            <button onClick={() => setStage('selecting')}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors mr-1">
              <X size={15} /> Back
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${callStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white font-semibold text-sm">
              {showActive    ? 'Pitch Review Session'
               : showSelecting ? 'Select Contacts'
               : showPrecall   ? 'Ready to Join'
               : showEnded     ? 'Call Ended'
               : showPiP       ? 'Call in Progress'
               :                 'Business Nexus Video'}
            </span>
          </div>
          {callStatus === 'connected' && (
            <span className="flex items-center gap-1.5 bg-gray-800 text-green-400 text-xs px-2.5 py-1 rounded-full">
              <Clock size={11} /> {timer}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showActive && (
            <>
              <span className="flex items-center gap-1 text-gray-400 text-xs"><Wifi size={13} className="text-green-400" /> HD</span>
              <span className="text-gray-600 text-xs">{activeParticipants.length + 1} participants</span>
              <button onClick={handleMini} title="Minimize to floating widget"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded-lg text-xs font-medium transition-colors border border-primary-600/30">
                <PictureInPicture2 size={14} /> Mini
              </button>
            </>
          )}
          {showPiP && (
            <button onClick={exitPiP}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-xs font-medium transition-colors border border-green-600/30">
              <Maximize2 size={14} /> Expand
            </button>
          )}
          <button onClick={() => setIsFullscreen(f => !f)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* 1. Contact selection */}
          {showSelecting && (
            <ContactSelectionScreen onStartCall={handleContactsChosen} />
          )}

          {/* 2. Camera preview */}
          {showPrecall && (
            <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Ready to join?</h2>
                <p className="text-gray-400">Check your camera and microphone before joining</p>
              </div>
              <div className="relative w-72 h-48 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar src={user.avatarUrl} alt={user.name || 'You'} size="xl" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 rounded-lg px-2.5 py-1 text-white text-xs">You (preview)</div>
                <div className="absolute top-3 right-3"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" /></div>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {chosenParticipants.map(p => (
                  <div key={p.id} className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                    <Avatar src={p.avatar} alt={p.name} size="sm" />
                    <div>
                      <p className="text-white text-xs font-medium">{p.name}</p>
                      <p className="text-green-400 text-xs">Waiting...</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={startCall} disabled={callStatus === 'calling'}
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-green-500/30">
                <Phone size={22} />
                {callStatus === 'calling' ? 'Connecting...' : 'Join Call'}
              </button>
            </div>
          )}

          {/* 3. PiP placeholder */}
          {showPiP && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
              <div className="w-16 h-16 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                <PictureInPicture2 size={30} className="text-green-400" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">Call is minimized</h2>
                <p className="text-gray-400 text-sm flex items-center justify-center gap-2"><Clock size={13} /> Running: {timer}</p>
                <p className="text-gray-500 text-xs">The floating widget is active in the corner</p>
              </div>
              <div className="flex gap-3">
                <button onClick={exitPiP}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  <Maximize2 size={18} /> Return to Call
                </button>
                <button onClick={endCall}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  <PhoneOff size={18} /> End Call
                </button>
              </div>
            </div>
          )}

          {/* 4. Call ended */}
          {showEnded && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
              <div className="w-20 h-20 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
                <PhoneOff size={36} className="text-red-400" />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Call ended</h2>
                <p className="text-gray-400 flex items-center gap-2 justify-center">
                  <Clock size={14} /> Duration: {callDuration}
                </p>
              </div>
              <div className="flex gap-3">
                {/* Rejoin — same contacts, back to camera preview */}
                <button onClick={handleRejoin}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  <Phone size={18} /> Rejoin
                </button>
                {/* New Call — clear contacts, back to contact list */}
                <button onClick={handleNewCall}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  <UserPlus size={18} /> New Call
                </button>
              </div>
            </div>
          )}

          {/* 5. Active call */}
          {showActive && (
            <>
              <div className="flex-1 relative p-3 pb-0">
                {mainP && <ParticipantTile participant={mainP} />}

                {/* Self view */}
                <div className="absolute bottom-4 right-4 w-36 h-24 bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-600 shadow-xl">
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 relative">
                    {isCameraOff ? (
                      <div className="flex flex-col items-center gap-1">
                        <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                        <span className="text-gray-400 text-xs">Cam off</span>
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <img src={user.avatarUrl} alt="You" className="w-full h-full object-cover opacity-70" style={{ filter: 'blur(0.5px) brightness(0.8)' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-2 text-white text-xs font-medium bg-black bg-opacity-40 px-1.5 py-0.5 rounded">
                      You {isMuted && '🔇'}
                    </div>
                  </div>
                </div>

                {isScreenSharing && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary-600 text-white text-xs px-3 py-1.5 rounded-full shadow">
                    <Monitor size={12} /> Sharing your screen
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {otherPs.length > 0 && (
                <div className="flex gap-2 px-3 py-2 overflow-x-auto">
                  {otherPs.map(p => (
                    <button key={p.id} onClick={() => setMainParticipant(p.id)}
                      className="relative w-32 h-20 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-primary-500 transition-colors">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar src={p.avatar} alt={p.name} size="sm" />
                      </div>
                      <div className="absolute bottom-1 left-1.5 text-white text-xs bg-black bg-opacity-50 px-1 rounded">
                        {p.name.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Controls */}
              <div className={`flex items-center justify-center gap-4 py-4 px-6 bg-gray-900 border-t border-gray-800
                transition-opacity duration-300 ${!showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center gap-3 flex-1 justify-start">
                  <CtrlBtn icon={isSpeakerOff ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    label={isSpeakerOff ? 'Unmute spkr' : 'Speaker'} onClick={toggleSpeaker} active={!isSpeakerOff} small />
                  <CtrlBtn icon={<MoreVertical size={18} />} label="More" onClick={() => {}} small />
                </div>
                <div className="flex items-center gap-4">
                  <CtrlBtn icon={isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                    label={isMuted ? 'Unmute' : 'Mute'} onClick={toggleMute} active={!isMuted} />
                  <CtrlBtn icon={isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
                    label={isCameraOff ? 'Start video' : 'Stop video'} onClick={toggleCamera} active={!isCameraOff} />
                  <CtrlBtn icon={<PhoneOff size={24} />} label="End call" onClick={endCall} danger />
                  <CtrlBtn icon={isScreenSharing ? <MonitorOff size={22} /> : <Monitor size={22} />}
                    label={isScreenSharing ? 'Stop share' : 'Share screen'} onClick={toggleScreenShare} active={!isScreenSharing} />
                  <CtrlBtn icon={<MessageCircle size={22} />} label="Chat"
                    onClick={() => { setShowChat(v => !v); setShowParticipants(false); }} active={!showChat} />
                </div>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <CtrlBtn icon={<Users size={18} />} label="People"
                    onClick={() => { setShowParticipants(v => !v); setShowChat(false); }} small />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chat panel */}
        {showChat && showActive && (
          <div className="w-72 flex-shrink-0"><ChatPanel onClose={() => setShowChat(false)} /></div>
        )}

        {/* Participants panel */}
        {showParticipants && showActive && (
          <div className="w-64 flex-shrink-0 bg-gray-900 border-l border-gray-700 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <span className="text-white font-semibold text-sm">Participants ({activeParticipants.length + 1})</span>
              <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white text-lg">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800">
                <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                <div className="flex-1">
                  <p className="text-white text-xs font-medium">{user.name} (You)</p>
                  <p className="text-gray-500 text-xs capitalize">{user.role}</p>
                </div>
                {isMuted ? <MicOff size={13} className="text-red-400" /> : <Mic size={13} className="text-green-400" />}
              </div>
              {activeParticipants.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800">
                  <Avatar src={p.avatar} alt={p.name} size="sm" />
                  <div className="flex-1">
                    <p className="text-white text-xs font-medium">{p.name}</p>
                    <p className="text-gray-500 text-xs capitalize">{p.role}</p>
                  </div>
                  {p.isMuted ? <MicOff size={13} className="text-red-400" /> : <Mic size={13} className="text-green-400" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};