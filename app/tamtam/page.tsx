'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlayIcon,
  ArrowDown01Icon,
  Menu01Icon,
  FileAttachmentIcon,
  Calendar03Icon,
  Tick01Icon,
  Add01Icon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';

const LOGO_SRC = '/assets/logo-v2.svg';

const events = [
  {
    title: 'Summer retreat',
    subtitle: 'Corporate retreat',
    budget: '49 350 €',
    participants: '78',
    date: 'In 3 days',
    status: 'Needs approval',
    statusColor: 'blue',
    thumb: '/assets/new-venue/1.webp',
  },
  {
    title: 'Team offsite',
    subtitle: 'Strategy day',
    budget: '32 100 €',
    participants: '45',
    date: 'In 5 days',
    status: 'Policy warning',
    statusColor: 'orange',
    thumb: '/assets/new-venue/2.webp',
  },
  {
    title: 'Annual conference',
    subtitle: 'All-hands',
    budget: '85 000 €',
    participants: '120',
    date: 'In 7 days',
    status: 'Needs approval',
    statusColor: 'blue',
    thumb: '/assets/new-venue/3.webp',
  },
];

export default function TamtamPage() {
  return (
    <div
      className="min-h-screen bg-[#F7F7F9]"
      style={{ backgroundColor: '#F7F7F9' }}
    >
      {/* Header – exact spacing: 72px height, 32px horizontal padding */}
      <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="max-w-[1200px] mx-auto px-[32px] h-[72px] flex items-center justify-between">
          <Link href="/home" className="h-[24px] w-[89px] shrink-0 relative block">
            <Image
              alt="Naboo"
              src={LOGO_SRC}
              width={89}
              height={24}
              className="object-contain object-left"
              priority
              unoptimized
            />
          </Link>
          <nav className="hidden md:flex items-center gap-[42px]">
            <button
              type="button"
              className="text-[15px] font-medium text-[#333333] tracking-[-0.3px] flex items-center gap-[7px] hover:opacity-70"
            >
              Products{' '}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={14}
                color="#333"
                strokeWidth={1.5}
              />
            </button>
            <button
              type="button"
              className="text-[15px] font-medium text-[#333333] tracking-[-0.3px] flex items-center gap-[7px] hover:opacity-70"
            >
              Solutions{' '}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={14}
                color="#333"
                strokeWidth={1.5}
              />
            </button>
            <Link
              href="#"
              className="text-[15px] font-medium text-[#333333] tracking-[-0.3px] hover:opacity-70"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-[15px] font-medium text-[#333333] tracking-[-0.3px] hover:opacity-70"
            >
              Resources
            </Link>
          </nav>
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              className="h-10 px-4 rounded border border-[#e0e0e0] text-[#333333] font-medium text-[15px] hover:opacity-70 transition-opacity"
            >
              Log in
            </button>
            <Link
              href="/home"
              className="h-10 px-5 rounded bg-primary text-primary-foreground font-medium text-[15px] flex items-center justify-center btn-hover-bg shrink-0"
            >
              See a demo
            </Link>
            <button
              type="button"
              className="flex items-center justify-center size-10 rounded-full text-[#333333] hover:bg-grey-light transition-colors md:hidden"
              aria-label="Menu"
            >
              <HugeiconsIcon
                icon={Menu01Icon}
                size={20}
                color="#333"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Hero + Device – spacing: 80px vertical, 32px horizontal, 64px gap between columns */}
      <section className="max-w-[1200px] mx-auto px-[32px] pt-[80px] pb-[80px]">
        <div className="grid md:grid-cols-[1fr_1fr] gap-[64px] items-start">
          {/* Left: Hero content – 24px gap between elements */}
          <div className="flex flex-col gap-[24px]">
            <p className="text-[14px] text-[#333333] tracking-[-0.28px] leading-[1.4]">
              Naboo raises $70M to roll-out it AI procurement software
              everywhere in the world
            </p>
            <div className="flex flex-col sm:flex-row sm:items-start gap-[24px] sm:gap-[32px]">
              <h1 className="text-[36px] md:text-[44px] font-bold tracking-[-0.88px] leading-[1.1] text-[#333333] max-w-[520px]">
                Save <span className="font-bold">time & money</span> on your{' '}
                <span className="font-bold">corporate events</span>
              </h1>
              <button
                type="button"
                className="flex items-center justify-center size-14 rounded-full bg-[#333333] text-white hover:opacity-90 transition-opacity shrink-0 self-start shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                aria-label="Play video"
              >
                <HugeiconsIcon
                  icon={PlayIcon}
                  size={28}
                  color="#fff"
                  strokeWidth={2}
                />
              </button>
            </div>
            <p className="text-[16px] text-[#666666] tracking-[-0.32px] leading-[1.5] max-w-[480px]">
              The AI Procurement Solution for Corporate Events
            </p>
            <div className="flex flex-wrap items-center gap-[16px]">
              <Link
                href="/home"
                className="h-12 px-6 rounded bg-primary text-primary-foreground font-medium text-[15px] flex items-center justify-center btn-hover-bg"
              >
                Get started
              </Link>
              <button
                type="button"
                className="h-12 px-6 rounded border border-[#e0e0e0] text-[#333333] font-medium text-[15px] flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <HugeiconsIcon
                  icon={Add01Icon}
                  size={18}
                  color="#333"
                  strokeWidth={1.5}
                />
                Try our AI planner
              </button>
            </div>
          </div>

          {/* Right: Device mockup with app UI */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[400px] rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.12)]"
              style={{
                backgroundColor: '#2a2a2a',
                padding: '10px',
                transform: 'perspective(800px) rotateY(-2deg) rotateX(4deg)',
              }}
            >
              <div className="rounded-xl overflow-hidden bg-white">
                {/* App header */}
                <div className="px-4 pt-4 pb-2 border-b border-[#eee]">
                  <h2 className="text-[18px] font-bold text-[#333333] tracking-[-0.36px]">
                    Needs your review
                  </h2>
                </div>
                {/* Tabs */}
                <div className="flex gap-6 px-4 pt-3 border-b border-[#eee]">
                  <button
                    type="button"
                    className="text-[14px] font-medium text-[#333333] pb-3 border-b-2 border-primary flex items-center gap-2"
                  >
                    <HugeiconsIcon
                      icon={FileAttachmentIcon}
                      size={16}
                      color="#333"
                      strokeWidth={1.5}
                    />
                    Needs action
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[12px] font-medium">
                      3
                    </span>
                  </button>
                  <button
                    type="button"
                    className="text-[14px] text-[#999999] pb-3 flex items-center gap-2 hover:text-[#333]"
                  >
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={16}
                      color="#999"
                      strokeWidth={1.5}
                    />
                    Upcoming events
                  </button>
                  <button
                    type="button"
                    className="text-[14px] text-[#999999] pb-3 flex items-center gap-2 hover:text-[#333]"
                  >
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={16}
                      color="#999"
                      strokeWidth={1.5}
                    />
                    Recent events
                  </button>
                </div>
                {/* Event list - column headers */}
                <div className="px-4 py-2 flex text-[11px] font-medium text-[#999999] uppercase tracking-wider border-b border-[#f0f0f0]">
                  <div className="w-[200px] shrink-0">Event</div>
                  <div className="w-[80px] shrink-0 text-right">Budget</div>
                  <div className="w-[70px] shrink-0 text-right">
                    Participants
                  </div>
                  <div className="w-[70px] shrink-0 text-right">Date</div>
                  <div className="flex-1 min-w-[100px] text-right">Status</div>
                </div>
                {events.map((e, i) => (
                  <div
                    key={e.title + i}
                    className="px-4 py-3 flex items-center gap-2 border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-grey-light relative">
                      <Image
                        src={e.thumb}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="w-[140px] shrink-0 min-w-0">
                      <p className="text-[14px] font-semibold text-[#333333] truncate">
                        {e.title}
                      </p>
                      <p className="text-[12px] text-[#666666] truncate">
                        {e.subtitle}
                      </p>
                    </div>
                    <div className="w-[80px] shrink-0 text-right text-[14px] text-[#333333]">
                      {e.budget}
                    </div>
                    <div className="w-[70px] shrink-0 text-right text-[14px] text-[#333333]">
                      {e.participants}
                    </div>
                    <div className="w-[70px] shrink-0 text-right text-[14px] text-[#333333]">
                      {e.date}
                    </div>
                    <div className="flex-1 min-w-[100px] flex justify-end">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[12px] font-medium ${
                          e.statusColor === 'blue'
                            ? 'bg-[#e3f2fd] text-[#1976d2]'
                            : 'bg-[#fff3e0] text-[#e65100]'
                        }`}
                      >
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="shrink-0"
                        />
                        {e.status}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Expenditure analysis */}
                <div className="px-4 py-4 border-t border-[#eee] bg-[#fafafa]">
                  <h3 className="text-[14px] font-bold text-[#333333] mb-3">
                    Expenditure analysis
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-9 rounded bg-[#1a1a1a] flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-medium text-white uppercase">
                        VISA
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#999999]">
                        Budget per participant
                      </p>
                      <p className="text-[18px] font-bold text-[#333333]">
                        227 €
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
