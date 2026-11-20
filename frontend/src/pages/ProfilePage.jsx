import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { 
  User, 
  MapPin, 
  CheckCircle2, 
  ThumbsUp, 
  Award, 
  Clock, 
  Calendar, 
  ArrowRight,
  Shield,
  Sparkles,
  LogOut
} from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';

export const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('reported'); // 'reported', 'upvoted'
  const [reportedComplaints, setReportedComplaints] = useState([]);
  const [upvotedComplaints, setUpvotedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserContributions = async () => {
      try {
        const res = await authAPI.getMyComplaints();
        if (res.data.success) {
          setReportedComplaints(res.data.data.submitted || []);
          setUpvotedComplaints(res.data.data.upvoted || []);
        }
      } catch (err) {
        console.warn('Error loading user complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserContributions();
  }, [isAuthenticated]);

  const resolvedCount = reportedComplaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Citizen Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9EFE7] shadow-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-forest to-forest-600 text-white font-display font-extrabold text-2xl flex items-center justify-center shadow-warm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-extrabold text-2xl text-charcoal-900">
                {user?.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-forest-100 text-forest-800 border border-forest-200">
                {user?.badge || 'Civic Guardian 🌟'}
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-medium">
              {user?.email} • {user?.phone || '+91 Citizen Registered'}
            </p>
            <p className="text-xs text-forest-800 font-semibold pt-0.5">
              Role: <span className="capitalize">{user?.role}</span>
              {user?.department ? ` • ${user.department}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link
            to="/report"
            className="flex-1 md:flex-none text-center px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-warm transition-transform transform hover:-translate-y-0.5"
          >
            + Report New Grievance
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2.5 rounded-xl border border-charcoal-300 text-charcoal-700 hover:text-terracotta hover:bg-terracotta-50 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Citizen Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E9EFE7] shadow-warm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Complaints Submitted
          </span>
          <p className="font-display font-extrabold text-3xl text-charcoal-900">
            {reportedComplaints.length}
          </p>
          <p className="text-[11px] text-charcoal-500 font-medium">Verified by Gemini AI</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9EFE7] shadow-warm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Grievances Resolved
          </span>
          <p className="font-display font-extrabold text-3xl text-forest-700">
            {resolvedCount}
          </p>
          <p className="text-[11px] text-charcoal-500 font-medium">With verified photographic proof</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9EFE7] shadow-warm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Issues Upvoted
          </span>
          <p className="font-display font-extrabold text-3xl text-terracotta-700">
            {upvotedComplaints.length}
          </p>
          <p className="text-[11px] text-charcoal-500 font-medium">Priority triage votes boosted</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#E9EFE7] pb-3">
        <button
          onClick={() => setActiveTab('reported')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reported'
              ? 'bg-terracotta text-white shadow-warm'
              : 'text-charcoal-700 hover:bg-sage/40'
          }`}
        >
          <span>My Reported Grievances ({reportedComplaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upvoted')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upvoted'
              ? 'bg-terracotta text-white shadow-warm'
              : 'text-charcoal-700 hover:bg-sage/40'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Issues I Upvoted ({upvotedComplaints.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'reported' ? (
        <div className="space-y-4">
          {reportedComplaints.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#E9EFE7] text-center space-y-3">
              <Sparkles className="w-8 h-8 text-charcoal-400 mx-auto" />
              <h3 className="font-bold text-base text-charcoal-800">
                No Grievances Reported Yet
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                Spot a pothole or overflowing waste bin? Help improve Bengaluru by uploading photo evidence.
              </p>
              <Link
                to="/report"
                className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-terracotta text-white font-bold text-xs shadow-warm"
              >
                Submit First Report
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportedComplaints.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-3 flex flex-col justify-between hover:border-terracotta-300 transition-all"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-20 h-20 rounded-2xl object-cover bg-charcoal-100 flex-shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-charcoal-700">
                          #{item.complaintId}
                        </span>
                        <StatusBadge status={item.status} size="sm" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-charcoal-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-charcoal-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E9EFE7] text-xs">
                    <SeverityBadge severity={item.severity} size="sm" />
                    <Link
                      to={`/complaints/${item._id}`}
                      className="font-bold text-terracotta hover:text-terracotta-700 flex items-center space-x-1"
                    >
                      <span>Track Lifecycle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Upvoted Tab */
        <div className="space-y-4">
          {upvotedComplaints.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#E9EFE7] text-center space-y-3">
              <ThumbsUp className="w-8 h-8 text-charcoal-400 mx-auto" />
              <h3 className="font-bold text-base text-charcoal-800">
                No Grievances Upvoted Yet
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                Explore the live Bengaluru city map and upvote community complaints to elevate their municipal repair urgency!
              </p>
              <Link
                to="/map"
                className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-forest text-white font-bold text-xs shadow-warm"
              >
                Explore Live Map
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upvotedComplaints.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-3xl border border-[#E9EFE7] shadow-warm space-y-3 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-20 h-20 rounded-2xl object-cover bg-charcoal-100 flex-shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-charcoal-700">
                          #{item.complaintId}
                        </span>
                        <StatusBadge status={item.status} size="sm" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-charcoal-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-charcoal-500 truncate">{item.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E9EFE7] text-xs">
                    <span className="text-terracotta font-bold flex items-center space-x-1">
                      <ThumbsUp className="w-3.5 h-3.5 fill-current" />
                      <span>{item.upvotesCount || 1} Community Upvotes</span>
                    </span>
                    <Link
                      to={`/complaints/${item._id}`}
                      className="font-bold text-forest hover:underline"
                    >
                      View Record →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
