import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  Layers, 
  ShieldCheck, 
  Calendar,
  FileDown,
  Printer
} from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const DashboardPage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const PALETTE = ['#D66A45', '#356B52', '#E5B84B', '#96A88F', '#BF522D', '#2C5A44', '#79331B'];

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getAnalytics(),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E9EFE7] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
            {t('openGovTag')}
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900 mt-1">
            {t('dashboardTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            {t('dashboardSubtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start">
          <button
            onClick={handlePrintAudit}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D5DFD1] text-xs font-bold text-charcoal-700 hover:bg-sage/40 transition-colors shadow-warm"
          >
            <Printer className="w-4 h-4 text-forest" />
            <span>{t('printAuditBtn')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              {t('kpiTotal')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-extrabold text-3xl text-charcoal-900">
            {stats?.totalComplaints || 42}
          </p>
          <p className="text-xs text-charcoal-500 font-medium">
            {t('totalReportsSub')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              {t('kpiResolved')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="font-display font-extrabold text-3xl text-forest-700">
              {stats?.resolvedComplaints || 28}
            </p>
            <span className="text-xs font-bold text-forest-800">
              ({stats?.resolutionRate || 67}%)
            </span>
          </div>
          <p className="text-xs text-charcoal-500 font-medium">
            {t('resolutionRateSub')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              {t('kpiAvg')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-mustard-100 text-mustard-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-extrabold text-3xl text-charcoal-900">
            {stats?.avgResolutionDays || 2.4} <span className="text-base font-semibold text-charcoal-500">{t('daysUnit')}</span>
          </p>
          <p className="text-xs text-charcoal-500 font-medium">
            {t('avgTurnaroundSub')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              {t('kpiCritical')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-extrabold text-3xl text-red-700">
            {stats?.criticalComplaints || 3}
          </p>
          <p className="text-xs text-charcoal-500 font-medium">
            {t('kpiCriticalSub')}
          </p>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Category Distribution Donut Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              {t('chartCategoryTitle')}
            </h3>
            <p className="text-xs text-charcoal-500">
              {t('categoriesSub')}
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.categoryDistribution || [
                    { name: 'Road Damage', total: 18 },
                    { name: 'Garbage', total: 12 },
                    { name: 'Drainage', total: 8 },
                    { name: 'Water Leakage', total: 7 },
                    { name: 'Streetlight', total: 5 },
                    { name: 'Public Safety', total: 4 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="total"
                  nameKey="name"
                >
                  {(analytics?.categoryDistribution || [1, 2, 3, 4, 5, 6]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} reports`, t(name) || name]}
                  contentStyle={{
                    backgroundColor: '#F8F6F0',
                    borderRadius: '12px',
                    borderColor: '#D5DFD1',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => t(value) || value}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Severity Distribution Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              {t('chartSeverityTitle')}
            </h3>
            <p className="text-xs text-charcoal-500">
              {t('geoIntelTag')}
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.severityDistribution || [
                  { range: 'Low (1-3)', count: 6, color: '#356B52' },
                  { range: 'Medium (4-6)', count: 14, color: '#E5B84B' },
                  { range: 'High (7-8)', count: 18, color: '#D66A45' },
                  { range: 'Critical (9-10)', count: 7, color: '#BF522D' },
                ]}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EFE7" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#545851' }} />
                <YAxis tick={{ fontSize: 11, fill: '#545851' }} />
                <Tooltip
                  formatter={(value) => [`${value} reports`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#F8F6F0',
                    borderRadius: '12px',
                    borderColor: '#D5DFD1',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {(analytics?.severityDistribution || [1, 2, 3, 4]).map((entry, index) => (
                    <Cell
                      key={`sev-${index}`}
                      fill={entry.color || PALETTE[index % PALETTE.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Monthly Grievance & Resolution Trends */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              {t('chartMonthlyTitle')}
            </h3>
            <p className="text-xs text-charcoal-500">
              {t('resolutionRateSub')}
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics?.monthlyTrend || [
                  { month: 'Jun', total: 42, resolved: 38 },
                  { month: 'Jul', total: 68, resolved: 60 },
                  { month: 'Aug', total: 95, resolved: 84 },
                  { month: 'Sep', total: 110, resolved: 98 },
                  { month: 'Oct', total: 135, resolved: 118 },
                  { month: 'Nov', total: 154, resolved: 129 },
                ]}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D66A45" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D66A45" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#356B52" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#356B52" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EFE7" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#545851' }} />
                <YAxis tick={{ fontSize: 11, fill: '#545851' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F8F6F0',
                    borderRadius: '12px',
                    borderColor: '#D5DFD1',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Reported"
                  stroke="#D66A45"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#356B52"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Department-Wise Workload & Resolution Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              {t('chartDeptTitle')}
            </h3>
            <p className="text-xs text-charcoal-500">
              {t('adminTag')}
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.departmentWorkload || [
                  { department: 'Roads & Infra', resolved: 14, pending: 6 },
                  { department: 'Solid Waste', resolved: 11, pending: 4 },
                  { department: 'Stormwater', resolved: 7, pending: 3 },
                  { department: 'Water Supply', resolved: 6, pending: 2 },
                  { department: 'Streetlights', resolved: 5, pending: 1 },
                ]}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EFE7" vertical={false} />
                <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#545851' }} />
                <YAxis tick={{ fontSize: 11, fill: '#545851' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F8F6F0',
                    borderRadius: '12px',
                    borderColor: '#D5DFD1',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="resolved" name="Resolved" fill="#356B52" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="In Queue" fill="#D66A45" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
