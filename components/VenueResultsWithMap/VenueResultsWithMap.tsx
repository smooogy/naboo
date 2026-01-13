'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, MapRef } from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';
import { VenueCard, type Venue } from '@/components/VenueCard';

interface VenueResultsWithMapProps {
  venues: Venue[];
  resultsCount?: string;
}

export function VenueResultsWithMap({ venues, resultsCount }: VenueResultsWithMapProps) {
  const [activeVenueId, setActiveVenueId] = useState<number | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const mapRef = useRef<MapRef>(null);
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Filter venues with valid coordinates
  const venuesWithCoords = venues.filter(
    (venue) => venue.latitude != null && venue.longitude != null
  );

  // Check for token error (dev only)
  useEffect(() => {
    if (!mapboxToken && process.env.NODE_ENV === 'development') {
      setMapError('NEXT_PUBLIC_MAPBOX_TOKEN is missing. Please add it to your .env.local file.');
    }
  }, [mapboxToken]);

  // Simulate progressive loading for venues
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingVenues(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Calculate bounds and fit map
  const fitMapBounds = useCallback(() => {
    if (!mapRef.current || venuesWithCoords.length === 0) return;

    if (venuesWithCoords.length === 1) {
      const venue = venuesWithCoords[0];
      mapRef.current.flyTo({
        center: [venue.longitude!, venue.latitude!],
        zoom: 12,
        duration: 600,
      });
      return;
    }

    const bounds = venuesWithCoords.reduce(
      (acc, venue) => {
        if (venue.longitude != null && venue.latitude != null) {
          acc.minLng = Math.min(acc.minLng, venue.longitude);
          acc.maxLng = Math.max(acc.maxLng, venue.longitude);
          acc.minLat = Math.min(acc.minLat, venue.latitude);
          acc.maxLat = Math.max(acc.maxLat, venue.latitude);
        }
        return acc;
      },
      {
        minLng: Infinity,
        maxLng: -Infinity,
        minLat: Infinity,
        maxLat: -Infinity,
      }
    );

    if (
      bounds.minLng !== Infinity &&
      bounds.maxLng !== -Infinity &&
      bounds.minLat !== Infinity &&
      bounds.maxLat !== -Infinity
    ) {
      mapRef.current.fitBounds(
        [
          [bounds.minLng, bounds.minLat],
          [bounds.maxLng, bounds.maxLat],
        ],
        {
          padding: 60,
          duration: 600,
        }
      );
    }
  }, [venuesWithCoords]);

  // Fit bounds on mount and when venues change
  useEffect(() => {
    if (showMap && venuesWithCoords.length > 0) {
      // Small delay to ensure map is fully loaded
      const timer = setTimeout(() => {
        fitMapBounds();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showMap, venuesWithCoords, fitMapBounds]);

  // Scroll to card when selected from map
  useEffect(() => {
    if (selectedVenueId && cardRefs.current[selectedVenueId]) {
      cardRefs.current[selectedVenueId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedVenueId]);

  // Card hover: only affect card styling, not map markers/popups
  const handleCardMouseEnter = (id: number) => {
    // Intentionally no-op for map state: we don't want card hover to trigger map popups.
  };

  const handleCardMouseLeave = () => {
    // Intentionally no-op for map state.
  };

  const handleCardClick = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVenueId(id === selectedVenueId ? null : id);
    setActiveVenueId(null);
  };

  const handleMarkerMouseEnter = (id: number) => {
    setActiveVenueId(id);
  };

  const handleMarkerMouseLeave = () => {
    if (selectedVenueId === null) {
      setActiveVenueId(null);
    }
  };

  const handleMarkerClick = (id: number) => {
    setSelectedVenueId(id === selectedVenueId ? null : id);
    setActiveVenueId(null);
  };

  // Calculate center point for initial map view
  const getInitialCenter = () => {
    if (venuesWithCoords.length === 0) {
      return { longitude: 2.3522, latitude: 48.8566 }; // Paris default
    }

    const avgLng =
      venuesWithCoords.reduce((sum, v) => sum + (v.longitude || 0), 0) /
      venuesWithCoords.length;
    const avgLat =
      venuesWithCoords.reduce((sum, v) => sum + (v.latitude || 0), 0) /
      venuesWithCoords.length;

    return { longitude: avgLng, latitude: avgLat };
  };

  const initialCenter = getInitialCenter();

  if (!mapboxToken) {
    return (
      <div className="w-full flex flex-col lg:flex-row">
        <div className="flex-1 px-4 sm:px-8 lg:px-4">
          <div className="max-w-[900px] flex flex-col gap-[22px] items-start w-full py-4">
            {resultsCount && (
              <p className="font-['TWK_Lausanne'] font-medium text-[15px] text-grey tracking-[-0.3px] leading-[1.2] w-full">
                {resultsCount}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        </div>
        {mapError && (
          <div className="w-full lg:w-[40%] p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{mapError}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row">
      {/* Left Column - Results */}
      <div className="flex-1 px-4 sm:px-8 lg:px-4">
        <div className="flex flex-col gap-[22px] items-start w-full py-6">
          {/* Mobile Map Toggle */}
          <div className="lg:hidden w-full flex items-center justify-between">
            {resultsCount && (
              <p className="font-['TWK_Lausanne'] font-medium text-[15px] text-grey tracking-[-0.3px] leading-[1.2]">
                {resultsCount}
              </p>
            )}
            <button
              onClick={() => setShowMap(!showMap)}
              className="border border-border rounded flex gap-2.5 h-11 items-center justify-center px-4 py-3.5 hover:bg-grey-lighter transition-colors cursor-pointer shrink-0"
            >
              <span className="font-['TWK_Lausanne'] text-[15px] text-black leading-[1.2]">
                {showMap ? 'Hide Map' : 'Show Map'}
              </span>
            </button>
          </div>

          

          {/* Mobile Map (when toggled) */}
          {showMap && (
            <div className="lg:hidden w-full h-[400px] rounded overflow-hidden border border-border mb-4">
              <Map
                ref={mapRef}
                mapboxAccessToken={mapboxToken}
                initialViewState={{
                  longitude: initialCenter.longitude,
                  latitude: initialCenter.latitude,
                  zoom: 10,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/bemaxdesign/cmkb0yqgn00q601s9eza817ds"
              >
                {venuesWithCoords.map((venue) => (
                  <Marker
                    key={venue.id}
                    longitude={venue.longitude!}
                    latitude={venue.latitude!}
                    anchor="bottom"
                    onClick={() => handleMarkerClick(venue.id)}
                  >
                    <div
                      className={`cursor-pointer transition-transform duration-150 ${
                        selectedVenueId === venue.id
                          ? 'scale-110'
                          : activeVenueId === venue.id
                          ? 'scale-105'
                          : 'scale-100'
                      }`}
                      onMouseEnter={() => handleMarkerMouseEnter(venue.id)}
                      onMouseLeave={handleMarkerMouseLeave}
                    >
                      <div
                        className={`px-3 py-1 rounded-full text-[13px] font-['TWK_Lausanne'] leading-[1.2] shadow-sm border ${
                          selectedVenueId === venue.id
                            ? 'bg-black text-white border-black'
                            : activeVenueId === venue.id
                            ? 'bg-black text-white border-white/40'
                            : 'bg-black text-white border-transparent'
                        }`}
                      >
                        {venue.price ? `${venue.price}€` : '•'}
                      </div>
                    </div>
                  </Marker>
                ))}

                {/* Popups - only show on click, not on hover */}
                {selectedVenueId && (
                  <Popup
                    longitude={
                      venuesWithCoords.find((v) => v.id === selectedVenueId)?.longitude || 0
                    }
                    latitude={
                      venuesWithCoords.find((v) => v.id === selectedVenueId)?.latitude || 0
                    }
                    anchor="bottom"
                    closeButton={true}
                    onClose={() => setSelectedVenueId(null)}
                  >
                    <div className="text-sm">
                      <p className="font-medium mb-1">
                        {venues.find((v) => v.id === selectedVenueId)?.name}
                      </p>
                      {venues.find((v) => v.id === selectedVenueId)?.city && (
                        <p className="text-grey text-xs mb-1">
                          {venues.find((v) => v.id === selectedVenueId)?.city}
                          {venues.find((v) => v.id === selectedVenueId)?.country &&
                            `, ${venues.find((v) => v.id === selectedVenueId)?.country}`}
                        </p>
                      )}
                      {venues.find((v) => v.id === selectedVenueId)?.capacity && (
                        <p className="text-grey text-xs">
                          Capacity: {venues.find((v) => v.id === selectedVenueId)?.capacity}
                        </p>
                      )}
                      {venues.find((v) => v.id === selectedVenueId)?.price && (
                        <p className="text-grey text-xs">
                          From {venues.find((v) => v.id === selectedVenueId)?.price}€ / personne
                        </p>
                      )}
                    </div>
                  </Popup>
                )}
              </Map>
            </div>
          )}

          {/* Venue Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
            {isLoadingVenues
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-[12px] items-start w-full">
                    {/* Image skeleton */}
                    <div className="h-[305px] w-full rounded bg-black/10 animate-pulse-fast" />

                    {/* Text skeleton */}
                    <div className="flex flex-col gap-[8px] w-full">
                      <div className="h-4 w-2/3 rounded bg-black/10 animate-pulse-fast" />
                      <div className="h-4 w-1/2 rounded bg-black/10 animate-pulse-fast" />
                    </div>

                    {/* Price and details skeleton */}
                    <div className="flex gap-[10px] items-center">
                      <div className="h-4 w-32 rounded bg-black/10 animate-pulse-fast" />
                      <div className="h-4 w-8 rounded bg-black/10 animate-pulse-fast" />
                      <div className="h-4 w-8 rounded bg-black/10 animate-pulse-fast" />
                    </div>

                    {/* Tags skeleton */}
                    <div className="flex gap-[4px]">
                      <div className="h-6 w-24 rounded bg-black/10 animate-pulse-fast" />
                      <div className="h-6 w-20 rounded bg-black/10 animate-pulse-fast" />
                      <div className="h-6 w-10 rounded bg-black/10 animate-pulse-fast" />
                    </div>
                  </div>
                ))
              : venues.map((venue) => (
                  <div
                    key={venue.id}
                    ref={(el) => {
                      cardRefs.current[venue.id] = el;
                    }}
                    onMouseEnter={() => handleCardMouseEnter(venue.id)}
                    onMouseLeave={handleCardMouseLeave}
                    className={`transition-all duration-200 rounded ${
                      activeVenueId === venue.id
                        ? 'ring-1 ring-primary/50 bg-grey-lighter'
                        : ''
                    }`}
                  >
                    <VenueCard venue={venue} />
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Right Column - Map (Desktop) */}
      <aside className="hidden lg:block w-full lg:w-[40%] h-screen lg:sticky lg:top-0 relative shrink-0 overflow-hidden">
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            longitude: initialCenter.longitude,
            latitude: initialCenter.latitude,
            zoom: 10,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/bemaxdesign/cmkb0yqgn00q601s9eza817ds"
        >
          {venuesWithCoords.map((venue) => (
            <Marker
              key={venue.id}
              longitude={venue.longitude!}
              latitude={venue.latitude!}
              anchor="bottom"
              onClick={() => handleMarkerClick(venue.id)}
            >
              <div
                className={`cursor-pointer transition-transform duration-150 ${
                  selectedVenueId === venue.id
                    ? 'scale-110'
                    : activeVenueId === venue.id
                    ? 'scale-105'
                    : 'scale-100'
                }`}
                onMouseEnter={() => handleMarkerMouseEnter(venue.id)}
                onMouseLeave={handleMarkerMouseLeave}
              >
                <div
                  className={`px-3 py-1 rounded-full text-[13px] font-['TWK_Lausanne'] leading-[1.2] shadow-sm border ${
                    selectedVenueId === venue.id
                      ? 'bg-black text-white border-black'
                      : activeVenueId === venue.id
                      ? 'bg-black text-white border-white/40'
                      : 'bg-black text-white border-transparent'
                  }`}
                >
                  {venue.price ? `${venue.price}€` : '•'}
                </div>
              </div>
            </Marker>
          ))}

          {/* Popups - only show on click, not on hover */}
          {selectedVenueId && (
            <Popup
              longitude={
                venuesWithCoords.find((v) => v.id === selectedVenueId)?.longitude || 0
              }
              latitude={
                venuesWithCoords.find((v) => v.id === selectedVenueId)?.latitude || 0
              }
              anchor="bottom"
              closeButton={true}
              onClose={() => setSelectedVenueId(null)}
            >
              <div className="text-sm">
                <p className="font-medium mb-1">
                  {venues.find((v) => v.id === selectedVenueId)?.name}
                </p>
                {venues.find((v) => v.id === selectedVenueId)?.city && (
                  <p className="text-grey text-xs mb-1">
                    {venues.find((v) => v.id === selectedVenueId)?.city}
                    {venues.find((v) => v.id === selectedVenueId)?.country &&
                      `, ${venues.find((v) => v.id === selectedVenueId)?.country}`}
                  </p>
                )}
                {venues.find((v) => v.id === selectedVenueId)?.capacity && (
                  <p className="text-grey text-xs">
                    Capacity: {venues.find((v) => v.id === selectedVenueId)?.capacity}
                  </p>
                )}
                {venues.find((v) => v.id === selectedVenueId)?.price && (
                  <p className="text-grey text-xs">
                    From {venues.find((v) => v.id === selectedVenueId)?.price}€ / personne
                  </p>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </aside>
    </div>
  );
}
