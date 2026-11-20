import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Clock, Eye, AlertCircle, Wrench, ShieldCheck, ChevronRight } from 'lucide-react';

export const TimelineView = ({ timeline = [], currentStatus = 'Submitted' }) => {
  const { t } = useLanguage();

  const allStages = [
    { key: 'Submitted', label: t('Submitted'), desc: 'Complaint registered by citizen' },
    { key: 'AI Analyzed', label: t('AI Analyzed'), desc: 'Gemini Flash triage & scoring' },
    { key: 'Verified', label: t('Verified'), desc: 'Reviewed by municipal desk' },
    { key: 'Assigned', label: t('Assigned'), desc: 'Dispatched to ward engineering unit' },
    { key: 'In Progress', label: t('In Progress'), desc: 'Field repair works ongoing' },
    { key: 'Resolved', label: t('Resolved'), desc: 'Remediation completed & verified' },
  ];

  const currentStageIndex = allStages.findIndex(s => s.key === currentStatus);

  return (
    <div className="space-y-6">
      {/* Horizontal Progress Bar for Large Screens */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#D5DFD1] w-full -z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-forest transition-all duration-500 -z-0"
            style={{ width: `${Math.max(0, (currentStageIndex / (allStages.length - 1)) * 100)}%` }}
          ></div>

          {allStages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-warm ${
                    isCurrent
                      ? 'bg-terracotta text-white ring-4 ring-terracotta-100 scale-110'
                      : isCompleted
                      ? 'bg-forest text-white'
                      : 'bg-white text-charcoal-400 border border-charcoal-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                    isCurrent ? 'text-terracotta-700 font-bold' : isCompleted ? 'text-forest-800' : 'text-charcoal-400'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical Detailed Logs */}
      <div className="space-y-4 pt-4 border-t border-[#E9EFE7]">
        <h5 className="font-display font-bold text-sm text-charcoal-800 uppercase tracking-wider">
          Auditable Activity Log
        </h5>

        {timeline && timeline.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D5DFD1]">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center shadow-warm">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>

                <div className="bg-ivory-100 rounded-xl p-3.5 border border-[#E9EFE7] hover:border-terracotta-200 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-charcoal-800">
                      {item.title || t(item.status) || item.status}
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      {new Date(item.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-2 text-[10px] text-charcoal-500 font-medium">
                    Updated by: <span className="text-forest-800 font-semibold">{item.updatedBy || 'Civic Authority'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-charcoal-500 italic">No timeline entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default TimelineView;
