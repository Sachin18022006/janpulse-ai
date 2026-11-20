import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Sparkles } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('citizen');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register({
      name,
      email,
      password,
      phone,
      role,
      department: role === 'admin' ? department || 'BBMP Central Command' : '',
    });

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
        <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center font-display font-bold text-xl mx-auto shadow-warm">
          JP
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900">
          Join the Civic Movement
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600">
          Create an account to report civic issues and verify community improvements.
        </p>
      </div>

      {/* Main Register Form */}
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
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  role === 'citizen'
                    ? 'bg-forest text-white border-forest shadow-warm'
                    : 'bg-ivory-100 text-charcoal-700 border-[#D5DFD1]'
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  role === 'admin'
                    ? 'bg-forest text-white border-forest shadow-warm'
                    : 'bg-ivory-100 text-charcoal-700 border-[#D5DFD1]'
                }`}
              >
                Municipal Admin
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          {role === 'admin' && (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Department Name
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. BBMP Roads & Infrastructure"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm text-charcoal-900"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-forest hover:bg-forest-600 text-white font-bold text-sm shadow-warm transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? 'Registering Account...' : 'Create Citizen Account'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-charcoal-600">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-forest hover:underline">
            Sign In here
          </Link>
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
