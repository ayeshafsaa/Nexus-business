import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle, TrendingUp, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === 'entrepreneur') {
      setEmail('sarah@techwave.io');
      setPassword('password123');
    } else {
      setEmail('michael@vcinnovate.com');
      setPassword('password123');
    }
    setRole(userRole);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL – animated gradient background ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-violet-900 flex-col justify-between p-12">

        {/* animated floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl bg-purple-400"
            style={{ top: '-80px', left: '-80px', animation: 'float1 8s ease-in-out infinite' }}
          />
          <div
            className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl bg-amber-400"
            style={{ bottom: '10%', right: '-60px', animation: 'float2 10s ease-in-out infinite' }}
          />
          <div
            className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl bg-violet-300"
            style={{ top: '40%', left: '30%', animation: 'float3 12s ease-in-out infinite' }}
          />
        </div>

        {/* grid overlay texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Business Nexus</span>
          </div>
        </div>

        {/* center headline */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
            Where Great<br />
            <span className="text-amber-300">Ideas Meet</span><br />
            Capital
          </h1>
          <p className="text-purple-200 text-lg leading-relaxed max-w-sm">
            Connect with the right investors and entrepreneurs to turn vision into reality.
          </p>

          {/* feature pills */}
          <div className="flex flex-col gap-3 pt-4">
            {[
              { icon: <TrendingUp size={16} />, text: 'Track deals and investments in real-time' },
              { icon: <Shield size={16} />, text: 'Secure document sharing and e-signatures' },
              { icon: <Zap size={16} />, text: 'Instant video calls and messaging' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white border-opacity-20">
                <span className="text-amber-300">{item.icon}</span>
                <span className="text-white text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '2,400+', label: 'Entrepreneurs' },
            { value: '$180M+', label: 'Funding Raised' },
            { value: '850+', label: 'Investors' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-purple-300 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* floating animation styles */}
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -20px) scale(1.05); }
            66% { transform: translate(-20px, 30px) scale(0.95); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-40px, 20px) scale(1.08); }
            66% { transform: translate(20px, -30px) scale(0.92); }
          }
          @keyframes float3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(25px, 25px) scale(1.1); }
          }
        `}</style>
      </div>

      {/* ── RIGHT PANEL – login form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-white">
        {/* mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-gray-900 font-bold text-lg">Business Nexus</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('entrepreneur')}
                  className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    role === 'entrepreneur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Building2 size={17} />
                  Entrepreneur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('investor')}
                  className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    role === 'investor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CircleDollarSign size={17} />
                  Investor
                </button>
              </div>
            </div>

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<User size={17} />}
            />

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<LogIn size={17} />}
              className="py-3 rounded-xl font-semibold">
              Sign in
            </Button>
          </form>

          {/* demo accounts */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400 font-medium uppercase tracking-wide">Demo Accounts</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => fillDemoCredentials('entrepreneur')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Building2 size={15} />
                Entrepreneur
              </button>
              <button
                onClick={() => fillDemoCredentials('investor')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <CircleDollarSign size={15} />
                Investor
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
