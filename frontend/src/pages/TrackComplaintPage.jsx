import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { complaintAPI } from '../services/api';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';

export const TrackComplaintPage = () => {
  const [ticketId, setTicketId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const res = await complaintAPI.getById(ticketId.trim());
      if (res.data.success) {
        setComplaint(res.data.data);
      }
    } catch (err) {
      setError('No grievance found with this reference ID. Please verify the code.');
    } finally {
      setLoading(false);
    }
  };

  const sampleIds = [
    'JP-2026-BLR-1001',
    'JP-2026-BLR-1003',
    'JP-2026-BLR-1005',
    'JP-2026-BLR-1007',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
          Public Tracking Terminal
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900">
          Track Your Civic Grievance
        </h1>
        <p className="text-sm text-charcoal-600 max-w-lg mx-auto">
          Enter your unique complaint reference ID to inspect real-time municipal inspection progress, assigned engineering units, and verified resolution status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              required
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="e.g. JP-2026-BLR-1001"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#D5DFD1] bg-ivory-50 text-charcoal-900 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-warm transition-transform transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Ticket'}
          </button>
        </form>

        {/* Quick Sample IDs */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-charcoal-500 font-semibold">Try sample IDs:</span>
          {sampleIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTicketId(id);
              }}
              className="px-2.5 py-1 rounded-lg bg-ivory-200 hover:bg-sage text-charcoal-700 font-mono text-xs transition-colors"
            >
              #{id}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Preview Card */}
      {complaint && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-forest-300 shadow-warm-lg space-y-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E9EFE7]">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-charcoal-700">
                #{complaint.complaintId}
              </span>
              <StatusBadge status={complaint.status} size="sm" />
            </div>
            <SeverityBadge severity={complaint.severity} size="sm" />
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-full sm:w-44 h-32 rounded-2xl object-cover bg-charcoal-100 flex-shrink-0"
            />
            <div className="space-y-2 flex-1">
              <h3 className="font-display font-bold text-lg text-charcoal-900 leading-snug">
                {complaint.title}
              </h3>
              <p className="text-xs text-charcoal-600 line-clamp-2">
                {complaint.description}
              </p>
              <div className="flex items-center space-x-1.5 text-xs text-charcoal-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span className="truncate">{complaint.address}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E9EFE7] flex items-center justify-between">
            <span className="text-xs text-forest-800 font-bold">
              Routed to: {complaint.department}
            </span>

            <button
              onClick={() => navigate(`/complaints/${complaint._id}`)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-warm transition-transform transform hover:-translate-y-0.5"
            >
              <span>View Full Lifecycle Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrackComplaintPage;
