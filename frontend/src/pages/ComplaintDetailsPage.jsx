import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  ThumbsUp, 
  Clock, 
  User, 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Share2,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';
import TimelineView from '../components/TimelineView';
import AIAnalysisCard from '../components/AIAnalysisCard';
import LeafletMap from '../components/LeafletMap';
import confetti from 'canvas-confetti';

export const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upvoting, setUpvoting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      try {
        const res = await complaintAPI.getById(id);
        if (res.data.success) {
          setComplaint(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Complaint not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please log in as a citizen to upvote this grievance and boost municipal priority.');
      return;
    }

    setUpvoting(true);
    try {
      const res = await complaintAPI.upvote(complaint._id);
      if (res.data.success) {
        setComplaint((prev) => ({
          ...prev,
          upvotesCount: res.data.upvotesCount,
          userHasUpvoted: res.data.upvoted,
        }));

        if (res.data.upvoted) {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 },
          });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not process upvote.');
    } finally {
      setUpvoting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta flex items-center justify-center mx-auto animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-charcoal-600">
          Loading verified grievance record & municipal timeline...
        </p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-charcoal-900">
          Complaint Record Not Found
        </h2>
        <p className="text-sm text-charcoal-600">{error || 'Invalid complaint ID specified.'}</p>
        <Link
          to="/map"
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-terracotta text-white font-bold text-sm shadow-warm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Live Map</span>
        </Link>
      </div>
    );
  }

  const coords = complaint.location?.coordinates || [77.5946, 12.9716];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Share */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/map"
          className="inline-flex items-center space-x-2 text-xs font-bold text-charcoal-600 hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live City Map</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D5DFD1] text-xs font-semibold text-charcoal-700 hover:bg-ivory-100 transition-colors shadow-warm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-forest" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Grievance'}</span>
          </button>
        </div>
      </div>

      {/* Main Grievance Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9EFE7] shadow-warm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-ivory-200 text-charcoal-700 border border-charcoal-300">
                #{complaint.complaintId}
              </span>
              <StatusBadge status={complaint.status} size="md" />
              <SeverityBadge severity={complaint.severity} size="md" />
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 leading-tight">
              {complaint.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-500 pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span className="font-medium text-charcoal-700">{complaint.address}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Reported on {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>By {complaint.reporterName || 'Citizen'}</span>
              </span>
            </div>
          </div>

          {/* Upvote Button */}
          <div className="flex flex-col items-center sm:items-end justify-center">
            <button
              onClick={handleUpvote}
              disabled={upvoting}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-warm transition-all transform active:scale-95 ${
                complaint.userHasUpvoted
                  ? 'bg-forest text-white hover:bg-forest-600'
                  : 'bg-terracotta text-white hover:bg-terracotta-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${complaint.userHasUpvoted ? 'fill-current' : ''}`} />
              <span>{complaint.userHasUpvoted ? 'Upvoted' : 'Upvote Issue'}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {complaint.upvotesCount || 0}
              </span>
            </button>
            <p className="text-[11px] text-charcoal-500 mt-1">
              Boosts priority on municipal queue
            </p>
          </div>
        </div>

        {/* Primary Images Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E9EFE7]">
          {/* Complaint Evidence Photo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal-700">
              <span>Citizen Evidence Photograph:</span>
              <span className="text-terracotta">Reported State</span>
            </div>
            <div className="rounded-2xl overflow-hidden bg-charcoal-100 border border-charcoal-200 h-72">
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600';
                }}
              />
            </div>
          </div>

          {/* Resolution Proof Photo (or status placeholder) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal-700">
              <span>Municipal Resolution Proof:</span>
              <span className={complaint.status === 'Resolved' ? 'text-forest-700' : 'text-charcoal-500'}>
                {complaint.status === 'Resolved' ? 'Verified Fixed' : 'Pending Verification'}
              </span>
            </div>
            {complaint.resolutionProofUrl ? (
              <div className="rounded-2xl overflow-hidden bg-forest-50 border-2 border-forest-300 h-72 relative">
                <img
                  src={complaint.resolutionProofUrl}
                  alt="Resolution Proof"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-forest text-white text-xs px-3 py-1 rounded-xl font-bold flex items-center space-x-1.5 shadow-warm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Work Verified by Field Supervisor</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-[#D5DFD1] bg-ivory-100 h-72 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Clock className="w-8 h-8 text-charcoal-400" />
                <h4 className="font-bold text-xs text-charcoal-700">
                  Resolution Proof Pending
                </h4>
                <p className="text-[11px] text-charcoal-500 max-w-xs">
                  Once municipal engineers complete repair work, photographic evidence will be published here with timestamp verification.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description & Official Remarks */}
        <div className="space-y-4 pt-4 border-t border-[#E9EFE7]">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Grievance Description
            </h4>
            <p className="text-sm text-charcoal-800 mt-1 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {complaint.officialRemarks && (
            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Official Municipal Engineering Remarks</span>
              </span>
              <p className="text-xs text-charcoal-800 font-medium">
                {complaint.officialRemarks}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Multimodal Assessment Card */}
      <AIAnalysisCard
        analysis={{
          category: complaint.category,
          severity: complaint.severity,
          confidence: complaint.confidence,
          description: complaint.description,
          department: complaint.department,
          urgency: complaint.urgency,
          detectedObjects: complaint.detectedObjects,
          recommendedAction: complaint.recommendedAction,
        }}
      />

      {/* Two Column Section: Location Map + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Location Mini Map */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal-900">
                Geotagged Location
              </h3>
              <p className="text-xs text-charcoal-500">
                Coordinates: {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-forest-100 text-forest-800 font-bold">
              Bengaluru
            </span>
          </div>

          <LeafletMap
            complaints={[complaint]}
            center={[coords[1], coords[0]]}
            zoom={15}
            height="320px"
          />

          <div className="p-3 rounded-xl bg-ivory-100 border border-[#E9EFE7] text-xs text-charcoal-700">
            <strong>Address:</strong> {complaint.address}
          </div>
        </div>

        {/* Auditable Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-charcoal-900">
              Grievance Lifecycle Timeline
            </h3>
            <p className="text-xs text-charcoal-500">
              Transparent tracking of every administrative stage and dispatch
            </p>
          </div>

          <TimelineView
            timeline={complaint.timeline}
            currentStatus={complaint.status}
          />
        </div>

      </div>

    </div>
  );
};

export default ComplaintDetailsPage;
