'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Menu01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';

/* Client logos for "employees have experienced" section */
const clientLogos = [
  '/logos/clients/amazon.svg',
  '/logos/clients/axa.svg',
  '/logos/clients/bcg.svg',
  '/logos/clients/capgemini.svg',
  '/logos/clients/chanel.svg',
  '/logos/clients/danone.svg',
  '/logos/clients/figma.svg',
  '/logos/clients/microsoft.svg',
  '/logos/clients/siemens.svg',
  '/logos/clients/uber.svg',
];

/* Figma Tamtam node 90-809 – Our worldwide curated collection */
const collectionCategories = [
  {
    title: 'High-tech Hub',
    venuesCount: 32,
    image: '/collection/high-tech-hub.png',
    venueLabel: 'Sundance Mountain Resort, Utah, USA',
  },
  {
    title: 'Mountain chalets',
    venuesCount: 32,
    image: '/collection/mountain-chalets.png',
    venueLabel: 'Sundance Mountain Resort, Utah, USA',
  },
  {
    title: 'Eco-friendly',
    venuesCount: 32,
    image: '/collection/eco-friendly.png',
    venueLabel: 'Sundance Mountain Resort, Utah, USA',
  },
];

const RIVE_HEIGHT = 260;

const cards = [
  {
    title: 'Venue sourcing',
    description: 'Source any vendor for your event',
    riv: '/rive/venue-sourcing-v2.riv',
  },
  {
    title: 'Conciergerie',
    description: 'Your personal event adviser, 24/7',
    riv: '/rive/conciergerie-v2.riv',
  },
  {
    title: 'Event Planning',
    description: 'Review and manage events in one place',
    riv: '/rive/event-planning-v2.riv',
  },
  {
    title: 'Corporate Cards',
    description: 'One card for all event spend',
    riv: '/rive/card-v2.riv',
  },
  {
    title: 'Accounts Payable',
    description: 'Invoices and payments in one flow',
    riv: '/rive/centralizedinvoices-v3.riv',
  },
  {
    title: 'Procurement',
    description: 'Policies and approvals under control',
    riv: '/rive/procurement-v2.riv',
  },
];

function RiveCard({
  title,
  description,
  src,
}: {
  title: string;
  description: string;
  src: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src,
      animations: ['on', 'off'],
      autoplay: false,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomRight }),
    },
    { shouldResizeCanvasToContainer: true }
  );

  // Merge refs: hook's setContainerRef + our ref for ResizeObserver
  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      setContainerRef(el);
    },
    [setContainerRef]
  );

  // Show idle state as soon as Rive is ready so the illustration appears without hover
  useEffect(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  // Resize: call resizeDrawingSurfaceToCanvas() and restore animation state (fix viewport scaling + state machine interruption)
  useEffect(() => {
    if (!rive || !containerRef.current) return;
    const el = containerRef.current;
    const handleResize = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!rive || !el || el.offsetWidth <= 0 || el.offsetHeight <= 0) return;
          rive.resizeDrawingSurfaceToCanvas();
          // Re-play current state so animation doesn't stop or disappear after layout shift
          rive.stop();
          rive.play('off');
        });
      });
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [rive]);

  const playOn = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('on');
  }, [rive]);

  const playOff = useCallback(() => {
    if (!rive) return;
    rive.stop();
    rive.play('off');
  }, [rive]);

  return (
    <article
      className="group flex flex-col rounded-md bg-[#F5F6F8] overflow-hidden transition-all duration-200"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="px-6 pt-6 shrink-0 mb-4">
        <h3 className="text-[22px] font-bold text-[var(--riv-black)] tracking-[-0.48px] ">
          {title}
        </h3>
        <p className="text-[18px] text-[#666666] tracking-[-0.32px] leading-[1.5] max-w-[280px]">
          {description}
        </p>
      </div>
      {/* Rive container: responsive dimensions so canvas can scale; resizeDrawingSurfaceToCanvas() handles resize */}
      <div
        ref={setRef}
        className="relative w-full overflow-hidden block leading-[0] bg-[#F5F6F8] mt-auto shrink-0"
        style={{
          width: '100%',
          height: RIVE_HEIGHT,
          minHeight: RIVE_HEIGHT,
          minWidth: 1,
          pointerEvents: 'auto',
        }}
        onMouseEnter={playOn}
        onMouseLeave={playOff}
      >
        <RiveComponent
          className="w-full h-full"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </article>
  );
}

const SCROLL_SPEED_FACTOR = 1.1; // 110% scroll speed (faster)

export default function RivPage() {
  const collectionScrollRef = useRef<HTMLDivElement>(null);
  const heroScrollTargetRef = useRef<HTMLElement | null>(null);
  const aiPlannerBtnRef = useRef<HTMLButtonElement>(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [aiPlannerSpotlight, setAiPlannerSpotlight] = useState<{ x: number; y: number } | null>(null);

  const handleAiPlannerMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = aiPlannerBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setAiPlannerSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleAiPlannerMouseLeave = useCallback(() => {
    setAiPlannerSpotlight(null);
  }, []);

  const scrollToNextSection = useCallback(() => {
    const target = heroScrollTargetRef.current;
    if (!target) return;
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + start;
    const distance = end - start;
    const baseDuration = 800;
    const duration = baseDuration / SCROLL_SPEED_FACTOR; // 110% speed = shorter duration
    const startTime = performance.now();
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollCollection = (direction: 'left' | 'right') => {
    const el = collectionScrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Sticky header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full h-16 bg-white/0 backdrop-blur-[32px] transition-[border-color,box-shadow] duration-200 ${
          headerScrolled ? 'border-b border-black/10' : ''
        }`}
      >
        <div className="w-full h-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center">
        <div className="w-72 h-7 relative overflow-hidden flex items-center shrink-0">
          <Link href="/home" className="scale-75">
            <Image
              alt="Naboo"
              src="/assets/logo-v2.svg"
              width={89}
              height={16}
              className="object-contain object-left"
              unoptimized
            />
          </Link>
        </div>
        <nav className="hidden md:flex justify-center items-center gap-8 flex-1">
          <Link href="#" className="flex items-center gap-1.5 text-[var(--riv-black)] text-base leading-4 hover:opacity-70 transition-opacity riv-font-medium">
            Features
          </Link>
          <Link href="#" className="flex items-center gap-1.5 text-[var(--riv-black)] text-base leading-4 hover:opacity-70 transition-opacity riv-font-medium">
            Solutions
          </Link>
          <Link href="#" className="text-[var(--riv-black)] text-base leading-4 hover:opacity-70 transition-opacity riv-font-medium">
            Collections
          </Link>
          <Link href="#" className="text-[var(--riv-black)] text-base leading-4 hover:opacity-70 transition-opacity riv-font-medium">
            Blog
          </Link>
        </nav>
        <div className="flex justify-end items-center gap-2 shrink-0">
          <Link href="#" className="h-10 px-4 py-3.5 rounded border border-[var(--riv-black-10)] flex justify-center items-center text-[var(--riv-black)] text-base leading-5 hover:opacity-70 transition-opacity">
            Log in
          </Link>
          <Link href="/home" className="h-10 px-4 py-3.5 riv-btn-primary rounded flex justify-center items-center text-base leading-5 btn-hover-bg">
            Get started
          </Link>
          <button type="button" className="w-10 h-10 bg-black/5 rounded-full flex justify-center items-center hover:bg-black/10 transition-colors md:hidden" aria-label="Menu">
            <HugeiconsIcon icon={Menu01Icon} size={20} color="#212721" strokeWidth={1.5} />
          </button>
        </div>
        </div>
      </header>

      {/* Hero – 90vh; pt-16 reserves space for fixed header. */}
      <section
        className="relative w-full h-[90vh] max-h-[900px] flex flex-col text-left text-xs text-[var(--riv-black)] overflow-hidden pt-16"
        style={{
          background: 'linear-gradient(180deg, rgba(153, 180, 233, 0.16) 10%, rgba(153, 180, 233, 0.16) 59.14%, rgba(153, 180, 233, 0.00) 100%)',
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto flex-1 min-h-0 flex flex-col lg:flex-row items-stretch px-6 sm:px-8 lg:px-12">
          {/* Left: H1, desc, btns – vertically centered with right; padding from container aligns with header */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center gap-8 pr-6 lg:pr-4 pb-12 lg:pb-0 relative z-0 shrink-0">
            <div className="flex flex-col items-start gap-[19px]">
              <div className="group/news shadow-[0px_0.5px_2px_rgba(0,0,0,0.03)] rounded border border-black/10 bg-white flex items-center justify-center py-1 pl-1.5 pr-2 gap-2 cursor-pointer transition-colors duration-300 ease-out hover:bg-white/70">
                <div className="rounded-sm bg-[#c6e278] flex items-center justify-center py-0.5 px-1">
                  <span className="text-[12px] font-medium tracking-[-0.01em] leading-[140%]">NEWS</span>
                </div>
                <span className="text-[15px] tracking-[-0.01em] leading-[140%]">
                  Naboo raises $70M in Series B led by Lightspeed
                </span>
                <span className="inline-flex shrink-0 transition-transform duration-300 ease-out group-hover/news:translate-x-0.5">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#212721" strokeWidth={1.5} />
                </span>
              </div>
              <div className="relative w-fit">
                <h1 className="text-4xl sm:text-5xl lg:text-[58px] leading-[95%] max-w-[593px] font-normal riv-hero-title">
                  Save time & money on your corporate events
                </h1>
                <button
                  type="button"
                  onClick={scrollToNextSection}
                  className="absolute right-[-20px] top-[62px] w-[56.4px] h-[56.4px] rounded-full flex items-center justify-center z-10 hover:opacity-90 transition-opacity hidden lg:flex overflow-hidden"
                  aria-label="Scroll to next section"
                >
                  <Image src="/arrow.svg" alt="" width={57} height={57} className="w-full h-full object-contain" />
                </button>
              </div>
              <div className="text-lg tracking-[-0.01em] leading-[140%] max-w-[444px]">
                The AI Procurement Solution for Corporate Events
              </div>
            </div>
            <div className="flex items-start gap-2 z-[2] text-base">
              <Link
                href="/home"
                className="h-12 rounded riv-btn-primary flex items-center justify-center px-4 py-3.5 tracking-[-0.01em] leading-[120%] btn-hover-bg"
              >
                Get started
              </Link>
              <button
                ref={aiPlannerBtnRef}
                type="button"
                className="group/aiplanner riv-ai-planner-btn relative h-[49px] rounded shadow-[0px_1px_2px_rgba(0,0,0,0.03)] bg-white/60 border border-black/15 flex items-center justify-center px-4 py-3.5 gap-2.5 font-medium tracking-[-0.01em] leading-[120%] text-[var(--riv-black)] hover:opacity-90 transition-opacity overflow-hidden"
                onMouseMove={handleAiPlannerMouseMove}
                onMouseLeave={handleAiPlannerMouseLeave}
              >
                {aiPlannerSpotlight && (
                  <span
                    className="pointer-events-none absolute w-[120px] h-[120px] rounded-full opacity-30 riv-ai-planner-spotlight-wave"
                    style={{
                      left: aiPlannerSpotlight.x,
                      top: aiPlannerSpotlight.y,
                      transform: 'translate(-50%, -50%)',
                      background: 'radial-gradient(circle, var(--riv-primary) 0%, transparent 70%)',
                      filter: 'blur(12px)',
                    }}
                  />
                )}
                <span className="relative z-[1] flex items-center gap-2.5">
                  <HugeiconsIcon icon={SparklesIcon} size={16} color="#212721" strokeWidth={1.5} className="shrink-0" />
                  <span className="riv-ai-planner-shimmer">Try our AI planner</span>
                </span>
              </button>
            </div>
          </div>
          {/* Right: container with hero-bg (cover), not full height; app-frame image aligned at bottom */}
          <div
            className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat min-h-[520px] w-full pl-[70px] pt-[40px] rounded-[12px]"
            style={{
              backgroundImage: 'url(/hero-bg.png)',
            }}
            aria-hidden
          >
            <div className="relative w-full h-full min-h-0 flex flex-col justify-end items-end pt-12 pb-0 pr-0 overflow-hidden">
              <Image
                src="/hero-app-frame.png"
                alt=""
                width={697}
                height={604}
                className="w-auto max-w-full object-contain object-right riv-hero-app-frame-reveal block"
                style={{ maxHeight: 604 }}
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Client logos – Over 500,000 employees */}
      <section ref={heroScrollTargetRef} className="w-full py-12 overflow-hidden bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-[60px]">
        <p className="text-center text-[20px] text-[var(--riv-black)] mb-10 px-5 mx-auto max-w-[900px]">
          Over 500,000 employees have experienced a Naboo event
        </p>
        <div className="relative">
          <div className="riv-logos-marquee flex gap-16 items-center">
            {[...clientLogos, ...clientLogos].map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-10 w-[120px] grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={src}
                  alt=""
                  width={120}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      <section className="riv-section w-full max-w-[1440px] mx-auto py-16 px-6 sm:px-8 lg:px-12 xl:px-[60px]">
        <h2 className="text-[44px] font-light text-[var(--riv-black)] tracking-[-0.96px] leading-[1.1] mb-4">
          Get to know Naboo
        </h2>
        <p className="text-[18px] text-[#666666] tracking-[-0.36px] leading-[1.5] max-w-[560px] mb-12">
          Replace fragmented event tools with Naboo, the Event Operating System
          built to give enterprises control, visibility and efficiency at scale.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-2">
          {cards.map((card) => (
            <RiveCard
              key={card.title}
              title={card.title}
              description={card.description}
              src={card.riv}
            />
          ))}
        </div>
      </section>

      {/* Tamtam – Our worldwide curated collection (Figma current selection, pixel-perfect) */}
      <section className="riv-section w-full pt-20 pb-20 overflow-visible">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-[60px] overflow-visible">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-[34px] font-semibold text-[var(--riv-black)] tracking-[-0.68px] leading-[1.2]">
            Our worldwide curated collection
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollCollection('left')}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e0e0e0] bg-[#f1f1f1] text-[#737876] hover:bg-[#e8e8e8] transition-colors"
              aria-label="Previous"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="#737876" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollCollection('right')}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e0e0e0] bg-white text-[var(--riv-black)] hover:bg-[#f5f5f5] transition-colors"
              aria-label="Next"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#212721" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="w-full h-px bg-[var(--riv-black-10)] mb-8" aria-hidden />
        <div
          ref={collectionScrollRef}
          className="flex gap-6 overflow-x-visible overflow-y-visible pb-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
        >
          {collectionCategories.map((cat) => (
            <article
              key={cat.title}
              className="group/card flex-shrink-0 w-[570px] min-w-[570px] snap-start flex flex-col gap-6 cursor-pointer"
              style={{ fontFamily: 'Aeonik, system-ui, sans-serif' }}
            >
              <div className="flex justify-between items-center w-full min-w-0">
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div
                    className="text-[var(--riv-black)] text-[22px] font-normal leading-[20.9px]"
                    style={{ fontFamily: 'Aeonik, system-ui, sans-serif' }}
                  >
                    {cat.title}
                  </div>
                  <div className="text-grey text-[18px] font-normal leading-[21.6px]">
                    {cat.venuesCount} venues available
                  </div>
                </div>
                <Link
                  href="#"
                  className="flex items-center gap-0.5 p-2.5 rounded text-grey text-base font-normal leading-4 shrink-0 transition-colors duration-300 ease-out bg-transparent group-hover/card:bg-[var(--riv-grey-light)] group-hover/card:text-[var(--riv-black)]"
                  style={{ fontFamily: 'Aeonik, system-ui, sans-serif' }}
                >
                  Explore venues
                  <span className="inline-flex transition-transform duration-300 ease-out group-hover/card:translate-x-0.5 text-[inherit]">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={1.5} className="shrink-0" />
                  </span>
                </Link>
              </div>
              <div className="relative w-full rounded overflow-hidden bg-grey-light shrink-0" style={{ height: 392 }}>
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover/card:scale-105"
                  sizes="570px"
                />
                <div
                  className="absolute inset-0 bg-black/[0.12] opacity-0 group-hover/card:opacity-100 pointer-events-none transition-opacity duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0) 31%, rgba(0, 0, 0, 0) 83%, rgba(0, 0, 0, 0.25) 100%)',
                  }}
                />
                <div
                  className="absolute left-[20px] top-[20px] py-1.5 px-3 rounded-full bg-black/20 backdrop-blur-[14px] flex items-center justify-center"
                  style={{ fontFamily: 'Aeonik, system-ui, sans-serif' }}
                >
                  <span className="text-white text-[15px] font-medium leading-[18px]">
                    {cat.venueLabel}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}
