'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRive } from '@rive-app/react-canvas';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserMultiple02Icon, Moon02Icon, UserIcon, Folder02Icon, Logout03Icon, Menu01Icon, PaintBoardIcon } from '@hugeicons/core-free-icons';
import { ColorPaletteExplorer, useColorPaletteSettings } from '@/components/ColorPaletteExplorer';

// Image assets
const imgLogo = "/assets/logo-v2.svg";
const imgImage2183 = "/assets/send-image2183.png";
const imgLine472 = "/assets/send-line472.svg";
const imgServingFood = "/assets/send-serving-food.svg";
const imgComputerDesk01 = "/assets/send-computer-desk.svg";
const imgGroup1597884212 = "/assets/send-group1597884212.svg";
const imgCalendar03 = "/assets/send-calendar.svg";
const imgLine468 = "/assets/send-line468.svg";
const imgCheckmarkSquare02 = "/assets/send-checkmark.svg";

// Success View Component with Rive animation
function SuccessView({ onGoToProject }: { onGoToProject: () => void }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const { RiveComponent } = useRive({
    src: '/assets/request-sent.riv',
    autoplay: true,
  });

  const handleClick = () => {
    setIsNavigating(true);
    setTimeout(() => {
      onGoToProject();
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center mt-32 animate-fade-in">
      <div className="flex flex-col items-center gap-[24px] text-center">
        {/* Rive Animation */}
        <div className="size-[64px]">
          <RiveComponent />
        </div>

        {/* Success Message */}
        <div className="flex flex-col gap-[12px] items-center">
          <p className="font-sans font-normal text-[28px] text-black tracking-[-0.28px] w-[468px]">
            Request sent to the venue
          </p>
          <p className="font-sans font-normal text-[16px] text-grey tracking-[-0.18px] w-full">
            We're checking availability and pricing.
            <br />
            Your advisor will keep you updated.
          </p>
        </div>

        {/* CTA Button */}
        <button 
          className="font-sans bg-primary flex h-[44px] w-[196px] items-center justify-center rounded-[4px] cursor-pointer btn-hover-bg disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleClick}
          disabled={isNavigating}
        >
          {isNavigating ? (
            <div className="border border-primary-foreground border-t-transparent rounded-full w-4 h-4 animate-spin" style={{ borderWidth: '1.5px' }} />
          ) : (
            <p className="font-sans font-medium leading-[1.2] text-[15px] text-primary-foreground text-nowrap">
              Go to my project space
            </p>
          )}
        </button>

        {/* Small Text */}
        <p className="font-sans font-normal text-[13px] text-grey text-center text-nowrap tracking-[-0.13px]">
          Usually confirmed within 24h
        </p>
      </div>
    </div>
  );
}

export default function SendPage() {
  // Load saved color palette settings on mount
  useColorPaletteSettings();
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [contentLoaded, setContentLoaded] = useState({
    package: false,
    summary: false,
  });

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

  // Progressive loading effect
  useEffect(() => {
    // Load package card
    const timer1 = setTimeout(() => {
      setContentLoaded(prev => ({ ...prev, package: true }));
    }, 300);
    
    // Then summary card
    const timer2 = setTimeout(() => {
      setContentLoaded(prev => ({ ...prev, summary: true }));
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleRequestClick = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setFadeOut(true);
      // Wait for fade out animation to complete
      setTimeout(() => {
        setIsSubmitted(true);
      }, 300);
    }, 2000);
  };

  return (
    <div className="bg-[#fdfdfd] min-h-screen">
      {/* Color Palette Explorer */}
      <ColorPaletteExplorer 
        isOpen={isColorPaletteOpen} 
        onClose={() => setIsColorPaletteOpen(false)} 
      />

      {/* Navbar */}
      <nav className="h-[72px]">
        <div className="max-w-[1920px] mx-auto px-[32px] h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="h-[24px] w-[89px] relative shrink-0 mb-[5px]">
            <img 
              src={imgLogo} 
              alt="Naboo logo" 
              className="block max-w-none size-full"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Link>

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
      </nav>

      {!isSubmitted ? (
        <div 
          className={`flex gap-[27px] w-[1080px] m-auto items-start pt-[39px] transition-all duration-500 ease-out ${fadeOut ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
        >
          {/* Left Column - Main Content */}
          <div className="flex flex-col gap-[32px] items-start w-[701px]">
          {/* Header */}
          <div className="flex flex-col items-start w-full">
            <p className="font-sans font-normal text-[24px] text-black tracking-[-0.24px] w-[468px]">
              Request availability & pricing
            </p>
            <p className="font-sans font-normal text-[18px] text-grey tracking-[-0.18px] w-full">
            Send a request to venues to confirm availability and pricing before booking.
            </p>
          </div>

          {/* Divider */}
          <div className="h-0 w-full relative">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine472} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          </div>

          {/* Recommended Package Section */}
          <div className="flex flex-col gap-[16px] items-start w-full">
            {contentLoaded.package ? (
              <>
                <p className="font-sans font-normal text-[15px] text-grey tracking-[-0.15px] w-full animate-fade-in">
                  Recommended package
                </p>

                <div className="flex flex-col gap-[9px] items-start w-full animate-fade-in">
                  {/* Package Card */}
                  <div className="bg-white border border-[#e0e0e0] border-solid flex gap-[16px] items-center p-[20px] rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01),0px_1px_1px_0px_rgba(0,0,0,0.02)] w-full">
                <div className="flex flex-col gap-[16px] items-start flex-1">
                  <div className="flex flex-col gap-[2px] items-start leading-[1.2] w-full">
                    
                    <p className="font-sans font-normal text-[20px] text-black tracking-[-0.4px] w-full">
                      Full Board Package single
                    </p>
                    
                    <p className="font-sans font-medium text-[15px] text-grey tracking-[-0.28px] w-full">
                      Single room · x160
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-[8px] items-start">
                    <div className="bg-[#f1f1f1] flex gap-[8px] items-center p-[5px] rounded-[4px]">
                      <div className="relative shrink-0 size-[16px]">
                        <img alt="" className="block max-w-none size-full" src={imgServingFood} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      <p className="font-sans font-normal leading-[1.2] text-[14px] text-black text-nowrap tracking-[-0.28px]">
                        Catering
                      </p>
                    </div>
                    <div className="bg-[#f1f1f1] flex gap-[8px] items-center p-[5px] rounded-[4px]">
                      <div className="relative shrink-0 size-[16px]">
                        <img alt="" className="block max-w-none size-full" src={imgComputerDesk01} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      <p className="font-sans font-normal leading-[1.2] text-[14px] text-black text-nowrap tracking-[-0.28px]">
                        Workspace
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkbox icon */}
                <div className="relative shrink-0 size-[20px]">
                  <img alt="" className="block max-w-none size-full" src={imgGroup1597884212} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
              </div>

              {/* Customize button */}
              <button className="border border-primary/20 border-solid flex h-[44px] items-center justify-center px-[16px] py-[14px] rounded-[4px] w-full cursor-pointer hover:bg-primary/5 transition-colors">
                <p className="font-sans font-medium leading-[1.2] text-[15px] text-black text-nowrap">
                  Customize my demand
                </p>
              </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-[18px] w-[180px] bg-gray-200 rounded animate-pulse"></div>
                <div className="bg-white border border-[#e0e0e0] border-solid flex gap-[16px] items-center p-[20px] rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01),0px_1px_1px_0px_rgba(0,0,0,0.02)] w-full">
                  <div className="flex flex-col gap-[16px] items-start flex-1">
                    <div className="flex flex-col gap-[2px] items-start w-full">
                      <div className="h-[24px] w-[280px] bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-[18px] w-[120px] bg-gray-200 rounded animate-pulse mt-1"></div>
                    </div>
                    <div className="flex gap-[8px] items-start">
                      <div className="h-[26px] w-[100px] bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-[26px] w-[110px] bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[20px] bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-[44px] w-full bg-gray-200 rounded animate-pulse"></div>
              </>
            )}
          </div>

          {/* Primary CTA Button */}
          <button 
            className="font-sans bg-primary flex h-[44px] items-center justify-center px-[16px] py-[14px] rounded-[4px] cursor-pointer btn-hover-bg disabled:cursor-not-allowed disabled:opacity-70 min-w-[220px]"
            onClick={handleRequestClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="border border-primary-foreground border-t-transparent rounded-full w-4 h-4 animate-spin" style={{ borderWidth: '1.5px' }} />
            ) : (
              <p className="font-sans font-medium leading-[1.2] text-[15px] text-primary-foreground text-nowrap">
                Request availability & pricing
              </p>
            )}
          </button>
        </div>

        {/* Right Column - Summary Card */}
        <div className="bg-white border border-[#e0e0e0] border-solid flex flex-col gap-[16px] items-start justify-center p-[20px] rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01),0px_1px_1px_0px_rgba(0,0,0,0.02)] w-[327px]">
          {contentLoaded.summary ? (
            <>
              {/* Venue Image */}
              <div className="h-[120px] relative rounded-[4px] shrink-0 w-full animate-fade-in">
            <img 
              alt="" 
              className="absolute inset-0 max-w-none object-cover object-center pointer-events-none rounded-[4px] size-full" 
              src={imgImage2183}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          {/* Venue Info */}
          <div className="flex flex-col gap-[2px] items-start leading-[1.2] w-full">
            <p className="font-sans font-normal text-[14px] text-grey tracking-[-0.28px] w-full">
              Asnières-sur-Oise, France
            </p>
            <p className="font-sans font-normal text-[20px] text-black tracking-[-0.4px] w-full">
              L'abbaye de Royaumont
            </p>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-[10px] items-start justify-center w-full">
            <div className="flex items-center gap-[10px]">
              <img src="/assets/type-of-stay/corporate-retreat-light.svg" alt="" className="w-[16px] h-[16px]" />
              <p className="font-sans font-medium leading-[1.2] text-[15px] text-black text-nowrap tracking-[-0.28px]">
                Corporate retreat
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <HugeiconsIcon icon={UserMultiple02Icon} size={16} color="#212724" strokeWidth={1.5} />
              <p className="font-sans font-medium leading-[1.2] text-[15px] text-black text-nowrap tracking-[-0.28px]">
                160 participants
              </p>
            </div>
            <div className="flex gap-[10px] items-center">
              <div className="relative shrink-0 size-[16px]">
                <img alt="" className="block max-w-none size-full" src={imgCalendar03} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <p className="font-sans font-medium leading-[1.2] text-[15px] text-black text-nowrap tracking-[-0.28px]">
                May 04 - May 20
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-0 w-full relative">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine468} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-start overflow-clip w-full">
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-[4px] items-start w-[182px]">
                <p className="font-sans font-normal leading-[20px] text-[13px] text-grey text-nowrap tracking-[-0.36px]">
                  A partir de
                </p>
                <div className="flex items-start w-full">
                  <div className="flex flex-col gap-0 items-start justify-center leading-[20px] w-full">
                    <p className="font-sans font-normal text-[20px] text-black tracking-[-0.6px]">
                      <span className="font-bold mb-1">25 000,00 € </span>
                      <span className="text-black">HT</span>
                    </p>
                    <p className="font-sans font-normal text-[14px] text-grey tracking-[-0.42px]">
                      45,00 € HT /personne
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </>
          ) : (
            <>
              {/* Skeleton for Summary Card */}
              <div className="h-[120px] w-full bg-gray-200 rounded-[4px] animate-pulse"></div>
              <div className="flex flex-col gap-[2px] items-start w-full">
                <div className="h-[17px] w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-[24px] w-[250px] bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
              <div className="flex flex-col gap-[10px] items-start w-full">
                <div className="h-[16px] w-[140px] bg-gray-200 rounded animate-pulse"></div>
                <div className="h-[16px] w-[130px] bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-[1px] w-full bg-gray-200"></div>
              <div className="flex flex-col gap-[4px] items-start w-[182px]">
                <div className="h-[12px] w-[80px] bg-gray-200 rounded animate-pulse"></div>
                <div className="h-[20px] w-[160px] bg-gray-200 rounded animate-pulse mt-1"></div>
                <div className="h-[14px] w-[140px] bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
            </>
          )}
        </div>
        </div>
      ) : (
        <SuccessView onGoToProject={() => router.push('/project')} />
      )}
    </div>
  );
}

