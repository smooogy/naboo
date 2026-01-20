'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Menu01Icon,
  UserMultiple02Icon,
  Calendar03Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  Clock01Icon,
  Tick01Icon,
  Briefcase01Icon,
  UserIcon,
  Folder02Icon,
  Logout03Icon,
  PaintBoardIcon
} from '@hugeicons/core-free-icons';
import { ColorPaletteExplorer, useColorPaletteSettings } from '@/components/ColorPaletteExplorer';

// Assets
const imgLogo = "/assets/logo-v2.svg";

// Types
interface Vendor {
  id: number;
  name: string;
  location?: string;
  price: string;
  status: 'available' | 'pending';
  image: string;
  linkText: string;
  comment?: {
    avatar: string;
    text: string;
  };
}

interface VendorCategory {
  name: string;
  count: number;
  vendors: Vendor[];
}

// Sample data
const vendorCategories: VendorCategory[] = [
  {
    name: 'Venue',
    count: 1,
    vendors: [
      {
        id: 1,
        name: 'Abbaye de Royaumont',
        location: "Val d'Oise, Île-de-France",
        price: '500,00 €',
        status: 'available',
        image: '/fake_data/-BfE1765823942802.webp',
        linkText: 'See the quotation',
        comment: {
          avatar: '/fake_data/-BfE1765823942802.webp',
          text: "J'ai réussi à négocier -10% sur ce lieu atypique !!",
        },
      },
    ],
  },
  {
    name: 'Activities',
    count: 2,
    vendors: [
      {
        id: 2,
        name: 'Equitation',
        price: '500,00 €',
        status: 'pending',
        image: '/fake_data/2_x31747387155525.webp',
        linkText: 'View estimate',
      },
      {
        id: 3,
        name: 'Yoga en pleine nature',
        price: '500,00 €',
        status: 'pending',
        image: '/fake_data/67ec1746325615525.webp',
        linkText: 'View estimate',
      },
    ],
  },
  {
    name: 'Catering',
    count: 2,
    vendors: [
      {
        id: 4,
        name: 'Buffet froid',
        price: '500,00 €',
        status: 'pending',
        image: '/fake_data/8Eqz1751896085806.webp',
        linkText: 'View estimate',
      },
      {
        id: 5,
        name: 'Yoga en pleine nature',
        price: '500,00 €',
        status: 'pending',
        image: '/fake_data/cq7_1759329005051.webp',
        linkText: 'View estimate',
      },
    ],
  },
];

// Vendor Row Component
function VendorRow({ 
  vendor, 
  onViewEstimate,
  isFirst,
  isLast,
  isOnly
}: { 
  vendor: Vendor; 
  onViewEstimate: () => void;
  isFirst: boolean;
  isLast: boolean;
  isOnly: boolean;
}) {
  // Determine border radius based on position
  let borderRadius = '';
  if (isOnly) {
    borderRadius = 'rounded';
  } else if (isFirst) {
    borderRadius = 'rounded-t';
  } else if (isLast) {
    borderRadius = 'rounded-b';
  }

  return (
    <div className={`bg-white border border-border ${borderRadius} ${!isLast && !isOnly ? 'border-b-0' : ''} p-4 flex flex-col gap-3`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Vendor Info */}
        <div className="flex items-center gap-4 w-full lg:w-[320px] shrink-0">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-[58px] h-[58px] rounded object-cover shrink-0"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <p className="font-sans font-medium text-[16px] text-black tracking-[-0.32px] leading-[1.4] truncate">
              {vendor.name}
            </p>
            {vendor.location && (
              <p className="font-sans font-medium text-[14px] text-grey tracking-[-0.28px] truncate">
                {vendor.location}
              </p>
            )}
          </div>
        </div>

        {/* Price & Link */}
        <div className="flex flex-col gap-1 w-full lg:w-[147px]">
          <p className="font-sans font-medium text-black">
            <span className="text-[16px] leading-5">{vendor.price}</span>
            <span className="text-[12px] leading-5 ml-1">excl. VAT</span>
          </p>
          <button
            onClick={onViewEstimate}
            className="flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <span className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px]">
              {vendor.linkText}
            </span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-grey" strokeWidth={1.5} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="shrink-0 w-[180px] flex justify-end">
          {vendor.status === 'available' ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(45, 114, 85, 0.1)' }}>
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#2D7255' }} />
              <span className="font-sans font-medium text-[13px] tracking-[-0.13px]" style={{ color: '#2D7255' }}>
                Ready to book
              </span>
            </div>
          ) : (
            <div className="bg-grey-light flex items-center gap-1.5 px-2 py-1 rounded-full whitespace-nowrap">
              <HugeiconsIcon icon={Clock01Icon} size={12} className="text-black shrink-0" strokeWidth={1.5} />
              <span className="font-sans font-medium text-[13px] text-black tracking-[-0.26px]">
                Pending confirmation
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Comment Row (inside the card for Venue) */}
      {vendor.comment && (
        <div className="bg-black/5 rounded h-8 px-2 flex items-center gap-2 w-full">
          <img
            src={vendor.comment.avatar}
            alt="Comment author"
            className="w-5 h-5 rounded-full object-cover shrink-0"
          />
          <p className="font-sans font-medium text-[13px] text-grey tracking-[-0.26px] leading-5 flex-1 truncate">
            {vendor.comment.text}
          </p>
          <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
        </div>
      )}
    </div>
  );
}

// Skeleton components for progressive loading
function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse-fast bg-grey-light rounded ${className}`} />;
}

function ProposalPageSkeleton() {
  // Same layout constants as main component
  const logoWidth = 70;
  const logoToBreadcrumbGap = 180;
  const mainContentWidth = 816;
  const bookingCardWidth = 320;
  const navPadding = 32;

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Navbar Skeleton */}
      <nav className="bg-white h-[72px] flex items-center">
        <div className="max-w-[1440px] w-full mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center">
            <SkeletonPulse className="w-[70px] h-6" />
            <div className="w-[150px]" />
            <div className="flex items-center gap-2">
              <SkeletonPulse className="w-32 h-4" />
              <SkeletonPulse className="w-4 h-4" />
              <SkeletonPulse className="w-20 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SkeletonPulse className="w-32 h-10 rounded" />
            <SkeletonPulse className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </nav>

      {/* Header Section Skeleton */}
      <header className="bg-white pb-6 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-8 pt-4">
          <div style={{ marginLeft: `${logoWidth + logoToBreadcrumbGap - navPadding}px`, maxWidth: `${mainContentWidth}px` }}>
            {/* Title */}
            <SkeletonPulse className="w-72 h-7 mb-4" />
            {/* Meta Info */}
            <div className="flex items-center gap-3">
              <SkeletonPulse className="w-32 h-5" />
              <div className="w-px h-5 bg-border" />
              <SkeletonPulse className="w-32 h-5" />
              <div className="w-px h-5 bg-border" />
              <SkeletonPulse className="w-36 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area Skeleton */}
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex gap-6" style={{ marginLeft: `${logoWidth + logoToBreadcrumbGap - navPadding}px` }}>
          {/* Vendor Breakdown Skeleton */}
          <div style={{ width: `${mainContentWidth}px` }}>
            <div className="bg-white border border-border rounded p-5">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <SkeletonPulse className="w-24 h-5" />
                <SkeletonPulse className="w-16 h-4" />
              </div>
              
              {/* Vendor Rows */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="py-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <SkeletonPulse className="w-16 h-16 rounded" />
                    <div className="flex-1">
                      <SkeletonPulse className="w-40 h-5 mb-2" />
                      <SkeletonPulse className="w-28 h-4" />
                    </div>
                    <SkeletonPulse className="w-24 h-6 rounded-full" />
                    <SkeletonPulse className="w-20 h-5" />
                    <SkeletonPulse className="w-24 h-4" />
                  </div>
                </div>
              ))}

              {/* Total Row */}
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <SkeletonPulse className="w-32 h-5" />
                <SkeletonPulse className="w-28 h-7" />
              </div>
            </div>
          </div>

          {/* Booking Card Skeleton */}
          <div className="shrink-0" style={{ width: `${bookingCardWidth}px` }}>
            <div className="bg-white border border-border rounded p-5 sticky top-8">
              <SkeletonPulse className="w-28 h-4 mb-3" />
              <SkeletonPulse className="w-36 h-8 mb-6" />
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <SkeletonPulse className="w-20 h-4" />
                  <SkeletonPulse className="w-16 h-4" />
                </div>
                <div className="flex justify-between">
                  <SkeletonPulse className="w-24 h-4" />
                  <SkeletonPulse className="w-16 h-4" />
                </div>
              </div>
              
              <SkeletonPulse className="w-full h-11 rounded mb-3" />
              <SkeletonPulse className="w-full h-11 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProposalPage() {
  // Load saved color palette settings on mount
  useColorPaletteSettings();
  
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Simulate loading delay for progressive loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasPendingVendors = vendorCategories.some(cat => 
    cat.vendors.some(v => v.status === 'pending')
  );

  // Layout constants
  const logoWidth = 70; // px
  const logoToBreadcrumbGap = 180; // px (adjusted to get 218px margin)
  const mainContentWidth = 816; // px
  const bookingCardWidth = 320; // px
  const contentGap = 24; // px gap between main content and booking card
  const navPadding = 32; // px-8 = 32px
  
  // Calculate left offset for content alignment with breadcrumb
  // marginLeft = logoWidth + logoToBreadcrumbGap - navPadding = 70 + 180 - 32 = 218px
  const contentLeftOffset = navPadding + logoWidth + logoToBreadcrumbGap;

  // Show skeleton while loading
  if (isLoading) {
    return <ProposalPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Navbar */}
      <nav className="bg-white h-[72px] flex items-center">
        <div className="max-w-[1440px] w-full mx-auto px-8 flex items-center justify-between">
          {/* Left - Logo and Breadcrumb */}
          <div className="flex items-center">
            <Link href="/home" className="h-[22px] w-[70px] relative shrink-0 mb-[5px]">
              <img 
                alt="Naboo logo" 
                className="block max-w-none size-full object-contain" 
                src={imgLogo}
              />
            </Link>
            {/* Gap to align breadcrumb with main content (218px margin = logoWidth + gap - navPadding) */}
            <div className="w-[150px] flex items-center justify-center">
             
            </div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <Link href="/project" className="font-sans text-[15px] text-grey tracking-[-0.3px] hover:text-black transition-colors">
                Séminaire d'été 2025
              </Link>
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-grey" strokeWidth={1.5} />
              <span className="font-sans text-[15px] text-black tracking-[-0.3px]">
                Proposals
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsColorPaletteOpen(!isColorPaletteOpen)}
              className={`hidden md:flex h-10 px-4 py-3.5 border rounded items-center justify-center transition-colors ${
                isColorPaletteOpen 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-primary/20 text-black hover:bg-grey-lighterGrey'
              }`}
            >
              <span className="font-sans font-medium text-[15px] tracking-[-0.3px]">
                Become a partner
              </span>
            </button>
            {/* Hamburger Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                className="bg-[#eaeae9] flex items-center justify-center rounded-full size-10 shrink-0 hover:bg-[#ddd] transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <HugeiconsIcon icon={Menu01Icon} size={16} color="#212724" strokeWidth={1.5} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-[12px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] border border-border z-50"
                  style={{ animation: 'menuSlideIn 0.2s ease-out forwards' }}
                >
                  {/* User Name */}
                  <div className="px-4 py-4 border-b border-border">
                    <p className="font-sans font-medium text-[16px] text-black">Maxime Beneteau</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={UserIcon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[15px] text-black">Account</span>
                    </button>
                    <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={Folder02Icon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[15px] text-black">Projects</span>
                    </button>
                    <button 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => {
                        setIsColorPaletteOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon icon={PaintBoardIcon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[15px] text-black">Color & Font</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border mx-4" />

                  {/* Logout */}
                  <div className="py-2 pb-3">
                    <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={Logout03Icon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[15px] text-black">Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-white pb-6 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-8 pt-4">
          {/* Content aligned with breadcrumb (logo 70px + gap 120px = 190px offset) */}
          <div style={{ marginLeft: `${logoWidth + logoToBreadcrumbGap - navPadding}px`, maxWidth: `${mainContentWidth}px` }}>
            {/* Title */}
            <h1 className="font-sans font-medium text-[22px] text-black tracking-[-0.22px] leading-none mb-4">
              Abbaye de Royaumont <span className="text-grey">+2 venues</span>
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Corporate retreat */}
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={Briefcase01Icon} size={14} className="text-black" strokeWidth={1.5} />
                <span className="font-sans font-medium text-[14px] text-black tracking-[-0.28px]">
                  Corporate retreat
                </span>
              </div>

              <div className="w-px h-5 bg-border" />

              {/* Participants */}
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={UserMultiple02Icon} size={16} className="text-black" strokeWidth={1.5} />
                <span className="font-sans font-medium text-[14px] text-black tracking-[-0.28px]">
                  160 participants
                </span>
              </div>

              <div className="w-px h-5 bg-border" />

              {/* Date */}
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-black" strokeWidth={1.5} />
                <span className="font-sans font-medium text-[14px] text-black tracking-[-0.28px]">
                  May 04 - May 20
                </span>
              </div>

              {hasPendingVendors && (
                <>
                  <div className="w-px h-5 bg-border" />
                  {/* Pending confirmation */}
                  <div className="flex items-center gap-1.5 px-1.5 py-1">
                    <HugeiconsIcon icon={Clock01Icon} size={12} className="text-info" strokeWidth={1.5} />
                    <span className="font-sans text-[14px] text-info tracking-[-0.14px]">
                      Pending confirmation
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          <div className="flex gap-6" style={{ marginLeft: `${logoWidth + logoToBreadcrumbGap - navPadding}px` }}>
            {/* Vendor Breakdown - 816px */}
            <div className="w-full" style={{ maxWidth: `${mainContentWidth}px` }}>
              <div className="flex flex-col gap-6">
                {vendorCategories.map((category) => (
                  <div key={category.name} className="flex flex-col gap-2.5">
                    {/* Category Header */}
                    <div className="flex items-center gap-2">
                      <p className="font-sans font-medium text-[15px] text-black tracking-[-0.3px] leading-[1.2]">
                        {category.name}
                      </p>
                      <div className="bg-grey-light flex items-center justify-center px-2.5  rounded-full">
                        <span className="font-sans font-medium text-[14px] text-black tracking-[-0.14px]">
                          {category.count}
                        </span>
                      </div>
                    </div>

                    {/* Vendors */}
                    <div className="flex flex-col">
                      {category.vendors.map((vendor, index) => (
                        <VendorRow
                          key={vendor.id}
                          vendor={vendor}
                          onViewEstimate={() => router.push('/venue')}
                          isFirst={index === 0}
                          isLast={index === category.vendors.length - 1}
                          isOnly={category.vendors.length === 1}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount Card - 320px aligned to right edge */}
            <div className="hidden lg:block w-[320px] shrink-0 sticky top-6 self-start">
              <div className="bg-white border border-border rounded overflow-hidden">
                <div className="p-5 flex flex-col gap-4">
                  {/* Total Amount */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col gap-1">
                      <p className="font-sans font-medium text-[13px] text-black tracking-[-0.26px] leading-6">
                        Total amount
                      </p>
                      <p className="font-sans font-medium text-black tracking-[-0.32px]">
                        <span className="text-[24px] leading-6">20 850,00 €</span>
                        <span className="text-[12px] leading-6 ml-1">excl. VAT</span>
                      </p>
                    </div>
                    <div className="flex justify-between text-[12px] text-grey leading-4">
                      <span>Total /person</span>
                      <span>300,00 € excl. VAT</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-border" />

                  {/* Subtotals */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-medium text-[14px] text-grey tracking-[-0.28px] leading-5">
                        Subtotal of quotes
                      </span>
                      <span className="font-sans font-medium text-grey">
                        <span className="text-[14px] leading-5">20 000,00 €</span>
                        <span className="text-[12px] leading-5"> excl. VAT</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-medium text-[14px] text-grey tracking-[-0.28px] leading-5">
                        Service charges
                      </span>
                      <span className="font-sans font-medium text-grey">
                        <span className="text-[14px] leading-5">850,00 €</span>
                        <span className="text-[12px] leading-5"> excl. VAT</span>
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-border" />

                  {/* Payment Progress */}
                  <div className="flex flex-col gap-2 pl-3">
                    {/* Step 1 - Deposit */}
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <div className="w-px h-[60px] bg-primary" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="font-sans font-medium text-[14px] text-black leading-5">
                          Deposit : 6 900,00€
                        </p>
                        <button className="bg-primary h-8 px-3 py-2 rounded flex items-center justify-center btn-hover-bg">
                          <span className="font-sans font-medium text-[12px] text-primary-foreground leading-4">
                            Pay the deposit
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Step 2 - Balance */}
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-border" />
                        <div className="w-px h-4 bg-border" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-sans text-[12px] text-grey tracking-[-0.24px] leading-4">
                          Balance
                        </p>
                      </div>
                    </div>

                    {/* Step 3 - Balance after stay */}
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-border" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-sans text-[12px] text-grey tracking-[-0.24px] leading-4">
                          Balance after stay
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Total Amount Card */}
      <div className="lg:hidden max-w-[1440px] mx-auto px-8 pb-6">
        <div className="bg-white border border-border rounded overflow-hidden">
          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-col gap-1">
                <p className="font-sans font-medium text-[13px] text-black tracking-[-0.26px] leading-6">
                  Total amount
                </p>
                <p className="font-sans font-medium text-black tracking-[-0.32px]">
                  <span className="text-[24px] leading-6">20 850,00 €</span>
                  <span className="text-[12px] leading-6 ml-1">excl. VAT</span>
                </p>
              </div>
              <div className="flex justify-between text-[12px] text-grey leading-4">
                <span>Total /person</span>
                <span>300,00 € excl. VAT</span>
              </div>
            </div>
            <div className="w-full h-px bg-border" />
            <button className="bg-primary h-10 px-4 py-2 rounded flex items-center justify-center btn-hover-bg w-full">
              <span className="font-sans font-medium text-[14px] text-primary-foreground leading-4">
                Pay the deposit - 6 900,00€
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Color Palette Explorer */}
      <ColorPaletteExplorer 
        isOpen={isColorPaletteOpen} 
        onClose={() => setIsColorPaletteOpen(false)} 
      />
    </div>
  );
}
