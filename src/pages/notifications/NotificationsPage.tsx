import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, UserPlus, DollarSign, ChevronRight, Check } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

// These userIds match EXACTLY the IDs in users.ts
// Messages for each of these exist in messages.ts for user e1 (Sarah, the default logged-in entrepreneur)
// If you log in as a different user, the userIds here should match people they have conversations with
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'message',
    userId: 'i1', // Michael Rodriguez — messages m1-m4 exist between e1 and i1
    user: {
      name: 'Michael Rodriguez',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    },
    content: 'sent you a message about your startup',
    time: '5 minutes ago',
    unread: true,
  },
  {
    id: 2,
    type: 'connection',
    userId: 'i2', // Jennifer Lee — messages m5-m6 exist between e1 and i2
    user: {
      name: 'Jennifer Lee',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    content: 'accepted your connection request',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 3,
    type: 'investment',
    userId: 'i3', // Robert Torres — messages m7-m8 exist between e1 and i3
    user: {
      name: 'Robert Torres',
      avatar: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg',
    },
    content: 'showed interest in investing in your startup',
    time: '1 day ago',
    unread: false,
  },
  {
    id: 4,
    type: 'message',
    userId: 'e3', // Maya Patel — messages m9-m10 exist between e1 and e3
    user: {
      name: 'Maya Patel',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    content: 'replied to your pitch deck question',
    time: '2 days ago',
    unread: false,
  },
];

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markOneRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  const handleClick = (n: typeof INITIAL_NOTIFICATIONS[0]) => {
    markOneRead(n.id);
    navigate(`/messages?userId=${n.userId}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':    return <MessageCircle size={16} className="text-primary-600" />;
      case 'connection': return <UserPlus size={16} className="text-secondary-600" />;
      case 'investment': return <DollarSign size={16} className="text-accent-600" />;
      default:           return <Bell size={16} className="text-gray-600" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'message':    return 'bg-primary-100';
      case 'connection': return 'bg-secondary-100';
      case 'investment': return 'bg-accent-100';
      default:           return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" leftIcon={<Check size={14} />} onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            onClick={() => handleClick(notification)}
            className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 group
              ${notification.unread
                ? 'bg-primary-50 border-primary-100 hover:bg-primary-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
          >
            <div className="relative flex-shrink-0">
              <Avatar src={notification.user.avatar} alt={notification.user.name} size="md" />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${getTypeBg(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">{notification.user.name}</span>
                {notification.unread && <Badge variant="primary" size="sm" rounded>New</Badge>}
              </div>
              <p className="text-gray-600 text-sm mt-0.5">{notification.content}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                {getIcon(notification.type)}
                <span>{notification.time}</span>
                <span className="text-primary-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  · Click to open chat →
                </span>
              </div>
            </div>

            <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-gray-400" />
          </div>
          <h3 className="text-gray-700 font-semibold">No notifications</h3>
          <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};