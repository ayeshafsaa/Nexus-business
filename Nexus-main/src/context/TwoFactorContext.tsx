import React, { createContext, useContext, useState, useCallback } from 'react';

export type TwoFactorMethod = 'app' | 'sms' | 'email';

export interface TrustedDevice {
  id: string;
  name: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
}

interface TwoFactorContextValue {
  is2FAEnabled: boolean;
  activeMethod: TwoFactorMethod | null;
  isVerified: boolean;
  backupCodesRemaining: number;
  trustedDevices: TrustedDevice[];
  loginActivity: LoginActivity[];
  enable2FA: (method: TwoFactorMethod) => void;
  disable2FA: () => void;
  verify2FA: (code: string) => boolean;
  removeDevice: (id: string) => void;
  regenerateBackupCodes: () => void;
}

const TwoFactorContext = createContext<TwoFactorContextValue | null>(null);

const MOCK_DEVICES: TrustedDevice[] = [
  {
    id: 'dev_001',
    name: 'Windows PC',
    browser: 'Chrome 124',
    location: 'Rawalpindi, PK',
    lastActive: 'Just now',
    isCurrent: true,
  },
  {
    id: 'dev_002',
    name: 'iPhone 15 Pro',
    browser: 'Safari 17',
    location: 'Islamabad, PK',
    lastActive: '2 days ago',
    isCurrent: false,
  },
  {
    id: 'dev_003',
    name: 'MacBook Air',
    browser: 'Firefox 125',
    location: 'Lahore, PK',
    lastActive: '5 days ago',
    isCurrent: false,
  },
];

const MOCK_ACTIVITY: LoginActivity[] = [
  {
    id: 'act_001',
    device: 'Windows PC',
    browser: 'Chrome 124',
    location: 'Rawalpindi, PK',
    ip: '182.176.xx.xx',
    timestamp: new Date().toISOString(),
    status: 'success',
  },
  {
    id: 'act_002',
    device: 'iPhone 15 Pro',
    browser: 'Safari 17',
    location: 'Islamabad, PK',
    ip: '39.35.xx.xx',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'success',
  },
  {
    id: 'act_003',
    device: 'Unknown Device',
    browser: 'Chrome 120',
    location: 'Mumbai, IN',
    ip: '103.21.xx.xx',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'failed',
  },
  {
    id: 'act_004',
    device: 'Unknown Device',
    browser: 'Unknown',
    location: 'Jakarta, ID',
    ip: '202.79.xx.xx',
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    status: 'blocked',
  },
  {
    id: 'act_005',
    device: 'MacBook Air',
    browser: 'Firefox 125',
    location: 'Lahore, PK',
    ip: '119.73.xx.xx',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'success',
  },
];

export function TwoFactorProvider({ children }: { children: React.ReactNode }) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [activeMethod, setActiveMethod] = useState<TwoFactorMethod | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [backupCodesRemaining, setBackupCodesRemaining] = useState(8);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>(MOCK_DEVICES);
  const [loginActivity] = useState<LoginActivity[]>(MOCK_ACTIVITY);

  const enable2FA = useCallback((method: TwoFactorMethod) => {
    setIs2FAEnabled(true);
    setActiveMethod(method);
    setIsVerified(false);
  }, []);

  const disable2FA = useCallback(() => {
    setIs2FAEnabled(false);
    setActiveMethod(null);
    setIsVerified(false);
  }, []);

  // Mock: any 6-digit code is accepted
  const verify2FA = useCallback((code: string): boolean => {
    if (code.length === 6 && /^\d+$/.test(code)) {
      setIsVerified(true);
      return true;
    }
    return false;
  }, []);

  const removeDevice = useCallback((id: string) => {
    setTrustedDevices(prev => prev.filter(d => d.id !== id));
  }, []);

  const regenerateBackupCodes = useCallback(() => {
    setBackupCodesRemaining(10);
  }, []);

  return (
    <TwoFactorContext.Provider
      value={{
        is2FAEnabled,
        activeMethod,
        isVerified,
        backupCodesRemaining,
        trustedDevices,
        loginActivity,
        enable2FA,
        disable2FA,
        verify2FA,
        removeDevice,
        regenerateBackupCodes,
      }}
    >
      {children}
    </TwoFactorContext.Provider>
  );
}

export function useTwoFactor() {
  const ctx = useContext(TwoFactorContext);
  if (!ctx) throw new Error('useTwoFactor must be used inside TwoFactorProvider');
  return ctx;
}