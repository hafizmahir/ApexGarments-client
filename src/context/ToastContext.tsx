import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (title: string, type?: ToastType, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  confirmDialog: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    onConfirm: () => void | Promise<void>;
  }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    danger: boolean;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, type: ToastType = 'success', message?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, type, title, message, duration };

      setToasts(prev => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const confirmDialog = useCallback(
    (options: {
      title: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      danger?: boolean;
      onConfirm: () => void | Promise<void>;
    }) => {
      setDialogConfig({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        danger: Boolean(options.danger),
        onConfirm: options.onConfirm
      });
    },
    []
  );

  const handleCloseDialog = () => {
    setDialogConfig(null);
  };

  const handleConfirmAction = async () => {
    if (dialogConfig?.onConfirm) {
      await dialogConfig.onConfirm();
    }
    handleCloseDialog();
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, confirmDialog }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-200 transform translate-y-0 ${
                isSuccess
                  ? 'bg-white dark:bg-slate-900 border-emerald-500/40 text-slate-800 dark:text-slate-100 shadow-emerald-500/10'
                  : isError
                  ? 'bg-white dark:bg-slate-900 border-rose-500/40 text-slate-800 dark:text-slate-100 shadow-rose-500/10'
                  : isWarning
                  ? 'bg-white dark:bg-slate-900 border-amber-500/40 text-slate-800 dark:text-slate-100 shadow-amber-500/10'
                  : 'bg-white dark:bg-slate-900 border-indigo-500/40 text-slate-800 dark:text-slate-100 shadow-indigo-500/10'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-500" />}
              </div>

              <div className="flex-1 text-sm">
                <p className="font-semibold">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* SweetAlert-Style Reusable Modal Dialog */}
      {dialogConfig?.isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${
                  dialogConfig.danger
                    ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600'
                    : 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600'
                }`}
              >
                {dialogConfig.danger ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {dialogConfig.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {dialogConfig.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                {dialogConfig.cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm cursor-pointer ${
                  dialogConfig.danger
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {dialogConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
