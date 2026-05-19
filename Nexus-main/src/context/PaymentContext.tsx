import React, { createContext, useContext, useState, useCallback } from 'react';
import { Wallet, Transaction, TransactionType, getWalletForUser } from '../data/payments';

interface PaymentContextValue {
  wallet: Wallet;
  deposit: (amount: number, note?: string) => void;
  withdraw: (amount: number, note?: string) => boolean;
  transfer: (toUserId: string, toName: string, amount: number, note?: string) => boolean;
  fundDeal: (toUserId: string, toName: string, amount: number, dealId: string, dealName: string) => boolean;
  addIncomingTransaction: (tx: Transaction) => void;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(() => getWalletForUser('investor1'));

  const makeId = () => 'txn_' + Math.random().toString(36).slice(2, 10);

  const deposit = useCallback((amount: number, note?: string) => {
    const tx: Transaction = {
      id: makeId(),
      type: 'deposit',
      amount,
      sender: 'Bank Account ••' + Math.floor(1000 + Math.random() * 9000),
      senderId: 'bank',
      receiver: 'You',
      receiverId: wallet.userId,
      status: 'completed',
      note,
      timestamp: new Date().toISOString(),
    };
    setWallet(w => ({ ...w, balance: w.balance + amount, transactions: [tx, ...w.transactions] }));
  }, [wallet.userId]);

  const withdraw = useCallback((amount: number, note?: string): boolean => {
    if (wallet.balance < amount) return false;
    const tx: Transaction = {
      id: makeId(),
      type: 'withdraw',
      amount,
      sender: 'You',
      senderId: wallet.userId,
      receiver: 'Bank Account ••' + Math.floor(1000 + Math.random() * 9000),
      receiverId: 'bank',
      status: 'completed',
      note,
      timestamp: new Date().toISOString(),
    };
    setWallet(w => ({ ...w, balance: w.balance - amount, transactions: [tx, ...w.transactions] }));
    return true;
  }, [wallet.balance, wallet.userId]);

  const transfer = useCallback((toUserId: string, toName: string, amount: number, note?: string): boolean => {
    if (wallet.balance < amount) return false;
    const tx: Transaction = {
      id: makeId(),
      type: 'transfer',
      amount,
      sender: 'You',
      senderId: wallet.userId,
      receiver: toName,
      receiverId: toUserId,
      status: 'completed',
      note,
      timestamp: new Date().toISOString(),
    };
    setWallet(w => ({ ...w, balance: w.balance - amount, transactions: [tx, ...w.transactions] }));
    return true;
  }, [wallet.balance, wallet.userId]);

  const fundDeal = useCallback((toUserId: string, toName: string, amount: number, dealId: string, dealName: string): boolean => {
    if (wallet.balance < amount) return false;
    const tx: Transaction = {
      id: makeId(),
      type: 'funding',
      amount,
      sender: 'You',
      senderId: wallet.userId,
      receiver: toName,
      receiverId: toUserId,
      status: 'pending',
      dealId,
      dealName,
      note: 'Deal funding via Nexus',
      timestamp: new Date().toISOString(),
    };
    setWallet(w => ({ ...w, balance: w.balance - amount, transactions: [tx, ...w.transactions] }));
    return true;
  }, [wallet.balance, wallet.userId]);

  const addIncomingTransaction = useCallback((tx: Transaction) => {
    setWallet(w => ({ ...w, balance: w.balance + tx.amount, transactions: [tx, ...w.transactions] }));
  }, []);

  return (
    <PaymentContext.Provider value={{ wallet, deposit, withdraw, transfer, fundDeal, addIncomingTransaction }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used inside PaymentProvider');
  return ctx;
}