import React from 'react';
import { AlertCircle, ThumbsUp, ArrowRight, X, MapPin, CheckCircle } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import StatusBadge from './StatusBadge';

export const DuplicateAlertModal = ({
  isOpen,
  onClose,
  duplicatesData,
  onUpvoteExisting,
  onProceedAnyway,
  isSubmitting = false,
}) => {
  if (!isOpen || !duplicatesData) return null;

  const topMatch = duplicatesData.topMatch || duplicatesData.duplicates?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-warm-xl border border-terracotta-200 overflow-hidden relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-charcoal-400 hover:text-charcoal hover:bg-ivory-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="flex items-start space-x-3.5 pb-4 border-b border-[#E9EFE7]">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta flex items-center justify-center flex-shrink-0 shadow-warm">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-extrabold text-xl text-charcoal-900">
                Potential Duplicate Grievance Detected
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-terracotta-100 text-terracotta-800">
                200m Spatial Radius
              </span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              A very similar complaint was already reported just <strong className="text-terracotta-700">{topMatch?.distanceMeters || 45} meters away</strong>. 
              Instead of creating a duplicate ticket, upvoting consolidates citizen voice and accelerates municipal dispatch!
            </p>
          </div>
        </div>

        {/* Existing Complaint Card */}
        {topMatch && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-ivory-100 border border-[#E4DCB8] space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Photo Thumbnail */}
              <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-charcoal-100 flex-shrink-0 border border-charcoal-200 relative">
                <img
                  src={topMatch.imageUrl}
                  alt={topMatch.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400';
                  }}
                />
                <div className="absolute bottom-1 right-1 bg-charcoal/80 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs">
                  {topMatch.distanceMeters || 45}m away
                </div>
              </div>

              {/* Information */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-mono text-xs font-semibold text-charcoal-500">
                    #{topMatch.complaintId}
                  </span>
                  <StatusBadge status={topMatch.status} size="sm" />
                </div>

                <h4 className="font-display font-bold text-sm sm:text-base text-charcoal-900 leading-snug">
                  {topMatch.title}
                </h4>

                <p className="text-xs text-charcoal-600 line-clamp-2">
                  {topMatch.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <SeverityBadge severity={topMatch.severity} size="sm" />
                  <span className="text-xs text-charcoal-500 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta" />
                    <span className="truncate max-w-[200px]">{topMatch.address}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between pt-3 border-t border-[#D5DFD1] text-xs">
              <span className="text-charcoal-600 font-medium">
                Reported by {topMatch.reporterName || 'Citizen'} • {topMatch.upvotesCount || 1} citizens affected
              </span>
              <span className="text-forest-700 font-bold flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{topMatch.similarityScore || 88}% Triage Match</span>
              </span>
            </div>
          </div>
        )}

        {/* Benefits Box */}
        <div className="mt-4 p-3 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-800 space-y-1">
          <p className="font-bold flex items-center space-x-1.5">
            <span>💡 Why upvote instead of creating a duplicate ticket?</span>
          </p>
          <p className="text-charcoal-700">
            Municipal algorithms rank issues with higher upvotes at the top of the engineering queue. Submitting separate tickets for the same pothole dilutes urgency and slows down repair crews.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#E9EFE7]">
          <button
            type="button"
            onClick={onProceedAnyway}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-charcoal-300 text-charcoal-700 hover:bg-sage/40 font-semibold text-xs transition-colors"
          >
            No, It's A Distinct Issue (Submit Anyway)
          </button>

          <button
            type="button"
            onClick={() => onUpvoteExisting(topMatch?._id)}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-warm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Upvote Existing Grievance (+1)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DuplicateAlertModal;
