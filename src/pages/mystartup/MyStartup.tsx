import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, MapPin, Calendar, Users, DollarSign,
  FileText, TrendingUp, Edit3, Plus, Target, BarChart2,
  CheckCircle, Clock, AlertCircle, X, Trash2, Save, Download
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { Entrepreneur } from '../../types';

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

interface TeamMember { id: string; name: string; role: string; avatarUrl: string; }
interface Milestone { id: string; label: string; date: string; done: boolean; }
interface StartupOverview { problem: string; solution: string; market: string; advantage: string; }
interface Update { id: string; title: string; body: string; date: string; }
interface DocFile { name: string; updated: string; url: string; }

export const MyStartup: React.FC = () => {
  const { user: currentUser, updateProfile } = useAuth();
  const entrepreneur = currentUser as Entrepreneur;

  const [pitch, setPitch] = useState(
    entrepreneur?.pitchSummary ||
    'We are building an AI-powered platform that connects entrepreneurs with the right investors at the right stage — reducing the fundraising timeline from months to weeks through smart matching, automated due diligence tools, and structured collaboration workflows.'
  );

  const [overview, setOverview] = useState<StartupOverview>({
    problem: 'Entrepreneurs spend 6–12 months searching for the right investors, with no structured way to reach decision-makers. Most outreach goes unanswered.',
    solution: 'Our platform uses data-driven matching to connect startups with investors whose thesis, stage preference, and sector focus align — turning cold outreach into warm introductions.',
    market: `The ${entrepreneur?.industry || 'tech'} market is experiencing significant growth, with a projected CAGR of 14.5% through 2027. Our solution addresses key pain points in this expanding market.`,
    advantage: 'Unlike competitors, our approach combines AI-powered matching with deep industry expertise, resulting in 3x faster fundraising timelines and higher investor conversion rates.',
  });

  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: entrepreneur?.name || 'You', role: 'Founder & CEO', avatarUrl: entrepreneur?.avatarUrl || '' },
    { id: '2', name: 'Alex Johnson', role: 'CTO', avatarUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg' },
    { id: '3', name: 'Jessica Chen', role: 'Head of Product', avatarUrl: 'https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg' },
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', label: 'MVP Launched', date: 'Jan 2022', done: true },
    { id: '2', label: 'First 100 customers', date: 'Apr 2022', done: true },
    { id: '3', label: 'Seed round closed — $750K', date: 'Jul 2022', done: true },
    { id: '4', label: 'Series A fundraising', date: 'Ongoing', done: false },
  ]);

  const [updates, setUpdates] = useState<Update[]>([
    { id: '1', title: 'Reached 1,200 active users!', body: 'Excited to share that we crossed 1,200 monthly active users this week — a 20% jump from last month.', date: 'May 2026' },
  ]);

  const [profileData, setProfileData] = useState({
    startupName: entrepreneur?.startupName || '',
    industry: entrepreneur?.industry || '',
    location: entrepreneur?.location || '',
    foundedYear: entrepreneur?.foundedYear?.toString() || '',
    teamSize: entrepreneur?.teamSize?.toString() || '',
    fundingNeeded: entrepreneur?.fundingNeeded || '',
  });

  const [docs, setDocs] = useState<DocFile[]>([
    { name: 'Pitch Deck', updated: '2 months ago', url: '' },
    { name: 'Business Plan', updated: '1 month ago', url: '' },
    { name: 'Financial Projections', updated: '2 weeks ago', url: '' },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    setDocs(prev => [...prev, { name: file.name, updated: `Uploaded ${now}`, url }]);
    e.target.value = ''; // reset so same file can be uploaded again
  };

  const handleViewDoc = (doc: DocFile) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      alert(`"${doc.name}" is a sample document. Upload a real file to view it.`);
    }
  };

  const handleDeleteDoc = (name: string) => {
    setDocs(prev => prev.filter(d => d.name !== name));
  };

  type ModalType = 'editProfile' | 'addUpdate' | 'editPitch' | 'editOverview' | 'addMember' | 'editMember' | 'addMilestone' | null;
  const [modal, setModal] = useState<ModalType>(null);
  const closeModal = () => setModal(null);

  const [tmpPitch, setTmpPitch] = useState('');
  const [tmpOverview, setTmpOverview] = useState<StartupOverview>(overview);
  const [tmpProfile, setTmpProfile] = useState(profileData);
  const [tmpMember, setTmpMember] = useState<Omit<TeamMember, 'id'>>({ name: '', role: '', avatarUrl: '' });
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [tmpMilestone, setTmpMilestone] = useState({ label: '', date: '', done: false });
  const [tmpUpdate, setTmpUpdate] = useState({ title: '', body: '' });

  const openEditProfile = () => { setTmpProfile(profileData); setModal('editProfile'); };
  const saveProfile = () => {
    setProfileData(tmpProfile);
    updateProfile(entrepreneur.id, {
      startupName: tmpProfile.startupName,
      industry: tmpProfile.industry,
      location: tmpProfile.location,
      foundedYear: parseInt(tmpProfile.foundedYear),
      teamSize: parseInt(tmpProfile.teamSize),
      fundingNeeded: tmpProfile.fundingNeeded,
    } as any);
    closeModal();
  };

  const openEditPitch = () => { setTmpPitch(pitch); setModal('editPitch'); };
  const savePitch = () => { setPitch(tmpPitch); updateProfile(entrepreneur.id, { pitchSummary: tmpPitch } as any); closeModal(); };

  const openEditOverview = () => { setTmpOverview(overview); setModal('editOverview'); };
  const saveOverview = () => { setOverview(tmpOverview); closeModal(); };

  const openAddMember = () => { setTmpMember({ name: '', role: '', avatarUrl: '' }); setEditingMemberId(null); setModal('addMember'); };
  const openEditMember = (m: TeamMember) => { setTmpMember({ name: m.name, role: m.role, avatarUrl: m.avatarUrl }); setEditingMemberId(m.id); setModal('editMember'); };
  const saveMember = () => {
    if (!tmpMember.name.trim() || !tmpMember.role.trim()) return;
    if (editingMemberId) {
      setTeam(prev => prev.map(m => m.id === editingMemberId ? { ...m, ...tmpMember } : m));
    } else {
      setTeam(prev => [...prev, { id: Date.now().toString(), ...tmpMember }]);
    }
    closeModal();
  };
  const deleteMember = (id: string) => setTeam(prev => prev.filter(m => m.id !== id));

  const openAddMilestone = () => { setTmpMilestone({ label: '', date: '', done: false }); setModal('addMilestone'); };
  const saveMilestone = () => {
    if (!tmpMilestone.label.trim()) return;
    setMilestones(prev => [...prev, { id: Date.now().toString(), ...tmpMilestone }]);
    closeModal();
  };
  const deleteMilestone = (id: string) => setMilestones(prev => prev.filter(m => m.id !== id));
  const toggleMilestone = (id: string) => setMilestones(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m));

  const openAddUpdate = () => { setTmpUpdate({ title: '', body: '' }); setModal('addUpdate'); };
  const saveUpdate = () => {
    if (!tmpUpdate.title.trim()) return;
    setUpdates(prev => [{ id: Date.now().toString(), ...tmpUpdate, date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }, ...prev]);
    closeModal();
  };

  const fundingStages = [
    { label: 'Pre-seed', status: 'completed' },
    { label: 'Seed', status: 'completed' },
    { label: 'Series A', status: 'in-progress' },
    { label: 'Series B', status: 'upcoming' },
  ];
  const statusIcon = (s: string) => s === 'completed' ? <CheckCircle size={14} className="text-green-600" /> : s === 'in-progress' ? <Clock size={14} className="text-yellow-600" /> : <AlertCircle size={14} className="text-gray-400" />;
  const statusBadge = (s: string) => s === 'completed' ? 'bg-green-100 text-green-800' : s === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500';

  if (!entrepreneur || entrepreneur.role !== 'entrepreneur') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <Link to="/dashboard/entrepreneur"><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <Card>
        <CardBody className="sm:flex sm:items-start sm:justify-between p-6">
          <div className="sm:flex sm:space-x-6">
            <Avatar src={entrepreneur.avatarUrl} alt={entrepreneur.name} size="xl" status="online" className="mx-auto sm:mx-0" />
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-gray-900">{profileData.startupName || entrepreneur.startupName}</h1>
                <Badge variant="accent">Your Startup</Badge>
              </div>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                <Building2 size={16} className="mr-1" /> Founded by {entrepreneur.name}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge variant="primary">{profileData.industry || entrepreneur.industry}</Badge>
                <Badge variant="gray"><MapPin size={14} className="mr-1" />{profileData.location || entrepreneur.location}</Badge>
                <Badge variant="accent"><Calendar size={14} className="mr-1" />Founded {profileData.foundedYear || entrepreneur.foundedYear}</Badge>
                <Badge variant="secondary"><Users size={14} className="mr-1" />{team.length} team members</Badge>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
            <Button variant="outline" leftIcon={<Edit3 size={18} />} onClick={openEditProfile}>Edit Startup</Button>
            <Button leftIcon={<Plus size={18} />} onClick={openAddUpdate}>Add Update</Button>
          </div>
        </CardBody>
      </Card>

      {/* Recent Updates */}
      {updates.length > 0 && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Updates</h2>
            <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={openAddUpdate}>Add Update</Button>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {updates.map(u => (
                <div key={u.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-md bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{u.title}</p>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{u.date}</span>
                    </div>
                    {u.body && <p className="text-sm text-gray-600 mt-1">{u.body}</p>}
                  </div>
                  <button onClick={() => setUpdates(prev => prev.filter(x => x.id !== u.id))} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Pitch Summary */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Pitch Summary</h2>
              <Button variant="outline" size="sm" leftIcon={<Edit3 size={14} />} onClick={openEditPitch}>Edit</Button>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 leading-relaxed">{pitch}</p>
            </CardBody>
          </Card>

          {/* Startup Overview */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Startup Overview</h2>
              <Button variant="outline" size="sm" leftIcon={<Edit3 size={14} />} onClick={openEditOverview}>Edit</Button>
            </CardHeader>
            <CardBody>
              <div className="space-y-5">
                {([
                  { label: 'Problem Statement', value: overview.problem },
                  { label: 'Solution', value: overview.solution },
                  { label: 'Market Opportunity', value: overview.market },
                  { label: 'Competitive Advantage', value: overview.advantage },
                ] as { label: string; value: string }[]).map(({ label, value }) => (
                  <div key={label}>
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{label}</h3>
                    <p className="text-gray-700 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Team</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{team.length} members</span>
                <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={openAddMember}>Add Member</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {team.map((member, i) => (
                  <div key={member.id} className={`flex items-center p-3 border rounded-md ${i === 0 ? 'border-primary-200 bg-primary-50' : 'border-gray-200'}`}>
                    <Avatar
                      src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                      alt={member.name} size="md" className="mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{member.name}</h3>
                      <p className="text-xs text-gray-500">{member.role}</p>
                      {i === 0 && <span className="text-xs text-primary-600 font-medium">You</span>}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => openEditMember(member)} className="p-1 text-gray-400 hover:text-primary-600 transition-colors" title="Edit">
                        <Edit3 size={14} />
                      </button>
                      {i !== 0 && (
                        <button onClick={() => deleteMember(member.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Milestones & Traction</h2>
              <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={openAddMilestone}>Add Milestone</Button>
            </CardHeader>
            <CardBody>
              {milestones.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No milestones yet. Add your first one!</p>
              ) : (
                <div className="space-y-3">
                  {milestones.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-md">
                      <button onClick={() => toggleMilestone(m.id)} className="flex-shrink-0" title="Toggle status">
                        {m.done ? <CheckCircle size={18} className="text-green-500" /> : <Clock size={18} className="text-yellow-500" />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${m.done ? 'text-gray-900' : 'text-gray-700'}`}>{m.label}</p>
                      </div>
                      <span className="text-xs text-gray-400 mr-2">{m.date}</span>
                      <button onClick={() => deleteMilestone(m.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Funding Status</h2></CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Current Round</span>
                  <div className="flex items-center mt-1">
                    <DollarSign size={18} className="text-accent-600 mr-1" />
                    <p className="text-lg font-semibold text-gray-900">{profileData.fundingNeeded || entrepreneur.fundingNeeded}</p>
                  </div>
                </div>
                <div><span className="text-sm text-gray-500">Valuation</span><p className="text-md font-medium text-gray-900">$8M – $12M</p></div>
                <div><span className="text-sm text-gray-500">Previous Funding</span><p className="text-md font-medium text-gray-900">$750K Seed (2022)</p></div>
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 block mb-2">Funding Timeline</span>
                  <div className="space-y-2">
                    {fundingStages.map(stage => (
                      <div key={stage.label} className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">{statusIcon(stage.status)}<span className="text-xs font-medium">{stage.label}</span></div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(stage.status)}`}>
                          {stage.status === 'completed' ? 'Completed' : stage.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Key Metrics</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                {([
                  { label: 'Monthly Revenue', value: '$24K', icon: TrendingUp },
                  { label: 'Active Users', value: '1,200', icon: Users },
                  { label: 'MoM Growth', value: '+18%', icon: BarChart2 },
                  { label: 'Runway', value: '14 months', icon: Target },
                ] as { label: string; value: string; icon: React.FC<any> }[]).map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between p-3 border border-gray-100 rounded-md bg-gray-50">
                    <div className="flex items-center gap-2"><Icon size={16} className="text-primary-600" /><span className="text-sm text-gray-600">{label}</span></div>
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={handleUploadClick}>Upload</Button>
            </CardHeader>
            <CardBody>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xlsx,.pptx,.png,.jpg"
                onChange={handleFileChange}
              />
              <div className="space-y-3">
                {docs.map(doc => (
                  <div key={doc.name} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-primary-50 rounded-md mr-3"><FileText size={16} className="text-primary-700" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                      <p className="text-xs text-gray-500">{doc.updated}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDoc(doc)}>View</Button>
                      <button onClick={() => handleDeleteDoc(doc.name)} className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-1" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {docs.length === 0 && (
                  <div className="text-center py-6">
                    <FileText size={28} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">No documents yet. Click Upload to add one.</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ══ MODALS ══ */}

      {modal === 'editProfile' && (
        <Modal title="Edit Startup Profile" onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Startup Name">
              <input className={inputClass} value={tmpProfile.startupName} onChange={e => setTmpProfile(p => ({ ...p, startupName: e.target.value }))} />
            </Field>
            <Field label="Industry">
              <input className={inputClass} value={tmpProfile.industry} onChange={e => setTmpProfile(p => ({ ...p, industry: e.target.value }))} />
            </Field>
            <Field label="Location">
              <input className={inputClass} value={tmpProfile.location} onChange={e => setTmpProfile(p => ({ ...p, location: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Founded Year">
                <input className={inputClass} type="number" value={tmpProfile.foundedYear} onChange={e => setTmpProfile(p => ({ ...p, foundedYear: e.target.value }))} />
              </Field>
              <Field label="Funding Needed">
                <input className={inputClass} placeholder="e.g. $2M Series A" value={tmpProfile.fundingNeeded} onChange={e => setTmpProfile(p => ({ ...p, fundingNeeded: e.target.value }))} />
              </Field>
            </div>
            <p className="text-xs text-gray-500 bg-gray-50 rounded-md p-2">💡 Team members are managed in the Team section — use Add Member / Delete to change your team size.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveProfile}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'addUpdate' && (
        <Modal title="Post an Update" onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Update Title">
              <input className={inputClass} placeholder="e.g. Reached 1,000 users!" value={tmpUpdate.title} onChange={e => setTmpUpdate(p => ({ ...p, title: e.target.value }))} />
            </Field>
            <Field label="Details (optional)">
              <textarea className={textareaClass} rows={4} placeholder="Share more about this update..." value={tmpUpdate.body} onChange={e => setTmpUpdate(p => ({ ...p, body: e.target.value }))} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveUpdate}>Post Update</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'editPitch' && (
        <Modal title="Edit Pitch Summary" onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Pitch Summary">
              <textarea className={textareaClass} rows={6} placeholder="Describe your startup in a few compelling sentences..." value={tmpPitch} onChange={e => setTmpPitch(e.target.value)} />
            </Field>
            <p className="text-xs text-gray-500">Tip: Keep it clear and compelling — investors read hundreds of pitches.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={savePitch}>Save</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'editOverview' && (
        <Modal title="Edit Startup Overview" onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Problem Statement">
              <textarea className={textareaClass} rows={3} value={tmpOverview.problem} onChange={e => setTmpOverview(p => ({ ...p, problem: e.target.value }))} />
            </Field>
            <Field label="Solution">
              <textarea className={textareaClass} rows={3} value={tmpOverview.solution} onChange={e => setTmpOverview(p => ({ ...p, solution: e.target.value }))} />
            </Field>
            <Field label="Market Opportunity">
              <textarea className={textareaClass} rows={3} value={tmpOverview.market} onChange={e => setTmpOverview(p => ({ ...p, market: e.target.value }))} />
            </Field>
            <Field label="Competitive Advantage">
              <textarea className={textareaClass} rows={3} value={tmpOverview.advantage} onChange={e => setTmpOverview(p => ({ ...p, advantage: e.target.value }))} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveOverview}>Save</Button>
            </div>
          </div>
        </Modal>
      )}

      {(modal === 'addMember' || modal === 'editMember') && (
        <Modal title={modal === 'addMember' ? 'Add Team Member' : 'Edit Team Member'} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Full Name">
              <input className={inputClass} placeholder="e.g. John Smith" value={tmpMember.name} onChange={e => setTmpMember(p => ({ ...p, name: e.target.value }))} />
            </Field>
            <Field label="Role / Title">
              <input className={inputClass} placeholder="e.g. Head of Marketing" value={tmpMember.role} onChange={e => setTmpMember(p => ({ ...p, role: e.target.value }))} />
            </Field>
            <Field label="Avatar URL (optional)">
              <input className={inputClass} placeholder="https://..." value={tmpMember.avatarUrl} onChange={e => setTmpMember(p => ({ ...p, avatarUrl: e.target.value }))} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveMember}>{modal === 'addMember' ? 'Add Member' : 'Save Changes'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'addMilestone' && (
        <Modal title="Add Milestone" onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Milestone">
              <input className={inputClass} placeholder="e.g. Launched beta version" value={tmpMilestone.label} onChange={e => setTmpMilestone(p => ({ ...p, label: e.target.value }))} />
            </Field>
            <Field label="Date">
              <input className={inputClass} placeholder="e.g. Mar 2024" value={tmpMilestone.date} onChange={e => setTmpMilestone(p => ({ ...p, date: e.target.value }))} />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={tmpMilestone.done ? 'done' : 'pending'} onChange={e => setTmpMilestone(p => ({ ...p, done: e.target.value === 'done' }))}>
                <option value="done">Completed ✓</option>
                <option value="pending">In Progress / Upcoming</option>
              </select>
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button leftIcon={<Save size={16} />} onClick={saveMilestone}>Add Milestone</Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};