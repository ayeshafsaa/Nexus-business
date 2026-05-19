import React, { useState } from 'react';
import { Search, Filter, MapPin, MessageCircle, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { entrepreneurs } from '../../data/users';
import { useCall, Participant } from '../../context/CallContext';

export const EntrepreneursPage: React.FC = () => {
  const navigate = useNavigate();
  const { startCallWith, callStatus } = useCall();
  const isBusy = callStatus === 'calling' || callStatus === 'connected';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFundingRange, setSelectedFundingRange] = useState<string[]>([]);

  const allIndustries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(entrepreneur.industry);
    const matchesFunding = selectedFundingRange.length === 0 ||
      selectedFundingRange.some(range => {
        const amount = parseInt(entrepreneur.fundingNeeded.replace(/[^0-9]/g, ''));
        switch (range) {
          case '< $500K':     return amount < 500;
          case '$500K - $1M': return amount >= 500 && amount <= 1000;
          case '$1M - $5M':   return amount > 1000 && amount <= 5000;
          case '> $5M':       return amount > 5000;
          default: return true;
        }
      });
    return matchesSearch && matchesIndustry && matchesFunding;
  });

  const toggleIndustry    = (i: string) => setSelectedIndustries(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const toggleFundingRange = (r: string) => setSelectedFundingRange(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const handleMessage = (entrepreneurId: string) => {
    navigate(`/messages?userId=${entrepreneurId}`);
  };

  const handleVideoCall = (entrepreneur: typeof entrepreneurs[0]) => {
    if (isBusy) return;
    const participant: Participant = {
      id: entrepreneur.id,
      name: entrepreneur.name,
      avatar: entrepreneur.avatarUrl,
      role: 'entrepreneur',
      isMuted: false,
      isCameraOff: false,
      isOnline: entrepreneur.isOnline ?? true,
    };
    startCallWith(participant, false);
    navigate('/video-call');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Startups</h1>
        <p className="text-gray-600">Discover promising startups looking for investment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Filters</h2></CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Industry</h3>
                <div className="space-y-2">
                  {allIndustries.map(industry => (
                    <button key={industry} onClick={() => toggleIndustry(industry)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                        ${selectedIndustries.includes(industry) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Funding Range</h3>
                <div className="space-y-2">
                  {fundingRanges.map(range => (
                    <button key={range} onClick={() => toggleFundingRange(range)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                        ${selectedFundingRange.includes(range) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {range}
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
              placeholder="Search startups by name, industry, or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              startAdornment={<Search size={18} />}
              fullWidth
            />
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600">{filteredEntrepreneurs.length} results</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntrepreneurs.map(entrepreneur => (
              <div key={entrepreneur.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-primary-200 transition-all">
                <EntrepreneurCard entrepreneur={entrepreneur} />
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    onClick={() => handleMessage(entrepreneur.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-medium rounded-xl border border-primary-200 transition-colors"
                  >
                    <MessageCircle size={15} /> Message
                  </button>
                  <button
                    onClick={() => handleVideoCall(entrepreneur)}
                    disabled={isBusy}
                    title={isBusy ? 'Already on a call' : `Video call ${entrepreneur.name}`}
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