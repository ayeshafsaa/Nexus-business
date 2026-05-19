import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2, Clock } from 'lucide-react';
import { useCall } from '../../context/CallContext';

// ─── Draggable hook ───────────────────────────────────────────────────────────

const useDraggable = (initialPos: { x: number; y: number }) => {
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false);
  const offset   = useRef({ x: 0, y: 0 });
  const ref      = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const el = ref.current;
      if (!el) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const { width, height } = el.getBoundingClientRect();
      const nx = Math.min(Math.max(0, e.clientX - offset.current.x), W - width);
      const ny = Math.min(Math.max(0, e.clientY - offset.current.y), H - height);
      setPos({ x: nx, y: ny });
    };
    const onUp = (e: MouseEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      const el = ref.current;
      if (!el) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const { width, height } = el.getBoundingClientRect();
      const cx = e.clientX - offset.current.x + width / 2;
      const cy = e.clientY - offset.current.y + height / 2;
      const snapX = cx < W / 2 ? 20 : W - width - 20;
      const snapY = cy < H / 2 ? 80 : H - height - 20;
      setPos({ x: snapX, y: snapY });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return { pos, ref, onMouseDown };
};

// ─── Speaking pulse ───────────────────────────────────────────────────────────

const SpeakingRing: React.FC = () => (
  <span
    className="absolute inset-0 rounded-2xl pointer-events-none"
    style={{ boxShadow: '0 0 0 2.5px #22c55e', animation: 'pip-pulse 1.4s ease-in-out infinite' }}
  />
);

// ─── Widget inner — all hooks live here ──────────────────────────────────────

const WidgetInner: React.FC = () => {
  const {
    isMuted, isCameraOff, timer,
    toggleMute, toggleCamera, endCall, exitPiP,
    participants, chosenParticipants,
  } = useCall();

  const { pos, ref, onMouseDown } = useDraggable({
    x: typeof window !== 'undefined' ? window.innerWidth  - 280 - 20 : 100,
    y: typeof window !== 'undefined' ? window.innerHeight - 220 - 20 : 100,
  });

  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setSpeaking(v => !v), 3200);
    return () => clearInterval(id);
  }, []);

  // Use chosen participants if available, otherwise fall back to mock list
  const callPeople = chosenParticipants.length > 0 ? chosenParticipants : participants;
  const mainP      = callPeople[0];
  const totalCount = callPeople.length + 1; // +1 for self

  // Expand: just exit PiP — VideoCallPage is still mounted and will show the call
  const handleExpand = () => exitPiP();

  return (
    <>
      <style>{`
        @keyframes pip-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.02); }
        }
        @keyframes pip-fadein {
          from { opacity: 0; transform: scale(0.85) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .pip-widget { animation: pip-fadein 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div
        ref={ref}
        className="pip-widget fixed z-[9999] select-none"
        style={{ left: pos.x, top: pos.y, width: 272 }}
      >
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: '#0f1117' }}
        >
          {/* Drag handle */}
          <div
            className="absolute top-0 left-0 right-0 h-8 z-20 cursor-grab active:cursor-grabbing flex items-center justify-center"
            onMouseDown={onMouseDown}
          >
            <div className="w-8 h-1 rounded-full bg-white/20 mt-2" />
          </div>

          {speaking && <SpeakingRing />}

          {/* Video area */}
          <div className="relative w-full h-40 bg-gray-900 flex items-center justify-center overflow-hidden">
            <img
              src={mainP.avatar}
              alt={mainP.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.55) blur(0.5px)' }}
            />
            <img
              src={mainP.avatar}
              alt={mainP.name}
              className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-xl z-10"
            />

            {/* Self view */}
            <div className="absolute bottom-2 right-2 w-14 h-10 rounded-lg overflow-hidden border border-white/20 bg-gray-800 flex items-center justify-center z-10">
              {isCameraOff
                ? <VideoOff size={14} className="text-gray-400" />
                : <span className="text-white text-xs font-medium">You</span>
              }
            </div>

            {/* Top bar */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-green-400 text-xs px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                LIVE
              </span>
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                <Clock size={10} /> {timer}
              </span>
            </div>
          </div>

          {/* Info + controls */}
          <div className="px-3 py-2.5">
            <p className="text-white text-xs font-semibold truncate mb-0.5">{mainP.name}</p>
            <p className="text-gray-400 text-xs mb-2.5">
              {totalCount === 2 ? '1-on-1 call' : `Group call · ${totalCount} people`}
            </p>

            <div className="flex items-center justify-between">
              {/* Mute */}
              <button onClick={toggleMute}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-colors
                  ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
                <span className="text-[10px]">{isMuted ? 'Muted' : 'Mic'}</span>
              </button>

              {/* Camera */}
              <button onClick={toggleCamera}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-colors
                  ${isCameraOff ? 'bg-red-500/20 text-red-400' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                {isCameraOff ? <VideoOff size={15} /> : <Video size={15} />}
                <span className="text-[10px]">{isCameraOff ? 'Cam off' : 'Video'}</span>
              </button>

              {/* Expand — just exits PiP, no navigation */}
              <button onClick={handleExpand}
                className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                <Maximize2 size={15} />
                <span className="text-[10px]">Expand</span>
              </button>

              {/* End call */}
              <button onClick={endCall}
                className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors">
                <PhoneOff size={15} />
                <span className="text-[10px]">End</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Outer wrapper — safe to early-return here, no hooks before this ──────────

export const FloatingCallWidget: React.FC = () => {
  const { callStatus, isPiP } = useCall();
  if (callStatus !== 'connected' || !isPiP) return null;
  return <WidgetInner />;
};