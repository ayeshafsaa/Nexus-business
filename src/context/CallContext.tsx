import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CallStatus = 'idle' | 'calling' | 'connected' | 'ended';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'entrepreneur' | 'investor';
  isMuted: boolean;
  isCameraOff: boolean;
  isOnline: boolean;
}

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'p1',
    name: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    role: 'investor',
    isMuted: false,
    isCameraOff: false,
    isOnline: true,
  },
  {
    id: 'p2',
    name: 'Sarah Williams',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    role: 'entrepreneur',
    isMuted: true,
    isCameraOff: false,
    isOnline: true,
  },
];

// ─── Context shape ────────────────────────────────────────────────────────────

interface CallContextValue {
  callStatus: CallStatus;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isSpeakerOff: boolean;
  mainParticipant: string;
  timer: string;
  isPiP: boolean;

  // participants = full mock list (used as fallback)
  participants: Participant[];

  // chosenParticipants = who is actually in THIS call
  // VideoCallPage writes this when user picks contacts
  // startCallWith also writes this when calling from Messages/Investors
  chosenParticipants: Participant[];
  setChosenParticipants: (p: Participant[]) => void;

  // callee = the person called from chat (for call event pills)
  callee: Participant | null;
  isAudioOnly: boolean;

  startCall: () => void;
  // Called from Messages/Investors/Entrepreneurs pages
  startCallWith: (participant: Participant, audioOnly: boolean) => void;
  endCall: () => void;
  // resetCall resets status to idle but keeps chosenParticipants
  resetCall: () => void;
  // rejoinCall = full reset
  rejoinCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  toggleSpeaker: () => void;
  setMainParticipant: (id: string) => void;
  enterPiP: () => void;
  exitPiP: () => void;
}

// ─── Timer hook ───────────────────────────────────────────────────────────────

const useCallTimer = (running: boolean) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) { setSeconds(0); return; }
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const CallContext = createContext<CallContextValue | null>(null);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callStatus, setCallStatus]           = useState<CallStatus>('idle');
  const [isMuted, setIsMuted]                 = useState(false);
  const [isCameraOff, setIsCameraOff]         = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff]       = useState(false);
  const [mainParticipant, setMainParticipant] = useState('p1');
  const [isPiP, setIsPiP]                     = useState(false);

  // Who is actually in the call — VideoCallPage and startCallWith both write this
  const [chosenParticipants, setChosenParticipants] = useState<Participant[]>([]);

  // Who we dialled from Chat/Messages (for call event pills in ChatPage)
  const [callee, setCallee]       = useState<Participant | null>(null);
  const [isAudioOnly, setIsAudioOnly] = useState(false);

  const timer = useCallTimer(callStatus === 'connected');

  // Flash tab title in PiP mode
  useEffect(() => {
    if (isPiP && callStatus === 'connected') {
      let flag = true;
      const original = document.title;
      const id = setInterval(() => {
        document.title = flag ? '📞 On Call — BusinessNexus' : original;
        flag = !flag;
      }, 1500);
      return () => { clearInterval(id); document.title = original; };
    }
  }, [isPiP, callStatus]);

  // Generic start — used by VideoCallPage pre-call screen
  const startCall = useCallback(() => {
    setCallStatus('calling');
    setTimeout(() => setCallStatus('connected'), 2000);
  }, []);

  // Called from Messages / Find Investors / Find Entrepreneurs pages
  // Sets the one person being called as the only participant
  const startCallWith = useCallback((participant: Participant, audioOnly: boolean) => {
    setCallee(participant);
    setIsAudioOnly(audioOnly);
    setIsCameraOff(audioOnly);
    // This is the key fix: set chosenParticipants to ONLY this one person
    // so VideoCallPage and FloatingCallWidget show the right person
    setChosenParticipants([participant]);
    setMainParticipant(participant.id);
    setCallStatus('calling');
    setTimeout(() => setCallStatus('connected'), 2000);
  }, []);

  const endCall = useCallback(() => {
    setCallStatus('ended');
    setIsPiP(false);
    setIsScreenSharing(false);
  }, []);

  // resetCall: keep chosenParticipants, just reset status → used by VideoCallPage rejoin
  const resetCall = useCallback(() => {
    setCallStatus('idle');
    setIsMuted(false);
    setIsCameraOff(false);
    setIsScreenSharing(false);
    setIsPiP(false);
  }, []);

  // rejoinCall: full reset including participants
  const rejoinCall = useCallback(() => {
    setCallStatus('idle');
    setIsMuted(false);
    setIsCameraOff(false);
    setIsScreenSharing(false);
    setIsPiP(false);
    setCallee(null);
    setIsAudioOnly(false);
    setChosenParticipants([]);
  }, []);

  const enterPiP = useCallback(() => setIsPiP(true), []);
  const exitPiP  = useCallback(() => setIsPiP(false), []);

  return (
    <CallContext.Provider value={{
      callStatus,
      isMuted,
      isCameraOff,
      isScreenSharing,
      isSpeakerOff,
      mainParticipant,
      timer,
      isPiP,
      participants: MOCK_PARTICIPANTS,
      chosenParticipants,
      setChosenParticipants,
      callee,
      isAudioOnly,
      startCall,
      startCallWith,
      endCall,
      resetCall,
      rejoinCall,
      toggleMute:        () => setIsMuted(v => !v),
      toggleCamera:      () => setIsCameraOff(v => !v),
      toggleScreenShare: () => setIsScreenSharing(v => !v),
      toggleSpeaker:     () => setIsSpeakerOff(v => !v),
      setMainParticipant,
      enterPiP,
      exitPiP,
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used inside <CallProvider>');
  return ctx;
};