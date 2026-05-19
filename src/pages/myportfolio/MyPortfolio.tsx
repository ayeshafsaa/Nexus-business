import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, TrendingUp, DollarSign, BarChart3,
  MapPin, Plus, Edit3, CheckCircle, Clock,
  Target, Users, PieChart, X, Save, Trash2
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { Investor } from '../../types';

// ─── Reusable Modal ───────────────────────────────────────────────────────────
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";
const textareaClass = `${inputClass} resize-none`;

interface PortfolioCompany {
  id: string;
  name: string;
  industry: string;
  stage: string;
  invested: string;
  roi: string;
  status: 'active' | 'exited';
  year: string;
}

export const MyPortfolio: React.FC = () => {
  const { user: currentUser, updateProfile } = useAuth();
  const investor = currentUser as Investor;

  const [bio, setBio] = useState(
    investor?.bio ||
    'I am a seasoned investor with 10+ years of experience backing early-stage startups across SaaS, FinTech, and HealthTech. I bring more than capital — I provide strategic guidance, network access, and hands-on support to help founders scale from idea to exit.'
  );

  const [interests, setInterests] = useState<string[]>(
    investor?.investmentInterests?.length ? investor.investmentInterests : ['SaaS', 'FinTech', 'HealthTech', 'B2B Software']
  );

  const [stages, setStages] = useState<string[]>(
    investor?.investmentStage?.length ? investor.investmentStage : ['Seed', 'Series A', 'Series B']
  );

  const [companies, setCompanies] = useState<PortfolioCompany[]>([
    { id: '1', name: 'TechFlow AI', industry: 'SaaS', stage: 'Series A', invested: '$500K', roi: '+120%', status: 'active', year: '2022' },
    { id: '2', name: 'FinBridge', industry: 'FinTech', stage: 'Seed', invested: '$250K', roi: '+45%', status: 'active', year: '2021' },
    { id: '3', name: 'MedVault', industry: 'HealthTech', stage: 'Series B', invested: '$1M', roi: '+210%', status: 'exited', year: '2020' },
  ]);

  const [profileData, setProfileData] = useState({
    name: investor?.name || '',
    location: 'San Francisco, CA',
    minimumInvestment: investor?.minimumInvestment || '$50K',
    maximumInvestment: investor?.maximumInvestment || '$2M',
  });

  type ModalType = 'editProfile' | 'editInvestmentRange' | 'logInvestment' | 'editInterests' | 'editBio' | 'editCompany' | null;
  const [modal, setModal] = useState<ModalType>(null);
  const closeModal = () => setModal(null);

  const [tmpBio, setTmpBio] = useState('');
  const [tmpInterests, setTmpInterests] = useState<string[]>([]);
  const [tmpStages, setTmpStages] = useState<string[]>([]);
  const [tmpNewInterest, setTmpNewInterest] = useState('');
  const [tmpNewStage, setTmpNewStage] = useState('');
  const [tmpProfile, setTmpProfile] = useState(profileData);
  const [tmpCompany, setTmpCompany] = useState<Omit<PortfolioCompany, 'id'>>({ name: '', industry: '', stage: '', invested: '', roi: '', status: 'active', year: '' });
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  // Profile
  const openEditProfile = () => { setTmpProfile(profileData); setModal('editProfile'); };
  const saveProfile = () => {
    setProfileData(tmpProfile);
    updateProfile(investor.id, { name: tmpProfile.name } as any);
    closeModal();
  };

  // Investment Range
  const openEditInvestmentRange = () => { setTmpProfile(profileData); setModal('editInvestmentRange'); };
  const saveInvestmentRange = () => {
    setProfileData(p => ({ ...p, minimumInvestment: tmpProfile.minimumInvestment, maximumInvestment: tmpProfile.maximumInvestment }));
    updateProfile(investor.id, {
      minimumInvestment: tmpProfile.minimumInvestment,
      maximumInvestment: tmpProfile.maximumInvestment,
    } as any);
    closeModal();
  };

  // Bio
  const openEditBio = () => { setTmpBio(bio); setModal('editBio'); };
  const saveBio = () => { setBio(tmpBio); updateProfile(investor.id, { bio: tmpBio } as any); closeModal(); };

  // Interests
  const openEditInterests = () => { setTmpInterests([...interests]); setTmpStages([...stages]); setTmpNewInterest(''); setTmpNewStage(''); setModal('editInterests'); };
  const saveInterests = () => {
    setInterests(tmpInterests);
    setStages(tmpStages);
    updateProfile(investor.id, { investmentInterests: tmpInterests, investmentStage: tmpStages } as any);
    closeModal();
  };
  const addTmpInterest = () => { if (tmpNewInterest.trim() && !tmpInterests.includes(tmpNewInterest.trim())) { setTmpInterests(p => [...p, tmpNewInterest.trim()]); setTmpNewInterest(''); } };
  const removeTmpInterest = (i: string) => setTmpInterests(p => p.filter(x => x !== i));
  const addTmpStage = () => { if (tmpNewStage.trim() && !tmpStages.includes(tmpNewStage.trim())) { setTmpStages(p => [...p, tmpNewStage.trim()]); setTmpNewStage(''); } };
  const removeTmpStage = (s: string) => setTmpStages(p => p.filter(x => x !== s));

  // Companies
  const openLogInvestment = () => {
    setTmpCompany({ name: '', industry: '', stage: 'Seed', invested: '', roi: '0%', status: 'active', year: new Date().getFullYear().toString() });
    setEditingCompanyId(null);
    setModal('logInvestment');
  };
  const openEditCompany = (c: PortfolioCompany) => {
    setTmpCompany({ name: c.name, industry: c.industry, stage: c.stage, invested: c.invested, roi: c.roi, status: c.status, year: c.year });
    setEditingCompanyId(c.id);
    setModal('editCompany');
  };
  const saveCompany = () => {
    if (!tmpCompany.name.trim()) return;
    if (editingCompanyId) {
      setCompanies(prev => prev.map(c => c.id === editingCompanyId ? { ...c, ...tmpCompany } : c));
    } else {
      setCompanies(prev => [...prev, { id: Date.now().toString(), ...tmpCompany }]);
    }
    closeModal();
  };
  const deleteCompany = (id: string) => setCompanies(prev => prev.filter(c => c.id !== id));

  const activeCount = companies.filter(c => c.status === 'active').length;
  const exitedCount = companies.filter(c => c.status === 'exited').length;

  if (!investor || investor.role !== 'investor') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <Link to="/dashboard/investor"><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <Card>
        <CardBody className="sm:flex sm:items-start sm:justify-between p-6">
          <div className="sm:flex sm:space-x-6">
            <Avatar src={investor.avatarUrl} alt={investor.name} size="xl" status="online" className="mx-auto sm:mx-0" />
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name || investor.name}'s Portfolio</h1>
                <Badge variant="accent">Your Portfolio</Badge>
              </div>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                <Briefcase size={16} className="mr-1" />{companies.length} total investments
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge variant="primary"><MapPin size={14} className="mr-1" />{profileData.location}</Badge>
                {stages.map((s, i) => <Badge key={i} variant="secondary" size="sm">{s}</Badge>)}
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" leftIcon={<Edit3 size={18} />} onClick={openEditProfile}>Edit Profile</Button>
            <Button leftIcon={<Plus size={18} />} onClick={openLogInvestment}>Log New Investment</Button>
          </div>
        </CardBody>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {([
          { label: 'Investment Range', value: `${profileData.minimumInvestment}–${profileData.maximumInvestment}`, icon: DollarSign, color: 'text-primary-700' },
          { label: 'Avg. ROI', value: '3.2x', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Successful Exits', value: exitedCount, icon: CheckCircle, color: 'text-accent-600' },
          { label: 'Active Investments', value: activeCount, icon: Target, color: 'text-blue-600' },
        ] as { label: string; value: string | number; icon: React.FC<any>; color: string }[]).map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardBody className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className={`text-lg font-bold mt-1 ${color}`}>{value}</p>
                </div>
                <Icon size={22} className={color} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Portfolio Companies */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Portfolio Companies</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{companies.length} companies</span>
                <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={openLogInvestment}>Log Investment</Button>
              </div>
            </CardHeader>
            <CardBody>
              {companies.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No investments logged yet.</p>
                  <Button className="mt-3" leftIcon={<Plus size={16} />} onClick={openLogInvestment}>Log First Investment</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {companies.map(company => (
                    <div key={company.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-3 bg-primary-50 rounded-md flex-shrink-0">
                        <Briefcase size={18} className="text-primary-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{company.name}</h3>
                          {company.status === 'exited' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Exited</span>
                          )}
                          {company.status === 'active' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="primary" size="sm">{company.industry}</Badge>
                          <Badge variant="secondary" size="sm">{company.stage}</Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-900">{company.invested}</p>
                        <p className="text-xs text-green-600 font-medium">{company.roi}</p>
                        <p className="text-xs text-gray-400">{company.year}</p>
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <button onClick={() => openEditCompany(company)} className="p-1 text-gray-400 hover:text-primary-600 transition-colors" title="Edit">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => deleteCompany(company.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Investment Interests */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Investment Interests</h2>
              <Button variant="outline" size="sm" leftIcon={<Edit3 size={14} />} onClick={openEditInterests}>Edit</Button>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Industries</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interests.length > 0
                      ? interests.map((i, idx) => <Badge key={idx} variant="primary" size="md">{i}</Badge>)
                      : <p className="text-sm text-gray-400">No industries added yet.</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Investment Stages</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stages.length > 0
                      ? stages.map((s, idx) => <Badge key={idx} variant="secondary" size="md">{s}</Badge>)
                      : <p className="text-sm text-gray-400">No stages added yet.</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Investment Criteria</h3>
                  <ul className="mt-2 space-y-2 text-gray-700">
                    {[
                      'Strong founding team with domain expertise',
                      'Clear market opportunity and product-market fit',
                      'Scalable business model with strong unit economics',
                      'Potential for significant growth and market impact',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* About Me */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">About Me</h2>
              <Button variant="outline" size="sm" leftIcon={<Edit3 size={14} />} onClick={openEditBio}>Edit</Button>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 leading-relaxed">{bio}</p>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Investment Details</h2>
              <Button variant="outline" size="sm" leftIcon={<Edit3 size={14} />} onClick={openEditInvestmentRange}>Edit Range</Button>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Investment Range</span>
                  <p className="text-lg font-semibold text-gray-900">{profileData.minimumInvestment} – {profileData.maximumInvestment}</p>
                </div>
                <div><span className="text-sm text-gray-500">Total Investments</span><p className="text-md font-medium text-gray-900">{companies.length} companies</p></div>
                <div><span className="text-sm text-gray-500">Typical Timeline</span><p className="text-md font-medium text-gray-900">3–5 years</p></div>
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 block mb-2">Investment Focus</span>
                  <div className="space-y-2">
                    {[{ label: 'SaaS & B2B', pct: 75 }, { label: 'FinTech', pct: 60 }, { label: 'HealthTech', pct: 40 }].map(({ label, pct }) => (
                      <div key={label} className="flex justify-between items-center gap-3">
                        <span className="text-xs font-medium w-24 flex-shrink-0">{label}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Investment Stats</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                {([
                  { label: 'Successful Exits', value: exitedCount, icon: BarChart3 },
                  { label: 'Avg. ROI', value: '3.2x', icon: TrendingUp },
                  { label: 'Active Investments', value: activeCount, icon: Briefcase },
                  { label: 'Total Companies', value: companies.length, icon: PieChart },
                ] as { label: string; value: string | number; icon: React.FC<any> }[]).map(({ label, value, icon: Icon }) => (
                  <div key={label} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                        <p className="text-xl font-semibold text-primary-700 mt-1">{value}</p>
                      </div>
                      <Icon size={24} className="text-primary-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ══ MODALS ══ */}

      {modal === 'editProfile' && (
        <Modal title="Edit Profile" onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Full Name">
              <input className={inputClass} placeholder="Your name" value={tmpProfile.name} onChange={e => setTmpProfile(p => ({ ...p, name: e.target.value }))} />
            </Field>
            <Field label="Location">
              <input className={inputClass} placeholder="e.g. New York, NY" value={tmpProfile.location} onChange={e => setTmpProfile(p => ({ ...p, location: e.target.value }))} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveProfile}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'editInvestmentRange' && (
        <Modal title="Edit Investment Range" onClose={closeModal}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Minimum Investment">
                <input className={inputClass} placeholder="e.g. $50K" value={tmpProfile.minimumInvestment} onChange={e => setTmpProfile(p => ({ ...p, minimumInvestment: e.target.value }))} />
              </Field>
              <Field label="Maximum Investment">
                <input className={inputClass} placeholder="e.g. $2M" value={tmpProfile.maximumInvestment} onChange={e => setTmpProfile(p => ({ ...p, maximumInvestment: e.target.value }))} />
              </Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveInvestmentRange}>Save</Button>
            </div>
          </div>
        </Modal>
      )}

      {(modal === 'logInvestment' || modal === 'editCompany') && (
        <Modal title={modal === 'logInvestment' ? 'Log New Investment' : 'Edit Investment'} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Company Name">
              <input className={inputClass} placeholder="e.g. TechFlow AI" value={tmpCompany.name} onChange={e => setTmpCompany(p => ({ ...p, name: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Industry">
                <input className={inputClass} placeholder="e.g. SaaS" value={tmpCompany.industry} onChange={e => setTmpCompany(p => ({ ...p, industry: e.target.value }))} />
              </Field>
              <Field label="Stage">
                <select className={inputClass} value={tmpCompany.stage} onChange={e => setTmpCompany(p => ({ ...p, stage: e.target.value }))}>
                  {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'].map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Amount Invested">
                <input className={inputClass} placeholder="e.g. $500K" value={tmpCompany.invested} onChange={e => setTmpCompany(p => ({ ...p, invested: e.target.value }))} />
              </Field>
              <Field label="ROI">
                <input className={inputClass} placeholder="e.g. +120%" value={tmpCompany.roi} onChange={e => setTmpCompany(p => ({ ...p, roi: e.target.value }))} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Year">
                <input className={inputClass} placeholder="e.g. 2023" value={tmpCompany.year} onChange={e => setTmpCompany(p => ({ ...p, year: e.target.value }))} />
              </Field>
              <Field label="Status">
                <select className={inputClass} value={tmpCompany.status} onChange={e => setTmpCompany(p => ({ ...p, status: e.target.value as 'active' | 'exited' }))}>
                  <option value="active">Active</option>
                  <option value="exited">Exited</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveCompany}>{modal === 'logInvestment' ? 'Log Investment' : 'Save Changes'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'editInterests' && (
        <Modal title="Edit Investment Interests" onClose={closeModal}>
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Industries</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {tmpInterests.map(i => (
                  <span key={i} className="flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
                    {i}
                    <button onClick={() => removeTmpInterest(i)} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input className={inputClass} placeholder="Add industry (e.g. EdTech)" value={tmpNewInterest} onChange={e => setTmpNewInterest(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTmpInterest()} />
                <Button variant="outline" size="sm" onClick={addTmpInterest} leftIcon={<Plus size={14} />}>Add</Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Investment Stages</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {tmpStages.map(s => (
                  <span key={s} className="flex items-center gap-1 bg-secondary-50 text-secondary-700 text-xs font-medium px-2 py-1 rounded-full">
                    {s}
                    <button onClick={() => removeTmpStage(s)} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input className={inputClass} placeholder="Add stage (e.g. Series B)" value={tmpNewStage} onChange={e => setTmpNewStage(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTmpStage()} />
                <Button variant="outline" size="sm" onClick={addTmpStage} leftIcon={<Plus size={14} />}>Add</Button>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveInterests}>Save</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'editBio' && (
        <Modal title="Edit About Me" onClose={closeModal}>
          <div className="space-y-4">
            <Field label="About Me">
              <textarea className={textareaClass} rows={6} placeholder="Tell entrepreneurs about your background and investment philosophy..." value={tmpBio} onChange={e => setTmpBio(e.target.value)} />
            </Field>
            <p className="text-xs text-gray-500">Tip: Mention your background, what you look for in founders, and how you help beyond capital.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveBio}>Save</Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};