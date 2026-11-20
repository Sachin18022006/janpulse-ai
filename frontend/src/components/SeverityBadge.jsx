import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const SeverityBadge = ({ severity = 5, showText = true, size = 'md' }) => {
  const { t } = useLanguage();
  const num = parseInt(severity) || 5;

  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  let labelKey = 'medium';
  let dotColor = '';

  if (num >= 9) {
    labelKey = 'critical';
    bgClass = 'bg-[#FBEAEA]';
    textClass = 'text-[#B82B2B]';
    borderClass = 'border-[#F4C5C5]';
    dotColor = 'bg-[#B82B2B]';
  } else if (num >= 7) {
    labelKey = 'high';
    bgClass = 'bg-terracotta-50';
    textClass = 'text-terracotta-700';
    borderClass = 'border-terracotta-200';
    dotColor = 'bg-terracotta';
  } else if (num >= 4) {
    labelKey = 'medium';
    bgClass = 'bg-[#FDF6E2]';
    textClass = 'text-[#9A7010]';
    borderClass = 'border-[#F7E2A4]';
    dotColor = 'bg-mustard';
  } else {
    labelKey = 'low';
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

  const label = t(labelKey);

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
