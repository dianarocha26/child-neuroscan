import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import Toast, { type ToastType } from '../components/Toast';
import { ResponsiveModal } from '../components/ResponsiveModal';

interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
}

interface DialogContextValue {
  /** Non-blocking message, replaces window.alert(). */
  notify: (message: string, type?: ToastType) => void;
  /** Resolves true if the user confirms, replaces window.confirm(). */
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

interface PendingConfirm extends ConfirmOptions {
  message: string;
  resolve: (ok: boolean) => void;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; type: ToastType } | null>(null);
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const toastId = useRef(0);

  const notify = useCallback((message: string, type: ToastType = 'error') => {
    toastId.current += 1;
    setToast({ id: toastId.current, message, type });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  const confirm = useCallback((message: string, options: ConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setPending((prev) => {
        prev?.resolve(false);
        return { ...options, message, resolve };
      });
    });
  }, []);

  const settle = useCallback((ok: boolean) => {
    setPending((prev) => {
      prev?.resolve(ok);
      return null;
    });
  }, []);

  const cancel = useCallback(() => settle(false), [settle]);

  return (
    <DialogContext.Provider value={{ notify, confirm }}>
      {children}
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={closeToast} />}
      <ResponsiveModal isOpen={!!pending} onClose={cancel} title={pending?.title ?? 'Please confirm'} size="sm">
        <p className="text-gray-700 mb-6">{pending?.message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancel}
            className="px-4 py-2 min-h-[44px] rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => settle(true)}
            className="px-4 py-2 min-h-[44px] rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {pending?.confirmLabel ?? 'Delete'}
          </button>
        </div>
      </ResponsiveModal>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within a DialogProvider');
  return context;
}
