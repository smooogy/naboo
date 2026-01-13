'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Folder02Icon, 
  UserIcon, 
  Logout03Icon,
  Menu01Icon,
  SentIcon,
  Calendar03Icon,
  Money02Icon,
  UserMultiple02Icon,
  Location01Icon,
  ServiceIcon,
  Yoga02Icon,
  ComputerDesk01Icon
} from '@hugeicons/core-free-icons';

export default function ProjectPage() {
  const router = useRouter();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-[#fdfdfd] min-h-screen">
      {/* Navbar */}
      <nav className="h-[72px] border-b border-border relative">
        {/* Breadcrumb - Aligned with content */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-8 w-full">
            <div className="hidden lg:flex items-center gap-[6px] pointer-events-auto">
              <HugeiconsIcon icon={Folder02Icon} size={16} color="#676769" strokeWidth={1.5} />
              <p className="font-['TWK_Lausanne'] text-[13px] font-normal text-[#676769] tracking-[-0.26px]">
                My projects
              </p>
              <img src="/assets/arrow-right-01.svg" alt="" className="w-[16px] h-[16px]" />
              <p className="font-['TWK_Lausanne'] text-[13px] font-normal text-[#141b34] tracking-[-0.26px]">
                Séminaire d'été 2025
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto px-[32px] h-full flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link href="/home" className="h-[24px] w-[89px] relative shrink-0">
            <img 
              src="/assets/66c58706ea459819ac285f4024d05bd6cecfb0b9.svg" 
              alt="Naboo logo" 
              className="block max-w-none size-full"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-[10px] h-[44px] px-[16px] py-[14px] bg-white border border-primary/20 rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01),0px_1px_1px_0px_rgba(0,0,0,0.02)] hover:bg-grey-lighterGrey transition-colors">
              <span className="font-['TWK_Lausanne'] text-[15px] font-bold text-primary">Submit a brief</span>
              <HugeiconsIcon icon={SentIcon} size={20} color="#2d7255" strokeWidth={1.5} />
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
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-8 pt-8 pb-8 max-w-[1080px] m-auto">
        {/* Project Header */}
        <div className="flex flex-col gap-[26px] mb-6">
          {isLoading ? (
            <>
              <div className="h-[32px] w-[280px] rounded-full bg-black/10 animate-pulse-fast" />
              <div className="flex flex-col gap-[16px]">
                <div className="h-[28px] w-[350px] rounded bg-black/10 animate-pulse-fast" />
                <div className="flex items-center gap-[10px]">
                  <div className="h-[20px] w-[140px] rounded bg-black/10 animate-pulse-fast" />
                  <div className="w-0 h-[20px] border-l border-[#e0e0e0]"></div>
                  <div className="h-[20px] w-[120px] rounded bg-black/10 animate-pulse-fast" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-[8px] h-[32px] px-[8px] py-[6px] bg-[rgba(52,82,189,0.1)] rounded-[100px] w-fit">
                <img src="/assets/clock-01.svg" alt="" className="w-[16px] h-[16px]" />
                <p className="font-['TWK_Lausanne'] text-[13px] font-normal text-[#3452bd] tracking-[-0.13px]">
                  Waiting for venue confirmation
                </p>
              </div>

              <div className="flex flex-col gap-[16px]">
                <p className="font-['TWK_Lausanne'] text-[24px] sm:text-[28px] font-normal text-[#212724] tracking-[-0.28px]">
                  C-305 - Séminaire d'été 2025
                </p>
                <div className="flex flex-wrap items-center gap-[10px]">
                  <div className="flex items-center gap-[4px]">
                    <img src="/assets/type-of-stay/corporate-retreat-light.svg" alt="" className="w-[16px] h-[16px]" />
                    <p className="font-['TWK_Lausanne'] text-[15px] font-normal text-[#212724] tracking-[-0.3px]">
                      Corporate retreat
                    </p>
                  </div>
                  <div className="w-0 h-[20px] border-l border-[#e0e0e0]"></div>
                  <div className="flex items-center gap-[4px]">
                    <img src="/assets/user-multiple.svg" alt="" className="w-[16px] h-[16px]" />
                    <p className="font-['TWK_Lausanne'] text-[15px] font-normal text-[#212724] tracking-[-0.3px]">
                      160 participants
                    </p>
                  </div>
                  <div className="w-0 h-[20px] border-l border-[#e0e0e0]"></div>
                  <div className="flex items-center gap-[4px]">
                    <img src="/assets/calendar-03.svg" alt="" className="w-[16px] h-[16px]" />
                    <p className="font-['TWK_Lausanne'] text-[15px] font-normal text-[#212724] tracking-[-0.3px]">
                      May 04 - May 20
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-full h-[1px] bg-[#e0e0e0] mb-6"></div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[29px] items-start">
          {/* Left Column - Suggestions */}
          <div className="flex flex-col gap-[8px] w-full lg:w-[745px]">

            {/* Our Suggestions Section */}
            <div className="flex items-center justify-between mb-2">
            <h2 className="font-['TWK_Lausanne'] text-[18px] font-normal text-[#212724] tracking-[-0.18px]">
              Our suggestions
            </h2>
            <button className="flex items-center gap-[8px] h-[40px] px-0 py-[14px] rounded-[4px] hover:opacity-80 transition-opacity">
              <img src="/assets/carousel-horizontal.svg" alt="" className="w-[16px] h-[16px]" />
              <span className="font-['TWK_Lausanne'] text-[14px] sm:text-[15px] font-medium text-[#2d7255]">Compare venues</span>
            </button>
            </div>

            <div className="flex flex-col gap-[24px]">
            {/* Venue Card */}
            {isLoading ? (
              <div className="bg-white border border-[#e0e0e0] rounded-[4px] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.02),0px_2px_8px_0px_rgba(0,0,0,0.03),0px_1px_1px_0px_rgba(0,0,0,0.02)] p-[16px] sm:p-[20px] flex flex-col gap-[16px]">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex flex-col justify-between py-0 sm:py-[9px] w-full sm:w-[307px] order-2 sm:order-1 gap-4">
                    <div className="flex flex-col gap-[8px]">
                      <div className="h-[15px] w-[180px] rounded bg-black/10 animate-pulse-fast" />
                      <div className="h-[20px] w-[220px] rounded bg-black/10 animate-pulse-fast" />
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <div className="h-[15px] w-[100px] rounded bg-black/10 animate-pulse-fast" />
                      <div className="w-0 h-[20px] border-l border-[#e0e0e0]"></div>
                      <div className="h-[15px] w-[100px] rounded bg-black/10 animate-pulse-fast" />
                    </div>
                  </div>
                  <div className="w-full sm:w-[184px] h-[180px] sm:h-[122px] rounded-[4px] bg-black/10 animate-pulse-fast order-1 sm:order-2" />
                </div>

                <div className="w-full h-[1px] bg-[#e0e0e0]"></div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-[8px]">
                    <div className="h-[12px] w-[60px] rounded bg-black/10 animate-pulse-fast" />
                    <div className="h-[20px] w-[150px] rounded bg-black/10 animate-pulse-fast" />
                    <div className="h-[15px] w-[120px] rounded bg-black/10 animate-pulse-fast" />
                  </div>
                  <div className="flex gap-[8px]">
                    <div className="h-[40px] w-[100px] rounded bg-black/10 animate-pulse-fast" />
                    <div className="h-[40px] w-[120px] rounded bg-black/10 animate-pulse-fast" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#e0e0e0] rounded-[4px] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.02),0px_2px_8px_0px_rgba(0,0,0,0.03),0px_1px_1px_0px_rgba(0,0,0,0.02)] p-[16px] sm:p-[20px] flex flex-col gap-[16px] cursor-pointer hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex flex-col justify-between py-0 sm:py-[9px] w-full sm:w-[307px] order-2 sm:order-1">
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-['TWK_Lausanne'] text-[14px] sm:text-[15px] font-normal text-[#737876] tracking-[-0.3px]">
                        Asnières-sur-Oise, 95344, France
                      </p>
                      <p className="font-['TWK_Lausanne'] text-[18px] mb-6 sm:text-[20px] font-bold text-[#212724] tracking-[-0.4px]">
                        L'abbaye de Royaumont
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-[10px] mt-4 sm:mt-0">
                      <div className="flex items-center gap-[4px]">
                        <img src="/assets/user-multiple.svg" alt="" className="w-[16px] h-[16px]" />
                        <p className="font-['TWK_Lausanne'] text-[14px] sm:text-[15px] font-normal text-[#212724] tracking-[-0.3px]">
                          160 participants
                        </p>
                      </div>
                      <div className="w-0 h-[20px] border-l border-[#e0e0e0]"></div>
                      <div className="flex items-center gap-[4px]">
                        <img src="/assets/calendar-03.svg" alt="" className="w-[16px] h-[16px]" />
                        <p className="font-['TWK_Lausanne'] text-[14px] sm:text-[15px] font-normal text-[#212724] tracking-[-0.3px]">
                          May 04 - May 20
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-[184px] h-[180px] sm:h-[122px] rounded-[4px] overflow-hidden order-1 sm:order-2">
                    <img 
                      src="/assets/venue-royaumont.png" 
                      alt="L'abbaye de Royaumont" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                <div className="w-full h-[1px] bg-[#e0e0e0]"></div>

                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex flex-col gap-[4px] mb-4">
                      <p className="font-['TWK_Lausanne'] text-[13px] font-normal text-[#737876] tracking-[-0.36px] leading-[20px]">
                        Start at
                      </p>
                      <div className="flex flex-col">
                        <p className="font-['TWK_Lausanne'] text-[18px] sm:text-[20px] font-bold text-[#212724] tracking-[-0.6px] leading-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          25 000,00 € <span className="text-[#737876]">HT</span>
                        </p>
                        <p className="font-['TWK_Lausanne'] mt-[4px]  text-[14px] sm:text-[15px] font-normal text-[#737876] tracking-[-0.45px] leading-[20px]">
                          45,00 € HT /personne
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[8px]">
                      <button 
                        className="h-[44px] px-[16px] py-[14px] bg-[#2d7255] rounded-[4px] flex items-center justify-center hover:opacity-90 transition-opacity"
                        onClick={() => router.push('/venue')}
                      >
                        <span className="font-['TWK_Lausanne'] text-[15px] font-medium text-white">See details</span>
                      </button>
                      <button className="h-[44px] px-[16px] py-[14px] border border-[rgba(45,114,85,0.2)] rounded-[4px] flex items-center justify-center hover:bg-[rgba(45,114,85,0.05)] transition-colors">
                        <span className="font-['TWK_Lausanne'] text-[15px] font-medium text-[#2d7255]">See estimation</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add venue button */}
            <button className="bg-white border border-[rgba(45,114,85,0.2)] rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01),0px_1px_1px_0px_rgba(0,0,0,0.02)] h-[44px] px-[16px] py-[14px] flex items-center justify-center gap-[10px] hover:bg-[rgba(45,114,85,0.05)] transition-colors">
              <img src="/assets/plus-sign.svg" alt="" className="w-[16px] h-[16px]" />
              <span className="font-['TWK_Lausanne'] text-[14px] sm:text-[15px] font-medium text-[#2d7255]">Add a venue to compare</span>
            </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="flex flex-col gap-[8px] w-full lg:w-[289px]">
          {/* Advisor Card */}
          <div className="bg-white border border-[#e0e0e0] rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01),0px_1px_1px_0px_rgba(0,0,0,0.02)] p-[16px] flex flex-col gap-[8px]">
            <p className="font-['TWK_Lausanne'] text-[14px] font-medium text-[#737876] leading-[24px]">
              Votre conseiller dédié
            </p>
            <div className="flex items-center gap-[16px]">
              <div className="relative w-[56px] h-[56px] shrink-0">
                <img 
                  src="/assets/avatar-alexandre.png" 
                  alt="Alexandre Dubois" 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute bottom-[1.5px] right-[1px] w-[12px] h-[12px] bg-[#2d7255] rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col gap-[0px]">
                <p className="font-['TWK_Lausanne'] text-[14px] font-medium text-[#212724] leading-[20px]">
                  Alexandre Dubois
                </p>
                <div className="flex flex-col">
                  <a 
                    href="tel:0635584569" 
                    className="font-['TWK_Lausanne'] text-[14px] font-medium text-[#737876] leading-[20px] hover:text-[#2d7255] transition-colors"
                  >
                    06 35 58 45 69
                  </a>
                  <a 
                    href="mailto:alexandre.d@naboo.app" 
                    className="font-['TWK_Lausanne'] text-[14px] font-medium text-[#737876] leading-[20px] hover:text-[#2d7255] transition-colors"
                  >
                    alexandre.d@naboo.app
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Brief Card */}
          <div className="bg-white border border-[#e0e0e0] rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01),0px_1px_1px_0px_rgba(0,0,0,0.02)] p-[16px] flex flex-col gap-[12px]">
            <p className="font-['TWK_Lausanne'] text-[14px] font-medium text-[#737876] leading-[24px]">
              Mon brief
            </p>
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <HugeiconsIcon icon={Calendar03Icon} size={16} color="#737876" strokeWidth={1.5} />
                  <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                    Dates
                  </p>
                </div>
                <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                  May 04 - May 20
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <HugeiconsIcon icon={Money02Icon} size={16} color="#737876" strokeWidth={1.5} />
                  <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                    Budget
                  </p>
                </div>
                <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                  25 000 € - 35 000 €
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <HugeiconsIcon icon={UserMultiple02Icon} size={16} color="#737876" strokeWidth={1.5} />
                  <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                    Participants
                  </p>
                </div>
                <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                  160
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <HugeiconsIcon icon={Location01Icon} size={16} color="#737876" strokeWidth={1.5} />
                  <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                    Localisation
                  </p>
                </div>
                <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                  Île-de-France
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <HugeiconsIcon icon={ServiceIcon} size={16} color="#737876" strokeWidth={1.5} />
                  <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                    Restauration
                  </p>
                </div>
                <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                  Incluse
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <HugeiconsIcon icon={Yoga02Icon} size={16} color="#737876" strokeWidth={1.5} />
                  <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                    Activités
                  </p>
                </div>
                <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                  Team building
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <HugeiconsIcon icon={ComputerDesk01Icon} size={16} color="#737876" strokeWidth={1.5} />
                  <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                    Espace de travail
                  </p>
                </div>
                <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                  2 salles
                </p>
              </div>
            </div>
          </div>

          {/* Project Access Card */}
          <div className="bg-white border border-[#e0e0e0] rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01),0px_1px_1px_0px_rgba(0,0,0,0.02)] p-[16px] flex flex-col gap-[16px]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-[8px]">
                <p className="font-['TWK_Lausanne'] text-[14px] font-medium text-[#737876] leading-[24px]">
                  Accès au projet
                </p>
              </div>
              
            </div>

            <div className="flex flex-col gap-[12px]">
              {/* User 1 */}
              <div className="flex items-end justify-between hover:bg-[rgba(45,114,85,0.05)] -mx-2 px-2 py-1 rounded transition-colors">
                <div className="flex items-center gap-[12px] flex-1">
                  <img 
                    src="/assets/avatar-marc.png" 
                    alt="Marc Aurel" 
                    className="w-[40px] h-[40px] rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="flex flex-col">
                    <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                      Marc Aurel
                    </p>
                    <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                      Organisateur
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  <div className="w-[16px] h-[16px]"></div>
                  <p className="font-['TWK_Lausanne'] text-[12px] font-normal text-[#737876] leading-[16px]">
                    36 minutes
                  </p>
                </div>
              </div>

              {/* User 2 */}
              <div className="flex items-end justify-between hover:bg-[rgba(45,114,85,0.05)] -mx-2 px-2 py-1 rounded transition-colors">
                <div className="flex items-center gap-[12px] flex-1">
                  <img 
                    src="/assets/avatar-patricia.png" 
                    alt="Patricia Gomes" 
                    className="w-[40px] h-[40px] rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="flex flex-col">
                    <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#212724] leading-[20px]">
                      Patricia Gomes
                    </p>
                    <p className="font-['TWK_Lausanne'] text-[14px] font-normal text-[#737876] leading-[20px]">
                      Signataire
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  <div className="w-[16px] h-[16px]"></div>
                  <p className="font-['TWK_Lausanne'] text-[12px] font-normal text-[#737876] leading-[16px]">
                    2 heures
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
