import React from 'react';

/**
 * Severity indicator with exact spec color rules:
 * 1-3 Low (Green)
 * 4-6 Medium (Mustard Yellow)
 * 7-8 High (Terracotta / Orange)
 * 9-10 Critical (Crimson Red)
 */
export const SeverityBadge = ({ severity = 5, showText = true, size = 'md' }) => {
  const num = parseInt(severity) || 5;

  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  let label = 'Medium';
  let dotColor = '';

  if (num >= 9) {
    label = 'Critical';
    bgClass = 'bg-[#FBEAEA]';
    textClass = 'text-[#B82B2B]';
    borderClass = 'border-[#F4C5C5]';
    dotColor = 'bg-[#B82B2B]';
  } else if (num >= 7) {
    label = 'High';
    bgClass = 'bg-terracotta-50';
    textClass = 'text-terracotta-700';
    borderClass = 'border-terracotta-200';
    dotColor = 'bg-terracotta';
  } else if (num >= 4) {
    label = 'Medium';
    bgClass = 'bg-[#FDF6E2]';
    textClass = 'text-[#9A7010]';
    borderClass = 'border-[#F7E2A4]';
    dotColor = 'bg-mustard';
  } else {
    label = 'Low';
    bgClass = 'bg-forest-50';
    textClass = 'text-forest-700';
    borderClass = 'border-forest-200';
    dotColor = 'bg-forest';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-semibold rounded-full border ${bgClass} ${textClass} ${borderClass} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${num >= 8 ? 'animate-ping' : ''}`}></span>
      <span>{num}/10</span>
      {showText && <span>• {label}</span>}
    </span>
  );
};

export default SeverityBadge;
