'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search } from '@/components/ui/Search';
import { BookingCard } from '@/components/BookingCard';
import { VenueCard, type Venue } from '@/components/VenueCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  UserMultiple02Icon, 
  BedDoubleIcon, 
  StarIcon,
  SwimmingIcon,
  GolfBatIcon,
  TennisBallIcon,
  BedSingle01Icon,
  Building05Icon,
  Home11Icon,
  Target02Icon,
  UserIcon,
  Folder02Icon,
  Logout03Icon,
  Menu01Icon,
  PaintBoardIcon,
  Image01Icon
} from '@hugeicons/core-free-icons';
import { ColorPaletteExplorer, useColorPaletteSettings } from '@/components/ColorPaletteExplorer';

// Image assets
const imgLogo = "/assets/logo-v2.svg";


// Sample venue data
const venueData = {
  id: 1,
  name: "The Standard, East Village",
  location: "Glen Cove (11542), États-Unis - H-B3541",
  price: 25000,
  beds: 220,
  bedrooms: 18,
  capacity: 360,
  rating: 3.8,
  reviews: 1572,
  images: [
    "/assets/new-venue/1.webp",
    "/assets/new-venue/2.webp",
    "/assets/new-venue/3.webp",
    "/assets/new-venue/4.webp"
  ],
  description: "Wander Port Aransas Shores is a vibrant coastal haven, offering a luxurious beach retreat just a stroll from sandy shores. Indulge in the hot tub on the patio with a BBQ area and outdoor dining, perfect for unwinding. Enjoy ocean breezes from private balconies. Gather around a cozy fireplace or fire pit. Elegant interiors feature entertainment like life-size games and a",
  spaces: [
    { name: "Classroom", capacity: 120, icon: "/assets/room-type/classroom.svg" },
    { name: "Theater", capacity: 200, icon: "/assets/room-type/theater.svg" },
    { name: "Banquet", capacity: 80, icon: "/assets/room-type/banquet.svg" },
    { name: "U-Shape", capacity: 40, icon: "/assets/room-type/ushape.svg" },
  ],
  rooms: [
    { name: "Single bedroom", beds: "1 double bed", count: 50 },
    { name: "Double bedroom", beds: "2 double bed", count: 20 },
  ],
  activities: [
    { name: "Outdoor pool", icon: SwimmingIcon },
    { name: "Golf course", icon: GolfBatIcon },
    { name: "Tennis court", icon: TennisBallIcon },
  ],
  coordinates: [2.3522, 48.8566] as [number, number] // Paris area coordinates
};

function MapboxMap({ coordinates }: { coordinates: [number, number] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYmVtYXhkZXNpZ24iLCJhIjoiR3UzWTc2byJ9.SNtStYAEsncWFShXGDFLyw';

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/bemaxdesign/cmkb0yqgn00q601s9eza817ds',
        center: coordinates,
        zoom: 13,
      });

      map.current.on('load', () => {
        if (map.current) {
          new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(map.current);
          // Resize map to ensure it takes full width
          setTimeout(() => {
            if (map.current) {
              map.current.resize();
            }
          }, 100);
        }
      });

      // Also resize on window resize
      const handleResize = () => {
        if (map.current) {
          map.current.resize();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [coordinates]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg overflow-hidden" 
      style={{ width: '100%', height: '100%', minWidth: 0 }}
    />
  );
}

export default function VenuePage() {
  // Load saved color palette settings on mount
  useColorPaletteSettings();
  
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('about');
  const [isLoadingVenue, setIsLoadingVenue] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const spacesSectionRef = useRef<HTMLDivElement>(null);
  const roomsSectionRef = useRef<HTMLDivElement>(null);
  const activitiesSectionRef = useRef<HTMLDivElement>(null);
  const accessSectionRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide navbar based on "About the venue" section
      if (aboutSectionRef.current) {
        const rect = aboutSectionRef.current.getBoundingClientRect();
        if (rect.top <= 0) {
          setShowStickyNav(true);
        } else {
          setShowStickyNav(false);
        }
      }

      // Determine active tab based on scroll position
      const sections = [
        { id: 'about', ref: aboutSectionRef },
        { id: 'spaces', ref: spacesSectionRef },
        { id: 'rooms', ref: roomsSectionRef },
        { id: 'activities', ref: activitiesSectionRef },
        { id: 'access', ref: accessSectionRef },
      ];

      const offset = 100; // Offset to account for navbar
      let currentSection = 'about';

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= offset) {
            currentSection = section.id;
            break;
          }
        }
      }

      setActiveTab(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate loading for venue data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingVenue(false);
    }, 800); // Simulate 800ms loading time

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

  return (
    <div className="bg-white min-h-screen" style={{ paddingBottom: '56px' }}>
      {/* Header */}
      <header style={{ marginBottom: '24px' }}>
        <div className="max-w-[1920px] mx-auto px-[32px] h-[72px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/home" className="h-[24px] w-[89px] relative shrink-0 mb-[5px]">
            <img 
              alt="Naboo logo" 
              className="block max-w-none size-full" 
              src={imgLogo}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Link>

          {/* Search Component - centered */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="flex-1 max-w-[600px]">
              <Search 
                showLabels={false}
                isCompact={true}
                className="w-[550px]"
                onFieldClick={(fieldId) => console.log('Field clicked:', fieldId)}
                onSearch={() => console.log('Search clicked')}
                defaultFields={{
                  stayType: 'Corporate retreat',
                  location: 'France',
                  dates: 'Next week',
                }}
              />
            </div>
          </div>

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
                  <p className="font-sans text-[16px] font-bold text-black">Maxime Beneteau</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                    <HugeiconsIcon icon={UserIcon} size={20} color="#212724" strokeWidth={1.5} />
                    <span className="font-sans text-[15px] text-black">Account</span>
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                    <HugeiconsIcon icon={Folder02Icon} size={20} color="#212724" strokeWidth={1.5} />
                    <span className="font-sans text-[15px] text-black">Projects</span>
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
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors cursor-pointer"
                  >
                    <HugeiconsIcon icon={PaintBoardIcon} size={20} color="#212724" strokeWidth={1.5} />
                    <span className="font-sans text-[15px] text-black">Color & Font</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-border mx-4" />

                {/* Logout */}
                <div className="py-2 pb-3">
                  <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey transition-colors">
                    <HugeiconsIcon icon={Logout03Icon} size={20} color="#212724" strokeWidth={1.5} />
                    <span className="font-sans text-[15px] text-black">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Color Palette Explorer */}
      <ColorPaletteExplorer 
        isOpen={isColorPaletteOpen} 
        onClose={() => setIsColorPaletteOpen(false)} 
      />

      {/* Sticky Navigation Bar */}
      {showStickyNav && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-border z-50 h-[72px]">
          <div className="max-w-[1280px] mx-auto px-12 h-full flex items-center">
            <nav className="flex gap-[32px] items-center">
              <a 
                ref={(el) => { navRefs.current['about'] = el; }}
                href="#about" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('about');
                  if (element) {
                    const offset = 64 + 32; // navbar height + margin
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                className={`font-sans text-[15px] tracking-[-0.3px] leading-[1.2] transition-colors cursor-pointer ${
                  activeTab === 'about' 
                    ? 'text-black font-bold' 
                    : 'text-grey hover:text-black font-medium'
                }`}
              >
                About
              </a>
              <a 
                ref={(el) => { navRefs.current['spaces'] = el; }}
                href="#spaces" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('spaces');
                  if (element) {
                    const offset = 64 + 32; // navbar height + margin
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                className={`font-sans text-[15px] tracking-[-0.3px] leading-[1.2] transition-colors cursor-pointer ${
                  activeTab === 'spaces' 
                    ? 'text-black font-bold' 
                    : 'text-grey hover:text-black font-medium'
                }`}
              >
                Spaces
              </a>
              <a 
                ref={(el) => { navRefs.current['rooms'] = el; }}
                href="#rooms" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('rooms');
                  if (element) {
                    const offset = 64 + 32; // navbar height + margin
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                className={`font-sans text-[15px] tracking-[-0.3px] leading-[1.2] transition-colors cursor-pointer ${
                  activeTab === 'rooms' 
                    ? 'text-black font-bold' 
                    : 'text-grey hover:text-black font-medium'
                }`}
              >
                Rooms
              </a>
              <a 
                ref={(el) => { navRefs.current['activities'] = el; }}
                href="#activities" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('activities');
                  if (element) {
                    const offset = 64 + 32; // navbar height + margin
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                className={`font-sans text-[15px] tracking-[-0.3px] leading-[1.2] transition-colors cursor-pointer ${
                  activeTab === 'activities' 
                    ? 'text-black font-bold' 
                    : 'text-grey hover:text-black font-medium'
                }`}
              >
                Available activities
              </a>
              <a 
                ref={(el) => { navRefs.current['access'] = el; }}
                href="#access" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('access');
                  if (element) {
                    const offset = 64 + 32; // navbar height + margin
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                className={`font-sans text-[15px] tracking-[-0.3px] leading-[1.2] transition-colors cursor-pointer ${
                  activeTab === 'access' 
                    ? 'text-black font-bold' 
                    : 'text-grey hover:text-black font-medium'
                }`}
              >
                Access
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full relative">
        {/* Content wrapper */}
        <div className="relative max-w-[1280px] mx-auto px-12 py-0">
          <div className="flex flex-col gap-[32px] items-start w-full">
            {/* Image Mosaic Grid - Now First */}
            {isLoadingVenue ? (
              <div className="flex gap-[8px] items-start w-full h-[450px]">
                {/* Main large image skeleton - 60% */}
                <div className="rounded-bl-[8px] rounded-tl-[8px] w-[60%] h-full bg-black/10 animate-pulse-fast" />
                {/* Right column skeleton - 40% */}
                <div className="flex flex-col gap-[8px] w-[40%] h-full">
                  {/* Top image skeleton */}
                  <div className="rounded-tr-[8px] h-[221px] bg-black/10 animate-pulse-fast" />
                  {/* Bottom row skeleton */}
                  <div className="flex gap-[8px] h-[221px]">
                    <div className="basis-0 grow h-full rounded bg-black/10 animate-pulse-fast" />
                    <div className="basis-0 grow h-full rounded-br-[8px] bg-black/10 animate-pulse-fast" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-[8px] items-start w-full h-[450px]">
                {/* Main large image on the left - 60% */}
                <div className="relative rounded-bl-[8px] rounded-tl-[8px] w-[60%] h-full overflow-hidden group cursor-pointer">
                  <img 
                    alt={venueData.name} 
                    className="absolute inset-0 max-w-none object-cover object-center pointer-events-none rounded-bl-[8px] rounded-tl-[8px] size-full transition-transform duration-300 ease-in-out group-hover:scale-105" 
                    src={venueData.images[0]}
                    onError={(e) => { 
                      const target = e.currentTarget;
                      if (!target.dataset.fallbackUsed) {
                        target.dataset.fallbackUsed = 'true';
                        target.src = '/fake_data/-BfE1765823942802.webp';
                      } else {
                        target.style.display = 'none';
                      }
                    }}
                  />
                </div>
                
                {/* Right column: 1 image on top, 2 images below - 40% */}
                <div className="flex flex-col gap-[8px] w-[40%] h-full">
                  {/* Top single image */}
                  <div className="relative rounded-tr-[8px] h-[221px] overflow-hidden group cursor-pointer">
                    <img 
                      alt={venueData.name} 
                      className="absolute inset-0 max-w-none object-cover object-center pointer-events-none rounded-tr-[8px] size-full transition-transform duration-300 ease-in-out group-hover:scale-105" 
                      src={venueData.images[1] || venueData.images[0]}
                      onError={(e) => { 
                        const target = e.currentTarget;
                        if (!target.dataset.fallbackUsed) {
                          target.dataset.fallbackUsed = 'true';
                          target.src = '/fake_data/-BfE1765823942802.webp';
                        } else {
                          target.style.display = 'none';
                        }
                      }}
                    />
                    {/* See all photos button */}
                    <button className="absolute top-5 right-5 bg-white px-3 py-2  rounded-[4px] flex items-center gap-2 hover:bg-grey-light transition-colors shadow-sm">
                      <HugeiconsIcon icon={Image01Icon} size={16} color="#212724" strokeWidth={1.5} />
                      <span className="font-sans font-medium text-[14px] text-black">See all photos</span>
                    </button>
                  </div>
                  
                  {/* Bottom row with 2 images */}
                  <div className="flex gap-[8px] h-[221px]">
                    <div className="relative basis-0 grow h-full overflow-hidden group cursor-pointer">
                      <img 
                        alt={venueData.name} 
                        className="absolute inset-0 max-w-none object-cover object-center pointer-events-none size-full transition-transform duration-300 ease-in-out group-hover:scale-105" 
                        src={venueData.images[2] || venueData.images[0]}
                        onError={(e) => { 
                          const target = e.currentTarget;
                          if (!target.dataset.fallbackUsed) {
                            target.dataset.fallbackUsed = 'true';
                            target.src = '/fake_data/-BfE1765823942802.webp';
                          } else {
                            target.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                    <div className="relative basis-0 grow h-full rounded-br-[8px] overflow-hidden group cursor-pointer">
                      <img 
                        alt={venueData.name} 
                        className="absolute inset-0 max-w-none object-cover object-center pointer-events-none rounded-br-[8px] size-full transition-transform duration-300 ease-in-out group-hover:scale-105" 
                        src={venueData.images[3] || venueData.images[0]}
                        onError={(e) => { 
                          const target = e.currentTarget;
                          if (!target.dataset.fallbackUsed) {
                            target.dataset.fallbackUsed = 'true';
                            target.src = '/fake_data/-BfE1765823942802.webp';
                          } else {
                            target.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Venue Header with Stats and Rating - Now Below Mosaic */}
            <div className="flex items-end w-full">
              {isLoadingVenue ? (
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {/* Location skeleton */}
                  <div className="h-[18px] w-[200px] rounded bg-black/10 animate-pulse-fast" />
                  {/* Venue Name skeleton */}
                  <div className="h-[38px] w-[350px] rounded bg-black/10 animate-pulse-fast" />
                  {/* Separator skeleton */}
                  <div className="w-full h-px bg-black/10" />
                  {/* Section title skeleton */}
                  <div className="h-[18px] w-[220px] rounded bg-black/10 animate-pulse-fast" />
                  {/* Badges skeleton */}
                  <div className="flex gap-2 items-center">
                    <div className="h-[32px] w-[140px] rounded-full bg-black/10 animate-pulse-fast" />
                    <div className="h-[32px] w-[120px] rounded-full bg-black/10 animate-pulse-fast" />
                    <div className="h-[32px] w-[100px] rounded-full bg-black/10 animate-pulse-fast" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {/* Location */}
                  <p className="font-sans font-normal text-[15px] text-grey tracking-[-0.3px] leading-none">
                    {venueData.location}
                  </p>
                  {/* Venue Name and Rating Row */}
                  <div className="flex items-center justify-between w-full">
                    <h1 className="font-sans font-medium text-[32px] text-black tracking-[-0.64px] leading-none">
                      {venueData.name}
                    </h1>
                    {/* Rating */}
                    <div className="flex gap-[4px] items-center">
                      <HugeiconsIcon icon={StarIcon} size={16} color="#212724" strokeWidth={1.5} />
                      <div className="flex gap-[2px] items-center">
                        <p className="font-sans font-medium text-[15px] text-black tracking-[-0.3px] leading-[1.2]">
                          {venueData.rating}
                        </p>
                        <p className="font-sans font-medium text-[15px] text-grey tracking-[-0.3px] leading-[1.2]">
                          ({venueData.reviews} Reviews)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Separator */}
                  
                  
                  {/* Event capacity & accommodation */}
                  <div className="flex flex-col gap-3 mt-2 items-start mb-4">
                    <p className="font-sans font-medium text-[15px] text-grey tracking-[-0.3px]">
                      Event capacity & accommodation
                    </p>
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="px-3 py-1.5 bg-grey-light rounded-full font-sans font-medium text-[15px] text-black flex items-center gap-1.5">
                        <HugeiconsIcon icon={UserMultiple02Icon} size={15} color="#212724" strokeWidth={1.5} />
                        Up to {venueData.capacity} attendees
                      </span>
                      <span className="px-3 py-1.5 bg-grey-light rounded-full font-sans font-medium text-[15px] text-black flex items-center gap-1.5">
                        <HugeiconsIcon icon={BedSingle01Icon} size={15} color="#212724" strokeWidth={1.5} />
                        {venueData.beds} beds on site
                      </span>
                      <span className="px-3 py-1.5 bg-grey-light rounded-full font-sans font-medium text-[15px] text-black flex items-center gap-1.5">
                        <HugeiconsIcon icon={BedDoubleIcon} size={15} color="#212724" strokeWidth={1.5} />
                        {venueData.bedrooms} bedrooms
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-border" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section Below Mosaic */}
        <div className="max-w-[1280px] mx-auto px-12 py-0" style={{ marginTop: '32px' }}>
          <div className="flex items-start w-full gap-8">
            {/* Left Column - Venue Details */}
            <div className="flex flex-col gap-[32px] items-start flex-1 min-w-0 mt-4">
              {/* About the venue */}
              <div id="about" ref={aboutSectionRef} className="flex flex-col gap-[16px] items-start w-full">
                <h2 className="font-sans mb-4 font-normal text-[20px] text-black leading-[20px]">
                Why this venue works for your event
                </h2>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {/* Feature 1: Full private estate */}
                  <div className="flex items-center gap-[16px] w-full">
                    <div className="p-3 bg-grey-light rounded-[4px] flex items-center justify-center shrink-0">
                      <HugeiconsIcon icon={Building05Icon} size={24} color="#212724" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                      <p className="font-sans font-normal text-[15px] text-black leading-[18px]">
                        Capacity
                      </p>
                      <p className="font-sans font-normal text-[15px] text-grey leading-[18px]">
                        No external guests. Your team has full access to the entire property.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2: Sleeps 220 on site */}
                  <div className="flex items-center gap-[16px] w-full">
                    <div className="p-3 bg-grey-light rounded-[4px] flex items-center justify-center shrink-0">
                      <HugeiconsIcon icon={Home11Icon} size={24} color="#212724" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                      <p className="font-sans font-normal text-[15px] text-black leading-[18px]">
                       Formats supported
                      </p>
                      <p className="font-sans font-normal text-[15px] text-grey leading-[18px]">
                        Most participants can stay on-site, reducing logistics and travel friction.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3: Ideal for executive & leadership retreats */}
                  <div className="flex items-center gap-[16px] w-full">
                    <div className="p-3 bg-grey-light rounded-[4px] flex items-center justify-center shrink-0">
                      <HugeiconsIcon icon={Target02Icon} size={24} color="#212724" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                      <p className="font-sans font-normal text-[15px] text-black leading-[18px]">
                        Logistic
                      </p>
                      <p className="font-sans font-normal text-[15px] text-grey leading-[18px]">
                        Designed for strategic offsites, workshops, and high-level team moments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border" />

              {/* The spaces section */}
              <div id="spaces" ref={spacesSectionRef} className="flex flex-col gap-[24px] items-start w-full">
                <div className="flex items-end justify-between w-full">
                  <div className="flex flex-col">
                    <p className="font-sans font-normal text-[20px] text-black leading-none tracking-[-0.4px]">
                    Spaces & room configurations
                    </p>
                    <p className="font-sans font-normal text-[16px] text-grey leading-[1.2] tracking-[-0.32px] mt-[16px]">
                      Maximum capacities by room configuration
                    </p>
                  </div>
                  
                </div>
                <div className="flex gap-[8px] items-center w-full flex-wrap">
                  {venueData.spaces.map((space, index) => (
                    <div key={index} className="bg-white border border-border rounded-md flex flex-col h-[200px] items-start justify-between p-[20px] relative flex-1 min-w-[180px] max-w-[220px]">
                      <div className="flex flex-col gap-[4px] items-start leading-[1.2]">
                        <p className="font-sans font-normal text-[16px] text-black tracking-[-0.32px] whitespace-nowrap">
                          {space.name}
                        </p>
                        <div className="flex items-center gap-[4px]">
                          <HugeiconsIcon icon={UserMultiple02Icon} size={16} color="#737876" strokeWidth={1.5} />
                          <p className="font-sans font-normal text-[16px] text-grey tracking-[-0.32px] whitespace-nowrap">
                            {space.capacity} guests
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-full">
                        <img 
                          src={space.icon} 
                          alt={space.name} 
                          className="w-[96px] h-[96px]"
                          style={{ filter: 'grayscale(100%) brightness(0.4)' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="font-sans border border-primary/20 flex h-[44px] items-center justify-center px-[16px] py-[14px] rounded-[4px] hover:opacity-70 transition-opacity cursor-pointer">
                  <span className="font-sans font-medium text-[15px] text-black leading-[1.2]">
                    See all spaces
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border" />

              {/* The rooms section */}
              <div id="rooms" ref={roomsSectionRef} className="flex flex-col gap-[24px] items-start w-full">
                <p className="font-sans font-normal text-[20px] text-black leading-none tracking-[-0.4px] whitespace-nowrap">
                  The rooms (180)
                </p>
                <div className="flex gap-[8px] items-center w-full flex-wrap">
                  {venueData.rooms.map((room, index) => (
                    <div key={index} className="bg-white border border-border rounded-md flex flex-col items-start justify-between p-[20px] relative flex-1 min-w-[180px] max-w-[220px] min-h-[180px]">
                      <div className="flex flex-col gap-[4px] items-start leading-[1.2]">
                        <p className="font-sans font-normal text-[16px] text-black tracking-[-0.32px] whitespace-nowrap">
                          {room.name} <span className="text-grey">x{room.count}</span>
                        </p>
                        <p className="font-sans font-normal text-[16px] text-grey tracking-[-0.32px] whitespace-nowrap">
                          {room.beds}
                        </p>
                      </div>
                     
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border" />

              {/* Available activities */}
              <div id="activities" ref={activitiesSectionRef} className="flex flex-col gap-[24px] items-start w-full">
                <p className="font-sans font-normal text-[20px] text-black leading-none tracking-[-0.4px] whitespace-nowrap">
                  Available activities
                </p>
              <div className="flex gap-[32px] items-start flex-wrap">
                {venueData.activities.map((activity, index) => (
                  <div key={index} className="flex gap-[16px] items-center">
                    <div className="bg-grey-lighter flex items-center justify-center p-[12px] rounded-[4px]">
                      <HugeiconsIcon icon={activity.icon} size={24} color="#212724" strokeWidth={1.5} />
                    </div>
                    <p className="font-sans font-normal text-[16px] text-black leading-[1.2] tracking-[-0.32px]">
                      {activity.name}
                    </p>
                  </div>
                ))}
              </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border" />

              {/* Access / Map */}
              <div id="access" ref={accessSectionRef} className="flex flex-col gap-4 w-full">
                <p className="font-sans mb-4 font-normal text-[24px] text-black leading-none tracking-[-0.48px] whitespace-nowrap">
                  Access
                </p>
                <div className="h-[379px] w-full relative rounded-[8px] overflow-hidden">
                  <MapboxMap coordinates={venueData.coordinates} />
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border" />

              {/* Similar Venues */}
              <div className="flex flex-col gap-[24px] items-start w-full">
                <p className="font-sans font-normal text-[20px] text-black leading-none tracking-[-0.4px] whitespace-nowrap">
                  Similar venues
                </p>
                <div className="grid grid-cols-2 gap-[12px] w-full">
                  {[
                    {
                      id: 2,
                      name: "Château de Versailles",
                      location: "Versailles, 78000, France",
                      venueType: "Historic palace",
                      price: 320,
                      beds: 85,
                      capacity: 120,
                      image: "/fake_data/2_x31747387155525.webp",
                      images: [
                        "/fake_data/2_x31747387155525.webp",
                        "/fake_data/8Eqz1751896085806.webp",
                        "/fake_data/cq7_1759329005051.webp"
                      ],
                      tags: ["Exclusive venue", "Historic site", "Workspaces included"]
                    },
                    {
                      id: 3,
                      name: "Domaine de Chantilly",
                      location: "Chantilly, 60500, France",
                      venueType: "Historic estate",
                      price: 280,
                      beds: 65,
                      capacity: 90,
                      image: "/fake_data/67ec1746325615525.webp",
                      images: [
                        "/fake_data/67ec1746325615525.webp",
                        "/fake_data/l4Sc1759344655635.webp",
                        "/fake_data/-BfE1765823942802.webp"
                      ],
                      tags: ["Exclusive venue", "Outdoor park", "Workspaces included"]
                    },
                    {
                      id: 4,
                      name: "Palais des Congrès",
                      location: "Paris, 75017, France",
                      venueType: "Conference center",
                      price: 195,
                      beds: 120,
                      capacity: 200,
                      image: "/fake_data/8Eqz1751896085806.webp",
                      images: [
                        "/fake_data/8Eqz1751896085806.webp",
                        "/fake_data/cq7_1759329005051.webp",
                        "/fake_data/2_x31747387155525.webp"
                      ],
                      tags: ["Exclusive venue", "Modern facilities", "Workspaces included"]
                    }
                  ].map((venue) => (
                    <div key={venue.id}>
                      <VenueCard venue={venue} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="shrink-0 sticky top-[88px]">
              <BookingCard
                price={venueData.price}
                pricePerPerson={45}
                defaultStayType="Corporate retreat"
                defaultGuests={320}
                defaultDates="Feb 03, 2026 - Feb 21, 2026"
                onQuoteRequest={(data) => {
                  console.log('Quote requested:', data);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

