import { TourStep } from '../context/WalkthroughContext';

export const entrepreneurTourSteps: TourStep[] = [
  {
    target: 'body',
    title: '👋 Welcome to Nexus!',
    content: "This quick tour will show you everything Nexus has to offer. You'll be connecting with investors and growing your startup in no time!",
    placement: 'center',
  },
  {
    target: '[data-tour="sidebar"]',
    title: '🗺️ Navigation Sidebar',
    content: 'Everything you need is here — your dashboard, messages, documents, calendar, payments and security settings.',
    placement: 'right',
  },
  {
    target: '[data-tour="dashboard-stats"]',
    title: '📊 Your Stats at a Glance',
    content: 'See your pending investor requests, active connections, upcoming meetings, and wallet balance — all updated in real time.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="wallet-balance"]',
    title: '💳 Your Wallet',
    content: 'Track your funding balance. Received investments show up here instantly. Click to go to the full Payments page.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="collab-requests"]',
    title: '🤝 Investor Requests',
    content: 'Investors who want to connect with your startup appear here. Accept, decline, or message them directly.',
    placement: 'right',
  },
  {
    target: '[data-tour="find-investors-btn"]',
    title: '🔍 Find Investors',
    content: 'Browse hundreds of investors filtered by industry, ticket size and location. Send collaboration requests in one click.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-messages"]',
    title: '💬 Messages',
    content: 'Chat with investors directly. All your conversations are here — search, filter, and reply in real time.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-documents"]',
    title: '📄 Document Chamber',
    content: 'Upload pitch decks, term sheets and NDAs. Sign documents digitally and track their status from Draft to Signed.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-calendar"]',
    title: '📅 Calendar',
    content: 'Schedule and manage meetings with investors. Set your availability and accept or decline meeting requests.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-payments"]',
    title: '💰 Payments',
    content: 'View your full transaction history, deposit funds, withdraw to your bank, and track incoming investment tranches.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-security"]',
    title: '🔒 Security',
    content: 'Enable two-factor authentication, manage trusted devices, and monitor login activity to keep your account safe.',
    placement: 'right',
  },
  {
    target: 'body',
    title: "🚀 You're all set!",
    content: "That's the full Nexus platform! Start by updating your startup profile and browsing investors. Good luck!",
    placement: 'center',
  },
];

export const investorTourSteps: TourStep[] = [
  {
    target: 'body',
    title: '👋 Welcome to Nexus!',
    content: "This quick tour will guide you through the platform. You'll be discovering promising startups and funding deals in minutes!",
    placement: 'center',
  },
  {
    target: '[data-tour="sidebar"]',
    title: '🗺️ Navigation Sidebar',
    content: 'Your complete toolkit — discover startups, manage deals, communicate, and control your investment wallet from here.',
    placement: 'right',
  },
  {
    target: '[data-tour="dashboard-stats"]',
    title: '📊 Investment Overview',
    content: 'Your available capital, total startups in the ecosystem, active industries, and your current connections — all at a glance.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="wallet-balance"]',
    title: '💳 Available to Invest',
    content: "Your current wallet balance ready to deploy into deals. Click 'Fund a Deal' to send capital directly to an entrepreneur.",
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-startups"]',
    title: '🏢 Find Startups',
    content: 'Browse entrepreneurs filtered by industry, funding stage, and location. View full pitch decks and team profiles.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-deals"]',
    title: '📋 Deals',
    content: 'Track all your active and past deals. See deal status, funding amounts, and milestone progress in one place.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-messages"]',
    title: '💬 Messages',
    content: 'Direct messaging with entrepreneurs. Discuss terms, ask questions, and build relationships before committing capital.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-calendar"]',
    title: '📅 Calendar',
    content: 'Schedule pitch calls and due diligence meetings. Sync your availability with entrepreneurs seamlessly.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-payments"]',
    title: '💰 Payments',
    content: 'Deposit funds, transfer capital, and fund deals directly. Full transaction history with sender, receiver and status.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-security"]',
    title: '🔒 Security',
    content: 'Protect your investment account with 2FA, monitor login activity, and manage device access.',
    placement: 'right',
  },
  {
    target: 'body',
    title: "🚀 Ready to invest!",
    content: "You know the platform inside out. Start by browsing startups or funding an existing deal. Happy investing!",
    placement: 'center',
  },
];