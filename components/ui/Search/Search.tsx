'use client';

import { HTMLAttributes, forwardRef, useState, useRef, useEffect, Fragment } from 'react';
import { cn } from '@/lib/cn';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

// Image assets - now stored locally in public/assets
const imgVector = "/assets/ee0a40d38be0656746c619c76fff6975bd749a11.svg"; // Mountain/moon icon for Corporate retreat
const imgBedDouble = "/assets/3f8c5ea9d474b3b369dbc1837797153b710ab70e.svg";
const imgLine376 = "/assets/636f929860f83a62021c31013359b5bfe024f61d.svg";
const imgLocation01 = "/assets/b7045855ea0a4225ec990bfc3de6ddb0b7e8fdfe.svg";
const imgCalendar03 = "/assets/13c0bec278ae1eec9d0317bb356d0e55cc2cdc29.svg";
const imgSearch01 = "/assets/search-01.svg";
const imgUserGroup03 = "/assets/user-group-03.svg";

// Menu option images
const imgComputerDesk01 = "/assets/28132a640da70bc7baf7405f44d665314f7b13c1.svg";
const imgSun03 = "/assets/cb6a32382843a158aabd898d57dae9ef1e60d8e3.svg";
const imgDesk02 = "/assets/20360552a8af13849f6a0189eda38d4de8b3ede6.svg";
const imgGroup1597884217 = "/assets/9efb35a720037b169504fa578936569d651daeb0.svg";
const imgRestaurant = "/assets/09653b56fbb076059ea55eb006249b1a181f073b.svg";
const imgGroup1597884216 = "/assets/479a1aea3d0d8c233e3376d0d6624f71331dbc45.svg";
const imgBasketballHoop = "/assets/32ccd25a3105bb740ce5a547f7367865f77fe36c.svg";

export interface SearchField {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  placeholder?: string;
}

export interface MenuOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  fields?: SearchField[];
  onFieldClick?: (fieldId: string) => void;
  onSearch?: () => void;
  onStayTypeChange?: (value: string) => void;
  onLocationChange?: (value: string) => void;
  defaultFields?: {
    stayType?: string;
    location?: string;
    dates?: string;
    guests?: string;
  };
  stayTypeOptions?: MenuOption[];
  locationOptions?: MenuOption[];
  showLabels?: boolean; // Control whether labels are shown
  isCompact?: boolean; // Explicit compact mode control
}

export const Search = forwardRef<HTMLDivElement, SearchProps>(
  ({ 
    className,
    fields,
    onFieldClick,
    onSearch,
    onStayTypeChange,
    onLocationChange,
    defaultFields,
    stayTypeOptions,
    locationOptions,
    showLabels = true, // Default to true for backward compatibility
    isCompact: isCompactProp,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [selectedStayType, setSelectedStayType] = useState(defaultFields?.stayType || 'Corporate retreat');
    const [selectedLocation, setSelectedLocation] = useState(defaultFields?.location || 'France');
    const [selectedGuests, setSelectedGuests] = useState(defaultFields?.guests || 'Any size');
    const [isLocationInputMode, setIsLocationInputMode] = useState(false);
    const [locationInputValue, setLocationInputValue] = useState('');
    const [isGuestsInputMode, setIsGuestsInputMode] = useState(false);
    const [guestsInputValue, setGuestsInputValue] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);
    const guestsInputRef = useRef<HTMLInputElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const fieldRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Default menu options
    const defaultStayTypeOptions: MenuOption[] = stayTypeOptions || [
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

    const defaultLocationOptions: MenuOption[] = locationOptions || [
      { 
        id: 'france', 
        label: 'France',
        icon: (
          <div className="bg-grey-lighter overflow-clip relative rounded-[4.8px] shrink-0" style={{ width: '48px', height: '48px', backgroundColor: '#eff1f3' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: '24px', height: '24px' }}>
                <img alt="" className="block max-w-none size-full" src={imgLocation01} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </div>
          </div>
        ),
      },
      { 
        id: 'spain', 
        label: 'Spain',
        icon: (
          <div className="bg-grey-lighter overflow-clip relative rounded-[4.8px] shrink-0" style={{ width: '48px', height: '48px', backgroundColor: '#eff1f3' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: '24px', height: '24px' }}>
                <img alt="" className="block max-w-none size-full" src={imgLocation01} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </div>
          </div>
        ),
      },
      { 
        id: 'italy', 
        label: 'Italy',
        icon: (
          <div className="bg-grey-lighter overflow-clip relative rounded-[4.8px] shrink-0" style={{ width: '48px', height: '48px', backgroundColor: '#eff1f3' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: '24px', height: '24px' }}>
                <img alt="" className="block max-w-none size-full" src={imgLocation01} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </div>
          </div>
        ),
      },
      { 
        id: 'germany', 
        label: 'Germany',
        icon: (
          <div className="bg-grey-lighter overflow-clip relative rounded-[4.8px] shrink-0" style={{ width: '48px', height: '48px', backgroundColor: '#eff1f3' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: '24px', height: '24px' }}>
                <img alt="" className="block max-w-none size-full" src={imgLocation01} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </div>
          </div>
        ),
      },
      { 
        id: 'uk', 
        label: 'United Kingdom',
        icon: (
          <div className="bg-grey-lighter overflow-clip relative rounded-[4.8px] shrink-0" style={{ width: '48px', height: '48px', backgroundColor: '#eff1f3' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: '24px', height: '24px' }}>
                <img alt="" className="block max-w-none size-full" src={imgLocation01} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </div>
          </div>
        ),
      },
    ];

    // Close menu and reset states when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        
        // Check if click is outside the entire search component
        if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
          setOpenMenu(null);
          setIsFocused(null);
          setFocusedField(null);
          setIsLocationInputMode(false);
          setLocationInputValue('');
          setShowLocationSuggestions(false);
          setIsDatePickerOpen(false);
          if (locationInputRef.current) {
            locationInputRef.current.blur();
          }
          setIsGuestsInputMode(false);
          setGuestsInputValue('');
          if (guestsInputRef.current) {
            guestsInputRef.current.blur();
          }
        } else {
          // Click is inside component
          const clickedField = Object.values(fieldRefs.current).some(
            (ref) => ref && ref.contains(target)
          );
          
          // Check if click is outside menus/date picker
          const clickedMenu = menuRef.current?.contains(target);
          const clickedDatePicker = datePickerRef.current?.contains(target);
          
          if (!clickedField && !clickedMenu && !clickedDatePicker) {
            if (openMenu) {
              setOpenMenu(null);
              setIsFocused(null);
              setFocusedField(null);
            }
            if (isDatePickerOpen) {
              setIsDatePickerOpen(false);
              setFocusedField(null);
              setIsFocused(null);
            }
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenu, isDatePickerOpen]);

    // Default fields if not provided
    const defaultSearchFields: SearchField[] = fields || [
      {
        id: 'stayType',
        label: 'Type of stay',
        value: selectedStayType,
        icon: (
          <div 
            className="bg-grey-lighter overflow-clip relative rounded-[4px] shrink-0 flex items-center justify-center"
            style={{ 
              width: '40px',
              height: '40px',
              backgroundColor: '#eff1f3',
            }}
          >
            <img alt="" className="block" style={{ width: '38px', height: '38px' }} src="/assets/type-of-stay/corporate-retreat.svg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        ),
      },
      {
        id: 'location',
        label: 'Location',
        value: selectedLocation,
        icon: (
          <div 
            className="relative shrink-0"
            style={{ width: '20px', height: '20px' }}
          >
            <img alt="" className="block max-w-none size-full" src={imgLocation01} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        ),
      },
      {
        id: 'dates',
        label: 'Dates',
        value: selectedDate ? format(selectedDate, 'MMM d, yyyy') : (defaultFields?.dates || 'Next week'),
        icon: (
          <div 
            className="relative shrink-0"
            style={{ width: '20px', height: '20px' }}
          >
            <img alt="" className="block max-w-none size-full" src={imgCalendar03} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        ),
      },
      {
        id: 'guests',
        label: 'Participants',
        value: selectedGuests,
        icon: (
          <div 
            className="relative shrink-0"
            style={{ width: '20px', height: '20px' }}
          >
            <img alt="" className="block max-w-none size-full" src={imgUserGroup03} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        ),
      },
    ];

    const handleFieldClick = (fieldId: string) => {
      // Close any open menus from other fields
      if (openMenu && openMenu !== fieldId) {
        setOpenMenu(null);
      }
      if (isLocationInputMode && fieldId !== 'location') {
        setIsLocationInputMode(false);
        setLocationInputValue('');
        setShowLocationSuggestions(false);
        if (locationInputRef.current) {
          locationInputRef.current.blur();
        }
      }
      if (isGuestsInputMode && fieldId !== 'guests') {
        setIsGuestsInputMode(false);
        setGuestsInputValue('');
        if (guestsInputRef.current) {
          guestsInputRef.current.blur();
        }
      }
      if (isDatePickerOpen && fieldId !== 'dates') {
        setIsDatePickerOpen(false);
      }
      
      setIsFocused(fieldId);
      if (fieldId === 'stayType') {
        setFocusedField(focusedField === fieldId ? null : fieldId);
        setOpenMenu(openMenu === fieldId ? null : fieldId);
      } else if (fieldId === 'location') {
        setFocusedField(fieldId);
        setIsLocationInputMode(true);
        setLocationInputValue('');
        setShowLocationSuggestions(true);
        setTimeout(() => {
          locationInputRef.current?.focus();
        }, 0);
      } else if (fieldId === 'dates') {
        const isClosing = focusedField === fieldId;
        setFocusedField(isClosing ? null : fieldId);
        setIsDatePickerOpen(!isClosing);
        if (isClosing) {
          setIsFocused(null);
        }
      } else if (fieldId === 'guests') {
        setFocusedField(fieldId);
        setIsGuestsInputMode(true);
        setGuestsInputValue('');
        setTimeout(() => {
          guestsInputRef.current?.focus();
        }, 0);
      }
      onFieldClick?.(fieldId);
    };

    const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocationInputValue(value);
      // Keep suggestions visible - will be filtered in renderMenu
      setShowLocationSuggestions(true);
    };

    const handleLocationInputBlur = () => {
      if (locationInputValue.trim()) {
        setSelectedLocation(locationInputValue);
        onLocationChange?.(locationInputValue);
      }
      setIsLocationInputMode(false);
      setIsFocused(null);
      setFocusedField(null);
      setShowLocationSuggestions(false);
    };

    const handleLocationInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (locationInputValue.trim()) {
          setSelectedLocation(locationInputValue);
          onLocationChange?.(locationInputValue);
        }
        setIsLocationInputMode(false);
        setIsFocused(null);
        setFocusedField(null);
        setShowLocationSuggestions(false);
        locationInputRef.current?.blur();
      } else if (e.key === 'Escape') {
        setIsLocationInputMode(false);
        setIsFocused(null);
        setFocusedField(null);
        setShowLocationSuggestions(false);
        locationInputRef.current?.blur();
      }
    };

    const handleGuestsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setGuestsInputValue(value);
    };

    const handleGuestsInputBlur = () => {
      if (guestsInputValue.trim()) {
        setSelectedGuests(guestsInputValue);
      }
      setIsGuestsInputMode(false);
      setIsFocused(null);
      setFocusedField(null);
    };

    const handleGuestsInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (guestsInputValue.trim()) {
          setSelectedGuests(guestsInputValue);
        }
        setIsGuestsInputMode(false);
        setIsFocused(null);
        setFocusedField(null);
        guestsInputRef.current?.blur();
      } else if (e.key === 'Escape') {
        setIsGuestsInputMode(false);
        setIsFocused(null);
        setFocusedField(null);
        guestsInputRef.current?.blur();
      }
    };

    const handleOptionSelect = (fieldId: string, optionId: string, optionLabel: string) => {
      if (fieldId === 'stayType') {
        setSelectedStayType(optionLabel);
        onStayTypeChange?.(optionLabel);
      } else if (fieldId === 'location') {
        setSelectedLocation(optionLabel);
        onLocationChange?.(optionLabel);
      }
      setOpenMenu(null);
      setIsFocused(null);
      setFocusedField(null);
    };

    const handleSearch = () => {
      setIsSearching(true);
      onSearch?.();
      // Reset loading state after a delay (you can adjust this based on actual search duration)
      setTimeout(() => {
        setIsSearching(false);
      }, 2000);
    };

    const renderMenu = (fieldId: string, options: MenuOption[], width?: number) => {
      if (fieldId === 'stayType' && openMenu !== fieldId) return null;
      if (fieldId === 'location' && !isLocationInputMode) return null;

      // Filter location options for autocomplete when user types
      const displayOptions = fieldId === 'location' && locationInputValue.trim()
        ? defaultLocationOptions.filter(option => 
            option.label.toLowerCase().includes(locationInputValue.toLowerCase())
          )
        : options;

      return (
        <div
          ref={menuRef}
          className={cn(
            'bg-white border-[#e6e5e5] border-[1.5px] border-solid',
            'flex flex-col',
            'p-4 rounded shadow-sm',
            'absolute z-50',
            'top-full left-0 mt-1',
            'overflow-visible'
          )}
          style={{
            boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.03), 0px 1px 28px 0px rgba(0,0,0,0.07)',
            gap: '8px',
            width: width ? `${width}px` : '200px',
            minWidth: width ? `${width}px` : '200px',
            animation: 'menuSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {displayOptions.length > 0 ? (
            displayOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  'flex gap-4 items-center',
                  'cursor-pointer transition-colors',
                  'rounded p-2 -m-2 hover:bg-grey-lighterGrey',
                  'px-2 py-2'
                )}
                onClick={() => {
                  if (fieldId === 'location') {
                    setSelectedLocation(option.label);
                    onLocationChange?.(option.label);
                    setLocationInputValue('');
                    setIsLocationInputMode(false);
                    setIsFocused(null);
                    setFocusedField(null);
                    setShowLocationSuggestions(false);
                  } else {
                    handleOptionSelect(fieldId, option.id, option.label);
                  }
                }}
              >
                {option.icon && (
                  <div className="shrink-0">
                    {option.icon}
                  </div>
                )}
                <p
                  className="text-black"
                  style={{
                    fontSize: '15px',
                    letterSpacing: '-0.32px',
                    color: '#1a1919',
                  }}
                >
                  {option.label}
                </p>
              </div>
            ))
          ) : (
            <p
              className="text-grey text-center py-2"
              style={{
                fontSize: '14px',
              }}
            >
              No results found
            </p>
          )}
        </div>
      );
    };

    // Check if compact mode - use prop if provided, otherwise detect from className
    const classNameStr = typeof className === 'string' ? className : '';
    const isCompact = isCompactProp !== undefined 
      ? isCompactProp 
      : (classNameStr.includes('h-12') || classNameStr.includes('h-[48px]'));

    return (
      <div className="relative z-20" ref={searchContainerRef} style={{ overflow: 'visible' }}>
        <div
          ref={ref}
          className={cn(
            'bg-white border-[#e6e5e5] border border-solid',
            'flex items-center',
            'rounded shadow-sm',
            'w-full',
            className
          )}
          style={{
            boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.03), 0px 1px 28px 0px rgba(0,0,0,0.07)',
            overflow: 'visible',
          }}
          {...props}
        >
        <div className="flex items-stretch flex-1">
          {defaultSearchFields.map((field, index) => (
            <Fragment key={field.id}>
              <div 
                ref={(el) => { fieldRefs.current[field.id] = el; }}
                className={cn(
                  'flex-1 relative',
                  'cursor-pointer transition-colors',
                  'hover:bg-grey-lighterGrey',
                  (isFocused === field.id || openMenu === field.id || (field.id === 'dates' && isDatePickerOpen)) && 'bg-grey-lighterGrey',
                  (field.id === 'stayType' || field.id === 'location') && openMenu === field.id && 'z-50',
                  index === 0 && 'rounded-l-[3px]',
                  index === defaultSearchFields.length - 1 && 'rounded-r-[3px]'
                )}
                onClick={() => handleFieldClick(field.id)}
              >
                <div
                  className={cn(
                    'flex items-center relative w-full',
                    'h-full',
                    isCompact 
                      ? (field.id === 'stayType' ? 'px-4 pl-2 gap-2' : 'px-2 gap-2')
                      : 'gap-4 px-4',
                    field.id === 'location' && isLocationInputMode && 'items-center'
                  )}
                  style={{ 
                    ...(isCompact ? { 
                      height: '48px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    } : {
                      height: '72px',
                      display: 'flex',
                      alignItems: 'center'
                    })
                  }}
                >
                  {isCompact ? (
                    field.id === 'stayType' ? (
                      // 32x32 icon for type of stay in compact mode
                      <div 
                        className="bg-grey-lighter overflow-clip relative rounded-[4px] shrink-0 flex items-center justify-center"
                        style={{ 
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#eff1f3',
                        }}
                      >
                        <img alt="" className="block" style={{ width: '28px', height: '28px' }} src="/assets/type-of-stay/corporate-retreat.svg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                    ) : (
                      <div className="shrink-0 flex items-center justify-center" style={{ width: '16px', height: '16px', position: 'relative' }}>
                        {/* For 24px icons, scale to 16px */}
                        <div style={{ 
                          transform: 'scale(0.667)', 
                          transformOrigin: 'center center', 
                          width: '24px', 
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {field.icon}
                        </div>
                      </div>
                    )
                  ) : (
                    field.icon
                  )}
                  <div className="flex-1 relative w-full">
                    {field.id === 'location' ? (
                      showLabels ? (
                        <div className="flex flex-col gap-[2px] items-start leading-[1.2] text-nowrap relative w-full">
                          {/* Label - slides up and fades out */}
                          <p 
                            className={cn(
                              'text-sm text-grey transition-all duration-300 ease-in-out',
                              isLocationInputMode ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0',
                              isCompact && 'font-bold'
                            )}
                            style={{ 
                              fontSize: '14px',
                              letterSpacing: '-0.28px',
                            }}
                          >
                            {field.label}
                          </p>
                          {/* Input - always present, transitions between read-only and editable */}
                          <input
                            ref={locationInputRef}
                            type="text"
                            value={isLocationInputMode ? locationInputValue : selectedLocation}
                            onChange={handleLocationInputChange}
                            onBlur={handleLocationInputBlur}
                            onKeyDown={handleLocationInputKeyDown}
                            placeholder={selectedLocation}
                            readOnly={!isLocationInputMode}
                            className={cn(
                              'w-full bg-transparent border-none outline-none',
                              'text-black placeholder:text-grey',
                              'focus:outline-none transition-all duration-300 ease-in-out',
                              isLocationInputMode 
                                ? 'opacity-100 -translate-y-[10px] cursor-text' 
                                : 'opacity-100 translate-y-0 cursor-pointer pointer-events-none'
                            )}
                            style={{
                              fontSize: isCompact ? '14px' : '15px',
                              letterSpacing: isCompact ? '-0.28px' : '-0.36px',
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center leading-[1.2] text-nowrap relative w-full h-full">
                          {/* No label variant - input/value centered with icon */}
                          <input
                            ref={locationInputRef}
                            type="text"
                            value={isLocationInputMode ? locationInputValue : selectedLocation}
                            onChange={handleLocationInputChange}
                            onBlur={handleLocationInputBlur}
                            onKeyDown={handleLocationInputKeyDown}
                            placeholder={selectedLocation}
                            readOnly={!isLocationInputMode}
                            className={cn(
                              'w-full bg-transparent border-none outline-none font-bold',
                              'text-black placeholder:text-grey',
                              'focus:outline-none transition-all duration-300 ease-in-out',
                              isLocationInputMode 
                                ? 'cursor-text' 
                                : 'cursor-pointer pointer-events-none'
                            )}
                            style={{
                              fontSize: isCompact ? '14px' : '15px',
                              letterSpacing: isCompact ? '-0.28px' : '-0.36px',
                            }}
                          />
                        </div>
                      )
                    ) : (
                      field.id === 'guests' ? (
                        showLabels ? (
                          <div className="flex flex-col gap-[2px] items-start leading-[1.2] text-nowrap relative w-full">
                            <p 
                              className={cn(
                                'text-sm text-grey transition-all duration-300 ease-in-out',
                                isGuestsInputMode ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0',
                                isCompact && 'font-bold'
                              )}
                              style={{ 
                                fontSize: '14px',
                                letterSpacing: '-0.28px',
                              }}
                            >
                              {field.label}
                            </p>
                            <input
                              ref={guestsInputRef}
                              type="text"
                              value={isGuestsInputMode ? guestsInputValue : selectedGuests}
                              onChange={handleGuestsInputChange}
                              onBlur={handleGuestsInputBlur}
                              onKeyDown={handleGuestsInputKeyDown}
                              placeholder={selectedGuests}
                              readOnly={!isGuestsInputMode}
                              className={cn(
                                'w-full bg-transparent border-none outline-none',
                                'text-black placeholder:text-grey',
                                'focus:outline-none transition-all duration-300 ease-in-out',
                                isGuestsInputMode 
                                  ? 'opacity-100 -translate-y-[10px] cursor-text' 
                                  : 'opacity-100 translate-y-0 cursor-pointer pointer-events-none'
                              )}
                              style={{
                                fontSize: isCompact ? '14px' : '15px',
                                letterSpacing: isCompact ? '-0.28px' : '-0.36px',
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center leading-[1.2] text-nowrap relative w-full h-full">
                            <input
                              ref={guestsInputRef}
                              type="text"
                              value={isGuestsInputMode ? guestsInputValue : selectedGuests}
                              onChange={handleGuestsInputChange}
                              onBlur={handleGuestsInputBlur}
                              onKeyDown={handleGuestsInputKeyDown}
                              placeholder={selectedGuests}
                              readOnly={!isGuestsInputMode}
                              className={cn(
                                'w-full bg-transparent border-none outline-none font-bold',
                                'text-black placeholder:text-grey',
                                'focus:outline-none transition-all duration-300 ease-in-out',
                                isGuestsInputMode 
                                  ? 'cursor-text' 
                                  : 'cursor-pointer pointer-events-none'
                              )}
                              style={{
                                fontSize: isCompact ? '14px' : '15px',
                                letterSpacing: isCompact ? '-0.28px' : '-0.36px',
                              }}
                            />
                          </div>
                        )
                      ) : (
                        showLabels ? (
                          <div className="flex flex-col gap-[2px] items-start leading-[1.2] text-nowrap relative w-full">
                            <p 
                              className={cn(
                                'text-sm text-grey transition-all duration-300 ease-in-out',
                                (field.id === 'stayType' || field.id === 'dates') && focusedField === field.id && 'opacity-0 -translate-y-2 pointer-events-none',
                                isCompact && 'font-bold'
                              )}
                              style={{ 
                                fontSize: '14px',
                                letterSpacing: '-0.28px',
                              }}
                            >
                              {field.label}
                            </p>
                            <p 
                              className={cn(
                                'text-black transition-all duration-300 ease-in-out',
                                (field.id === 'stayType' || field.id === 'dates') && focusedField === field.id && '-translate-y-[10px]'
                              )}
                              style={{ 
                                fontSize: isCompact ? '14px' : '15px',
                                letterSpacing: isCompact ? '-0.28px' : '-0.36px',
                              }}
                            >
                              {field.value}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center leading-[1.2] text-nowrap relative w-full h-full">
                            {/* No label variant - value centered with icon */}
                            <p 
                              className="text-black font-bold"
                              style={{ 
                                fontSize: isCompact ? '14px' : '15px',
                                letterSpacing: isCompact ? '-0.28px' : '-0.36px',
                              }}
                            >
                              {field.value}
                            </p>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
                {field.id === 'stayType' && renderMenu('stayType', defaultStayTypeOptions, 280)}
                {field.id === 'location' && isLocationInputMode && renderMenu('location', defaultLocationOptions, 280)}
                {field.id === 'dates' && isDatePickerOpen && (
                  <div
                    ref={datePickerRef}
                    className={cn(
                      'bg-white border-[#e6e5e5] border-[1.5px] border-solid',
                      'p-4 rounded shadow-sm',
                      'absolute z-50',
                      'top-full mt-1'
                    )}
                    style={{
                      boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.03), 0px 1px 28px 0px rgba(0,0,0,0.07)',
                      animation: 'menuSlideInCentered 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      left: '50%',
                    }}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setIsDatePickerOpen(false);
                          setFocusedField(null);
                          setIsFocused(null);
                        }
                      }}
                      numberOfMonths={2}
                      className="rounded-md"
                    />
                  </div>
                )}
              </div>
              
              {index < defaultSearchFields.length - 1 && (
                <div className="flex flex-row items-center self-stretch relative opacity-60">
                  <div 
                    className="h-full bg-border"
                    style={{ width: '1px' }}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Fixed-width container to prevent layout shift */}
        <div 
          className={cn(
            'shrink-0 flex items-center justify-end',
            !showLabels 
              ? 'w-12 h-12'
              : isCompact 
                ? 'min-w-[108px] h-12'
                : 'min-w-[126px] h-[72px]'
          )}
        >
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className={cn(
              'bg-primary flex items-center justify-center',
              'rounded shrink-0',
              'btn-hover-bg',
              'transition-all duration-200 ease-out',
              'cursor-pointer',
              !showLabels 
                ? 'w-8 h-8 m-2' 
                : isCompact 
                  ? isSearching 
                    ? 'h-10 w-10 my-1 mx-2'
                    : 'h-10 my-1 mx-2 px-4'
                  : isSearching
                    ? 'h-11 w-11 mx-[14px]'
                    : 'h-11 py-3.5 mx-[14px] px-4'
            )}
          >
            {isSearching ? (
              <div 
                className="border border-primary-foreground border-t-transparent rounded-full w-[14px] h-[14px] animate-spin"
                style={{ borderWidth: '1.5px' }}
              />
            ) : !showLabels ? (
              <div className="w-5 h-5 relative shrink-0 text-primary-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
            ) : (
              <span className="font-sans font-medium leading-[1.2] text-primary-foreground text-nowrap text-[15px]">
                Search
              </span>
            )}
          </button>
        </div>
      </div>
      </div>
    );
  }
);

Search.displayName = 'Search';

