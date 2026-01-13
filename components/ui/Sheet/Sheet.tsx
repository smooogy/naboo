'use client';

import { useEffect, useRef, useCallback, useState, HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Sheet/Drawer component - Right-side panel overlay
 * 
 * Features:
 * - Focus trap for accessibility
 * - ESC to close
 * - Backdrop click to close
 * - ARIA labels
 * - Responsive: drawer on desktop, full-screen on mobile
 * 
 * Future extensions:
 * - Add keyboard shortcuts (e.g., Cmd+Enter to approve)
 * - Add "Approve all" batch action
 * - Add swipe-to-close on mobile
 */

export interface SheetProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  ({ open, onOpenChange, title, children, className, ...props }, ref) => {
    const sheetRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Handle ESC key to close
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          onOpenChange(false);
        }
      },
      [open, onOpenChange]
    );

    // Focus trap - keep focus within the sheet
    const handleFocusTrap = useCallback(
      (e: KeyboardEvent) => {
        if (!open || e.key !== 'Tab' || !sheetRef.current) return;

        const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      },
      [open]
    );

    // Handle mounting/unmounting for animations
    useEffect(() => {
      if (open) {
        setIsMounted(true);
      } else {
        // Delay unmounting to allow exit animation
        const timer = setTimeout(() => setIsMounted(false), 300);
        return () => clearTimeout(timer);
      }
    }, [open]);

    useEffect(() => {
      if (open && isMounted) {
        // Store the currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;
        
        // Focus the sheet after animation starts
        setTimeout(() => {
          const closeButton = sheetRef.current?.querySelector<HTMLElement>('[data-sheet-close]');
          closeButton?.focus();
        }, 100);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      } else {
        // Restore focus
        previousActiveElement.current?.focus();
        
        // Restore body scroll
        document.body.style.overflow = '';
      }

      if (!isMounted) return;

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', handleFocusTrap);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keydown', handleFocusTrap);
        document.body.style.overflow = '';
      };
    }, [open, isMounted, handleKeyDown, handleFocusTrap]);

    if (!isMounted && !open) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ease-out',
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />

        {/* Sheet */}
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Sheet'}
          className={cn(
            // Base styles
            'fixed z-50 bg-white flex flex-col',
            // Desktop: right drawer with smooth slide-in animation
            'lg:right-0 lg:top-0 lg:h-full lg:w-[480px] lg:shadow-[-4px_0_24px_rgba(0,0,0,0.08)]',
            'lg:transition-transform lg:duration-300 lg:ease-out',
            open ? 'lg:translate-x-0' : 'lg:translate-x-full',
            // Mobile: full screen sheet from bottom with smooth slide-up animation
            'max-lg:inset-0',
            'max-lg:transition-transform max-lg:duration-300 max-lg:ease-out',
            open ? 'max-lg:translate-y-0' : 'max-lg:translate-y-full',
            // Hide when closed
            !open && 'pointer-events-none',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

Sheet.displayName = 'Sheet';

// Sheet Header component
export interface SheetHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ onClose, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-start justify-between gap-4 p-5 border-b border-border shrink-0',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {onClose && (
        <button
          data-sheet-close
          onClick={onClose}
          className="p-2 -m-2 hover:bg-grey-light rounded transition-colors shrink-0"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="#737876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  )
);

SheetHeader.displayName = 'SheetHeader';

// Sheet Body component
export const SheetBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1 overflow-y-auto p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
);

SheetBody.displayName = 'SheetBody';

// Sheet Footer component
export const SheetFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'shrink-0 p-5 border-t border-border bg-white',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

SheetFooter.displayName = 'SheetFooter';
