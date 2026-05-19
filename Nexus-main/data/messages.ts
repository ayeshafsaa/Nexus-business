import { Message, ChatConversation } from '../types';

export const messages: Message[] = [
  // e1 (Sarah) <-> i1 (Michael)
  { id: 'm1', senderId: 'e1', receiverId: 'i1', content: 'Thanks for connecting! I would love to discuss how TechWave AI can help with financial analytics.', timestamp: '2024-01-15T10:15:00Z', isRead: true },
  { id: 'm2', senderId: 'i1', receiverId: 'e1', content: 'Im interested in your tech stack. Are you available for a call this week?', timestamp: '2024-01-15T10:30:00Z', isRead: true },
  { id: 'm3', senderId: 'e1', receiverId: 'i1', content: 'Absolutely! How does Thursday at 2pm work?', timestamp: '2024-01-15T10:45:00Z', isRead: true },
  { id: 'm4', senderId: 'i1', receiverId: 'e1', content: 'I sent you a message about your startup — your AI platform addresses a real gap. Thursday works great!', timestamp: '2024-01-15T11:00:00Z', isRead: false },

  // e1 (Sarah) <-> i2 (Jennifer)
  { id: 'm5', senderId: 'i2', receiverId: 'e1', content: 'Hi Sarah! I accepted your connection request. Your ESG analytics angle is very interesting to me.', timestamp: '2024-01-16T09:00:00Z', isRead: false },
  { id: 'm6', senderId: 'e1', receiverId: 'i2', content: 'Thank you Jennifer! I would love to show you our sustainability reporting module.', timestamp: '2024-01-16T09:30:00Z', isRead: true },

  // e1 (Sarah) <-> i3 (Robert)
  { id: 'm7', senderId: 'i3', receiverId: 'e1', content: 'Sarah, I showed interest in investing in your startup after reviewing your deck. The healthcare analytics vertical is compelling.', timestamp: '2024-01-17T11:00:00Z', isRead: false },
  { id: 'm8', senderId: 'e1', receiverId: 'i3', content: 'Robert, that is great to hear! Let me send you our HealthTech case study.', timestamp: '2024-01-17T11:30:00Z', isRead: true },

  // e1 (Sarah) <-> e3 (Maya)
  { id: 'm9', senderId: 'e1', receiverId: 'e3', content: 'Hey Maya, how did you structure your pitch deck for the healthcare market?', timestamp: '2024-01-18T09:00:00Z', isRead: true },
  { id: 'm10', senderId: 'e3', receiverId: 'e1', content: 'I replied to your pitch deck question! Structure: problem first, solution, market size. Happy to share my template!', timestamp: '2024-01-18T09:45:00Z', isRead: false },

  // e2 (David) <-> i1 (Michael)
  { id: 'm11', senderId: 'e2', receiverId: 'i1', content: 'Hi Michael, our sustainable packaging has a strong B2B SaaS angle.', timestamp: '2024-01-19T10:00:00Z', isRead: true },
  { id: 'm12', senderId: 'i1', receiverId: 'e2', content: 'Tell me more about the SaaS revenue model David.', timestamp: '2024-01-19T10:30:00Z', isRead: false },

  // e2 (David) <-> i2 (Jennifer)
  { id: 'm13', senderId: 'i2', receiverId: 'e2', content: 'David, GreenLife is exactly the kind of CleanTech I invest in. Can we set up a call?', timestamp: '2024-01-20T14:00:00Z', isRead: true },
  { id: 'm14', senderId: 'e2', receiverId: 'i2', content: 'Jennifer, I would love that! Free Tuesday or Wednesday next week.', timestamp: '2024-01-20T14:30:00Z', isRead: false },

  // e2 (David) <-> i3 (Robert)
  { id: 'm15', senderId: 'e2', receiverId: 'i3', content: 'Hello Robert, our biodegradable materials have medical supply applications.', timestamp: '2024-01-21T14:00:00Z', isRead: true },
  { id: 'm16', senderId: 'i3', receiverId: 'e2', content: 'Interesting crossover David. Id love to learn more.', timestamp: '2024-01-21T15:30:00Z', isRead: false },

  // e3 (Maya) <-> i1 (Michael)
  { id: 'm17', senderId: 'e3', receiverId: 'i1', content: 'Hi Michael, HealthPulse uses a subscription model similar to SaaS.', timestamp: '2024-01-22T09:00:00Z', isRead: true },
  { id: 'm18', senderId: 'i1', receiverId: 'e3', content: 'Recurring revenue in HealthTech is very compelling Maya. Lets schedule a deep dive.', timestamp: '2024-01-22T09:30:00Z', isRead: false },

  // e3 (Maya) <-> i2 (Jennifer)
  { id: 'm19', senderId: 'i2', receiverId: 'e3', content: 'Maya, your mental healthcare platform is exactly what underserved communities need.', timestamp: '2024-01-22T11:00:00Z', isRead: true },
  { id: 'm20', senderId: 'e3', receiverId: 'i2', content: 'Thank you Jennifer! We have strong user acquisition data to share.', timestamp: '2024-01-22T11:30:00Z', isRead: false },

  // e3 (Maya) <-> i3 (Robert)
  { id: 'm21', senderId: 'i3', receiverId: 'e3', content: 'Maya, HealthPulse aligns with my portfolio. Tell me about your clinical partnerships.', timestamp: '2024-01-23T11:00:00Z', isRead: true },
  { id: 'm22', senderId: 'e3', receiverId: 'i3', content: 'We have two hospital pilots underway Robert! Happy to share outcomes data.', timestamp: '2024-01-23T11:30:00Z', isRead: false },

  // e4 (James) <-> i1 (Michael)
  { id: 'm23', senderId: 'e4', receiverId: 'i1', content: 'Hi Michael, UrbanFarm uses a SaaS model for our IoT farm management platform.', timestamp: '2024-01-24T09:00:00Z', isRead: true },
  { id: 'm24', senderId: 'i1', receiverId: 'e4', content: 'AgTech SaaS is interesting James. What does your MRR look like?', timestamp: '2024-01-24T09:30:00Z', isRead: false },

  // e4 (James) <-> i2 (Jennifer)
  { id: 'm25', senderId: 'i2', receiverId: 'e4', content: 'James, vertical farming for food security is exactly what I invest in!', timestamp: '2024-01-25T11:00:00Z', isRead: true },
  { id: 'm26', senderId: 'e4', receiverId: 'i2', content: 'Sending the deck now Jennifer. 3 pilot farms running in Chicago with great data.', timestamp: '2024-01-25T11:30:00Z', isRead: false },

  // e4 (James) <-> i3 (Robert)
  { id: 'm27', senderId: 'e4', receiverId: 'i3', content: 'Hi Robert, our vertical farms use medical-grade filtration systems.', timestamp: '2024-01-26T14:00:00Z', isRead: true },
  { id: 'm28', senderId: 'i3', receiverId: 'e4', content: 'That is a novel angle James. Tell me more about the medical applications.', timestamp: '2024-01-26T14:30:00Z', isRead: false },
];

export const getMessagesBetweenUsers = (user1Id: string, user2Id: string): Message[] => {
  return messages.filter(
    m => (m.senderId === user1Id && m.receiverId === user2Id) ||
         (m.senderId === user2Id && m.receiverId === user1Id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const getConversationsForUser = (userId: string): ChatConversation[] => {
  const partners = new Set<string>();
  messages.forEach(m => {
    if (m.senderId === userId) partners.add(m.receiverId);
    if (m.receiverId === userId) partners.add(m.senderId);
  });

  return Array.from(partners).map(partnerId => {
    const convMsgs = getMessagesBetweenUsers(userId, partnerId);
    const lastMessage = convMsgs[convMsgs.length - 1];
    return {
      id: `conv-${userId}-${partnerId}`,
      participants: [userId, partnerId],
      lastMessage,
      updatedAt: lastMessage?.timestamp || new Date().toISOString()
    };
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const sendMessage = (newMsg: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Message => {
  const message: Message = {
    ...newMsg,
    id: `m${messages.length + 1}`,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  messages.push(message);
  return message;
};
// Seeds starter messages for any new user so their inbox is never empty
export const seedMessagesForUser = (userId: string): void => {
  const alreadyHasMessages = messages.some(
    m => m.senderId === userId || m.receiverId === userId
  );
  if (alreadyHasMessages) return; // already seeded, skip

  const now = new Date();
  const ago = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

  // Seed conversations with the 4 notification users so inbox matches notifications
  const seeded: Message[] = [
    // With i1 (Michael Rodriguez)
    { id: `seed-${userId}-1`, senderId: 'i1', receiverId: userId, content: 'Hi! I reviewed your startup profile and I think there is a strong fit with my portfolio. Would love to connect.', timestamp: ago(300), isRead: false },
    { id: `seed-${userId}-2`, senderId: userId, receiverId: 'i1', content: 'Thank you Michael! I would love to discuss further. When are you available for a call?', timestamp: ago(290), isRead: true },
    { id: `seed-${userId}-3`, senderId: 'i1', receiverId: userId, content: 'I sent you a message about your startup — your platform addresses a real gap in the market.', timestamp: ago(5), isRead: false },

    // With i2 (Jennifer Lee)
    { id: `seed-${userId}-4`, senderId: 'i2', receiverId: userId, content: 'Hi! I accepted your connection request. Your startup angle is very interesting to me.', timestamp: ago(130), isRead: false },
    { id: `seed-${userId}-5`, senderId: userId, receiverId: 'i2', content: 'Thank you Jennifer! I would love to show you what we have built so far.', timestamp: ago(120), isRead: true },

    // With i3 (Robert Torres)
    { id: `seed-${userId}-6`, senderId: 'i3', receiverId: userId, content: 'I showed interest in investing in your startup after reviewing your deck. The concept is compelling.', timestamp: ago(1500), isRead: true },
    { id: `seed-${userId}-7`, senderId: userId, receiverId: 'i3', content: 'Robert, that is great to hear! Let me send you our business plan.', timestamp: ago(1480), isRead: true },

    // With e3 (Maya Patel)
    { id: `seed-${userId}-8`, senderId: userId, receiverId: 'e3', content: 'Hey Maya, how did you structure your pitch deck for your market?', timestamp: ago(2900), isRead: true },
    { id: `seed-${userId}-9`, senderId: 'e3', receiverId: userId, content: 'I replied to your pitch deck question! Structure: problem first, solution, market size. Happy to share my template!', timestamp: ago(2800), isRead: false },
  ];

  seeded.forEach(m => messages.push(m));
};