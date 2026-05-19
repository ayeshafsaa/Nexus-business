import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle,
  Phone,
  CheckCircle,
  AlertCircle,
  X,
  HelpCircle,
  BookOpen,
  Zap,
  Shield,
  Users,
  CreditCard,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Getting Started', 'Investors', 'Documents', 'Account', 'Billing'];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Getting Started': <Zap size={13} />,
  Investors:         <Users size={13} />,
  Documents:         <Shield size={13} />,
  Account:           <BookOpen size={13} />,
  Billing:           <CreditCard size={13} />,
};

const FAQS: FAQ[] = [
  // Getting Started
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I set up my startup profile?',
    answer:
      'Go to Settings → Profile and fill in your startup details — a compelling pitch, funding needs, team bios, market opportunity, and traction metrics. A fully completed profile receives up to 3× more investor views than an incomplete one.',
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'What happens after I sign up?',
    answer:
      'You\'ll be guided through a quick onboarding flow: complete your profile, upload your pitch deck, and set your funding goal. Once our team approves your account (usually within 24 hours), your profile becomes visible to the investor network.',
  },
  {
    id: 3,
    category: 'Getting Started',
    question: 'How do I track my profile views and activity?',
    answer:
      'Your dashboard shows real-time stats — profile views, collaboration requests, and active connections. For a deeper breakdown, go to Analytics in the sidebar to see view trends, investor engagement, and document access history.',
  },
  // Investors
  {
    id: 4,
    category: 'Investors',
    question: 'How do I connect with investors?',
    answer:
      'Browse the Investor Directory and filter by industry, stage, or ticket size. Click "Request Connection" on any profile. Once an investor accepts, a private messaging thread opens automatically so you can start a conversation.',
  },
  {
    id: 5,
    category: 'Investors',
    question: 'What are collaboration requests?',
    answer:
      'Collaboration requests are formal expressions of interest from investors who want to explore an investment opportunity with you. You\'ll receive a notification and can accept, decline, or schedule a call directly from the request card on your dashboard.',
  },
  {
    id: 6,
    category: 'Investors',
    question: 'Can I message investors who haven\'t connected yet?',
    answer:
      'Direct messaging is only available after a mutual connection. However, you can send a connection request with a personalised note (up to 300 characters) to introduce yourself and explain why you\'d like to connect.',
  },
  // Documents
  {
    id: 7,
    category: 'Documents',
    question: 'How do I share documents securely?',
    answer:
      'Upload files to your Document Vault (Documents tab). Each file gets a unique access link. Open the document, click "Share," select the connected investors you want to grant access to, and set an optional expiry date. All files are AES-256 encrypted at rest.',
  },
  {
    id: 8,
    category: 'Documents',
    question: 'What file types are supported?',
    answer:
      'We support PDF, DOCX, PPTX, XLSX, PNG, JPG, and MP4 (pitch videos up to 500 MB). For best compatibility we recommend PDF for pitch decks and financial models. Files larger than 500 MB should be shared via a link in your profile.',
  },
  {
    id: 9,
    category: 'Documents',
    question: 'Can I revoke document access after sharing?',
    answer:
      'Yes. In the Document Vault, open the shared document and click "Manage Access." You\'ll see a list of investors who have access — click "Revoke" next to any name to immediately remove their access. You can also set automatic expiry dates when sharing.',
  },
  // Account
  {
    id: 10,
    category: 'Account',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot password?" on the login page, enter your registered email, and check your inbox for a reset link valid for 30 minutes. If you don\'t see it within a few minutes, check your spam folder or contact support.',
  },
  {
    id: 11,
    category: 'Account',
    question: 'Can I add team members to my account?',
    answer:
      'Yes. Go to Settings → Team and invite co-founders or team members by email. You can assign roles: Admin (full access), Editor (can edit profile & documents), or Viewer (read-only). Each member gets their own login.',
  },
  // Billing
  {
    id: 12,
    category: 'Billing',
    question: 'How do I upgrade or change my plan?',
    answer:
      'Go to Settings → Billing → Change Plan. Upgrades take effect immediately and are prorated for the remainder of your billing cycle. Downgrades take effect at the end of your current cycle. A confirmation email is sent for every plan change.',
  },
  {
    id: 13,
    category: 'Billing',
    question: 'Do you offer refunds?',
    answer:
      'We offer a 14-day money-back guarantee for new subscriptions. To request a refund, contact support within 14 days of your charge with your order ID and reason. Refunds are processed within 5–7 business days back to your original payment method.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────

const FAQItem: React.FC<{
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ faq, isOpen, onToggle }) => (
  <div
    className={`border rounded-xl overflow-hidden transition-all duration-200 ${
      isOpen
        ? 'border-primary-300 shadow-sm'
        : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-primary-50 transition-colors duration-150 gap-4"
    >
      <span className="text-sm font-medium text-gray-900">{faq.question}</span>
      <span className={`flex-shrink-0 transition-colors ${isOpen ? 'text-primary-600' : 'text-gray-400'}`}>
        {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
      </span>
    </button>

    {/* Animated body */}
    <div
      style={{ maxHeight: isOpen ? '400px' : '0px', opacity: isOpen ? 1 : 0 }}
      className="overflow-hidden transition-all duration-200 ease-in-out"
    >
      <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
        {faq.answer}
      </p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const HelpPage: React.FC = () => {
  // Search & category filter
  const [query, setQuery]                 = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Accordion
  const [openId, setOpenId] = useState<number | null>(null);

  // Contact form
  const [form, setForm]             = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]         = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // ── Filtered FAQs ────────────────────────────────────────────────────────
  const filteredFAQs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchCat   = activeCategory === 'All' || faq.category === activeCategory;
      const q          = query.trim().toLowerCase();
      const matchQuery = !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, activeCategory]);

  // ── Form helpers ─────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim())                  next.name    = 'Your name is required.';
    if (!form.email.trim())                 next.email   = 'Email address is required.';
    else if (!isValidEmail(form.email))     next.email   = 'Please enter a valid email address.';
    if (!form.subject)                      next.subject = 'Please choose a topic.';
    if (!form.message.trim())              next.message = 'Message is required.';
    else if (form.message.trim().length < 20) next.message = 'Please write at least 20 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitStatus('loading');
    await new Promise((r) => setTimeout(r, 1500)); // Simulated API call
    setSubmitStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleReset = () => {
    setSubmitStatus('idle');
    setErrors({});
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help &amp; Support</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* ── Hero search ── */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={20} className="text-primary-200" />
          <p className="text-primary-100 text-sm font-medium">How can we help you?</p>
        </div>
        <h2 className="text-white text-xl font-bold mb-5">Search our knowledge base</h2>

        <div className="relative max-w-xl">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-300 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveCategory('All');
              setOpenId(null);
            }}
            placeholder="Search questions, topics, keywords…"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/15 backdrop-blur border border-white/25
                       text-white placeholder-primary-300 text-sm
                       focus:outline-none focus:ring-2 focus:ring-white/40 transition"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setOpenId(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-300 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Contact quick-access cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Mail size={20} className="text-primary-600" />,
            title: 'Email Support',
            desc: 'We reply within 2 business hours',
            action: 'support@yourplatform.com',
            href: 'mailto:support@yourplatform.com',
          },
          {
            icon: <MessageCircle size={20} className="text-primary-600" />,
            title: 'Live Chat',
            desc: 'Mon – Fri, 9 AM – 6 PM',
            action: 'Start a chat →',
            href: '#',
          },
          {
            icon: <Phone size={20} className="text-primary-600" />,
            title: 'Phone Support',
            desc: 'Available for Premium plans',
            action: '+92 300 1234567',
            href: 'tel:+9200000000',
          },
        ].map((card) => (
          <Card key={card.title} className="hover:border-primary-200 hover:shadow-sm transition-all duration-150">
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{card.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
                  <a
                    href={card.href}
                    className="text-xs text-primary-600 font-medium mt-1 inline-block hover:underline truncate"
                  >
                    {card.action}
                  </a>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* ── FAQ Section ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">Frequently Asked Questions</h2>
              <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {filteredFAQs.length}
              </span>
            </div>

            {/* Category pills — hidden when searching */}
            {!query && (
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                      activeCategory === cat
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {cat !== 'All' && CATEGORY_ICONS[cat]}
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-2">
              {filteredFAQs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                <Search size={22} className="text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium text-sm">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-gray-400 text-xs mt-1">Try different keywords or browse a category above</p>
              <button
                onClick={() => { setQuery(''); setActiveCategory('All'); }}
                className="mt-3 text-xs text-primary-600 font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Contact Form ── */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">Still need help?</h2>
          <p className="text-xs text-gray-500 mt-0.5">Send us a message and we'll get back to you within 2 hours.</p>
        </CardHeader>

        <CardBody className="pt-0">
          {submitStatus === 'success' ? (
            /* ── Success state ── */
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-3">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">Message sent!</p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                Our support team will reply to your email shortly. Check your inbox (and spam, just in case).
              </p>
              <button
                onClick={handleReset}
                className="mt-5 text-sm text-primary-600 font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <div className="space-y-5 max-w-2xl">

              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ali Khan"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition
                      focus:outline-none focus:ring-2 focus:ring-primary-400
                      ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ali@startup.com"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition
                      focus:outline-none focus:ring-2 focus:ring-primary-400
                      ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject / Topic */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Topic <span className="text-red-400">*</span>
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition
                    focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none
                    ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="">Select a topic…</option>
                  <option value="getting-started">Getting Started</option>
                  <option value="investors">Investors &amp; Connections</option>
                  <option value="documents">Documents &amp; File Sharing</option>
                  <option value="account">Account &amp; Team</option>
                  <option value="billing">Billing &amp; Plans</option>
                  <option value="bug">Bug Report</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle size={12} /> {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your issue or question in as much detail as possible…"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm resize-none transition
                    focus:outline-none focus:ring-2 focus:ring-primary-400
                    ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="block">
                    {errors.message && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle size={12} /> {errors.message}
                      </p>
                    )}
                  </span>
                  <span className={`text-xs ${
                    form.message.length > 0 && form.message.length < 20
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}>
                    {form.message.length} chars (min 20)
                  </span>
                </div>
              </div>

              {/* Submit row */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={submitStatus === 'loading'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700
                             disabled:opacity-60 text-white text-sm font-semibold rounded-lg
                             transition-all duration-150 shadow-sm hover:shadow-md"
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <Mail size={15} />
                      Send Message
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400">We'll reply within 2 business hours</p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};