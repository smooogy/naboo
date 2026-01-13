'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowLeft01Icon, 
  ArrowRight01Icon, 
  BedDoubleIcon, 
  UserMultiple02Icon 
} from '@hugeicons/core-free-icons';

export type Venue = {
  id: number;
  name: string;
  location: string;
  venueType?: string; // e.g., "Historic abbey"
  price: number;
  beds: number;
  capacity: number;
  image: string;
  images?: string[]; // Optional array of images for carousel
  tags?: string[]; // Optional array of tags (e.g., ["Exclusive venue", "Outdoor park", "Workspaces included"])
  // Map coordinates
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
};

interface VenueCardProps {
  venue: Venue;
  onClick?: (e: React.MouseEvent) => void;
}

export function VenueCard({ venue, onClick }: VenueCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use images array if provided, otherwise create array from single image
  const images = venue.images || [venue.image, venue.image, venue.image]; // Default to 3 images for demo

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      window.open('/venue', '_blank');
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Format location without postal code, with venue type if available
  const locationWithoutPostalCode = venue.location
    .split(', ')
    .filter(part => !/^\d+$/.test(part.trim()))
    .join(', ');
  
  const locationText = venue.venueType
    ? `${locationWithoutPostalCode} · ${venue.venueType}`
    : locationWithoutPostalCode;

  // Tags: use provided ones or fall back to default three tags from design
  const tags = venue.tags && venue.tags.length > 0
    ? venue.tags
    : ['Exclusive venue', 'Outdoor park', 'Workspaces included'];

  return (
    <div className="flex flex-col gap-[12px] items-start w-full cursor-pointer" onClick={handleCardClick}>
      {/* Image container with fixed height */}
      <div className="h-[305px] relative rounded overflow-hidden w-full group">
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <img 
              key={`${image}-${index}`}
              alt={venue.name} 
              className="absolute inset-0 max-w-none object-cover object-center pointer-events-none rounded size-full transition-all duration-300 ease-in-out group-hover:scale-105" 
              src={image}
              style={{ 
                opacity: index === currentImageIndex ? 1 : 0,
                zIndex: index === currentImageIndex ? 1 : 0
              }}
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
          ))}
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 rounded pointer-events-none z-10" 
            style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0.04) 50%, rgba(0, 0, 0, 0.16) 100%)' }}
          />
        </div>

        {/* Navigation arrows - appear on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="white" strokeWidth={2} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              aria-label="Next image"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="white" strokeWidth={2} />
            </button>
          </>
        )}

        {/* Carousel dots indicator - positioned at bottom center */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/75 w-1'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="flex flex-col gap-[8px] items-start w-full">
        {/* Location and title */}
        <div className="flex flex-col gap-[4px] items-start w-full">
          <p className="text-[13px] text-grey tracking-[-0.26px] leading-[1.2]">
            {locationText}
          </p>
          <p className="text-[16px] text-black tracking-[-0.32px] leading-[1.2]" style={{ fontWeight: 500 }}>
            {venue.name}
          </p>
        </div>

        {/* Price and details */}
        <div className="flex gap-[10px] items-center justify-center">
          <p className="text-[15px] text-black tracking-[-0.3px] leading-[1.2] whitespace-nowrap">
            <span className="text-grey">From</span>
            {` ${venue.price}€ / personne`}
          </p>
          <div className="w-px h-4 bg-grey-light" />
          <div className="flex gap-[4px] items-center">
            <HugeiconsIcon icon={BedDoubleIcon} size={16} color="#212724" strokeWidth={1.5} />
            <p className="text-[15px] text-black tracking-[-0.3px] leading-[1.2] whitespace-nowrap">
              {venue.beds}
            </p>
          </div>
          <div className="flex gap-[4px] items-center">
            <HugeiconsIcon icon={UserMultiple02Icon} size={16} color="#212724" strokeWidth={1.5} />
            <p className="text-[15px] text-black tracking-[-0.3px] leading-[1.2] whitespace-nowrap">
              {venue.capacity}
            </p>
          </div>
        </div>

        {/* Tags/Pills */}
        <div className="flex gap-[4px] items-start flex-wrap">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-grey-light flex items-center justify-center px-2 py-1 rounded-[3px] shrink-0"
            >
              <p className="font-medium text-[13px] text-grey tracking-[-0.26px] leading-[1.2] whitespace-nowrap">
                {tag}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
