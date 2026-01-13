'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

// Image assets
const imgLocation01 = "/assets/83db80608fa6edc3266ab54b46722d061fbd7d9e.svg";
const imgUserMultiple1 = "/assets/b91b5c2af7b4945335e9d48eb186a909ccf7d38f.svg";
const imgCalendar03 = "/assets/1d1ce5815412aa40de193616e25b2150243ed1e0.svg";

// Stay type icons - matching Search component
const imgComputerDesk01 = "/assets/28132a640da70bc7baf7405f44d665314f7b13c1.svg";
const imgSun03 = "/assets/cb6a32382843a158aabd898d57dae9ef1e60d8e3.svg";
const imgVector = "/assets/ee0a40d38be0656746c619c76fff6975bd749a11.svg";
const imgBedDouble = "/assets/3f8c5ea9d474b3b369dbc1837797153b710ab70e.svg";
const imgDesk02 = "/assets/20360552a8af13849f6a0189eda38d4de8b3ede6.svg";
const imgGroup1597884217 = "/assets/9efb35a720037b169504fa578936569d651daeb0.svg";
const imgRestaurant = "/assets/09653b56fbb076059ea55eb006249b1a181f073b.svg";
const imgGroup1597884216 = "/assets/479a1aea3d0d8c233e3376d0d6624f71331dbc45.svg";
const imgBasketballHoop = "/assets/32ccd25a3105bb740ce5a547f7367865f77fe36c.svg";

interface BookingCardProps {
  price?: number;
  pricePerPerson?: number;
  defaultStayType?: string;
  defaultGuests?: number;
  defaultDates?: string;
  onQuoteRequest?: (data: { stayType: string; guests: number; dates: string }) => void;
}

interface MenuOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const BookingCard = ({
  price = 25000,
  pricePerPerson = 45,
  defaultStayType = 'Corporate retreat',
  defaultGuests = 320,
  defaultDates = 'Feb 03, 2026 - Feb 21, 2026',
  onQuoteRequest,
}: BookingCardProps) => {
  const [selectedStayType, setSelectedStayType] = useState(defaultStayType);
  const [numberOfGuests, setNumberOfGuests] = useState(defaultGuests);
  const [selectedDates, setSelectedDates] = useState(defaultDates);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const stayTypeMenuRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestsInputRef = useRef<HTMLInputElement>(null);

  const stayTypeOptions: MenuOption[] = [
    {
      id: 'away-day',
      label: 'Away day',
      icon: (
        <div className="bg-grey-lighter overflow-clip relative rounded-[4px] shrink-0 flex items-center justify-center" style={{ width: '42px', height: '42px', backgroundColor: '#eff1f3' }}>
          <img alt="" className="block" style={{ width: '38px', height: '38px' }} src="/assets/type-of-stay/away-day.svg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      ),
    },
    {
      id: 'corporate-retreat',
      label: 'Corporate retreat',
      icon: (
        <div className="bg-grey-lighter overflow-clip relative rounded-[4px] shrink-0 flex items-center justify-center" style={{ width: '42px', height: '42px', backgroundColor: '#eff1f3' }}>
          <img alt="" className="block" style={{ width: '38px', height: '38px' }} src="/assets/type-of-stay/corporate-retreat.svg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      ),
    },
    {
      id: 'corporate-evening',
      label: 'Corporate evening',
      icon: (
        <div className="bg-grey-lighter overflow-clip relative rounded-[4px] shrink-0 flex items-center justify-center" style={{ width: '42px', height: '42px', backgroundColor: '#eff1f3' }}>
          <img alt="" className="block" style={{ width: '38px', height: '38px' }} src="/assets/type-of-stay/corporate-evening.svg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      ),
    },
    {
      id: 'business-meal',
      label: 'Business meal',
      icon: (
        <div className="bg-grey-lighter overflow-clip relative rounded-[4px] shrink-0 flex items-center justify-center" style={{ width: '42px', height: '42px', backgroundColor: '#eff1f3' }}>
          <img alt="" className="block" style={{ width: '38px', height: '38px' }} src="/assets/type-of-stay/business-meal.svg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      ),
    },
    {
      id: 'team-building',
      label: 'Team building',
      icon: (
        <div className="bg-grey-lighter overflow-clip relative rounded-[4px] shrink-0 flex items-center justify-center" style={{ width: '42px', height: '42px', backgroundColor: '#eff1f3' }}>
          <img alt="" className="block" style={{ width: '38px', height: '38px' }} src="/assets/type-of-stay/team-building.svg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      ),
    },
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !stayTypeMenuRef.current?.contains(target) &&
        !datePickerRef.current?.contains(target)
      ) {
        setOpenMenu(null);
        setIsDatePickerOpen(false);
        setFocusedField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFieldClick = (fieldId: string) => {
    if (fieldId === 'stayType') {
      setOpenMenu(openMenu === 'stayType' ? null : 'stayType');
      setIsDatePickerOpen(false);
      setFocusedField('stayType');
    } else if (fieldId === 'dates') {
      setIsDatePickerOpen(!isDatePickerOpen);
      setOpenMenu(null);
      setFocusedField('dates');
    } else if (fieldId === 'guests') {
      setOpenMenu(null);
      setIsDatePickerOpen(false);
      setFocusedField('guests');
      // Focus the input
      setTimeout(() => {
        guestsInputRef.current?.focus();
      }, 0);
    } else {
      setOpenMenu(null);
      setIsDatePickerOpen(false);
      setFocusedField(null);
    }
  };

  const handleStayTypeSelect = (option: MenuOption) => {
    setSelectedStayType(option.label);
    setOpenMenu(null);
    setFocusedField(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedDates(format(date, 'MMM dd, yyyy'));
      setIsDatePickerOpen(false);
      setFocusedField(null);
    }
  };

  const handleQuoteClick = () => {
    setIsLoading(true);
    if (onQuoteRequest) {
      onQuoteRequest({
        stayType: selectedStayType,
        guests: numberOfGuests,
        dates: selectedDates,
      });
    }
    // Simulate API call delay before navigation
    setTimeout(() => {
      router.push('/send');
    }, 500);
  };

  return (
    <div className="flex items-center shrink-0 sticky" style={{ top: '96px' }}>
      <div className="bg-white border border-border border-solid flex flex-col gap-[24px] items-start p-[24px] relative rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_28px_0px_rgba(0,0,0,0.07)] shrink-0 w-[380px]">
        {/* Price Section */}
        <div className="flex flex-col gap-[8px] items-start w-[182px]">
          <p className="font-['TWK_Lausanne'] font-medium text-[13px] text-grey leading-[20px] tracking-[-0.36px] whitespace-nowrap">
            Start at
          </p>
          <div className="flex flex-col gap-[2px] items-start justify-center leading-[20px] w-[182px]">
            <p className="font-['TWK_Lausanne'] font-medium text-[24px] text-black tracking-[-0.72px]">
              <span className="font-bold">{price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € </span>
              <span className="text-grey">HT</span>
            </p>
            <p className="font-['TWK_Lausanne'] font-normal text-[14px] text-grey tracking-[-0.42px]">
              {pricePerPerson.toFixed(2)} € HT /personne
            </p>
          </div>
        </div>

        {/* Search Fields */}
        <div ref={containerRef} className="flex flex-col items-start pb-px pt-0 px-0 w-full">
          {/* Type of stay */}
          <div
            className={cn(
              "border border-border border-solid flex items-center mb-[-1px] px-[16px] py-[12px] relative rounded-tl-[4px] rounded-tr-[4px] w-full",
              "cursor-pointer transition-colors hover:bg-grey-lighterGrey",
              (focusedField === 'stayType' || openMenu === 'stayType') && 'bg-grey-lighter'
            )}
            onClick={() => handleFieldClick('stayType')}
          >
            <div className="flex gap-[16px] items-center w-full">
              <div className="relative shrink-0 size-[20px]">
                <img alt="" className="block max-w-none size-full" src="/assets/type-of-stay/corporate-retreat-light.svg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div className="flex flex-col gap-[2px] items-start leading-[1.2] relative">
                <p 
                  className={cn(
                    "font-['TWK_Lausanne'] font-normal text-[14px] text-grey tracking-[-0.28px] whitespace-nowrap",
                    "transition-all duration-300 ease-in-out",
                    focusedField === 'stayType' && 'opacity-0 -translate-y-2 pointer-events-none'
                  )}
                >
                  Type of stay
                </p>
                <p 
                  className={cn(
                    "font-['TWK_Lausanne'] font-normal text-[15px] text-black tracking-[-0.3px] whitespace-nowrap",
                    "transition-all duration-300 ease-in-out",
                    focusedField === 'stayType' && '-translate-y-[10px]'
                  )}
                >
                  {selectedStayType}
                </p>
              </div>
            </div>
            {openMenu === 'stayType' && (
              <div
                ref={stayTypeMenuRef}
                className="absolute left-0 right-0 bg-white border-[#e6e5e5] border-[1.5px] border-solid rounded shadow-sm z-50"
                style={{
                  top: 'calc(100% + 4px)',
                  boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.03), 0px 1px 28px 0px rgba(0,0,0,0.07)',
                  animation: 'menuSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                {stayTypeOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-grey-lighterGrey transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStayTypeSelect(option);
                    }}
                  >
                    {option.icon}
                    <p className="text-black" style={{ fontSize: '15px', letterSpacing: '-0.3px' }}>
                      {option.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dates */}
          <div
            className={cn(
              "border border-border border-solid flex gap-[16px] items-center mb-[-1px] px-[16px] py-[12px] relative w-full",
              "cursor-pointer transition-colors hover:bg-grey-lighterGrey",
              (focusedField === 'dates' || isDatePickerOpen) && 'bg-grey-lighter'
            )}
            onClick={() => handleFieldClick('dates')}
          >
            <div className="relative shrink-0 size-[20px]">
              <img alt="" className="block max-w-none size-full" src={imgCalendar03} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="flex flex-col gap-[2px] items-start leading-[1.2] relative">
              <p 
                className={cn(
                  "font-['TWK_Lausanne'] font-normal text-[14px] text-grey tracking-[-0.28px] whitespace-nowrap",
                  "transition-all duration-300 ease-in-out",
                  focusedField === 'dates' && 'opacity-0 -translate-y-2 pointer-events-none'
                )}
              >
                Dates
              </p>
              <p 
                className={cn(
                  "font-['TWK_Lausanne'] font-normal text-[15px] text-black tracking-[-0.3px] whitespace-nowrap",
                  "transition-all duration-300 ease-in-out",
                  focusedField === 'dates' && '-translate-y-[10px]'
                )}
              >
                {selectedDates}
              </p>
            </div>
            {isDatePickerOpen && (
              <div
                ref={datePickerRef}
                className="absolute bg-white border-[#e6e5e5] border-[1.5px] border-solid p-4 rounded shadow-sm z-50"
                style={{
                  top: 'calc(100% + 4px)',
                  right: 0,
                  boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.03), 0px 1px 28px 0px rgba(0,0,0,0.07)',
                  animation: 'menuSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  className="rounded-md"
                />
              </div>
            )}
          </div>

          {/* Number of guests */}
          <div
            className={cn(
              "border border-border border-solid flex gap-[16px] items-center mb-[-1px] px-[16px] py-[12px] relative rounded-bl-[4px] rounded-br-[4px] w-full",
              "cursor-pointer transition-colors hover:bg-grey-lighterGrey",
              focusedField === 'guests' && 'bg-grey-lighter'
            )}
            onClick={() => handleFieldClick('guests')}
          >
            <div className="relative shrink-0 size-[20px]">
              <img alt="" className="block max-w-none size-full" src={imgUserMultiple1} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="flex flex-col gap-[2px] items-start leading-[1.2] flex-1 relative">
              <p 
                className={cn(
                  "font-['TWK_Lausanne'] font-normal text-[14px] text-grey tracking-[-0.28px] whitespace-nowrap",
                  "transition-all duration-300 ease-in-out",
                  focusedField === 'guests' && 'opacity-0 -translate-y-2 pointer-events-none'
                )}
              >
                Number of guests
              </p>
              <input
                ref={guestsInputRef}
                type="number"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 0)}
                onFocus={() => setFocusedField('guests')}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "font-['TWK_Lausanne'] font-normal text-[15px] text-black tracking-[-0.3px]",
                  "bg-transparent border-none outline-none w-full",
                  "transition-all duration-300 ease-in-out",
                  focusedField === 'guests' && '-translate-y-[10px]'
                )}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col gap-[12px] items-center">
          <button
            onClick={handleQuoteClick}
            disabled={isLoading}
            className="bg-primary flex h-[44px] items-center justify-center px-[16px] py-[14px] relative rounded-[4px] w-[332px] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div 
                className="border border-white border-t-transparent rounded-full"
                style={{
                  width: '16px',
                  height: '16px',
                  borderWidth: '1.5px',
                  animation: 'spin-smooth 0.7s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                }}
              />
            ) : (
              <p className="font-['TWK_Lausanne'] font-medium text-[15px] text-white leading-[1.2] whitespace-nowrap">
                Get my quote
              </p>
            )}
          </button>
          <p className="font-['TWK_Lausanne'] font-normal text-[14px] text-grey leading-[1.2] tracking-[-0.28px] whitespace-nowrap">
            You won't be charged yet
          </p>
        </div>
      </div>
    </div>
  );
};

