import React from 'react';

/**
 * Design System Components for Career Mitra
 * 
 * Reusable, responsive, and styled to fit a premium modern SaaS aesthetic.
 */

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:active:scale-100';

  const variants = {
    primary: 'btn-primary text-white',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus:ring-rose-500/20',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm focus:ring-emerald-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', hover = true, ...props }) => (
  <div
    className={`card ${hover ? 'card-hover' : ''} p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const Badge = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    neutral: 'badge-neutral',
  };

  return (
    <span className={`badge ${variants[variant] || variants.primary}`}>
      {children}
    </span>
  );
};

export const Input = ({ label, error, hint, ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wider mb-1.5">
        {label}
      </label>
    )}
    <input
      className={`input-field ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
      {...props}
    />
    {hint && !error && <p className="text-ink-500 text-xs mt-1.5">{hint}</p>}
    {error && <p className="text-rose-600 text-xs mt-1.5 font-medium">{error}</p>}
  </div>
);

export const Select = ({ label, options, error, ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wider mb-1.5">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        className={`input-field appearance-none pr-10 ${error ? 'border-rose-500' : ''}`}
        {...props}
      >
        <option value="">Select...</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-ink-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
    {error && <p className="text-rose-600 text-xs mt-1.5 font-medium">{error}</p>}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-modal max-w-md w-full max-h-[85vh] overflow-y-auto border border-surface-200 animate-slide-up"
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-surface-200 px-6 py-4.5 flex justify-between items-center rounded-t-2xl z-10">
          <h2 className="text-base font-bold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 transition-colors w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-100 font-bold"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const Loader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="relative flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-16 px-4 bg-white border border-surface-200 rounded-2xl">
    {Icon && (
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
        <Icon size={22} />
      </div>
    )}
    <h3 className="text-sm font-bold text-ink-900 mb-1">{title}</h3>
    <p className="text-ink-500 text-xs max-w-xs mx-auto leading-relaxed">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const Alert = ({ type = 'info', message, onClose }) => {
  const types = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
    error: 'bg-rose-50 text-rose-800 border-rose-200/60',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/60',
    info: 'bg-indigo-50 text-indigo-800 border-indigo-200/60',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`px-4.5 py-3 rounded-xl border text-sm ${types[type]} flex gap-3 items-center justify-between shadow-sm animate-slide-up`}>
      <div className="flex gap-2.5 items-center">
        <span className="font-bold text-xs bg-white/80 w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-2xs">
          {icons[type]}
        </span>
        <span className="font-medium text-xs leading-normal">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity font-bold text-xs px-2 py-1 hover:bg-black/5 rounded-lg">
          ✕
        </button>
      )}
    </div>
  );
};

export const Skeleton = ({ count = 1, className = '' }) => (
  <div className="space-y-2">
    {Array(count).fill(0).map((_, i) => (
      <div
        key={i}
        className={`bg-zinc-100 rounded-xl h-12 animate-pulse ${className}`}
      />
    ))}
  </div>
);
