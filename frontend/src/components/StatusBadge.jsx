import React from 'react';
import { CheckCircle2, Clock, Eye, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';

/**
 * Status indicator for complaint lifecycle:
 * Submitted -> AI Analyzed -> Verified -> Assigned -> In Progress -> Resolved
 */
export const StatusBadge = ({ status = 'Submitted', size = 'md' }) => {
  const configs = {
    Submitted: {
      bg: 'bg-ivory-200',
      text: 'text-charcoal-700',
      border: 'border-charcoal-300',
      icon: Clock,
      label: 'Submitted',
    },
    'AI Analyzed': {
      bg: 'bg-mustard-50',
      text: 'text-mustard-800',
      border: 'border-mustard-200',
      icon: Eye,
      label: 'AI Analyzed',
    },
    Verified: {
      bg: 'bg-sage',
      text: 'text-forest-800',
      border: 'border-forest-200',
      icon: ShieldAlert,
      label: 'Verified',
    },
    Assigned: {
      bg: 'bg-terracotta-50',
      text: 'text-terracotta-700',
      border: 'border-terracotta-200',
      icon: AlertCircle,
      label: 'Assigned',
    },
    'In Progress': {
      bg: 'bg-[#F9EFE7]',
      text: 'text-[#B85427]',
      border: 'border-terracotta-300',
      icon: Wrench,
      label: 'In Progress',
    },
    Resolved: {
      bg: 'bg-forest-100',
      text: 'text-forest-800',
      border: 'border-forest-300',
      icon: CheckCircle2,
      label: 'Resolved',
    },
  };

  const current = configs[status] || configs.Submitted;
  const Icon = current.icon;

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
      <span>{current.label}</span>
    </span>
  );
};

export default StatusBadge;
