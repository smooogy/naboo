'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from '@/components/ui/Search';
import { VenueCard, type Venue } from '@/components/VenueCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Folder02Icon, Logout03Icon, Menu01Icon } from '@hugeicons/core-free-icons';

// Image assets - now stored locally in public/assets
const imgVector = "/assets/66c58706ea459819ac285f4024d05bd6cecfb0b9.svg"; // Logo
const imgChevronDown = "/assets/5a5299a801da7c54ffba6f086126da822b7f3d1f.svg";
const imgSent = "/assets/f3a44bf21a820f451f56656c46677978a048468f.svg";
const imgCheckmarkBadge02 = "/assets/b99c41590a5feaa5041785b60fbacf2f2ec5ca09.svg";
const imgCaptureDecran20251221A1106141 = "/assets/5722dfd57d26be6ab9ad7aafc4df77851db93557.png";
const imgMenu01 = "/assets/menu-01.svg"; // Menu icon saved locally
const imgChevronDown1 = "/assets/arrow-right-01.svg"; // Arrow icon for \"Venues near Paris\"

// Fake venues for home page preview - matching Figma design
const homeVenues: Venue[] = [
  {
    id: 1,
    name: "L'abbaye de Royaumont",
    location: "Asnières-sur-Oise, France",
    venueType: 'Historic abbey',
    price: 240,
    beds: 71,
    capacity: 128,
    image: "/fake_data/-BfE1765823942802.webp",
    images: [
      "/fake_data/-BfE1765823942802.webp",
      "/fake_data/2_x31747387155525.webp",
      "/fake_data/67ec1746325615525.webp",
    ],
    tags: ['Exclusive venue', 'Outdoor park', '+1'],
  },
  {
    id: 2,
    name: "Château de Versailles",
    location: "Versailles, France",
    venueType: 'Royal palace',
    price: 320,
    beds: 85,
    capacity: 120,
    image: "/fake_data/2_x31747387155525.webp",
    images: [
      "/fake_data/2_x31747387155525.webp",
      "/fake_data/8Eqz1751896085806.webp",
      "/fake_data/cq7_1759329005051.webp",
    ],
    tags: ['Exclusive venue', 'Outdoor park', '+1'],
  },
  {
    id: 3,
    name: "Domaine de Chantilly",
    location: "Chantilly, France",
    venueType: 'Countryside estate',
    price: 280,
    beds: 65,
    capacity: 90,
    image: "/fake_data/67ec1746325615525.webp",
    images: [
      "/fake_data/67ec1746325615525.webp",
      "/fake_data/l4Sc1759344655635.webp",
      "/fake_data/-BfE1765823942802.webp",
    ],
    tags: ['Exclusive venue', 'Outdoor park', '+1'],
  },
  {
    id: 4,
    name: "Palais des Congrès",
    location: "Paris, France",
    venueType: 'Conference center',
    price: 195,
    beds: 120,
    capacity: 200,
    image: "/fake_data/8Eqz1751896085806.webp",
    images: [
      "/fake_data/8Eqz1751896085806.webp",
      "/fake_data/cq7_1759329005051.webp",
      "/fake_data/2_x31747387155525.webp",
    ],
    tags: ['Exclusive venue', 'Outdoor park', '+1'],
  },
];

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    setIsLoading(true);
    router.push('/results');
  };

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

  useEffect(() => {
    // Simulate progressive loading for the "Venues near Paris" section
    const timer = setTimeout(() => {
      setIsLoadingVenues(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen relative size-full"
      style={{ 
        background: 'linear-gradient(180deg, #f4f3ee 0%, #f9f8f5 25.953%, white 35.376%)'
      }}
    >
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-[1920px] mx-auto px-[32px] h-[72px] grid grid-cols-3 items-center">
          {/* Logo - Left */}
          <Link href="/home" className="h-[24px] w-[89px] relative shrink-0">
            <img 
              alt="Naboo logo" 
              className="block max-w-none size-full" 
              src={imgVector}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden md:flex gap-[42px] items-center justify-center">
            <div className="flex gap-[7px] items-center cursor-pointer hover:opacity-70 transition-opacity">
              <p className="font-['TWK_Lausanne'] text-[15px] text-black tracking-[-0.3px]">
                Our destinations
              </p>
              <div className="size-4 relative">
                <img 
                  alt="" 
                  className="block max-w-none size-full" 
                  src={imgChevronDown}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>
            <div className="flex gap-[7px] items-center cursor-pointer hover:opacity-70 transition-opacity">
              <p className="font-['TWK_Lausanne'] text-[15px] text-black tracking-[-0.3px]">
                Event ideas
              </p>
              <div className="size-4 relative">
                <img 
                  alt="" 
                  className="block max-w-none size-full" 
                  src={imgChevronDown}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>
          </nav>

          {/* CTA Buttons - Right */}
          <div className="flex gap-2 items-center justify-end">
            <button className=" border-primary/22 border-solid h-10 px-4 py-3.5 rounded flex items-center justify-center  transition-colors cursor-pointer">
              <span className="font-['TWK_Lausanne'] text-[15px] text-primary leading-[1.2]">
                Become a partner
              </span>
            </button>
            <button className="bg-primary h-10 px-4 py-3.5 rounded flex gap-[10px] items-center justify-center hover:bg-primary-light transition-colors cursor-pointer">
              <span className="font-['TWK_Lausanne'] text-[15px] text-white leading-[1.2]">
                Submit a brief
              </span>
              <div className="size-5 relative shrink-0">
                <img 
                  alt="" 
                  className="block max-w-none size-full" 
                  src={imgSent}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
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
                    <p className="font-['TWK_Lausanne'] text-[16px] font-bold text-black">Maxime Beneteau</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={UserIcon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-['TWK_Lausanne'] text-[15px] text-black">Account</span>
                    </button>
                    <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={Folder02Icon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-['TWK_Lausanne'] text-[15px] text-black">Projects</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border mx-4" />

                  {/* Logout */}
                  <div className="py-2 pb-3">
                    <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                      <HugeiconsIcon icon={Logout03Icon} size={20} color="#212724" strokeWidth={1.5} />
                      <span className="font-['TWK_Lausanne'] text-[15px] text-black">Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - CENTERED */}
      <section className="relative z-10 max-w-[1920px] mx-auto px-[52px] pt-[60px] pb-0">
        <div className="flex flex-col gap-[32px] items-center">
          {/* Heading and subtitle - centered */}
          <div className="flex flex-col gap-[19px] items-center text-center">
            <h1 className="font-['TWK_Lausanne'] text-[48px] text-black tracking-[-0.96px] leading-none w-[700px]">
              <span>Find and book your next </span>
              <span className="text-[#8a8a8a]">corporate meeting</span>
            </h1>
            <p className="text-[16px] text-grey tracking-[-0.32px] leading-[1.4] w-[444px]">
              Company retreats, offsites, away days, team building, corporate parties, conferences, business meals
            </p>
          </div>

          {/* Search component - centered, width 764px */}
          <div className="flex flex-col gap-[22px] items-center w-[764px]">
            <div className="w-full">
              <Search 
                onFieldClick={(fieldId) => console.log('Field clicked:', fieldId)}
                onSearch={handleSearch}
              />
            </div>
            {/* Trust message */}
            <div className="flex gap-[7px] items-center">
              <div className="size-4 relative shrink-0">
                <img 
                  alt="" 
                  className="block max-w-none size-full" 
                  src={imgCheckmarkBadge02}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <p className="font-['TWK_Lausanne'] text-[14px] text-grey tracking-[-0.28px] leading-none">
                <span className="font-['TWK_Lausanne'] font-bold text-black">96%</span>
                <span>{' participants satisfaction with 5,000+ events organized'}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Venues near Paris Section */}
      <section className="relative max-w-[1920px] mx-auto px-[52px] pt-[89px] pb-0 z-0">
        <div className="flex flex-col gap-[20px] items-start w-full max-w-[1373px] mx-auto">
          {/* Title with chevron */}
          <div className="flex gap-[8px] items-start">
            {isLoadingVenues ? (
              <>
                {/* Title skeleton */}
                <div className="h-[29px] w-[200px] rounded bg-black/10 animate-pulse-fast" />
                {/* Icon skeleton */}
                <div className="flex items-center pt-[2px]">
                  <div className="size-6 rounded bg-black/10 animate-pulse-fast" />
                </div>
              </>
            ) : (
              <>
                <h2 className="font-['TWK_Lausanne'] text-[24px] text-black tracking-[-0.48px] leading-none">
                  <span className="text-grey">Venues near</span>
                  <span>{' Paris'}</span>
                </h2>
                <div className="flex items-center pt-[2px]">
                  <div className="flex items-center justify-center size-6">
                    <div className="size-6 relative">
                      <img 
                        alt="" 
                        className="block max-w-none size-full" 
                        src={imgChevronDown1}
                        onError={(e) => { 
                          // Fallback to regular chevron if specific one not found
                          e.currentTarget.src = imgChevronDown;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Horizontal scroll of venue cards */}
          <div className="flex gap-[12px] items-start w-full overflow-x-auto pb-4">
            {isLoadingVenues
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[calc((100%-36px)/4)] min-w-[280px]"
                  >
                    <div className="flex flex-col gap-[12px] items-start w-full">
                      {/* Image skeleton */}
                      <div className="h-[305px] w-full rounded bg-black/10 animate-pulse-fast" />

                      {/* Text skeleton */}
                      <div className="flex flex-col gap-[8px] w-full">
                        <div className="h-4 w-2/3 rounded bg-black/10 animate-pulse-fast" />
                        <div className="h-4 w-1/2 rounded bg-black/10 animate-pulse-fast" />
                      </div>

                      {/* Tags skeleton */}
                      <div className="flex gap-[4px]">
                        <div className="h-6 w-24 rounded bg-black/10 animate-pulse-fast" />
                        <div className="h-6 w-20 rounded bg-black/10 animate-pulse-fast" />
                        <div className="h-6 w-10 rounded bg-black/10 animate-pulse-fast" />
                      </div>
                    </div>
                  </div>
                ))
              : homeVenues.map((venue) => (
                  <div
                    key={venue.id}
                    className="flex-shrink-0 w-[calc((100%-36px)/4)] min-w-[280px]"
                  >
                    <VenueCard venue={venue} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="relative z-10 max-w-[1920px] mx-auto px-8 py-0 mt-[89px]">
        <div className="flex flex-col gap-[10px] items-center w-full">
          <p className="font-['TWK_Lausanne'] text-[20px] text-grey text-center tracking-[-0.4px] w-full">
            Over 500,000 employees have experienced a Naboo event
          </p>
          <div className="aspect-[2556/178] relative w-full">
            <img 
              alt="Client logos" 
              className="absolute inset-0 max-w-none object-cover object-center pointer-events-none size-full" 
              src={imgCaptureDecran20251221A1106141}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
