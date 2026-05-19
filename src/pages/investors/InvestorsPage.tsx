import React, { useState } from 'react';
import { Search, Filter, MapPin, MessageCircle, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { investors } from '../../data/users';
import { useCall, Participant } from '../../context/CallContext';

export const InvestorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { startCallWith, callStatus } = useCall();
  const isBusy = callStatus === 'calling' || callStatus === 'connected';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const allStages    = Array.from(new Set(investors.flatMap(i => i.investmentStage)));
  const allInterests = Array.from(new Set(investors.flatMap(i => i.investmentInterests)));

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = searchQuery === '' ||
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.investmentInterests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStages    = selectedStages.length === 0    || investor.investmentStage.some(s => selectedStages.includes(s));
    const matchesInterests = selectedInterests.length === 0 || investor.investmentInterests.some(i => selectedInterests.includes(i));
    return matchesSearch && matchesStages && matchesInterests;
  });

  const toggleStage    = (s: string) => setSelectedStages(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleInterest = (i: string) => setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  // Message — navigates to messages page with this investor pre-selected
  const handleMessage = (investorId: string) => {
    navigate(`/messages?userId=${investorId}`);
  };

  // Video call — starts call and goes to video call page
  const handleVideoCall = (investor: typeof investors[0]) => {
    if (isBusy) return;
    const participant: Participant = {
      id: investor.id,
      name: investor.name,
      avatar: investor.avatarUrl,
      role: 'investor',
      isMuted: false,
      isCameraOff: false,
      isOnline: investor.isOnline ?? true,
    };
    startCallWith(participant, false);
    navigate('/video-call');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Investors</h1>
        <p className="text-gray-600">Connect with investors who match your startup's needs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Filters</h2></CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Investment Stage</h3>
                <div className="space-y-2">
                  {allStages.map(stage => (
                    <button key={stage} onClick={() => toggleStage(stage)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                        ${selectedStages.includes(stage) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Investment Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors
                        ${selectedInterests.includes(interest)
                          ? 'bg-primary-100 text-primary-700 border-primary-300'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                <div className="space-y-2">
                  {['San Francisco, CA', 'New York, NY', 'Boston, MA'].map(loc => (
                    <button key={loc} className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                      <MapPin size={16} className="mr-2" /> {loc}
                    </button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search investors by name, interests, or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              startAdornment={<Search size={18} />}
              fullWidth
            />
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600">{filteredInvestors.length} results</span>
            </div>
          </div>

          {/* Investor cards with Message + Video Call buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInvestors.map(investor => (
              <div key={investor.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-primary-200 transition-all">
                {/* Existing InvestorCard */}
                <InvestorCard investor={investor} />

                {/* Action buttons row */}
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    onClick={() => handleMessage(investor.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-medium rounded-xl border border-primary-200 transition-colors"
                  >
                    <MessageCircle size={15} /> Message
                  </button>
                  <button
                    onClick={() => handleVideoCall(investor)}
                    disabled={isBusy}
                    title={isBusy ? 'Already on a call' : `Video call ${investor.name}`}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-xl border transition-colors
                      ${isBusy
                        ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'}`}
                  >
                    <Video size={15} /> Video Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};