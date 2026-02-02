'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon,
  Folder02Icon,
  Logout03Icon,
  Menu01Icon,
  PaintBoardIcon,
  ArrowDown01Icon,
  Tick01Icon,
  PlayIcon,
} from '@hugeicons/core-free-icons';
import { ColorPaletteExplorer, useColorPaletteSettings } from '@/components/ColorPaletteExplorer';

const imgLogo = '/assets/logo-v2.svg';
const imgChevronDown = '/assets/5a5299a801da7c54ffba6f086126da822b7f3d1f.svg';
const imgClientLogos = '/assets/5722dfd57d26be6ab9ad7aafc4df77851db93557.png';

const solutionsTabs = ['Procurement', 'Event design', 'Guest manager', 'Expense tracker'];
const offices = [
  { city: 'Paris', country: 'France' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'New York', country: 'United States' },
];

const team = [
  { name: 'Adam Black', title: 'Head of Sales', avatar: '/assets/avatar-marc.png' },
  { name: 'Sarah Miller', title: 'Head of Events', avatar: '/assets/avatar-patricia.png' },
  { name: 'Alex Chen', title: 'Procurement Lead', avatar: '/assets/avatar-alexandre.png' },
  { name: 'Emma Wilson', title: 'Customer Success', avatar: '/assets/avatar-patricia.png' },
  { name: 'James Brown', title: 'Operations', avatar: '/assets/avatar-marc.png' },
];

const venues = [
  { name: 'Villa Mandi', location: 'Malibu, California', image: '/assets/new-venue/1.webp' },
  { name: 'Rigby Hall', location: 'London, United Kingdom', image: '/assets/new-venue/2.webp' },
  { name: 'Monaco events', location: 'Monaco', image: '/assets/new-venue/3.webp' },
];

export default function HomeV2Page() {
  useColorPaletteSettings();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#D3D676');
  const [activeTab, setActiveTab] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePrimaryColor = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      if (color) setPrimaryColor(color);
    };
    updatePrimaryColor();
    const observer = new MutationObserver(updatePrimaryColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <ColorPaletteExplorer isOpen={isColorPaletteOpen} onClose={() => setIsColorPaletteOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-[1200px] mx-auto px-8 h-[72px] flex items-center justify-between">
          <Link href="/home" className="h-[24px] w-[89px] shrink-0 mb-[5px]">
            <img alt="Naboo logo" className="block w-full h-full object-contain" src={imgLogo} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#" className="font-sans text-[15px] tracking-[-0.3px] text-black hover:opacity-70">Support</Link>
            <div className="flex gap-1 items-center cursor-pointer hover:opacity-70">
              <span className="font-sans text-[15px] tracking-[-0.3px] text-black">Solutions</span>
              <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-black" strokeWidth={1.5} />
            </div>
            <Link href="#" className="font-sans text-[15px] tracking-[-0.3px] text-black hover:opacity-70">Pricing</Link>
            <Link href="#" className="font-sans text-[15px] tracking-[-0.3px] text-black hover:opacity-70">Blog</Link>
          </nav>
          <div className="flex gap-3 items-center">
            <button className="font-sans h-10 px-4 rounded border border-border text-black font-medium text-[15px] hover:opacity-70 transition-opacity">
              Log in
            </button>
            <button className="font-sans h-10 px-4 rounded bg-primary text-primary-foreground font-medium text-[15px] btn-hover-bg">
              Get started
            </button>
            <div className="relative md:hidden" ref={menuRef}>
              <button className="flex items-center justify-center size-10 rounded-full bg-grey-light hover:bg-grey transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <HugeiconsIcon icon={Menu01Icon} size={16} color="#212724" strokeWidth={1.5} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-xl shadow-lg border border-border z-50 py-2">
                  <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey text-left">
                    <HugeiconsIcon icon={UserIcon} size={20} color="#212724" strokeWidth={1.5} />
                    <span className="font-medium text-[15px]">Account</span>
                  </button>
                  <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey text-left">
                    <HugeiconsIcon icon={Folder02Icon} size={20} color="#212724" strokeWidth={1.5} />
                    <span className="font-medium text-[15px]">Projects</span>
                  </button>
                  <button onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }} onClick={() => { setIsColorPaletteOpen(true); setIsMenuOpen(false); }} className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey text-left cursor-pointer">
                    <HugeiconsIcon icon={PaintBoardIcon} size={20} color="#212724" strokeWidth={1.5} />
                    <span className="font-medium text-[15px]">Color & Font</span>
                  </button>
                  <div className="h-px bg-border mx-4 my-2" />
                  <button className="font-sans w-full px-4 py-3 flex items-center gap-3 hover:bg-grey-lighterGrey text-left">
                    <HugeiconsIcon icon={Logout03Icon} size={20} color="#212724" strokeWidth={1.5} />
                    <span className="font-medium text-[15px]">Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <p className="font-sans text-[15px] text-grey tracking-[-0.3px]">
              When your CEO is out of his office it&apos;s easier to decide.
            </p>
            <h1 className="font-sans text-[40px] md:text-[48px] font-bold tracking-[-0.96px] leading-tight text-black">
              Save time & money on your corporate events
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link href="/home" className="font-sans h-12 px-6 rounded-lg bg-primary text-primary-foreground font-medium text-[15px] flex items-center justify-center btn-hover-bg">
                Discover more
              </Link>
              <button className="font-sans h-12 px-6 rounded-lg border border-border text-black font-medium text-[15px] flex items-center gap-2 hover:opacity-70 transition-opacity">
                <HugeiconsIcon icon={PlayIcon} size={20} color="#212724" strokeWidth={1.5} />
                Play tutorial
              </button>
            </div>
          </div>
          <div className="relative aspect-[4/3] max-h-[400px] rounded-xl overflow-hidden bg-grey-light">
            <img src="/assets/new-venue/1.webp" alt="Corporate event" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Client logos */}
      <section className="border-t border-border py-12">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="font-sans text-[18px] text-grey text-center tracking-[-0.36px] mb-8">
            Join 100,000 top organizations experiencing Naboo&apos;s magic
          </p>
          <div className="relative w-full overflow-hidden">
            <img alt="Client logos" className="w-full max-w-4xl mx-auto h-auto object-contain opacity-80" src={imgClientLogos} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        </div>
      </section>

      {/* Get to know Naboo */}
      <section className="max-w-[1200px] mx-auto px-8 py-20">
        <h2 className="font-sans text-[32px] font-bold tracking-[-0.64px] text-black mb-4">Get to know Naboo</h2>
        <p className="font-sans text-[16px] text-grey tracking-[-0.32px] leading-relaxed max-w-[640px] mb-12">
          Naboo takes every step of the event lifecycle, from planning to execution, so you can focus on what matters.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {['Naboo events', 'New requests', 'Event Planning'].map((title, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-sans font-medium text-[18px] text-black mb-3">{title}</h3>
              <ul className="space-y-2">
                {['Venue search', 'Supplier sourcing', 'Budget management'].map((item, j) => (
                  <li key={j} className="flex items-center gap-2 font-sans text-[14px] text-grey">
                    <HugeiconsIcon icon={Tick01Icon} size={16} className="text-primary shrink-0" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              {i === 2 && (
                <button className="mt-4 font-sans h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-[14px] btn-hover-bg w-full">
                  View all
                </button>
              )}
            </div>
          ))}
        </div>
        <h3 className="font-sans text-[24px] font-bold tracking-[-0.48px] text-black mb-6">Our worldwide curated collection</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {venues.map((v, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border shadow-sm">
              <div className="aspect-[4/3] relative">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="font-sans font-medium text-[16px] text-black">{v.name}</p>
                <p className="font-sans text-[14px] text-grey">{v.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently planned by Naboo */}
      <section className="bg-background-secondary py-20">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="font-sans text-[32px] font-bold tracking-[-0.64px] text-black mb-12">Recently planned by Naboo</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { company: 'J.P. Morgan', quote: 'Our event was perfectly organized by you, thanks!', author: 'Christine Peterson, Marketing Director', image: '/assets/new-venue/1.webp' },
              { company: 'DAVIDWE', quote: 'You are a great team, always adapted to our needs!', author: 'Sarah Miller, Head of Events', image: '/assets/new-venue/2.webp' },
              { company: 'UNICEF', quote: 'Exceptional service from start to finish.', author: 'Alex Johnson, Events Lead', image: '/assets/new-venue/3.webp' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="p-6">
                  <p className="font-sans text-[15px] text-black italic mb-2">&ldquo;{t.quote}&rdquo;</p>
                  <p className="font-sans text-[14px] text-grey">{t.author}</p>
                  <p className="font-sans font-medium text-[14px] text-black mt-1">{t.company}</p>
                </div>
                <div className="aspect-video">
                  <img src={t.image} alt={t.company} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet our procurement experts */}
      <section className="max-w-[1200px] mx-auto px-8 py-20">
        <h2 className="font-sans text-[32px] font-bold tracking-[-0.64px] text-black mb-4">Meet our procurement experts</h2>
        <p className="font-sans text-[16px] text-grey mb-12 max-w-[600px]">
          Work with a dedicated expert who will help you save money on your next corporate event.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {team.map((member, i) => (
            <div key={i} className="text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 bg-grey-light">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/profile-pic.png'; }} />
              </div>
              <p className="font-sans font-medium text-[15px] text-black">{member.name}</p>
              <p className="font-sans text-[14px] text-grey">{member.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROI & Performance */}
      <section className="bg-background-secondary py-20">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="font-sans text-[32px] font-bold tracking-[-0.64px] text-black mb-12 text-center">ROI & Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 border border-border text-center">
              <p className="font-sans text-[36px] font-bold text-primary">15%</p>
              <p className="font-sans text-[14px] text-grey mt-1">average budget savings across our portfolio</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border text-center">
              <p className="font-sans text-[36px] font-bold text-primary">100%</p>
              <p className="font-sans text-[14px] text-grey mt-1">customer satisfaction rate on reviews</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border text-center">
              <p className="font-sans text-[36px] font-bold text-primary">5-10h</p>
              <p className="font-sans text-[14px] text-grey mt-1">average time saved on manual tasks</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border text-center">
              <p className="font-sans text-[36px] font-bold text-primary">Miles</p>
              <p className="font-sans text-[14px] text-grey mt-1">carbon footprint reduction for all events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions for your team */}
      <section className="max-w-[1200px] mx-auto px-8 py-20">
        <h2 className="font-sans text-[32px] font-bold tracking-[-0.64px] text-black mb-4">Solutions for your team</h2>
        <p className="font-sans text-[16px] text-grey mb-8 max-w-[600px]">
          Naboo is a full-service event planning and management solution to help you from start to finish.
        </p>
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {solutionsTabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`font-sans px-4 py-3 text-[15px] font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === i ? 'border-primary text-primary' : 'border-transparent text-grey hover:text-black'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-sans text-[22px] font-bold text-black mb-3">Savings, compliance and spend control</h3>
            <p className="font-sans text-[15px] text-grey mb-4">Simplify, automate, and centralize spend.</p>
            <ul className="space-y-2">
              {['Secure best rates and terms', 'Automate invoicing & audit services', 'Streamline reporting & audit services'].map((item, j) => (
                <li key={j} className="flex items-center gap-2 font-sans text-[15px] text-black">
                  <HugeiconsIcon icon={Tick01Icon} size={18} className="text-primary shrink-0" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden bg-grey-light aspect-video max-h-[320px]">
            <img src="/assets/avatar-patricia.png" alt="Testimonial" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Our special features */}
      <section className="max-w-[1200px] mx-auto px-8 py-20">
        <h2 className="font-sans text-[32px] font-bold tracking-[-0.64px] text-black mb-4">Our special features</h2>
        <p className="font-sans text-[16px] text-grey mb-12 max-w-[640px]">
          We have multiple integrations with the top apps and tools you need, from Google Workspace to Jira and more.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            <h3 className="font-sans text-[22px] font-bold text-black mb-3">An all-in-one event app</h3>
            <p className="font-sans text-[15px] text-grey mb-4">From guest registration to post-event surveys.</p>
            <button className="font-sans h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-[14px] btn-hover-bg">
              View now
            </button>
          </div>
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            <h3 className="font-sans text-[22px] font-bold text-black mb-3">A tailored event plan</h3>
            <p className="font-sans text-[15px] text-grey mb-4">
              We take your vision and bring it to life with custom event designs, seamless logistics, and exceptional experiences.
            </p>
            <button className="font-sans h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-[14px] btn-hover-bg">
              View now
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background-secondary py-20">
        <div className="max-w-[1200px] mx-auto px-8 text-center">
          <h2 className="font-sans text-[32px] font-bold tracking-[-0.64px] text-black mb-6">Ready to modernize your corporate events?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/home" className="font-sans h-12 px-8 rounded-lg bg-primary text-primary-foreground font-medium text-[15px] flex items-center justify-center btn-hover-bg">
              Get started
            </Link>
            <button className="font-sans h-12 px-8 rounded-lg border border-border text-black font-medium text-[15px] hover:opacity-70 transition-opacity">
              Read more
            </button>
          </div>
        </div>
      </section>

      {/* Our offices */}
      <section className="max-w-[1200px] mx-auto px-8 py-16">
        <h2 className="font-sans text-[32px] font-bold tracking-[-0.64px] text-black mb-4">Our offices</h2>
        <p className="font-sans text-[16px] text-grey mb-8 max-w-[600px]">
          Our global headquarters are located in New York City, with satellite offices around the world.
        </p>
        <div className="flex flex-wrap gap-6">
          {offices.map((o, i) => (
            <div key={i} className="font-sans text-[15px] text-black">
              {o.city}, {o.country}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D7255] text-white py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
            <Link href="/home" className="shrink-0">
              <img alt="Naboo" src={imgLogo} className="h-6 w-auto brightness-0 invert" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </Link>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="font-sans font-medium text-[14px] mb-4">Solutions</p>
                <ul className="space-y-2 font-sans text-[14px] text-white/90">
                  {['Procurement', 'Event Design', 'Guest Manager', 'Expense Tracker'].map((l, i) => (
                    <li key={i}><Link href="#" className="hover:underline">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-sans font-medium text-[14px] mb-4">Company</p>
                <ul className="space-y-2 font-sans text-[14px] text-white/90">
                  {['About Us', 'Contact', 'Careers', 'Blog'].map((l, i) => (
                    <li key={i}><Link href="#" className="hover:underline">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-sans font-medium text-[14px] mb-4">Resources</p>
                <ul className="space-y-2 font-sans text-[14px] text-white/90">
                  {['Support', 'Pricing', 'Case Studies', 'Webinars'].map((l, i) => (
                    <li key={i}><Link href="#" className="hover:underline">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-sans font-medium text-[14px] mb-4">Legal</p>
                <ul className="space-y-2 font-sans text-[14px] text-white/90">
                  {['Terms', 'Privacy', 'Cookies', 'GDPR'].map((l, i) => (
                    <li key={i}><Link href="#" className="hover:underline">{l}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
