import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock, Bell, Globe, Palette, CreditCard,
  Check, Save, Moon, Sun, Monitor,
  ChevronRight, ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'notifications' | 'language' | 'appearance' | 'security' | 'billing';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS: { id: TabId; label: string; icon: React.ReactNode; linkTo?: string }[] = [
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'language',      label: 'Language',      icon: <Globe size={18} /> },
  { id: 'appearance',    label: 'Appearance',    icon: <Palette size={18} /> },
  { id: 'security',      label: 'Security',      icon: <Lock size={18} />,       linkTo: '/security'  },
  { id: 'billing',       label: 'Billing',       icon: <CreditCard size={18} />, linkTo: '/payments'  },
];

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
      checked ? 'bg-primary-600' : 'bg-gray-200'
    }`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
      checked ? 'translate-x-6' : 'translate-x-1'
    }`} />
  </button>
);

// ─── Notifications ────────────────────────────────────────────────────────────
const NotificationsTab: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: 'collab',    label: 'Collaboration Requests', description: 'When someone sends you a collaboration request',   email: true,  push: true  },
    { id: 'messages',  label: 'New Messages',            description: 'When you receive a new direct message',            email: true,  push: true  },
    { id: 'views',     label: 'Profile Views',           description: 'When someone views your profile',                  email: false, push: true  },
    { id: 'funding',   label: 'Funding Updates',         description: 'Updates about funding rounds and opportunities',   email: true,  push: false },
    { id: 'weekly',    label: 'Weekly Digest',           description: 'A weekly summary of activity and recommendations', email: true,  push: false },
    { id: 'marketing', label: 'Product News',            description: 'News and tips from Business Nexus',                email: false, push: false },
  ]);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string, field: 'email' | 'push') =>
    setSettings(prev => prev.map(s => s.id === id ? { ...s, [field]: !s[field] } : s));

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">Choose how and when you'd like to be notified.</p>
      </CardHeader>
      <CardBody>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Notification</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 w-20">Email</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 w-20">Push</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {settings.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Toggle checked={s.email} onChange={() => toggle(s.id, 'email')} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Toggle checked={s.push} onChange={() => toggle(s.id, 'push')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-5">
          <Button
            leftIcon={saved ? <Check size={16} /> : <Save size={16} />}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {saved ? 'Saved!' : 'Save Preferences'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

// ─── Language ─────────────────────────────────────────────────────────────────
const LanguageTab: React.FC = () => {
  const [selected, setSelected]   = useState('en');
  const [timezone, setTimezone]   = useState('America/Los_Angeles');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [saved, setSaved]         = useState(false);

  const languages = [
    { code: 'en', name: 'English',    flag: '🇺🇸' },
    { code: 'es', name: 'Español',    flag: '🇪🇸' },
    { code: 'fr', name: 'Français',   flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
    { code: 'zh', name: '中文',        flag: '🇨🇳' },
    { code: 'ar', name: 'العربية',    flag: '🇸🇦' },
    { code: 'pt', name: 'Português',  flag: '🇧🇷' },
    { code: 'ja', name: '日本語',      flag: '🇯🇵' },
  ];

  const timezones = [
    'America/Los_Angeles', 'America/New_York', 'America/Chicago',
    'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Karachi', 'Asia/Dubai',
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Language & Region</h2>
        <p className="text-sm text-gray-500 mt-1">Set your preferred language, timezone, and date format.</p>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Language grid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Display Language</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {languages.map(lang => (
              <button key={lang.code} onClick={() => setSelected(lang.code)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  selected === lang.code
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                <span className="text-lg">{lang.flag}</span>
                {lang.name}
                {selected === lang.code && <Check size={13} className="ml-auto text-primary-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select value={timezone} onChange={e => setTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            {timezones.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {/* Date format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <div className="flex gap-2 flex-wrap">
            {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(fmt => (
              <button key={fmt} onClick={() => setDateFormat(fmt)}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                  dateFormat === fmt
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            leftIcon={saved ? <Check size={16} /> : <Save size={16} />}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {saved ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

// ─── Appearance ───────────────────────────────────────────────────────────────
const AppearanceTab: React.FC = () => {
  const [theme, setTheme]           = useState<'light' | 'dark' | 'system'>('light');
  const [accentColor, setAccentColor] = useState('#4f46e5');
  const [fontSize, setFontSize]     = useState('md');
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saved, setSaved]           = useState(false);

  const accents = [
    { color: '#4f46e5', label: 'Indigo'   },
    { color: '#0ea5e9', label: 'Sky'      },
    { color: '#10b981', label: 'Emerald'  },
    { color: '#f59e0b', label: 'Amber'    },
    { color: '#ef4444', label: 'Red'      },
    { color: '#8b5cf6', label: 'Violet'   },
  ];

  const themes = [
    { id: 'light',  label: 'Light',  icon: <Sun size={20} /> },
    { id: 'dark',   label: 'Dark',   icon: <Moon size={20} /> },
    { id: 'system', label: 'System', icon: <Monitor size={20} /> },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
        <p className="text-sm text-gray-500 mt-1">Customize how Business Nexus looks for you.</p>
      </CardHeader>
      <CardBody className="space-y-7">
        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === t.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                {t.icon}
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Accent Color</label>
          <div className="flex gap-3 flex-wrap">
            {accents.map(a => (
              <button key={a.color} title={a.label} onClick={() => setAccentColor(a.color)}
                className="relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: a.color,
                  borderColor: accentColor === a.color ? a.color : 'transparent',
                  boxShadow: accentColor === a.color ? `0 0 0 3px ${a.color}40` : 'none',
                }}>
                {accentColor === a.color && <Check size={16} className="absolute inset-0 m-auto text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <div className="flex gap-2">
            {[{ id: 'sm', label: 'Small' }, { id: 'md', label: 'Default' }, { id: 'lg', label: 'Large' }].map(f => (
              <button key={f.id} onClick={() => setFontSize(f.id)}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                  fontSize === f.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Compact Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">Reduce spacing to show more content per screen</p>
            </div>
            <Toggle checked={compactMode} onChange={setCompactMode} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Collapse Sidebar by Default</p>
              <p className="text-xs text-gray-500 mt-0.5">Start with the sidebar minimized on every visit</p>
            </div>
            <Toggle checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            leftIcon={saved ? <Check size={16} /> : <Save size={16} />}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {saved ? 'Applied!' : 'Apply Changes'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

// ─── Main SettingsPage ────────────────────────────────────────────────────────
export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('notifications');

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications': return <NotificationsTab />;
      case 'language':      return <LanguageTab />;
      case 'appearance':    return <AppearanceTab />;
      default:              return <NotificationsTab />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your app preferences and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardBody className="p-2">
            <nav className="space-y-0.5">
              {TABS.map(tab =>
                tab.linkTo ? (
                  <Link
                    key={tab.id}
                    to={tab.linkTo}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-md transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-gray-400">{tab.icon}</span>
                      {tab.label}
                    </span>
                    <ExternalLink size={13} className="text-gray-300" />
                  </Link>
                ) : (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}>
                    <span className="flex items-center gap-3">
                      <span className={activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </span>
                    <ChevronRight size={14} className={activeTab === tab.id ? 'text-primary-500' : 'text-gray-300'} />
                  </button>
                )
              )}
            </nav>
          </CardBody>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};