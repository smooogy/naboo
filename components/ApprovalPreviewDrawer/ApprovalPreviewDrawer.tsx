'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Sheet, SheetHeader, SheetBody, SheetFooter } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

/**
 * Approval Preview Drawer
 * 
 * Level 1 decision surface for approving/denying bookings without leaving the dashboard.
 * Opens from clicking a pending event card on the Home dashboard.
 * 
 * Features:
 * - Summary view of booking details
 * - Cost breakdown (venue, catering, activities, etc.)
 * - Risk/warning flags
 * - Approve/Deny with confirmation
 * - Link to full details page
 * 
 * Future extensions:
 * - Add "Approve all" batch action
 * - Add keyboard shortcuts (Cmd+Enter to approve, Cmd+Backspace to deny)
 * - Add swipe gestures on mobile
 * - Add approval history/audit log
 */

// Types - shared with full approval page
export interface CostBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  icon?: string;
}

export interface BookingRisk {
  type: 'over_budget' | 'missing_attendees' | 'quote_expiring' | 'policy_violation';
  message: string;
  severity: 'warning' | 'error';
}

export interface BookingDetails {
  id: string;
  eventName: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  status: 'pending' | 'approved' | 'denied';
  venue: {
    name: string;
    location: string;
    rating?: number;
    reviewCount?: number;
    image: string;
    type?: string;
    amenities?: string[];
  };
  financial: {
    totalAmount: number;
    budget?: number;
    budgetPerParticipant?: number;
    costBreakdown: CostBreakdownItem[];
  };
  risks: BookingRisk[];
  requestedBy: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ApprovalPreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string | null;
  onApprove?: (eventId: string) => void;
  onDeny?: (eventId: string, reason?: string) => void;
  onRemoveFromList?: (eventId: string) => void;
}

// Mock data fetching - replace with actual API call
const fetchBookingDetails = async (eventId: string): Promise<BookingDetails> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Mock data - in production, this would call the existing API endpoint
  const mockData: Record<string, BookingDetails> = {
    '1': {
      id: '1',
      eventName: 'Corporate Retreat',
      startDate: '2025-10-27',
      endDate: '2025-11-23',
      guestCount: 78,
      status: 'pending',
      venue: {
        name: 'The Mansion at Glen Cove',
        location: 'Glen Cove, NY',
        rating: 4.8,
        reviewCount: 124,
        image: '/fake_data/cq7_1759329005051.webp',
        type: 'Venue',
        amenities: ['Pool', 'Spa', 'Conference rooms'],
      },
      financial: {
        totalAmount: 49350,
        budget: 45000,
        budgetPerParticipant: 577,
        costBreakdown: [
          { category: 'Venue', amount: 22000, percentage: 44 },
          { category: 'Catering', amount: 15500, percentage: 31 },
          { category: 'Activities', amount: 6000, percentage: 12 },
          { category: 'Transport', amount: 4350, percentage: 9 },
          { category: 'Fees', amount: 1500, percentage: 3 },
        ],
      },
      risks: [
        { type: 'over_budget', message: '+€4,350 over budget', severity: 'warning' },
        { type: 'quote_expiring', message: 'Quote expires in 3 days', severity: 'warning' },
      ],
      requestedBy: {
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: '/assets/avatar-patricia.png',
      },
    },
    '2': {
      id: '2',
      eventName: 'Quarterly Team Lunch',
      startDate: '2025-11-15',
      endDate: '2025-11-15',
      guestCount: 3,
      status: 'pending',
      venue: {
        name: 'Holiday Inn',
        location: 'Manhattan, NY',
        rating: 4.2,
        reviewCount: 89,
        image: '/fake_data/send-image2183.png',
        type: 'Hotel',
      },
      financial: {
        totalAmount: 3444,
        budget: 5000,
        budgetPerParticipant: 1148,
        costBreakdown: [
          { category: 'Venue', amount: 800, percentage: 23 },
          { category: 'Catering', amount: 2200, percentage: 64 },
          { category: 'Fees', amount: 444, percentage: 13 },
        ],
      },
      risks: [],
      requestedBy: {
        name: 'Marc Dubois',
        email: 'marc.dubois@company.com',
        avatar: '/assets/avatar-marc.png',
      },
    },
    '3': {
      id: '3',
      eventName: 'Executive Offsite',
      startDate: '2025-12-01',
      endDate: '2025-12-05',
      guestCount: 12,
      status: 'pending',
      venue: {
        name: 'Tanque Verde Resort',
        location: 'Tucson, AZ',
        rating: 4.9,
        reviewCount: 256,
        image: '/fake_data/CQuZ1748767898884.webp',
        type: 'Resort',
        amenities: ['Horseback riding', 'Hiking', 'Spa'],
      },
      financial: {
        totalAmount: 29350,
        budget: 30000,
        budgetPerParticipant: 2446,
        costBreakdown: [
          { category: 'Venue', amount: 15000, percentage: 51 },
          { category: 'Catering', amount: 8000, percentage: 27 },
          { category: 'Activities', amount: 4500, percentage: 15 },
          { category: 'Fees', amount: 1850, percentage: 6 },
        ],
      },
      risks: [
        { type: 'missing_attendees', message: '3 attendees not confirmed', severity: 'warning' },
      ],
      requestedBy: {
        name: 'Alexandre Martin',
        email: 'alexandre.m@company.com',
        avatar: '/assets/avatar-alexandre.png',
      },
    },
  };

  const data = mockData[eventId];
  if (!data) {
    throw new Error('Booking not found');
  }
  return data;
};

// Helper to format currency
const formatCurrency = (amount: number, currency = '€') => {
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
};

// Helper to format date range
const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  
  if (startDate === endDate) {
    return start.toLocaleDateString('en-US', options);
  }
  return `${start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-US', options)}`;
};

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ReactNode> = {
    Venue: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 21V8L12 3L20 8V21M4 21H20M4 21H9V14H15V21H20" stroke="#737876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Catering: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 11V20H21V11M12 3L3 11H21L12 3ZM8 15H16M8 15V20M16 15V20" stroke="#737876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Activities: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#737876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Transport: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 17H3V6C3 5.45 3.45 5 4 5H15C18.87 5 22 8.13 22 12V17H20M5 17C5 18.66 6.34 20 8 20C9.66 20 11 18.66 11 17M5 17C5 15.34 6.34 14 8 14C9.66 14 11 15.34 11 17M20 17C20 18.66 18.66 20 17 20C15.34 20 14 18.66 14 17M20 17C20 15.34 18.66 14 17 14C15.34 14 14 15.34 14 17M11 17H14M7 9H3M15 5V12H22" stroke="#737876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Fees: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1V23M17 5H9.5C8.57 5 7.68 5.37 7.02 6.03C6.37 6.68 6 7.57 6 8.5C6 9.43 6.37 10.32 7.02 10.97C7.68 11.63 8.57 12 9.5 12H14.5C15.43 12 16.32 12.37 16.97 13.03C17.63 13.68 18 14.57 18 15.5C18 16.43 17.63 17.32 16.97 17.97C16.32 18.63 15.43 19 14.5 19H6" stroke="#737876" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return icons[category] || icons.Fees;
};

// Confirm dialog component
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'secondary';
  isDestructive?: boolean;
  showReasonInput?: boolean;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  confirmVariant = 'primary',
  isDestructive = false,
  showReasonInput = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) => {
  const [reason, setReason] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[380px] p-5">
        <h3 className="text-[17px] font-medium text-black mb-2">{title}</h3>
        <p className="text-[14px] text-grey mb-4">{description}</p>
        
        {showReasonInput && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for denial (optional)"
            className="w-full border border-border rounded p-3 text-[14px] text-black placeholder:text-grey resize-none mb-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            rows={3}
          />
        )}

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant === 'primary' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => onConfirm(reason)}
            disabled={isLoading}
            className={cn(isDestructive && confirmVariant === 'secondary' && 'bg-red-500 hover:bg-red-600 border-red-500 text-white')}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="space-y-2">
      <div className="h-6 bg-grey-light rounded w-3/4" />
      <div className="h-4 bg-grey-light rounded w-1/2" />
    </div>
    <div className="h-24 bg-grey-light rounded" />
    <div className="space-y-3">
      <div className="h-8 bg-grey-light rounded w-1/3" />
      <div className="h-4 bg-grey-light rounded w-2/3" />
      <div className="h-4 bg-grey-light rounded w-1/2" />
    </div>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-grey-light rounded" />
      ))}
    </div>
  </div>
);

// Error state
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12M12 16H12.01M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <p className="text-[15px] text-black mb-2">Failed to load booking</p>
    <p className="text-[14px] text-grey mb-4">{message}</p>
    <Button variant="outline" size="sm" onClick={onRetry}>
      Try again
    </Button>
  </div>
);

// Clock icon component (matching table style)
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4.67V8L10 9.33M14 8C14 11.31 11.31 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8Z" stroke="#3452bd" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Status badge - styled to match the table badge
const StatusBadge = ({ status }: { status: BookingDetails['status'] }) => {
  const labels = {
    pending: 'Pending approval',
    approved: 'Approved',
    denied: 'Denied',
  };

  // Match table styling: border border-[rgba(0,0,0,0.09)] rounded-full px-2.5 py-[7px] with ClockIcon
  if (status === 'pending') {
    return (
      <div className="border border-[rgba(0,0,0,0.09)] rounded-full px-2.5 py-[7px] flex items-center gap-[7px] w-fit">
        <ClockIcon />
        <span className="text-[14px] font-medium text-[#3452bd] tracking-[-0.14px]">
          {labels[status]}
        </span>
      </div>
    );
  }

  // For approved/denied states, use different styling
  const styles = {
    approved: 'bg-primary/10 border-primary/20 text-primary',
    denied: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 text-[12px] font-medium rounded-full border', styles[status])}>
      {labels[status]}
    </span>
  );
};

// Risk alert row
const RiskAlert = ({ risk }: { risk: BookingRisk }) => {
  const icons = {
    over_budget: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5.33V8M8 10.67H8.01M14 8C14 11.31 11.31 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    missing_attendees: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.67 14V12.67C10.67 11.96 10.38 11.28 9.88 10.78C9.38 10.28 8.7 10 8 10H4C3.3 10 2.62 10.28 2.12 10.78C1.62 11.28 1.33 11.96 1.33 12.67V14M14.67 14V12.67C14.67 12.09 14.49 11.52 14.16 11.05C13.83 10.58 13.36 10.23 12.83 10.03M10.67 2.03C11.2 2.23 11.67 2.58 12 3.05C12.33 3.52 12.51 4.09 12.51 4.67C12.51 5.25 12.33 5.82 12 6.29C11.67 6.76 11.2 7.11 10.67 7.31M8 7.33C9.47 7.33 10.67 6.13 10.67 4.67C10.67 3.2 9.47 2 8 2C6.53 2 5.33 3.2 5.33 4.67C5.33 6.13 6.53 7.33 8 7.33Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    quote_expiring: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4V8L10.67 9.33M14 8C14 11.31 11.31 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    policy_violation: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 8L7.33 9.33L10 6.67M8 1.33L2.67 3.67V7.33C2.67 10.61 4.93 13.69 8 14.67C11.07 13.69 13.33 10.61 13.33 7.33V3.67L8 1.33Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  const severityStyles = {
    warning: 'bg-amber-50 border-amber-100 text-amber-700',
    error: 'bg-red-50 border-red-100 text-red-700',
  };

  return (
    <div className={cn('flex items-center gap-2.5 px-3 py-2.5 rounded border', severityStyles[risk.severity])}>
      {icons[risk.type]}
      <span className="text-[13px]">{risk.message}</span>
    </div>
  );
};

export function ApprovalPreviewDrawer({
  open,
  onOpenChange,
  eventId,
  onApprove,
  onDeny,
  onRemoveFromList,
}: ApprovalPreviewDrawerProps) {
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<'approve' | 'deny' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch booking details when drawer opens
  const loadBooking = useCallback(async () => {
    if (!eventId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBookingDetails(eventId);
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (open && eventId) {
      loadBooking();
    } else {
      // Reset state when closing
      setBooking(null);
      setError(null);
      setConfirmDialog(null);
    }
  }, [open, eventId, loadBooking]);

  // Handle approve action
  const handleApprove = async () => {
    if (!booking) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update local state
      setBooking((prev) => prev ? { ...prev, status: 'approved' } : null);
      
      // Call parent callback
      onApprove?.(booking.id);
      onRemoveFromList?.(booking.id);

      // Show success toast
      toast({
        title: 'Booking approved',
        description: `${booking.eventName} has been approved successfully.`,
        variant: 'success',
      });

      // Close confirm dialog
      setConfirmDialog(null);

      // Auto-close drawer after short delay
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      toast({
        title: 'Failed to approve',
        description: 'Please try again.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deny action
  const handleDeny = async (reason?: string) => {
    if (!booking) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update local state
      setBooking((prev) => prev ? { ...prev, status: 'denied' } : null);
      
      // Call parent callback
      onDeny?.(booking.id, reason);
      onRemoveFromList?.(booking.id);

      // Show success toast
      toast({
        title: 'Booking denied',
        description: `${booking.eventName} has been denied.`,
        variant: 'default',
      });

      // Close confirm dialog
      setConfirmDialog(null);

      // Auto-close drawer after short delay
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      toast({
        title: 'Failed to deny',
        description: 'Please try again.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate budget variance
  const getBudgetVariance = () => {
    if (!booking?.financial.budget) return null;
    const variance = booking.financial.totalAmount - booking.financial.budget;
    if (variance > 0) {
      return { type: 'over' as const, amount: variance };
    } else if (variance < 0) {
      return { type: 'under' as const, amount: Math.abs(variance) };
    }
    return { type: 'on' as const, amount: 0 };
  };

  const budgetVariance = booking ? getBudgetVariance() : null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} title={booking?.eventName || 'Booking Preview'}>
        {isLoading ? (
          <SheetBody>
            <LoadingSkeleton />
          </SheetBody>
        ) : error ? (
          <SheetBody>
            <ErrorState message={error} onRetry={loadBooking} />
          </SheetBody>
        ) : booking ? (
          <>
            {/* Header */}
            <SheetHeader onClose={() => onOpenChange(false)}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-medium text-black leading-[1.3]">
                    {booking.eventName}
                  </h2>
                </div>
                <p className="text-[14px] text-grey">
                  {formatDateRange(booking.startDate, booking.endDate)} · {booking.guestCount} guests
                </p>
                <StatusBadge status={booking.status} />
              </div>
            </SheetHeader>

            {/* Body */}
            <SheetBody>
              <div className="space-y-6">
                {/* Venue summary card */}
                <div className="border border-border rounded p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                      <Image
                        src={booking.venue.image}
                        alt={booking.venue.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 right-0">
                        <Image
                          src="/assets/type_venue.svg"
                          alt="Venue"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-medium text-black leading-[1.3] truncate">
                        {booking.venue.name}
                      </h3>
                      <p className="text-[13px] text-grey flex items-center gap-1 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 6.5C6.83 6.5 7.5 5.83 7.5 5C7.5 4.17 6.83 3.5 6 3.5C5.17 3.5 4.5 4.17 4.5 5C4.5 5.83 5.17 6.5 6 6.5Z" stroke="#737876" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 11C8 9 10 7.21 10 5C10 2.79 8.21 1 6 1C3.79 1 2 2.79 2 5C2 7.21 4 9 6 11Z" stroke="#737876" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {booking.venue.location}
                      </p>
                      {booking.venue.rating && (
                        <p className="text-[13px] text-grey flex items-center gap-1 mt-1">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 1L7.55 4.13L11 4.64L8.5 7.07L9.09 10.5L6 8.89L2.91 10.5L3.5 7.07L1 4.64L4.45 4.13L6 1Z" fill="#f59e0b" stroke="#f59e0b" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-black font-medium">{booking.venue.rating}</span>
                          <span className="text-grey">({booking.venue.reviewCount} reviews)</span>
                        </p>
                      )}
                    </div>
                  </div>
                  {booking.venue.amenities && booking.venue.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {booking.venue.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 bg-grey-light text-[11px] text-grey rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Financial summary */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-grey tracking-[-0.12px]">Total amount</p>
                    <p className="text-[28px] text-black leading-[1.2]">
                      {formatCurrency(booking.financial.totalAmount)}
                    </p>
                  </div>

                

                </div>

                {/* Cost breakdown */}
                <div className="space-y-3">
                  <p className="text-[12px] font-medium text-grey tracking-[-0.12px]">Cost breakdown</p>
                  <div className="space-y-2">
                    {booking.financial.costBreakdown.map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between py-2 px-3 -mx-3 rounded hover:bg-grey-light/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-grey-light rounded flex items-center justify-center">
                            {getCategoryIcon(item.category)}
                          </div>
                          <span className="text-[14px] text-black">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] text-black">{formatCurrency(item.amount)}</p>
                          <p className="text-[12px] text-grey">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks/Warnings */}
                {booking.risks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[12px] font-medium text-grey tracking-[-0.12px]">Attention required</p>
                    <div className="space-y-2">
                      {booking.risks.map((risk, index) => (
                        <RiskAlert key={index} risk={risk} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Requested by */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-[12px] font-medium text-grey tracking-[-0.12px] mb-2">Requested by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-grey-light">
                      {booking.requestedBy.avatar ? (
                        <Image
                          src={booking.requestedBy.avatar}
                          alt={booking.requestedBy.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[12px] text-grey">
                          {booking.requestedBy.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] text-black">{booking.requestedBy.name}</p>
                      <p className="text-[12px] text-grey">{booking.requestedBy.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetBody>

            {/* Footer with actions */}
            <SheetFooter>
              <div className="space-y-3">
                {booking.status === 'pending' ? (
                  <>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setConfirmDialog('deny')}
                      >
                        Deny booking
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1 text-white"
                        onClick={() => setConfirmDialog('approve')}
                      >
                        Approve booking
                      </Button>
                    </div>
                    <a
                      href={`/approval/${booking.id}`}
                      className="block text-center text-[14px] text-primary hover:underline"
                    >
                      View full details →
                    </a>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-[14px] text-grey">
                      This booking has been {booking.status}.
                    </p>
                    <a
                      href={`/approval/${booking.id}`}
                      className="inline-block mt-2 text-[14px] text-primary hover:underline"
                    >
                      View full details →
                    </a>
                  </div>
                )}
              </div>
            </SheetFooter>
          </>
        ) : null}
      </Sheet>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={confirmDialog === 'approve'}
        title="Approve this booking?"
        description={`This will approve "${booking?.eventName}" and notify the organizer.`}
        confirmLabel="Approve"
        confirmVariant="primary"
        onConfirm={handleApprove}
        onCancel={() => setConfirmDialog(null)}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={confirmDialog === 'deny'}
        title="Deny this booking?"
        description={`This will deny "${booking?.eventName}" and notify the organizer.`}
        confirmLabel="Deny booking"
        confirmVariant="secondary"
        isDestructive
        showReasonInput
        onConfirm={handleDeny}
        onCancel={() => setConfirmDialog(null)}
        isLoading={isSubmitting}
      />
    </>
  );
}
