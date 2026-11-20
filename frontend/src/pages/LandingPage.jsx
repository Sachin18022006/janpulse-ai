import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Compass, 
  Eye, 
  ThumbsUp,
  Layers,
  Activity
} from 'lucide-react';
import { complaintAPI, dashboardAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';

export const LandingPage = () => {
  const { t } = useLanguage();
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState({
    totalComplaints: 28,
    resolvedComplaints: 19,
    resolutionRate: 68,
    avgResolutionDays: 2.4,
    criticalComplaints: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [complaintsRes, statsRes] = await Promise.all([
          complaintAPI.getAll({ limit: 4, sort: '-createdAt' }),
          dashboardAPI.getStats(),
        ]);
        if (complaintsRes.data.success) {
          setRecentComplaints(complaintsRes.data.data);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (error) {
        console.warn('Using baseline fallback data for landing page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const categories = [
    { key: 'Road Damage', icon: '🛣️', desc: 'Potholes, broken asphalt, craters', color: 'bg-terracotta-50 text-terracotta-700' },
    { key: 'Garbage', icon: '🗑️', desc: 'Illegal dumping, overflowing bins', color: 'bg-mustard-50 text-mustard-800' },
    { key: 'Streetlight', icon: '💡', desc: 'Dark stretches, broken fixtures', color: 'bg-amber-50 text-amber-800' },
    { key: 'Water Leakage', icon: '💧', desc: 'Pipeline bursts, clean water wastage', color: 'bg-forest-50 text-forest-800' },
    { key: 'Drainage', icon: '🚰', desc: 'Open storm drains, clogged sewers', color: 'bg-emerald-50 text-emerald-800' },
    { key: 'Public Safety', icon: '⚠️', desc: 'Exposed live cables, structural risks', color: 'bg-red-50 text-red-800' },
  ];

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-terracotta-100/40 via-sage/30 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#D5DFD1] shadow-warm text-xs font-semibold text-charcoal-700 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-ping"></span>
            <span className="text-terracotta-700 font-bold">{t('heroTag')}</span>
            <span className="text-charcoal-400">•</span>
            <span className="text-forest-800">{t('heroPilot')}</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-charcoal-900 tracking-tight leading-[1.1]">
              {t('heroTitle1')} <br />
              <span className="text-terracotta underline decoration-mustard/60 decoration-wavy decoration-2">
                {t('heroTitle2')}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/report"
              className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-base shadow-warm-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Camera className="w-5 h-5" />
              <span>{t('reportNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/map"
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-ivory-100 text-charcoal-800 font-bold text-base border-2 border-[#D5DFD1] shadow-warm transition-all"
            >
              <MapPin className="w-5 h-5 text-forest" />
              <span>{t('exploreLiveMap')}</span>
            </Link>
          </div>

          {/* Pilot Statistics Strip */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-[#E9EFE7] shadow-warm text-left space-y-1">
              <div className="flex items-center space-x-2 text-terracotta">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-semibold text-charcoal-500 uppercase">{t('totalReports')}</span>
              </div>
              <p className="font-display font-extrabold text-3xl text-charcoal-900">
                {stats.totalComplaints || 42}+
              </p>
              <p className="text-[11px] text-charcoal-500 font-medium">{t('totalReportsSub')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E9EFE7] shadow-warm text-left space-y-1">
              <div className="flex items-center space-x-2 text-forest">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold text-charcoal-500 uppercase">{t('resolutionRate')}</span>
              </div>
              <p className="font-display font-extrabold text-3xl text-forest-700">
                {stats.resolutionRate || 72}%
              </p>
              <p className="text-[11px] text-charcoal-500 font-medium">{t('resolutionRateSub')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E9EFE7] shadow-warm text-left space-y-1">
              <div className="flex items-center space-x-2 text-mustard">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-semibold text-charcoal-500 uppercase">{t('avgTurnaround')}</span>
              </div>
              <p className="font-display font-extrabold text-3xl text-charcoal-900">
                {stats.avgResolutionDays || 2.4} <span className="text-base font-semibold text-charcoal-500">{t('daysUnit')}</span>
              </p>
              <p className="text-[11px] text-charcoal-500 font-medium">{t('avgTurnaroundSub')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E9EFE7] shadow-warm text-left space-y-1">
              <div className="flex items-center space-x-2 text-terracotta-700">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-semibold text-charcoal-500 uppercase">{t('duplicatesUnified')}</span>
              </div>
              <p className="font-display font-extrabold text-3xl text-charcoal-900">
                94%
              </p>
              <p className="text-[11px] text-charcoal-500 font-medium">{t('duplicatesUnifiedSub')}</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
            {t('pipelineTag')}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-charcoal-900">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-[#E9EFE7] shadow-warm relative space-y-4 hover:border-terracotta-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta flex items-center justify-center font-display font-bold text-lg">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              {t('step1Title')}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9EFE7] shadow-warm relative space-y-4 hover:border-terracotta-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest flex items-center justify-center font-display font-bold text-lg">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              {t('step2Title')}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9EFE7] shadow-warm relative space-y-4 hover:border-terracotta-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-mustard-100 text-mustard-800 flex items-center justify-center font-display font-bold text-lg">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              {t('step3Title')}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9EFE7] shadow-warm relative space-y-4 hover:border-terracotta-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sage text-forest-800 flex items-center justify-center font-display font-bold text-lg">
              04
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              {t('step4Title')}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              {t('step4Desc')}
            </p>
          </div>

        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E9EFE7] rounded-3xl p-8 sm:p-12 border border-[#D5DFD1]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                {t('categoriesTitle')}
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-charcoal-900 mt-1">
                {t('categoriesTitle')}
              </h2>
            </div>
            <Link
              to="/report"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-terracotta hover:text-terracotta-700"
            >
              <span>{t('categoriesSub')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-sage-300 shadow-warm flex items-start space-x-4 hover:shadow-warm-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${cat.color} flex-shrink-0`}>
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-charcoal-900">
                    {t(cat.key)}
                  </h4>
                  <p className="text-xs text-charcoal-600 mt-0.5">
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RECENT REPORTED ISSUES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
              {t('recentTag')}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-charcoal-900 mt-1">
              {t('recentTitle')}
            </h2>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center space-x-2 text-sm font-bold text-forest-700 hover:text-forest-900"
          >
            <span>{t('viewAllMap')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentComplaints.map((item) => (
            <div
              key={item._id || item.complaintId}
              className="bg-white rounded-3xl overflow-hidden border border-[#E9EFE7] shadow-warm hover:shadow-warm-lg transition-all flex flex-col group"
            >
              <div className="relative h-44 bg-charcoal-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <SeverityBadge severity={item.severity} size="sm" />
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={item.status} size="sm" />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-500">
                    <span>#{item.complaintId}</span>
                    <span>{t(item.category) || item.category}</span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-charcoal-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-charcoal-600 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E9EFE7] flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-1 text-terracotta font-semibold">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{item.upvotesCount || 0}</span>
                  </span>

                  <Link
                    to={`/complaints/${item._id}`}
                    className="font-bold text-forest hover:text-forest-800 flex items-center space-x-1"
                  >
                    <span>{t('inspect')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PUBLIC IMPACT & CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-terracotta to-terracotta-700 text-white p-8 sm:p-14 overflow-hidden shadow-warm-xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
              {t('ctaTag')}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
              {t('ctaTitle')}
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              {t('ctaDesc')}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/report"
                className="px-6 py-3 rounded-2xl bg-white hover:bg-ivory-100 text-terracotta-700 font-bold text-sm shadow-warm transition-transform transform hover:-translate-y-0.5"
              >
                {t('ctaLaunch')}
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-2xl bg-terracotta-800 hover:bg-terracotta-900 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                {t('ctaMetrics')}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
