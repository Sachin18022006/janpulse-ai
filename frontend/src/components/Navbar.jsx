import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  AlertCircle, 
  MapPin, 
  BarChart3, 
  PlusCircle, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X,
  Search,
  Languages
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, switchLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#F8F6F0]/90 backdrop-blur-md border-b border-[#E9EFE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-terracotta to-terracotta-600 flex items-center justify-center text-white shadow-warm group-hover:scale-105 transition-transform duration-200">
              <span className="font-display font-bold text-xl tracking-tight">JP</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-charcoal">
                  JANPULSE
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-terracotta-100 text-terracotta-700 tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-charcoal-500 tracking-wide uppercase">
                {t('brandSubtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') 
                  ? 'text-terracotta-600 bg-terracotta-50' 
                  : 'text-charcoal-700 hover:text-terracotta hover:bg-sage/40'
              }`}
            >
              {t('home')}
            </Link>

            <Link
              to="/map"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/map') 
                  ? 'text-terracotta-600 bg-terracotta-50' 
                  : 'text-charcoal-700 hover:text-terracotta hover:bg-sage/40'
              }`}
            >
              <MapPin className="w-4 h-4 text-forest" />
              <span>{t('exploreMap')}</span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/dashboard') 
                  ? 'text-terracotta-600 bg-terracotta-50' 
                  : 'text-charcoal-700 hover:text-terracotta hover:bg-sage/40'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-terracotta" />
              <span>{t('transparency')}</span>
            </Link>

            <Link
              to="/track"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/track') 
                  ? 'text-terracotta-600 bg-terracotta-50' 
                  : 'text-charcoal-700 hover:text-terracotta hover:bg-sage/40'
              }`}
            >
              <Search className="w-4 h-4 text-charcoal-500" />
              <span>{t('trackId')}</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/admin') 
                    ? 'text-forest-700 bg-forest-50' 
                    : 'text-forest-700 hover:bg-forest-50/70'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>{t('adminTriage')}</span>
              </Link>
            )}
          </nav>

          {/* Action CTAs & Language Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="flex items-center bg-white px-2 py-1 rounded-xl border border-[#D5DFD1] text-xs font-semibold shadow-warm">
              <Languages className="w-3.5 h-3.5 text-forest mr-1.5" />
              <select
                value={language}
                onChange={(e) => switchLanguage(e.target.value)}
                className="bg-transparent text-charcoal-800 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            <Link
              to="/report"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-semibold text-sm shadow-warm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('reportIssue')}</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-[#D5DFD1]">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl hover:bg-sage/50 text-charcoal-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-forest text-white font-bold text-xs flex items-center justify-center">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-charcoal-500 hover:text-terracotta hover:bg-terracotta-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-charcoal-700 hover:text-terracotta hover:bg-sage/40 transition-colors"
                >
                  {t('login')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <select
              value={language}
              onChange={(e) => switchLanguage(e.target.value)}
              className="bg-white border border-[#D5DFD1] rounded-lg px-2 py-1 text-xs font-bold text-charcoal-800"
            >
              <option value="en">EN</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="hi">हिंदी</option>
            </select>

            <Link
              to="/report"
              className="p-2 rounded-xl bg-terracotta text-white shadow-warm"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-700 hover:bg-sage/50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E9EFE7] bg-[#F8F6F0] px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-charcoal-800 hover:bg-sage/40"
          >
            {t('home')}
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-base font-semibold text-charcoal-800 hover:bg-sage/40"
          >
            <MapPin className="w-5 h-5 text-forest" />
            <span>{t('exploreMap')}</span>
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-base font-semibold text-charcoal-800 hover:bg-sage/40"
          >
            <BarChart3 className="w-5 h-5 text-terracotta" />
            <span>{t('transparency')}</span>
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-base font-semibold text-charcoal-800 hover:bg-sage/40"
          >
            <Search className="w-5 h-5 text-charcoal-500" />
            <span>{t('trackId')}</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-base font-semibold text-forest-700 bg-forest-50"
            >
              <ShieldCheck className="w-5 h-5 text-forest" />
              <span>{t('adminTriage')}</span>
            </Link>
          )}

          <div className="pt-4 border-t border-[#D5DFD1] space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-semibold text-charcoal-800 bg-sage/30"
                >
                  <User className="w-5 h-5 text-forest" />
                  <span>{t('myProfile')} ({user?.name})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-semibold text-terracotta hover:bg-terracotta-50 text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('logout')}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 rounded-xl border border-charcoal-300 font-semibold text-charcoal-800"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 rounded-xl bg-terracotta text-white font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
