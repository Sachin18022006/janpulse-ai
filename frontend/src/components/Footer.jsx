import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#E9EFE7] border-t border-[#D5DFD1] mt-24 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center text-white font-display font-bold text-lg shadow-warm">
                JP
              </div>
              <span className="font-display font-bold text-xl text-charcoal">
                JANPULSE <span className="text-terracotta">AI</span>
              </span>
            </div>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              {t('brandSubtitle')} — {t('heroDesc').slice(0, 95)}...
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse"></span>
              <span>{t('heroPilot')}: Bengaluru (BBMP)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal-800 mb-4">
              {t('home')}
            </h4>
            <ul className="space-y-2.5 text-sm text-charcoal-600">
              <li>
                <Link to="/map" className="hover:text-terracotta transition-colors">
                  {t('exploreMap')}
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-terracotta transition-colors">
                  {t('reportIssue')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-terracotta transition-colors">
                  {t('transparency')}
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-terracotta transition-colors">
                  {t('trackId')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-terracotta transition-colors">
                  {t('adminTriage')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic Categories */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal-800 mb-4">
              {t('categoriesTitle')}
            </h4>
            <ul className="space-y-2.5 text-sm text-charcoal-600">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
                <span>{t('Road Damage')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mustard"></span>
                <span>{t('Garbage')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                <span>{t('Water Leakage')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-charcoal-400"></span>
                <span>{t('Streetlight')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta-700"></span>
                <span>{t('Drainage')}</span>
              </li>
            </ul>
          </div>

          {/* AI & Tech Pillars */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal-800">
              {t('pipelineTag')}
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Google Gemini Flash multimodal vision, MongoDB 2dsphere 200m spatial clustering, and Leaflet interactive cartography.
            </p>
            <div className="p-3.5 rounded-2xl bg-white border border-[#D5DFD1] text-xs space-y-1">
              <div className="flex items-center text-forest font-semibold space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Fabricated Data</span>
              </div>
              <p className="text-charcoal-500 text-[11px]">
                Bengaluru Civic Redressal Pipeline.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#D5DFD1] flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500">
          <p>© {new Date().getFullYear()} JanPulse AI. Built for Transparent Municipal Governance.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Made with civic commitment</span>
            <span className="text-terracotta font-semibold">for cleaner, safer Indian cities</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
