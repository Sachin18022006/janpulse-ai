import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Clock, Eye, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';

export const StatusBadge = ({ status = 'Submitted', size = 'md' }) => {
  const { t } = useLanguage();

  const configs = {
    Submitted: {
      bg: 'bg-ivory-200',
      text: 'text-charcoal-700',
      border: 'border-charcoal-300',
      icon: Clock,
    },
    'AI Analyzed': {
      bg: 'bg-mustard-50',
      text: 'text-mustard-800',
      border: 'border-mustard-200',
      icon: Eye,
    },
    Verified: {
      bg: 'bg-sage',
      text: 'text-forest-800',
      border: 'border-forest-200',
      icon: ShieldAlert,
    },
    Assigned: {
      bg: 'bg-terracotta-50',
      text: 'text-terracotta-700',
      border: 'border-terracotta-200',
      icon: AlertCircle,
    },
    'In Progress': {
      bg: 'bg-[#F9EFE7]',
      text: 'text-[#B85427]',
      border: 'border-terracotta-300',
      icon: Wrench,
    },
    Resolved: {
      bg: 'bg-forest-100',
      text: 'text-forest-800',
      border: 'border-forest-300',
      icon: CheckCircle2,
    },
  };

  const current = configs[status] || configs.Submitted;
  const Icon = current.icon;
  const localizedLabel = t(status);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5',
    lg: 'text-sm px-3.5 py-1.5 space-x-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{localizedLabel}</span>
    </span>
  );
};

export default StatusBadge;
