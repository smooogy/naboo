'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Search } from '@/components/ui/Search';
import { type Venue } from '@/components/VenueCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, Folder02Icon, Logout03Icon, Menu01Icon, PaintBoardIcon } from '@hugeicons/core-free-icons';
import { ColorPaletteExplorer, useColorPaletteSettings } from '@/components/ColorPaletteExplorer';

// Dynamic import for VenueResultsWithMap to reduce initial bundle size
const VenueResultsWithMap = dynamic(
  () => import('@/components/VenueResultsWithMap').then(mod => mod.VenueResultsWithMap),
  {
    loading: () => (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-[14px] text-grey">Loading venues...</p>
        </div>
      </div>
    ),
    ssr: false // Mapbox doesn't work well with SSR
  }
);

// Image assets - now stored locally in public/assets
const imgLogo = "/assets/logo-v2.svg"; // Logo
const imgFilterHorizontal = "/assets/filter-horizontal.svg";

// Fake venue data with coordinates
const fakeVenues: Venue[] = [
  {
    id: 1,
    name: "L'abbaye de Royaumont",
    location: "Asnières-sur-Oise, 95344, France",
    venueType: 'Historic abbey',
    city: "Asnières-sur-Oise",
    country: "France",
    latitude: 49.1444,
    longitude: 2.3544,
    price: 240,
    beds: 71,
    capacity: 98,
    image: "/fake_data/-BfE1765823942802.webp",
    images: [
      "/fake_data/-BfE1765823942802.webp",
      "/fake_data/2_x31747387155525.webp",
      "/fake_data/67ec1746325615525.webp"
    ]
  },
  {
    id: 2,
    name: "Château de Versailles",
    location: "Versailles, 78000, France",
    venueType: 'Royal palace',
    city: "Versailles",
    country: "France",
    latitude: 48.8049,
    longitude: 2.1204,
    price: 320,
    beds: 85,
    capacity: 120,
    image: "/fake_data/2_x31747387155525.webp",
    images: [
      "/fake_data/2_x31747387155525.webp",
      "/fake_data/8Eqz1751896085806.webp",
      "/fake_data/cq7_1759329005051.webp"
    ]
  },
  {
    id: 3,
    name: "Domaine de Chantilly",
    location: "Chantilly, 60500, France",
    venueType: 'Countryside estate',
    city: "Chantilly",
    country: "France",
    latitude: 49.1944,
    longitude: 2.4700,
    price: 280,
    beds: 65,
    capacity: 90,
    image: "/fake_data/67ec1746325615525.webp",
    images: [
      "/fake_data/67ec1746325615525.webp",
      "/fake_data/l4Sc1759344655635.webp",
      "/fake_data/-BfE1765823942802.webp"
    ]
  },
  {
    id: 4,
    name: "Palais des Congrès",
    location: "Paris, 75017, France",
    venueType: 'Conference center',
    city: "Paris",
    country: "France",
    latitude: 48.8842,
    longitude: 2.3219,
    price: 195,
    beds: 120,
    capacity: 200,
    image: "/fake_data/8Eqz1751896085806.webp",
    images: [
      "/fake_data/8Eqz1751896085806.webp",
      "/fake_data/cq7_1759329005051.webp",
      "/fake_data/2_x31747387155525.webp"
    ]
  },
  {
    id: 5,
    name: "Château de Fontainebleau",
    location: "Fontainebleau, 77300, France",
    venueType: 'Renaissance château',
    city: "Fontainebleau",
    country: "France",
    latitude: 48.4024,
    longitude: 2.7014,
    price: 275,
    beds: 55,
    capacity: 75,
    image: "/fake_data/cq7_1759329005051.webp",
    images: [
      "/fake_data/cq7_1759329005051.webp",
      "/fake_data/l4Sc1759344655635.webp",
      "/fake_data/67ec1746325615525.webp"
    ]
  },
  {
    id: 6,
    name: "Hôtel des Invalides",
    location: "Paris, 75007, France",
    venueType: 'Historic monument',
    city: "Paris",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3122,
    price: 210,
    beds: 90,
    capacity: 150,
    image: "/fake_data/l4Sc1759344655635.webp",
    images: [
      "/fake_data/l4Sc1759344655635.webp",
      "/fake_data/-BfE1765823942802.webp",
      "/fake_data/8Eqz1751896085806.webp"
    ]
  }
];


export default function ResultsPage() {
  // Load saved color palette settings on mount
  useColorPaletteSettings();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className="bg-white min-h-screen">
      {/* Color Palette Explorer */}
      <ColorPaletteExplorer 
        isOpen={isColorPaletteOpen} 
        onClose={() => setIsColorPaletteOpen(false)} 
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-[32px] h-[72px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/home" className="h-[24px] w-[89px] relative shrink-0 mb-[5px]">
            <img 
              alt="Naboo logo" 
              className="block max-w-none size-full" 
              src={imgLogo}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Link>

          {/* Search Component and Filters - flex container */}
          <div className="flex-1 flex items-center justify-center gap-2 px-4">
            <div className="w-[550px]">
              <Search 
                showLabels={false}
                isCompact={true}
                onFieldClick={(fieldId) => console.log('Field clicked:', fieldId)}
                onSearch={() => console.log('Search clicked')}
                defaultFields={{
                  stayType: 'Corporate retreat',
                  location: 'France',
                  dates: 'Next week',
                }}
              />
            </div>
            <button className="border border-border rounded flex gap-2.5 h-[48px] items-center justify-center px-4 py-3.5 hover:bg-grey-lighter transition-colors cursor-pointer shrink-0">
              <div className="size-4 relative shrink-0">
                <img alt="" className="block max-w-none size-full" src={imgFilterHorizontal} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <span className="font-sans text-[15px] text-black leading-[1.2]">
                Filters
              </span>
            </button>
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

      {/* Main Content with Map */}
      <VenueResultsWithMap 
        venues={fakeVenues}
        resultsCount="767 résultats correspondent à votre recherche"
      />
    </div>
  );
}

