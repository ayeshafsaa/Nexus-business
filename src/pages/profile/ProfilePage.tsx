import React, { useState, useRef } from 'react';
import {
  User, Camera, Save, X, Check,
  MapPin, Building2, Briefcase, Mail, Phone,
  DollarSign, Tag, Users, Calendar, Link as LinkIcon
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string>((user as any)?.avatarUrl || '');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:              user?.name || '',
    email:             user?.email || '',
    phone:             '',
    location:          'San Francisco, CA',
    bio:               (user as any)?.bio || '',
    website:           '',
    // Entrepreneur-specific
    startupName:       (user as any)?.startupName || '',
    industry:          (user as any)?.industry || '',
    fundingNeeded:     (user as any)?.fundingNeeded || '',
    teamSize:          String((user as any)?.teamSize || ''),
    foundedYear:       String((user as any)?.foundedYear || ''),
    pitchSummary:      (user as any)?.pitchSummary || '',
    // Investor-specific
    minimumInvestment: (user as any)?.minimumInvestment || '',
    maximumInvestment: (user as any)?.maximumInvestment || '',
  });

  if (!user) return null;

  const isEntrepreneur = user.role === 'entrepreneur';

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChange = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDiscard = () => {
    setForm({
      name: user?.name || '', email: user?.email || '', phone: '',
      location: 'San Francisco, CA', bio: (user as any)?.bio || '', website: '',
      startupName: (user as any)?.startupName || '', industry: (user as any)?.industry || '',
      fundingNeeded: (user as any)?.fundingNeeded || '',
      teamSize: String((user as any)?.teamSize || ''),
      foundedYear: String((user as any)?.foundedYear || ''),
      pitchSummary: (user as any)?.pitchSummary || '',
      minimumInvestment: (user as any)?.minimumInvestment || '',
      maximumInvestment: (user as any)?.maximumInvestment || '',
    });
    setAvatarPreview((user as any)?.avatarUrl || '');
  };

  const Field: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        {children}
      </div>
    </div>
  );

  const inputCls = "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Your public profile — what others see when they view your page.</p>
      </div>

      {/* ── Photo Card ─────────────────────────────────────── */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-primary-100">
                {avatarPreview
                  ? <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><User size={40} className="text-primary-400" /></div>
                }
              </div>
              <button onClick={handlePhotoClick}
                className="absolute -bottom-1 -right-1 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow-md transition-colors">
                <Camera size={14} />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">{form.name || user.name}</h2>
              <p className="text-sm text-gray-500 capitalize flex items-center gap-1.5 mt-0.5">
                <Briefcase size={14} />
                {user.role}
                {isEntrepreneur && form.startupName && <> · {form.startupName}</>}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Button variant="outline" size="sm" onClick={handlePhotoClick} leftIcon={<Camera size={14} />}>
                  Upload Photo
                </Button>
                {avatarPreview && avatarPreview !== (user as any)?.avatarUrl && (
                  <span className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> New photo ready</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF · Max 800KB</p>
            </div>

            <div className="ml-auto hidden sm:flex flex-col items-end gap-2">
              <Badge variant="primary" className="capitalize">{user.role}</Badge>
              {(user as any).isOnline && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
                </span>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Basic Info ─────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          <p className="text-sm text-gray-500 mt-0.5">Personal details visible on your profile.</p>
        </CardHeader>
        <CardBody className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Full Name" icon={<User size={15} />}>
              <input value={form.name} onChange={handleChange('name')} className={inputCls} />
            </Field>

            <Field label="Email Address" icon={<Mail size={15} />}>
              <input type="email" value={form.email} onChange={handleChange('email')} className={inputCls} />
            </Field>

            <Field label="Phone Number" icon={<Phone size={15} />}>
              <input type="tel" value={form.phone} onChange={handleChange('phone')}
                placeholder="+1 (555) 000-0000" className={inputCls} />
            </Field>

            <Field label="Location" icon={<MapPin size={15} />}>
              <input value={form.location} onChange={handleChange('location')} className={inputCls} />
            </Field>

            <div className="md:col-span-2">
              <Field label="Website / LinkedIn" icon={<LinkIcon size={15} />}>
                <input value={form.website} onChange={handleChange('website')}
                  placeholder="https://yourwebsite.com" className={inputCls} />
              </Field>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea rows={4} value={form.bio} onChange={handleChange('bio')}
              placeholder="Tell others about yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">{form.bio.length} / 500 characters</p>
          </div>
        </CardBody>
      </Card>

      {/* ── Role-specific ──────────────────────────────────── */}
      {isEntrepreneur ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Startup Details</h2>
            <p className="text-sm text-gray-500 mt-0.5">Information about your startup shown to investors.</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Startup Name" icon={<Building2 size={15} />}>
                <input value={form.startupName} onChange={handleChange('startupName')} className={inputCls} />
              </Field>

              <Field label="Industry" icon={<Tag size={15} />}>
                <input value={form.industry} onChange={handleChange('industry')} className={inputCls} />
              </Field>

              <Field label="Team Size" icon={<Users size={15} />}>
                <input type="number" value={form.teamSize} onChange={handleChange('teamSize')} className={inputCls} />
              </Field>

              <Field label="Founded Year" icon={<Calendar size={15} />}>
                <input type="number" value={form.foundedYear} onChange={handleChange('foundedYear')}
                  placeholder="2022" className={inputCls} />
              </Field>

              <div className="md:col-span-2">
                <Field label="Funding Needed" icon={<DollarSign size={15} />}>
                  <input value={form.fundingNeeded} onChange={handleChange('fundingNeeded')}
                    placeholder="e.g. $500K" className={inputCls} />
                </Field>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Summary</label>
                <textarea rows={3} value={form.pitchSummary} onChange={handleChange('pitchSummary')}
                  placeholder="Briefly describe what your startup does and the problem it solves..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Investment Details</h2>
            <p className="text-sm text-gray-500 mt-0.5">Your investment preferences shown to entrepreneurs.</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Minimum Investment" icon={<DollarSign size={15} />}>
                <input value={form.minimumInvestment} onChange={handleChange('minimumInvestment')}
                  placeholder="e.g. $50K" className={inputCls} />
              </Field>

              <Field label="Maximum Investment" icon={<DollarSign size={15} />}>
                <input value={form.maximumInvestment} onChange={handleChange('maximumInvestment')}
                  placeholder="e.g. $500K" className={inputCls} />
              </Field>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Actions ────────────────────────────────────────── */}
      <div className="flex justify-end gap-3 pb-6">
        <Button variant="outline" leftIcon={<X size={16} />} onClick={handleDiscard}>
          Discard Changes
        </Button>
        <Button
          leftIcon={saved ? <Check size={16} /> : <Save size={16} />}
          onClick={handleSave}
          className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {saved ? 'Saved!' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
};