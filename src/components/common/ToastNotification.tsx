import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        let borderClass = 'border-agro-200 bg-white';

        if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
          borderClass = 'border-rose-200 bg-rose-50/90';
        } else if (toast.type === 'warning') {
          icon = <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
          borderClass = 'border-amber-200 bg-amber-50/90';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />;
          borderClass = 'border-sky-200 bg-sky-50/90';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-soft-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${borderClass}`}
          >
            <div className="pt-0.5">{icon}</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-charcoal-900">{toast.title}</h4>
              <p className="text-xs text-charcoal-800/80 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 transition p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
