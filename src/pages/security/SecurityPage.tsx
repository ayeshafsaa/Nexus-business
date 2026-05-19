import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, ShieldCheck, ShieldAlert, Smartphone, Mail, Key,
  QrCode, CheckCircle2, XCircle, Clock, AlertTriangle, Trash2,
  RefreshCw, Eye, EyeOff, Lock, Unlock, Monitor, Globe,
  ChevronRight, Copy, Check, Download,
} from 'lucide-react';
import { useTwoFactor, TwoFactorMethod } from '../../context/TwoFactorContext';

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

function SecurityScore({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-emerald-600' :
    score >= 50 ? 'text-amber-500' : 'text-rose-500';
  const bar =
    score >= 80 ? 'bg-emerald-500' :
    score >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  const label =
    score >= 80 ? 'Strong' :
    score >= 50 ? 'Fair' : 'Weak';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between">
        <span className="text-sm text-slate-500 font-medium">Security Score</span>
        <span className={`text-3xl font-black ${color}`}>{score}<span className="text-base font-semibold text-slate-400">/100</span></span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${bar} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${color}`}>{label} Security</span>
    </div>
  );
}

// ─── OTP input ────────────────────────────────────────────────────────────────

function OTPInput({ onComplete }: { onComplete: (code: string) => void }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d !== '')) onComplete(next.join(''));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      onComplete(pasted);
      refs.current[5]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-slate-800 transition-all"
        />
      ))}
    </div>
  );
}

// ─── Enable 2FA Modal ─────────────────────────────────────────────────────────

function Enable2FAModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { enable2FA, verify2FA } = useTwoFactor();
  const [step, setStep] = useState<'choose' | 'setup' | 'verify' | 'done'>('choose');
  const [method, setMethod] = useState<TwoFactorMethod>('app');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const MOCK_SECRET = 'NEXS-4F2A-9K1B-7X3P';
  const MOCK_PHONE = '+92 3xx xxx xxxx';
  const MOCK_EMAIL = 'y***@gmail.com';

  const handleVerify = (code: string) => {
    const ok = verify2FA(code);
    if (ok) {
      enable2FA(method);
      setStep('done');
    } else {
      setError('Invalid code. Use any 6 digits for the demo.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_SECRET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodOptions: { id: TwoFactorMethod; icon: React.ReactNode; title: string; desc: string }[] = [
    {
      id: 'app',
      icon: <QrCode size={22} className="text-violet-600" />,
      title: 'Authenticator App',
      desc: 'Google Authenticator, Authy, or any TOTP app. Most secure.',
    },
    {
      id: 'sms',
      icon: <Smartphone size={22} className="text-blue-600" />,
      title: 'SMS / Text Message',
      desc: `Code sent to ${MOCK_PHONE}`,
    },
    {
      id: 'email',
      icon: <Mail size={22} className="text-teal-600" />,
      title: 'Email',
      desc: `Code sent to ${MOCK_EMAIL}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Enable Two-Factor Auth</h2>
              <p className="text-violet-200 text-xs mt-0.5">
                Step {step === 'choose' ? 1 : step === 'setup' ? 2 : 3} of 3
              </p>
            </div>
          </div>
          {/* progress bar */}
          <div className="mt-4 h-1 bg-white/20 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: step === 'choose' ? '33%' : step === 'setup' ? '66%' : '100%' }}
            />
          </div>
        </div>

        <div className="p-6">

          {/* Step 1 — Choose method */}
          {step === 'choose' && (
            <div className="space-y-3">
              <p className="text-slate-600 text-sm mb-4">Choose how you want to receive verification codes:</p>
              {methodOptions.map(m => (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    method === m.id
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    className="accent-violet-600"
                  />
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {m.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{m.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{m.desc}</div>
                  </div>
                </label>
              ))}
              <button
                onClick={() => setStep('setup')}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Setup */}
          {step === 'setup' && (
            <div className="space-y-4">
              {method === 'app' && (
                <>
                  <p className="text-slate-600 text-sm">Scan this QR code with your authenticator app, or enter the secret key manually:</p>
                  {/* Mock QR code */}
                  <div className="flex justify-center">
                    <div className="w-40 h-40 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2">
                      <QrCode size={48} className="text-slate-400" />
                      <span className="text-xs text-slate-400">Mock QR Code</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5">Or enter this secret key:</p>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                      <code className="flex-1 text-sm font-mono text-violet-700 tracking-widest">{MOCK_SECRET}</code>
                      <button onClick={handleCopy} className="text-slate-400 hover:text-violet-600 transition-colors">
                        {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {method === 'sms' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Smartphone size={28} className="text-blue-600" />
                  </div>
                  <p className="text-slate-700 font-medium">SMS Code Sent!</p>
                  <p className="text-slate-500 text-sm mt-1">We sent a 6-digit code to <strong>{MOCK_PHONE}</strong></p>
                  <p className="text-xs text-slate-400 mt-3">Didn't receive it? <button className="text-violet-600 hover:underline">Resend</button></p>
                </div>
              )}

              {method === 'email' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Mail size={28} className="text-teal-600" />
                  </div>
                  <p className="text-slate-700 font-medium">Email Code Sent!</p>
                  <p className="text-slate-500 text-sm mt-1">We sent a 6-digit code to <strong>{MOCK_EMAIL}</strong></p>
                  <p className="text-xs text-slate-400 mt-3">Check your spam folder if you don't see it.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('choose')}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('verify')}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  I'm Ready →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Verify */}
          {step === 'verify' && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-slate-700 font-medium">Enter Verification Code</p>
                <p className="text-slate-500 text-sm mt-1">Enter any 6-digit number to complete setup (demo)</p>
              </div>
              <OTPInput onComplete={handleVerify} />
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm">
                  <XCircle size={14} /> {error}
                </div>
              )}
              <button
                onClick={() => setStep('setup')}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">2FA Enabled!</p>
                <p className="text-slate-500 text-sm mt-1">Your account is now protected with two-factor authentication.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ Save your backup codes</p>
                <p className="text-xs text-amber-600">Download your backup codes now. You'll need them if you lose access to your authenticator.</p>
              </div>
              <button
                onClick={() => { onSuccess(); onClose(); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Disable 2FA Modal ────────────────────────────────────────────────────────

function Disable2FAModal({ onClose, onDisabled }: { onClose: () => void; onDisabled: () => void }) {
  const { disable2FA, verify2FA } = useTwoFactor();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');

  const handleDisable = () => {
    if (!password) { setError('Enter your current password'); return; }
    const ok = verify2FA(code);
    if (!ok) { setError('Invalid 2FA code. Enter any 6 digits.'); return; }
    disable2FA();
    onDisabled();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldAlert size={26} className="text-rose-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Disable 2FA</h2>
          <p className="text-slate-500 text-sm mt-1">This will make your account less secure.</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Current Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">2FA Code</label>
            <OTPInput onComplete={setCode} />
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDisable}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
            >
              Disable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Backup codes panel ───────────────────────────────────────────────────────

const MOCK_BACKUP_CODES = [
  'NX4F-2A1B', 'K9P7-3X2Q', 'M5R8-6Y4W', 'T2J1-8N9Z',
  'Q6L3-4K7V', 'B8W5-1M2C', 'D3H9-7P6S', 'F1G4-5R8U',
];

function BackupCodesPanel() {
  const { is2FAEnabled, backupCodesRemaining, regenerateBackupCodes } = useTwoFactor();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(MOCK_BACKUP_CODES.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!is2FAEnabled) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key size={17} className="text-amber-500" />
          <h3 className="font-semibold text-slate-800">Backup Codes</h3>
        </div>
        <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
          {backupCodesRemaining} remaining
        </span>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Use these one-time codes if you lose access to your authenticator app. Each code can only be used once.
      </p>

      {revealed ? (
        <>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {MOCK_BACKUP_CODES.map((code, i) => (
              <div
                key={i}
                className={`font-mono text-sm px-3 py-2 rounded-lg text-center border ${
                  i >= backupCodesRemaining
                    ? 'bg-slate-50 text-slate-300 border-slate-100 line-through'
                    : 'bg-violet-50 text-violet-800 border-violet-200'
                }`}
              >
                {code}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyAll}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button
              onClick={regenerateBackupCodes}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              <RefreshCw size={14} /> Regenerate
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-sm font-medium hover:border-violet-300 hover:text-violet-600 transition-colors"
        >
          <Eye size={15} /> Show Backup Codes
        </button>
      )}
    </div>
  );
}

// ─── Password Change Section ──────────────────────────────────────────────────

function ChangePasswordPanel() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const strength = next.length >= 12 && /[A-Z]/.test(next) && /\d/.test(next) && /[^a-zA-Z0-9]/.test(next)
    ? 'Strong'
    : next.length >= 8
    ? 'Fair'
    : next.length > 0
    ? 'Weak'
    : '';

  const strengthColor = strength === 'Strong' ? 'text-emerald-600' : strength === 'Fair' ? 'text-amber-500' : 'text-rose-500';
  const strengthWidth = strength === 'Strong' ? 'w-full' : strength === 'Fair' ? 'w-1/2' : 'w-1/4';
  const strengthBar = strength === 'Strong' ? 'bg-emerald-500' : strength === 'Fair' ? 'bg-amber-500' : 'bg-rose-500';

  const handleSave = () => {
    if (!current) { setError('Enter your current password'); return; }
    if (next.length < 8) { setError('New password must be at least 8 characters'); return; }
    if (next !== confirm) { setError('Passwords do not match'); return; }
    setError('');
    setSaved(true);
    setCurrent(''); setNext(''); setConfirm('');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lock size={17} className="text-slate-500" />
        <h3 className="font-semibold text-slate-800">Change Password</h3>
        {saved && (
          <span className="ml-auto flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 size={11} /> Saved
          </span>
        )}
      </div>

      <div className="space-y-3">
        {([
          { key: 'current', label: 'Current Password', val: current, set: setCurrent },
          { key: 'next', label: 'New Password', val: next, set: setNext },
          { key: 'confirm', label: 'Confirm New Password', val: confirm, set: setConfirm },
        ] as const).map(({ key, label, val, set }) => (
          <div key={key}>
            <label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
            <div className="relative">
              <input
                type={show[key] ? 'text' : 'password'}
                value={val}
                onChange={e => set(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {key === 'next' && next && (
              <div className="mt-1.5">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${strengthBar} ${strengthWidth} rounded-full transition-all`} />
                </div>
                <span className={`text-xs font-medium ${strengthColor}`}>{strength}</span>
              </div>
            )}
          </div>
        ))}

        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={handleSave}
          className="w-full py-3 mt-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold hover:opacity-90 transition-opacity text-sm"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

// ─── Trusted Devices ──────────────────────────────────────────────────────────

function TrustedDevicesPanel() {
  const { trustedDevices, removeDevice } = useTwoFactor();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Monitor size={17} className="text-slate-500" />
        <h3 className="font-semibold text-slate-800">Trusted Devices</h3>
        <span className="ml-auto text-xs text-slate-400">{trustedDevices.length} devices</span>
      </div>

      {trustedDevices.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No trusted devices</p>
      ) : (
        <div className="space-y-2">
          {trustedDevices.map(device => (
            <div
              key={device.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                device.isCurrent ? 'border-violet-200 bg-violet-50' : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                device.isCurrent ? 'bg-violet-200' : 'bg-slate-100'
              }`}>
                <Monitor size={16} className={device.isCurrent ? 'text-violet-700' : 'text-slate-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">{device.name}</span>
                  {device.isCurrent && (
                    <span className="text-xs bg-violet-200 text-violet-800 px-1.5 py-0.5 rounded-full">This device</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{device.browser}</span>
                  <span>·</span>
                  <Globe size={10} />
                  <span>{device.location}</span>
                  <span>·</span>
                  <Clock size={10} />
                  <span>{device.lastActive}</span>
                </div>
              </div>
              {!device.isCurrent && (
                <button
                  onClick={() => removeDevice(device.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                  title="Remove device"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Login Activity ───────────────────────────────────────────────────────────

function LoginActivityPanel() {
  const { loginActivity } = useTwoFactor();

  const statusConfig = {
    success: { label: 'Success', icon: <CheckCircle2 size={12} />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    failed:  { label: 'Failed',  icon: <XCircle size={12} />,      className: 'bg-rose-50 text-rose-700 border-rose-200' },
    blocked: { label: 'Blocked', icon: <AlertTriangle size={12} />, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={17} className="text-slate-500" />
        <h3 className="font-semibold text-slate-800">Login Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
              <th className="text-left pb-2 font-medium">Device</th>
              <th className="text-left pb-2 font-medium">Location / IP</th>
              <th className="text-left pb-2 font-medium">Date</th>
              <th className="text-center pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loginActivity.map(log => {
              const cfg = statusConfig[log.status];
              return (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5">
                    <div className="font-medium text-slate-700">{log.device}</div>
                    <div className="text-xs text-slate-400">{log.browser}</div>
                  </td>
                  <td className="py-2.5">
                    <div className="text-slate-600">{log.location}</div>
                    <div className="text-xs text-slate-400 font-mono">{log.ip}</div>
                  </td>
                  <td className="py-2.5 text-xs text-slate-400">{fmtDate(log.timestamp)}</td>
                  <td className="py-2.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const { is2FAEnabled, activeMethod, isVerified, backupCodesRemaining, loginActivity } = useTwoFactor();
  const [showEnable, setShowEnable] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const failedLogins = loginActivity.filter(l => l.status !== 'success').length;

  // Compute security score
  const score = Math.min(100,
    (is2FAEnabled ? 40 : 0) +
    (backupCodesRemaining > 0 ? 20 : 0) +
    30 + // base for having an account
    (failedLogins === 0 ? 10 : 0)
  );

  const methodLabel: Record<string, string> = {
    app: 'Authenticator App',
    sms: 'SMS',
    email: 'Email',
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" /> {toast}
        </div>
      )}

      {showEnable && (
        <Enable2FAModal
          onClose={() => setShowEnable(false)}
          onSuccess={() => showToast('Two-factor authentication enabled!')}
        />
      )}

      {showDisable && (
        <Disable2FAModal
          onClose={() => setShowDisable(false)}
          onDisabled={() => showToast('Two-factor authentication disabled.')}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your account security and authentication</p>
        </div>
        {failedLogins > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl text-sm">
            <AlertTriangle size={15} />
            <span>{failedLogins} suspicious login attempt{failedLogins > 1 ? 's' : ''} detected</span>
          </div>
        )}
      </div>

      {/* Security score card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={18} className="text-violet-400" />
            <span className="text-slate-300 text-sm font-medium">Account Protection</span>
          </div>
          <SecurityScore score={score} />
          <div className="mt-5 space-y-2">
            {[
              { label: '2FA Enabled', done: is2FAEnabled },
              { label: 'Backup Codes', done: backupCodesRemaining > 0 },
              { label: 'Strong Password', done: true },
              { label: 'No Suspicious Activity', done: failedLogins === 0 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                {item.done
                  ? <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                  : <XCircle size={13} className="text-slate-500 flex-shrink-0" />
                }
                <span className={item.done ? 'text-slate-300' : 'text-slate-500'}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2FA Status card */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                is2FAEnabled ? 'bg-emerald-100' : 'bg-slate-100'
              }`}>
                {is2FAEnabled
                  ? <ShieldCheck size={26} className="text-emerald-600" />
                  : <ShieldAlert size={26} className="text-slate-400" />
                }
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Two-Factor Authentication</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    is2FAEnabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {is2FAEnabled ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                    {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {is2FAEnabled && activeMethod && (
                    <span className="text-xs text-slate-500">via {methodLabel[activeMethod]}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => is2FAEnabled ? setShowDisable(true) : setShowEnable(true)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                is2FAEnabled
                  ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                  : 'bg-gradient-to-r from-violet-600 to-purple-700 text-white hover:opacity-90 shadow-md shadow-violet-200'
              }`}
            >
              {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          <p className="text-slate-500 text-sm mt-4">
            {is2FAEnabled
              ? 'Your account is protected. Every sign-in requires your password and a verification code.'
              : 'Add an extra layer of security. When 2FA is on, you need your password and a verification code to sign in.'
            }
          </p>

          {!is2FAEnabled && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: <QrCode size={18} className="text-violet-600" />, label: 'Auth App', desc: 'Most secure' },
                { icon: <Smartphone size={18} className="text-blue-600" />, label: 'SMS Code', desc: 'Via phone' },
                { icon: <Mail size={18} className="text-teal-600" />, label: 'Email Code', desc: 'Via email' },
              ].map(opt => (
                <div
                  key={opt.label}
                  onClick={() => setShowEnable(true)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 cursor-pointer transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center">
                    {opt.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{opt.label}</span>
                  <span className="text-xs text-slate-400">{opt.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lower panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChangePasswordPanel />
        <BackupCodesPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrustedDevicesPanel />
        <LoginActivityPanel />
      </div>
    </div>
  );
}