'use client';

import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Toast notification component
 * 
 * Usage:
 * 1. Wrap app with <ToastProvider>
 * 2. Use const { toast } = useToast() hook
 * 3. Call toast({ title, description, variant })
 */

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastData[];
  toast: (data: Omit<ToastData, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...data, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// Toast container - renders all toasts
function ToastContainer({ 
  toasts, 
  onDismiss 
}: { 
  toasts: ToastData[]; 
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[420px] w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Individual toast item
function ToastItem({ 
  toast, 
  onDismiss 
}: { 
  toast: ToastData; 
  onDismiss: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration ?? 4000;
    const exitTimer = setTimeout(() => setIsExiting(true), duration - 300);
    const dismissTimer = setTimeout(() => onDismiss(toast.id), duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, toast.duration, onDismiss]);

  const variantStyles: Record<ToastVariant, string> = {
    default: 'bg-white border-border',
    success: 'bg-white border-primary',
    error: 'bg-white border-red-500',
    warning: 'bg-white border-amber-500',
  };

  const iconsByVariant: Record<ToastVariant, ReactNode> = {
    default: null,
    success: (
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.33 8L6.67 11.33L12.67 5.33" stroke="#D3D676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
    error: (
      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5.33V8M8 10.67H8.01M14 8C14 11.31 11.31 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8Z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
    warning: (
      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5.33V8M8 10.67H8.01M6.86 2.57L1.21 12C1.09 12.2 1.02 12.43 1.02 12.67C1.02 12.91 1.09 13.14 1.21 13.33C1.34 13.53 1.51 13.7 1.73 13.82C1.94 13.94 2.18 14 2.43 14H13.57C13.82 14 14.06 13.94 14.27 13.82C14.49 13.7 14.66 13.53 14.79 13.33C14.91 13.14 14.98 12.91 14.98 12.67C14.98 12.43 14.91 12.2 14.79 12L9.14 2.57C9.02 2.38 8.85 2.22 8.64 2.1C8.43 1.98 8.2 1.92 7.96 1.92C7.72 1.92 7.49 1.98 7.28 2.1C7.07 2.22 6.9 2.38 6.78 2.57H6.86Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
  };

  return (
    <div
      className={cn(
        'pointer-events-auto bg-white border rounded-lg shadow-md p-4 flex items-start gap-3 transition-all duration-300',
        variantStyles[toast.variant ?? 'default'],
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0 animate-in slide-in-from-right'
      )}
      role="alert"
    >
      {iconsByVariant[toast.variant ?? 'default']}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-black leading-[1.4]">{toast.title}</p>
        {toast.description && (
          <p className="text-[14px] text-grey mt-0.5 leading-[1.4]">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 -m-1 hover:bg-grey-light rounded transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L4 12M4 4L12 12" stroke="#737876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
