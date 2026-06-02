import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { type, message } = e.detail;
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      
      setToasts((prev) => [...prev, { id, type, message }]);

      // Auto dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener('custom-toast', handleToast);
    return () => window.removeEventListener('custom-toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        let icon = <FiInfo size={16} />;
        let colorClass = 'bg-blue-50 border-blue-200 text-blue-800';
        let progressColor = 'bg-blue-500';
        
        if (t.type === 'success') {
          icon = <FiCheckCircle size={16} className="text-emerald-600" />;
          colorClass = 'bg-white/95 border-emerald-100 text-ink-900 shadow-emerald-500/5';
          progressColor = 'bg-emerald-500';
        } else if (t.type === 'error') {
          icon = <FiAlertCircle size={16} className="text-rose-600" />;
          colorClass = 'bg-white/95 border-rose-100 text-ink-900 shadow-rose-500/5';
          progressColor = 'bg-rose-500';
        } else if (t.type === 'warning') {
          icon = <FiAlertTriangle size={16} className="text-amber-600" />;
          colorClass = 'bg-white/95 border-amber-100 text-ink-900 shadow-amber-500/5';
          progressColor = 'bg-amber-500';
        } else if (t.type === 'info') {
          icon = <FiInfo size={16} className="text-indigo-600" />;
          colorClass = 'bg-white/95 border-indigo-100 text-ink-900 shadow-indigo-500/5';
          progressColor = 'bg-indigo-600';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto border rounded-xl p-4 flex gap-3.5 items-start shadow-modal backdrop-blur-md transition-all duration-300 animate-slide-up relative overflow-hidden ${colorClass}`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 text-xs font-semibold leading-relaxed pr-2">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-ink-400 hover:text-ink-900 transition-colors shrink-0"
            >
              <FiX size={14} />
            </button>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-surface-100/50">
              <div className={`h-full ${progressColor} animate-progress-bar`} style={{ animationDuration: '4000ms' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
