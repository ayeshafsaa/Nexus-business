import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Phone, Video, Info, Smile, PhoneCall, PhoneOff, PhoneMissed } from 'lucide-react';
import { useCall, Participant, CallStatus } from '../../context/CallContext';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { useAuth } from '../../context/AuthContext';
import { Message } from '../../types';
import { findUserById } from '../../data/users';
import { getMessagesBetweenUsers, sendMessage, getConversationsForUser } from '../../data/messages';
import { MessageCircle } from 'lucide-react';
 
// ─── System event pill shown inside the chat ─────────────────────────────────
interface CallEvent {
  id: string;
  type: 'calling' | 'connected' | 'ended' | 'missed';
  audioOnly: boolean;
  duration?: string;   // only set when type === 'ended'
  timestamp: string;
}
 
const CallEventPill: React.FC<{ event: CallEvent }> = ({ event }) => {
  const icons = {
    calling:   <Phone   size={14} className="text-blue-500" />,
    connected: <PhoneCall size={14} className="text-green-500" />,
    ended:     <PhoneOff  size={14} className="text-gray-500" />,
    missed:    <PhoneMissed size={14} className="text-red-500" />,
  };
 
  const labels = {
    calling:   (ao: boolean) => ao ? '📞 Calling...' : '🎥 Video calling...',
    connected: (ao: boolean) => ao ? 'Voice call started' : 'Video call started',
    ended:     (ao: boolean, dur?: string) => `${ao ? 'Voice' : 'Video'} call ended${dur ? ` · ${dur}` : ''}`,
    missed:    (ao: boolean) => `${ao ? 'Voice' : 'Video'} call • No answer`,
  };
 
  const colors = {
    calling:   'bg-blue-50 text-blue-700 border-blue-100',
    connected: 'bg-green-50 text-green-700 border-green-100',
    ended:     'bg-gray-100 text-gray-600 border-gray-200',
    missed:    'bg-red-50 text-red-600 border-red-100',
  };
 
  return (
    <div className="flex justify-center my-2">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${colors[event.type]}`}>
        {icons[event.type]}
        {event.type === 'ended'
          ? labels.ended(event.audioOnly, event.duration)
          : labels[event.type](event.audioOnly)}
        <span className="text-[10px] opacity-60 ml-1">{event.timestamp}</span>
      </div>
    </div>
  );
};
 
export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { startCallWith, callStatus, callee, isAudioOnly, timer } = useCall();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [callEvents, setCallEvents] = useState<CallEvent[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const prevStatus = useRef<CallStatus>('idle');
  const callStartTime = useRef<Date | null>(null);
 
  const chatPartner = userId ? findUserById(userId) : null;
  const isBusy = callStatus === 'calling' || callStatus === 'connected';
 
  // ── Track call status changes and add system event pills ──────────────────
  useEffect(() => {
    const prev = prevStatus.current;
    const now = callStatus;
 
    // Only show events when this chat is the active callee conversation
    const isThisConversation = callee?.id === userId;
    if (!isThisConversation) { prevStatus.current = now; return; }
 
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
 
    if (prev === 'idle' && now === 'calling') {
      callStartTime.current = new Date();
      setCallEvents(ev => [...ev, {
        id: `evt-${Date.now()}`,
        type: 'calling',
        audioOnly: isAudioOnly,
        timestamp,
      }]);
    }
 
    if (prev === 'calling' && now === 'connected') {
      setCallEvents(ev => [...ev, {
        id: `evt-${Date.now()}`,
        type: 'connected',
        audioOnly: isAudioOnly,
        timestamp,
      }]);
    }
 
    if (prev === 'connected' && now === 'ended') {
      setCallEvents(ev => [...ev, {
        id: `evt-${Date.now()}`,
        type: 'ended',
        audioOnly: isAudioOnly,
        duration: timer,
        timestamp,
      }]);
    }
 
    if (prev === 'calling' && now === 'ended') {
      // ended before connecting = missed / cancelled
      setCallEvents(ev => [...ev, {
        id: `evt-${Date.now()}`,
        type: 'missed',
        audioOnly: isAudioOnly,
        timestamp,
      }]);
    }
 
    prevStatus.current = now;
  }, [callStatus, callee, userId, isAudioOnly, timer]);
 
  const handleCall = (audioOnly: boolean) => {
    if (!chatPartner || isBusy) return;
    const participant: Participant = {
      id: chatPartner.id,
      name: chatPartner.name,
      avatar: chatPartner.avatarUrl,
      role: chatPartner.role as 'entrepreneur' | 'investor',
      isMuted: false,
      isCameraOff: audioOnly,
      isOnline: chatPartner.isOnline ?? true,
    };
    startCallWith(participant, audioOnly);
    navigate('/video-call');
  };
  
  useEffect(() => {
    if (currentUser) {
      setConversations(getConversationsForUser(currentUser.id));
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (currentUser && userId) {
      setMessages(getMessagesBetweenUsers(currentUser.id, userId));
    }
  }, [currentUser, userId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, callEvents]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !userId) return;
    const message = sendMessage({ senderId: currentUser.id, receiverId: userId, content: newMessage });
    setMessages([...messages, message]);
    setNewMessage('');
    setConversations(getConversationsForUser(currentUser.id));
  };
  
  if (!currentUser) return null;
 
  // Merge real messages + call events, sorted by time so events appear in order
  // We use a simple approach: render messages first, then append events at the bottom
  // (since events are always "just happened", they naturally belong at the end)
  
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in">
      {/* Conversations sidebar */}
      <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200">
        <ChatUserList conversations={conversations} />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {chatPartner ? (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Avatar
                  src={chatPartner.avatarUrl}
                  alt={chatPartner.name}
                  size="md"
                  status={chatPartner.isOnline ? 'online' : 'offline'}
                  className="mr-3"
                />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{chatPartner.name}</h2>
                  <p className="text-sm text-gray-500">
                    {/* Show live call status in header when on a call with this person */}
                    {callee?.id === userId && callStatus === 'calling'  && (
                      <span className="text-blue-500 font-medium animate-pulse">
                        {isAudioOnly ? '📞 Calling...' : '🎥 Video calling...'}
                      </span>
                    )}
                    {callee?.id === userId && callStatus === 'connected' && (
                      <span className="text-green-600 font-medium">
                        🟢 On call · {timer}
                      </span>
                    )}
                    {(callee?.id !== userId || (callStatus !== 'calling' && callStatus !== 'connected')) && (
                      chatPartner.isOnline ? 'Online' : 'Last seen recently'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="rounded-full p-2"
                  aria-label="Voice call" disabled={isBusy}
                  onClick={() => handleCall(true)}
                  title={isBusy ? 'Already on a call' : `Call ${chatPartner.name}`}>
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2"
                  aria-label="Video call" disabled={isBusy}
                  onClick={() => handleCall(false)}
                  title={isBusy ? 'Already on a call' : `Video call ${chatPartner.name}`}>
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2" aria-label="Info">
                  <Info size={18} />
                </Button>
              </div>
            </div>
            
            {/* Messages + call events */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length > 0 || callEvents.length > 0 ? (
                <div className="space-y-4">
                  {messages.map(message => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isCurrentUser={message.senderId === currentUser.id}
                    />
                  ))}
                  {/* Call event pills appear after all messages */}
                  {callEvents.map(event => (
                    <CallEventPill key={event.id} event={event} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <MessageCircle size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                  <p className="text-gray-500 mt-1">Send a message to start the conversation</p>
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Button type="button" variant="ghost" size="sm" className="rounded-full p-2" aria-label="Add emoji">
                  <Smile size={20} />
                </Button>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  fullWidth
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!newMessage.trim()}
                  className="rounded-full p-2 w-10 h-10 flex items-center justify-center" aria-label="Send message">
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <MessageCircle size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-700">Select a conversation</h2>
            <p className="text-gray-500 mt-2 text-center">
              Choose a contact from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};