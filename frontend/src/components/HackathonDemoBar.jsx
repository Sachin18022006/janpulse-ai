import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, ShieldCheck, HelpCircle, X, ChevronUp, ChevronDown } from 'lucide-react';

export const HackathonDemoBar = ({ onOpenPitch }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { demoLogin, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const handleQuickRole = async (role) => {
    await demoLogin(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/report');
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94%] transition-all duration-300">
      <div className="bg-charcoal-900/95 text-white rounded-2xl border-2 border-terracotta-400 p-3 shadow-warm-xl backdrop-blur-md">
        
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand & Badge */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-base">🏆</span>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-xs text-white tracking-wide uppercase">
                  Hackathon Ready Bar
                </span>
                <span className="text-[10px] bg-terracotta px-1.5 py-0.2 rounded font-bold text-white">
                  Live Demo
                </span>
              </div>
            </div>
          </div>

          {!collapsed && (
            <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
              
              {/* 1-Click Pothole Scenario */}
              <button
                onClick={() => {
                  navigate('/report?scenario=pothole');
                }}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold transition-all shadow-warm"
                title="Loads pothole at Indiranagar 100ft road to trigger 200m duplicate triage"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Auto-Test 200m Duplicate</span>
              </button>

              {/* Quick Citizen */}
              <button
                onClick={() => handleQuickRole('citizen')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-600 text-white font-semibold transition-all"
              >
                <User className="w-3.5 h-3.5 text-forest-400" />
                <span>Citizen View</span>
              </button>

              {/* Quick Admin */}
              <button
                onClick={() => handleQuickRole('admin')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-600 text-white font-semibold transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-mustard" />
                <span>Admin Triage Room</span>
              </button>

              {/* Pitch Deck */}
              <button
                onClick={onOpenPitch}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold transition-all shadow-warm"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pitch Deck & Architecture</span>
              </button>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-charcoal-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand Demo Bar' : 'Collapse Demo Bar'}
          >
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

        </div>

      </div>
    </div>
  );
};

export default HackathonDemoBar;
