export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'funding';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  sender: string;
  senderId: string;
  receiver: string;
  receiverId: string;
  status: TransactionStatus;
  note?: string;
  dealId?: string;
  dealName?: string;
  timestamp: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const seedWallets: Record<string, Wallet> = {
  investor1: {
    userId: 'investor1',
    balance: 124500,
    currency: 'USD',
    transactions: [
      {
        id: 'txn_001',
        type: 'deposit',
        amount: 50000,
        sender: 'Bank Account ••4521',
        senderId: 'bank',
        receiver: 'Sarah Chen',
        receiverId: 'investor1',
        status: 'completed',
        note: 'Initial deposit',
        timestamp: daysAgo(30),
      },
      {
        id: 'txn_002',
        type: 'funding',
        amount: 25000,
        sender: 'Sarah Chen',
        senderId: 'investor1',
        receiver: 'TechVenture AI',
        receiverId: 'entrepreneur1',
        status: 'completed',
        dealName: 'TechVenture AI — Seed Round',
        dealId: 'deal_001',
        note: 'Seed funding tranche 1',
        timestamp: daysAgo(20),
      },
      {
        id: 'txn_003',
        type: 'deposit',
        amount: 100000,
        sender: 'Bank Account ••4521',
        senderId: 'bank',
        receiver: 'Sarah Chen',
        receiverId: 'investor1',
        status: 'completed',
        note: 'Q2 fund allocation',
        timestamp: daysAgo(10),
      },
      {
        id: 'txn_004',
        type: 'transfer',
        amount: 500,
        sender: 'Sarah Chen',
        senderId: 'investor1',
        receiver: 'James Patel',
        receiverId: 'investor2',
        status: 'completed',
        note: 'Due diligence fee share',
        timestamp: daysAgo(5),
      },
    ],
  },
  entrepreneur1: {
    userId: 'entrepreneur1',
    balance: 42300,
    currency: 'USD',
    transactions: [
      {
        id: 'txn_005',
        type: 'funding',
        amount: 25000,
        sender: 'Sarah Chen',
        senderId: 'investor1',
        receiver: 'Alex Rivera',
        receiverId: 'entrepreneur1',
        status: 'completed',
        dealName: 'TechVenture AI — Seed Round',
        dealId: 'deal_001',
        note: 'Seed funding tranche 1',
        timestamp: daysAgo(20),
      },
      {
        id: 'txn_006',
        type: 'withdraw',
        amount: 8000,
        sender: 'Alex Rivera',
        senderId: 'entrepreneur1',
        receiver: 'Bank Account ••9911',
        receiverId: 'bank',
        status: 'completed',
        note: 'Team salaries — May',
        timestamp: daysAgo(8),
      },
      {
        id: 'txn_007',
        type: 'deposit',
        amount: 15000,
        sender: 'Stripe Revenue',
        senderId: 'external',
        receiver: 'Alex Rivera',
        receiverId: 'entrepreneur1',
        status: 'completed',
        note: 'Product revenue — April',
        timestamp: daysAgo(3),
      },
      {
        id: 'txn_008',
        type: 'funding',
        amount: 40000,
        sender: 'James Patel',
        senderId: 'investor2',
        receiver: 'Alex Rivera',
        receiverId: 'entrepreneur1',
        status: 'pending',
        dealName: 'TechVenture AI — Series A',
        dealId: 'deal_002',
        note: 'Series A milestone payment',
        timestamp: daysAgo(1),
      },
    ],
  },
};

export function getWalletForUser(userId: string): Wallet {
  return (
    seedWallets[userId] ?? {
      userId,
      balance: 12000,
      currency: 'USD',
      transactions: [
        {
          id: 'txn_default_001',
          type: 'deposit',
          amount: 12000,
          sender: 'Bank Account ••0000',
          senderId: 'bank',
          receiver: 'You',
          receiverId: userId,
          status: 'completed',
          note: 'Welcome bonus',
          timestamp: daysAgo(7),
        },
      ],
    }
  );
}