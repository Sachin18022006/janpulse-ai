import React from 'react';
import { Sparkles, Shield, AlertTriangle, CheckCircle, Tag, Building2, Compass } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export const AIAnalysisCard = ({ analysis, isAnalyzing = false }) => {
  if (isAnalyzing) {
    return (
      <div className="rounded-2xl border border-terracotta-200 bg-white p-6 shadow-warm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center text-terracotta animate-spin">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-charcoal-800">
              Gemini Flash AI Analyzing Civic Issue...
            </h4>
            <p className="text-xs text-charcoal-500">
              Identifying category, calculating 1–10 severity, and matching municipal department
            </p>
          </div>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-sage/60 rounded-md w-3/4"></div>
          <div className="h-4 bg-sage/60 rounded-md w-1/2"></div>
          <div className="h-20 bg-ivory-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const confidencePercent = Math.round((analysis.confidence || 0.9) * 100);

  return (
    <div className="rounded-2xl border-2 border-terracotta-200 bg-gradient-to-br from-white to-[#FDF9F5] p-6 shadow-warm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E9EFE7]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-600 text-white flex items-center justify-center shadow-warm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-display font-bold text-base text-charcoal-900">
                Gemini AI Triage Assessment
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
                {confidencePercent}% AI Confidence
              </span>
            </div>
            <p className="text-xs text-charcoal-500">
              Verified by Google Gemini Flash Multimodal Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-charcoal-600">Calculated Severity:</span>
          <SeverityBadge severity={analysis.severity} size="lg" />
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Identified Category & Department */}
        <div className="p-4 rounded-xl bg-ivory-100 border border-[#E9EFE7] space-y-2">
          <div className="text-xs font-semibold text-charcoal-500 flex items-center space-x-1.5">
            <Tag className="w-3.5 h-3.5 text-terracotta" />
            <span>Civic Category</span>
          </div>
          <p className="font-display font-bold text-base text-charcoal-800">
            {analysis.category || 'Road Damage'}
          </p>
          <div className="text-xs text-charcoal-600 flex items-center space-x-1.5 pt-1 border-t border-[#E4DCB8]/40">
            <Building2 className="w-3.5 h-3.5 text-forest" />
            <span className="font-medium text-forest-800">{analysis.department || 'BBMP Roads & Infrastructure'}</span>
          </div>
        </div>

        {/* Urgency & Severity Gauge */}
        <div className="p-4 rounded-xl bg-ivory-100 border border-[#E9EFE7] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-mustard" />
              <span>Urgency Level</span>
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              analysis.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
              analysis.urgency === 'High' ? 'bg-terracotta-100 text-terracotta-800' :
              analysis.urgency === 'Medium' ? 'bg-mustard-100 text-mustard-800' :
              'bg-forest-100 text-forest-800'
            }`}>
              {analysis.urgency || 'High'} Priority
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-charcoal-600">
              <span>Severity Gauge</span>
              <span>{analysis.severity || 5} / 10</span>
            </div>
            <div className="w-full bg-[#E9EFE7] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (analysis.severity || 5) >= 8 ? 'bg-terracotta-600' :
                  (analysis.severity || 5) >= 5 ? 'bg-mustard-500' :
                  'bg-forest-500'
                }`}
                style={{ width: `${Math.min(100, ((analysis.severity || 5) / 10) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Detected Objects / Defects */}
      {analysis.detectedObjects && analysis.detectedObjects.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-charcoal-600">
            AI Detected Features & Defects:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.detectedObjects.map((obj, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-sage/60 border border-sage-300 text-charcoal-800 text-xs font-medium"
              >
                ✓ {obj}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div className="p-3.5 rounded-xl bg-forest-50/70 border border-forest-200 flex items-start space-x-3">
        <CheckCircle className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-forest-800">
            Recommended Municipal Action
          </h5>
          <p className="text-xs text-charcoal-700 mt-0.5 font-medium">
            {analysis.recommendedAction || 'Schedule road repair inspection'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisCard;
