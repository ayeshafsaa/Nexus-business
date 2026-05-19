import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, Smile, MessageCircle, Phone, Video, Info, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCall, Participant } from '../../context/CallContext';
import { Avatar } from '../../components/ui/Avatar';
import { getConversationsForUser, getMessagesBetweenUsers, sendMessage, seedMessagesForUser } from '../../data/messages';
import { findUserById } from '../../data/users';
import { Message } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export const MessagesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── Call context ──
  const { startCallWith, startCall, callStatus } = useCall();
  const isBusy = callStatus === 'calling' || callStatus === 'connected';

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const buildConversationList = (currentUserId: string, ensureUserId?: string | null) => {
    const convs = getConversationsForUser(currentUserId);
    if (ensureUserId && ensureUserId !== currentUserId) {
      const exists = convs.some(c => c.participants.includes(ensureUserId));
      if (!exists) {
        const extraUser = findUserById(ensureUserId);
        if (extraUser) {
          convs.unshift({
            id: `conv-new-${ensureUserId}`,
            participants: [currentUserId, ensureUserId],
            lastMessage: undefined,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
    return convs;
  };

  useEffect(() => {
    if (!currentUser) return;
    seedMessagesForUser(currentUser.id);
    const paramUserId = searchParams.get('userId');
    const convs = buildConversationList(currentUser.id, paramUserId);
    setConversations(convs);
    if (paramUserId && paramUserId !== currentUser.id) {
      setSelectedUserId(paramUserId);
      setMessages(getMessagesBetweenUsers(currentUser.id, paramUserId));
    } else if (convs.length > 0) {
      const firstOther = convs[0].participants.find((id: string) => id !== currentUser.id);
      if (firstOther) {
        setSelectedUserId(firstOther);
        setMessages(getMessagesBetweenUsers(currentUser.id, firstOther));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const paramUserId = searchParams.get('userId');
    if (!paramUserId || paramUserId === currentUser.id) return;
    setSelectedUserId(paramUserId);
    setConversations(buildConversationList(currentUser.id, paramUserId));
    setMessages(getMessagesBetweenUsers(currentUser.id, paramUserId));
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedUserId) return;
    const msg = sendMessage({ senderId: currentUser.id, receiverId: selectedUserId, content: newMessage.trim() });
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setConversations(buildConversationList(currentUser.id, selectedUserId));
  };

  const handleSelectUser = (userId: string) => {
    if (!currentUser) return;
    setSelectedUserId(userId);
    setMessages(getMessagesBetweenUsers(currentUser.id, userId));
    navigate(`/messages?userId=${userId}`, { replace: true });
  };

  // ── Handle call from MessagesPage ──
  const handleCall = (audioOnly: boolean) => {
    if (!selectedUser || isBusy) return;
    const participant: Participant = {
      id: selectedUser.id,
      name: selectedUser.name,
      avatar: selectedUser.avatarUrl,
      role: selectedUser.role as 'entrepreneur' | 'investor',
      isMuted: false,
      isCameraOff: audioOnly,
      isOnline: selectedUser.isOnline ?? true,
    };
    // startCallWith sets callee name/avatar on VideoCallPage
    // startCall is fallback if context not yet updated
    if (startCallWith) {
      startCallWith(participant, audioOnly);
    } else {
      startCall();
    }
    navigate('/video-call');
  };

  if (!currentUser) return null;

  const selectedUser = selectedUserId ? findUserById(selectedUserId) : null;

  const filteredConvs = conversations.filter(conv => {
    const otherId = conv.participants.find((id: string) => id !== currentUser.id);
    if (!otherId) return false;
    const other = findUserById(otherId);
    if (!other) return false;
    return other.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-7rem)] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-fade-in">

      {/* ── LEFT: conversation list ── */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              className="bg-transparent text-sm text-gray-700 outline-none flex-1 placeholder-gray-400"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length > 0 ? (
            filteredConvs.map(conv => {
              const otherId = conv.participants.find((id: string) => id !== currentUser.id);
              if (!otherId) return null;
              const other = findUserById(otherId);
              if (!other) return null;
              const isActive = selectedUserId === otherId;
              const lastMsg = conv.lastMessage;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectUser(otherId)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-4
                    ${isActive ? 'bg-primary-50 border-primary-500' : 'hover:bg-gray-50 border-transparent'}`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar src={other.avatarUrl} alt={other.name} size="md" />
                    {other.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 truncate">{other.name}</span>
                      {lastMsg && (
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: false })}
                        </span>
                      )}
                    </div>
                    {lastMsg ? (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {lastMsg.senderId === currentUser.id ? 'You: ' : ''}{lastMsg.content}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic mt-0.5">Start a conversation</p>
                    )}
                    <p className="text-xs text-gray-400 capitalize mt-0.5">{other.role}</p>
                  </div>
                  {lastMsg && !lastMsg.isRead && lastMsg.senderId !== currentUser.id && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageCircle size={32} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: chat area ── */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header with working call buttons */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar src={selectedUser.avatarUrl} alt={selectedUser.name} size="md" />
                  {selectedUser.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">
                    {selectedUser.isOnline ? '🟢 Online' : 'Last seen recently'} · {selectedUser.role}
                  </p>
                </div>
              </div>

              {/* ── Call buttons — now working ── */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCall(true)}
                  disabled={isBusy}
                  title={isBusy ? 'Already on a call' : `Voice call ${selectedUser.name}`}
                  className={`p-2 rounded-lg transition-colors
                    ${isBusy
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                >
                  <Phone size={18} />
                </button>
                <button
                  onClick={() => handleCall(false)}
                  disabled={isBusy}
                  title={isBusy ? 'Already on a call' : `Video call ${selectedUser.name}`}
                  className={`p-2 rounded-lg transition-colors
                    ${isBusy
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'}`}
                >
                  <Video size={18} />
                </button>
                <button
                  onClick={() => navigate(`/chat/${selectedUser.id}`)}
                  title="Open full chat"
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50 space-y-3">
              {messages.length > 0 ? (
                <>
                  {messages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && <Avatar src={selectedUser.avatarUrl} alt={selectedUser.name} size="sm" />}
                        <div className="max-w-xs lg:max-w-md">
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                            ${isMe
                              ? 'bg-primary-600 text-white rounded-br-sm'
                              : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'}`}>
                            {msg.content}
                          </div>
                          <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                        {isMe && <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="sm" />}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <MessageCircle size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">No messages yet</p>
                  <p className="text-xs text-gray-400 mt-1">Say hello to {selectedUser.name}!</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <Smile size={20} />
                </button>
                <input
                  className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary-400 placeholder-gray-400"
                  placeholder={`Message ${selectedUser.name}...`}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(e as any)}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 flex items-center justify-center bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-full transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Select a conversation</h3>
            <p className="text-sm text-gray-400 mt-1">Choose someone from the left to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};