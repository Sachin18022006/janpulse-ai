import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  List, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ThumbsUp,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';
import { complaintAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LeafletMap from '../components/LeafletMap';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';

export const MapExplorerPage = () => {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Road Damage',
    'Garbage',
    'Streetlight',
    'Water Leakage',
    'Drainage',
    'Public Safety',
  ];

  const statuses = ['All', 'Submitted', 'AI Analyzed', 'Assigned', 'In Progress', 'Resolved'];

  const severityOptions = [
    { label: 'All Severities', value: 'All' },
    { label: 'Critical (9–10)', value: 'critical', min: 9 },
    { label: 'High (7–8)', value: 'high', min: 7, max: 8 },
    { label: 'Medium (4–6)', value: 'medium', min: 4, max: 6 },
    { label: 'Low (1–3)', value: 'low', max: 3 },
  ];

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const chosenSeverity = severityOptions.find(s => s.value === selectedSeverity);
      if (chosenSeverity?.min) params.severityMin = chosenSeverity.min;
      if (chosenSeverity?.max) params.severityMax = chosenSeverity.max;

      const res = await complaintAPI.getAll(params);
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching complaints for map:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory, selectedStatus, selectedSeverity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header, View Toggle & Heatmap switch */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E9EFE7] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
            Real-Time Geospatial Intelligence
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900 mt-1">
            Live Bengaluru Civic Map
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Displaying geo-indexed grievances with severity markers, duplicate clusters, and department status.
          </p>
        </div>

        {/* View Toggle + Heatmap Button */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all shadow-warm ${
              showHeatmap
                ? 'bg-mustard text-charcoal-900 border-mustard font-extrabold'
                : 'bg-white text-charcoal-700 border-[#D5DFD1] hover:bg-mustard-50'
            }`}
          >
            <Flame className={`w-4 h-4 ${showHeatmap ? 'text-terracotta-700 animate-pulse' : 'text-mustard-600'}`} />
            <span>{showHeatmap ? '🔥 Heatmap Active' : 'Show Density Heatmap'}</span>
          </button>

          {/* Map vs List Toggle */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-[#D5DFD1] shadow-warm">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-terracotta text-white shadow-warm'
                  : 'text-charcoal-700 hover:bg-sage/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-terracotta text-white shadow-warm'
                  : 'text-charcoal-700 hover:bg-sage/40'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-4">
        
        {/* Search bar + Severity dropdown */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by street name, locality (Indiranagar, Koramangala...), or complaint ID..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-terracotta text-white font-bold text-xs hover:bg-terracotta-600 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Severity selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-bold text-charcoal-600 whitespace-nowrap">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full md:w-48 px-3 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            >
              {severityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-bold text-charcoal-600 whitespace-nowrap">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full md:w-40 px-3 py-2.5 rounded-xl border border-[#D5DFD1] bg-ivory-50 text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 border-t border-[#E9EFE7]">
          <span className="text-xs font-bold text-charcoal-500 whitespace-nowrap mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                selectedCategory === cat
                  ? 'bg-forest text-white border-forest shadow-warm'
                  : 'bg-ivory-100 text-charcoal-700 border-[#D5DFD1] hover:border-forest-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Main View Display */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map canvas */}
          <div className="lg:col-span-2 space-y-3">
            <LeafletMap
              complaints={complaints}
              center={[12.9716, 77.5946]}
              zoom={12}
              height="600px"
              showHeatmap={showHeatmap}
            />

            {/* Severity Legend */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E9EFE7] flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal-700 shadow-warm">
              <span className="font-bold text-charcoal-800">Pin Severity Legend:</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#D63031]"></span>
                  <span>Critical (9–10)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#D66A45]"></span>
                  <span>High (7–8)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#E5B84B]"></span>
                  <span>Medium (4–6)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#356B52]"></span>
                  <span>Low (1–3)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Side Feed */}
          <div className="space-y-4 max-h-[660px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9EFE7]">
              <span className="text-xs font-bold uppercase text-charcoal-700">
                Found {complaints.length} Grievances
              </span>
              <Link to="/report" className="text-xs font-bold text-terracotta hover:underline">
                + Report New
              </Link>
            </div>

            {complaints.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-[#E9EFE7] text-center space-y-2">
                <MapPin className="w-8 h-8 text-charcoal-400 mx-auto" />
                <p className="text-sm font-bold text-charcoal-700">No complaints matching filter</p>
                <p className="text-xs text-charcoal-500">Try clearing filters or search query.</p>
              </div>
            ) : (
              complaints.map((item) => (
                <div
                  key={item._id || item.complaintId}
                  className="bg-white p-4 rounded-2xl border border-[#E9EFE7] shadow-warm space-y-3 hover:border-terracotta-300 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover bg-charcoal-100 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] text-charcoal-500 font-bold">
                          #{item.complaintId}
                        </span>
                        <SeverityBadge severity={item.severity} size="sm" showText={false} />
                      </div>
                      <h4 className="font-display font-bold text-xs text-charcoal-900 truncate mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-charcoal-500 truncate">
                        {item.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E9EFE7] text-xs">
                    <StatusBadge status={item.status} size="sm" />
                    <Link
                      to={`/complaints/${item._id}`}
                      className="font-bold text-terracotta hover:text-terracotta-700 flex items-center space-x-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* List & Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((item) => (
            <div
              key={item._id || item.complaintId}
              className="bg-white rounded-3xl overflow-hidden border border-[#E9EFE7] shadow-warm hover:shadow-warm-lg transition-all flex flex-col group"
            >
              <div className="relative h-48 bg-charcoal-100 overflow-hidden">
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

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-charcoal-500">
                    <span>#{item.complaintId}</span>
                    <span className="font-semibold text-forest-800">{item.category}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-charcoal-900 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-charcoal-600 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center space-x-1.5 text-xs text-charcoal-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                    <span className="truncate">{item.address}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E9EFE7] flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-1 text-terracotta font-semibold">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{item.upvotesCount || 0} Upvotes</span>
                  </span>

                  <Link
                    to={`/complaints/${item._id}`}
                    className="font-bold text-forest hover:text-forest-800 flex items-center space-x-1"
                  >
                    <span>View Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MapExplorerPage;
