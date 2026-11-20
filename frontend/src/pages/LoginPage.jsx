import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, ShieldCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      setError(result.message);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setError('');
    const result = await demoLogin(role);
    setLoading(false);

    if (result.success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center font-display font-bold text-xl mx-auto shadow-warm">
          JP
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
          Welcome to JanPulse AI
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600">
          Sign in to report civic grievances, upvote neighborhood issues, and track resolutions.
        </p>
      </div>

      {/* 1-Click Quick Demo Login Box */}
      <div className="bg-ivory-100 p-5 rounded-3xl border border-[#E4DCB8] space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-700">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span>Quick 1-Click Demo Evaluation</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('citizen')}
            disabled={loading}
            className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white hover:bg-forest-50 border border-forest-300 text-forest-800 text-xs font-bold shadow-warm transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Citizen Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            disabled={loading}
            className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white hover:bg-terracotta-50 border border-terracotta-300 text-terracotta-800 text-xs font-bold shadow-warm transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Municipal Admin</span>
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-6">
        
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-warm transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to JanPulse'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-charcoal-600">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-terracotta hover:underline">
            Register as Citizen
          </Link>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
