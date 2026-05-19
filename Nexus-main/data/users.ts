import { Entrepreneur, Investor } from '../types';

export const entrepreneurs: Entrepreneur[] = [
  {
    id: 'e1',
    name: 'Sarah Johnson',
    email: 'sarah@techwave.io',
    role: 'entrepreneur',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    bio: 'Serial entrepreneur with 10+ years of experience in SaaS and fintech.',
    startupName: 'TechWave AI',
    pitchSummary: 'AI-powered financial analytics platform helping SMBs make data-driven decisions.',
    fundingNeeded: '$1.5M',
    industry: 'FinTech',
    location: 'San Francisco, CA',
    foundedYear: 2021,
    teamSize: 12,
    isOnline: true,
    createdAt: '2023-01-15T09:24:00Z'
  },
  {
    id: 'e2',
    name: 'David Chen',
    email: 'david@greenlife.co',
    role: 'entrepreneur',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    bio: 'Environmental scientist turned entrepreneur. Passionate about sustainable solutions.',
    startupName: 'GreenLife Solutions',
    pitchSummary: 'Biodegradable packaging alternatives for consumer goods and food industry.',
    fundingNeeded: '$2M',
    industry: 'CleanTech',
    location: 'Portland, OR',
    foundedYear: 2020,
    teamSize: 8,
    isOnline: false,
    createdAt: '2022-03-10T14:35:00Z'
  },
  {
    id: 'e3',
    name: 'Maya Patel',
    email: 'maya@healthpulse.com',
    role: 'entrepreneur',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    bio: 'Former healthcare professional with an MBA. Building tech to improve patient care.',
    startupName: 'HealthPulse',
    pitchSummary: 'Mobile platform connecting patients with mental health professionals in real-time.',
    fundingNeeded: '$800K',
    industry: 'HealthTech',
    location: 'Boston, MA',
    foundedYear: 2022,
    teamSize: 5,
    isOnline: true,
    createdAt: '2022-07-22T11:42:00Z'
  },
  {
    id: 'e4',
    name: 'James Wilson',
    email: 'james@urbanfarm.io',
    role: 'entrepreneur',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    bio: 'Agricultural engineer focused on urban farming solutions and food security.',
    startupName: 'UrbanFarm',
    pitchSummary: 'IoT-enabled vertical farming systems for urban environments and food deserts.',
    fundingNeeded: '$3M',
    industry: 'AgTech',
    location: 'Chicago, IL',
    foundedYear: 2019,
    teamSize: 14,
    isOnline: false,
    createdAt: '2021-11-05T16:18:00Z'
  }
];

export const investors: Investor[] = [
  {
    id: 'i1',
    name: 'Michael Rodriguez',
    email: 'michael@vcinnovate.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    bio: 'Early-stage investor with focus on B2B SaaS and fintech. Previously founded and exited two startups.',
    investmentInterests: ['FinTech', 'SaaS', 'AI/ML'],
    investmentStage: ['Seed', 'Series A'],
    portfolioCompanies: ['PayStream', 'DataSense', 'CloudSecure'],
    totalInvestments: 12,
    minimumInvestment: '$250K',
    maximumInvestment: '$1.5M',
    isOnline: true,
    createdAt: '2020-05-18T10:15:00Z'
  },
  {
    id: 'i2',
    name: 'Jennifer Lee',
    email: 'jennifer@impactvc.org',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    bio: 'Impact investor focused on climate tech, sustainable agriculture, and clean energy.',
    investmentInterests: ['CleanTech', 'AgTech', 'Sustainability'],
    investmentStage: ['Seed', 'Series A', 'Series B'],
    portfolioCompanies: ['SolarFlow', 'EcoPackage', 'CleanWater Solutions'],
    totalInvestments: 18,
    minimumInvestment: '$500K',
    maximumInvestment: '$3M',
    isOnline: false,
    createdAt: '2019-08-30T15:40:00Z'
  },
  {
    id: 'i3',
    name: 'Robert Torres',
    email: 'robert@healthventures.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg',
    bio: 'Healthcare-focused investor with medical background. Looking for innovations in patient care and biotech.',
    investmentInterests: ['HealthTech', 'BioTech', 'Medical Devices'],
    investmentStage: ['Series A', 'Series B'],
    portfolioCompanies: ['MediTrack', 'BioGenics', 'Patient+'],
    totalInvestments: 9,
    minimumInvestment: '$1M',
    maximumInvestment: '$5M',
    isOnline: true,
    createdAt: '2021-02-12T09:30:00Z'
  },
  // ── Investors referenced from EntrepreneurDashboard collaboration requests ──
  {
    id: 'inv-michael-chen',
    name: 'Michael Chen',
    email: 'michael.chen@sequoia.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    bio: 'Partner at Sequoia Capital focusing on early-stage B2B SaaS, AI/ML, and FinTech startups. 10+ years of investing experience with multiple unicorn exits.',
    investmentInterests: ['SaaS', 'AI/ML', 'FinTech'],
    investmentStage: ['Seed', 'Series A'],
    portfolioCompanies: ['CloudBase', 'NeuralPay', 'SaaSMetrics'],
    totalInvestments: 22,
    minimumInvestment: '$500K',
    maximumInvestment: '$2M',
    isOnline: true,
    createdAt: '2018-03-10T08:00:00Z'
  },
  {
    id: 'inv-sarah-williams',
    name: 'Sarah Williams',
    email: 'sarah.williams@a16z.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    bio: 'General Partner at Andreessen Horowitz. Passionate about HealthTech and Biotech innovations that improve patient outcomes at scale.',
    investmentInterests: ['HealthTech', 'Biotech', 'AI'],
    investmentStage: ['Series A', 'Series B'],
    portfolioCompanies: ['GenomicAI', 'CareLoop', 'BioSynth'],
    totalInvestments: 15,
    minimumInvestment: '$1M',
    maximumInvestment: '$5M',
    isOnline: true,
    createdAt: '2017-09-20T10:00:00Z'
  },
  {
    id: 'inv-james-patel',
    name: 'James Patel',
    email: 'james.patel@ycombinator.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    bio: 'Partner at Y Combinator with deep expertise in EdTech, Consumer apps, and Marketplace businesses. Mentor to 50+ portfolio companies.',
    investmentInterests: ['EdTech', 'Consumer', 'Marketplace'],
    investmentStage: ['Pre-seed', 'Seed'],
    portfolioCompanies: ['LearnFast', 'MarketNest', 'ShopLocal'],
    totalInvestments: 31,
    minimumInvestment: '$250K',
    maximumInvestment: '$1M',
    isOnline: false,
    createdAt: '2016-06-01T09:00:00Z'
  },
  {
    id: 'inv-aisha-kamara',
    name: 'Aisha Kamara',
    email: 'aisha.kamara@tigerglobal.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    bio: 'Investment Director at Tiger Global. Leads Series A rounds in E-commerce, Logistics, and PropTech with a focus on high-growth emerging markets.',
    investmentInterests: ['E-commerce', 'Logistics', 'PropTech'],
    investmentStage: ['Series A', 'Series B'],
    portfolioCompanies: ['ShipFast', 'PropMatch', 'CartFlow'],
    totalInvestments: 11,
    minimumInvestment: '$2M',
    maximumInvestment: '$10M',
    isOnline: true,
    createdAt: '2019-01-15T11:00:00Z'
  },
  // ── Recommended investors shown in dashboard sidebar ──
  {
    id: 'inv1',
    name: 'David Nguyen',
    email: 'david.nguyen@lightspeed.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    bio: 'Managing Director at Lightspeed Ventures specializing in SaaS, B2B tools, and AI-powered enterprise software.',
    investmentInterests: ['SaaS', 'B2B', 'AI'],
    investmentStage: ['Seed', 'Series A'],
    portfolioCompanies: ['TaskAI', 'B2BHub', 'SaaSly'],
    totalInvestments: 17,
    minimumInvestment: '$500K',
    maximumInvestment: '$3M',
    isOnline: true,
    createdAt: '2020-02-20T09:00:00Z'
  },
  {
    id: 'inv2',
    name: 'Priya Sharma',
    email: 'priya.sharma@accel.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    bio: 'Partner at Accel Partners. Invests in FinTech, SaaS, and Consumer startups with proven product-market fit and strong founding teams.',
    investmentInterests: ['FinTech', 'SaaS', 'Consumer'],
    investmentStage: ['Series A', 'Series B'],
    portfolioCompanies: ['FinFlow', 'ConsumerEdge', 'PayLite'],
    totalInvestments: 14,
    minimumInvestment: '$1M',
    maximumInvestment: '$5M',
    isOnline: true,
    createdAt: '2019-11-05T10:00:00Z'
  },
  {
    id: 'inv3',
    name: 'Robert Kim',
    email: 'robert.kim@bessemer.com',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
    bio: 'Venture Partner at Bessemer Venture Partners. Focuses on Cloud infrastructure, Security, and Developer Tools.',
    investmentInterests: ['Cloud', 'Security', 'DevTools'],
    investmentStage: ['Series A', 'Series B', 'Series C'],
    portfolioCompanies: ['CloudShield', 'DevKit', 'SecureOps'],
    totalInvestments: 19,
    minimumInvestment: '$2M',
    maximumInvestment: '$8M',
    isOnline: false,
    createdAt: '2018-07-12T08:30:00Z'
  },
];

// Combined user data for lookup
export const users = [...entrepreneurs, ...investors];

// Helper function to find a user by ID
export const findUserById = (id: string) => {
  return users.find(user => user.id === id) || null;
};

// Helper function to get a user by role
export const getUsersByRole = (role: 'entrepreneur' | 'investor') => {
  return users.filter(user => user.role === role);
};