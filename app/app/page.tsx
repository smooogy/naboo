"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { ApprovalPreviewDrawer } from "@/components/ApprovalPreviewDrawer";
import { ToastProvider } from "@/components/ui/Toast";
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Home01Icon, 
  Calendar03Icon, 
  AnalyticsUpIcon, 
  UserGroupIcon,
  Invoice01Icon,
  Menu01Icon,
  Building06Icon,
  ChartBarLineIcon,
  SecurityCheckIcon,
  WorkflowSquare10Icon,
  Notification03Icon,
  Search01Icon,
  Settings01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  Menu09Icon,
  CalendarAdd01Icon,
  Store01Icon,
  FileSearchIcon,
  Home02Icon,
  Restaurant01Icon,
  GameController01Icon,
  Clock01Icon,
  Calendar01Icon,
  CheckmarkCircle01Icon,
  TaskEdit01Icon
} from '@hugeicons/core-free-icons';

// SVG Icons as inline components for pixel-perfect rendering
const NabooLogo = () => (
  <Image 
    src="/assets/66c58706ea459819ac285f4024d05bd6cecfb0b9.svg" 
    alt="Naboo" 
    width={89} 
    height={18} 
  />
);

const MenuIcon = () => (
  <HugeiconsIcon icon={Menu01Icon} size={24} color="#212724" strokeWidth={1.5} />
);

const CloseIcon = () => (
  <HugeiconsIcon icon={Cancel01Icon} size={24} color="#212724" strokeWidth={1.5} />
);

const SidebarCollapseIcon = () => (
  <HugeiconsIcon icon={Menu09Icon} size={20} color="#212724" strokeWidth={1.5} />
);

const NotificationIcon = () => (
  <HugeiconsIcon icon={Notification03Icon} size={20} color="#212724" strokeWidth={1.5} />
);

const SearchIcon = ({ color = "#878787" }: { color?: string }) => (
  <HugeiconsIcon icon={Search01Icon} size={20} color={color} strokeWidth={1.5} />
);

const HomeIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={Home01Icon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const CalendarIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={Calendar03Icon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const PipelineIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={AnalyticsUpIcon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const UsersIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={UserGroupIcon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const ExpenseIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={Invoice01Icon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const QueueIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={Menu01Icon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const SuppliersIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={Building06Icon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const BenchmarkIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={ChartBarLineIcon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const PolicyIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={SecurityCheckIcon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const WorkflowIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={WorkflowSquare10Icon} size={16} color={active ? "#2d7255" : "#737876"} strokeWidth={1.5} />
);

const ChevronRightIcon = ({ color = "#737876" }: { color?: string }) => (
  <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={color} strokeWidth={1.5} />
);

const SettingsIcon = () => (
  <HugeiconsIcon icon={Settings01Icon} size={20} color="#737876" strokeWidth={1.5} />
);

const TransactionHistoryIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={TaskEdit01Icon} size={20} color={active ? "#2d7255" : "#707885"} strokeWidth={1.5} />
);

const ProgressIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={Calendar01Icon} size={20} color={active ? "#2d7255" : "#707885"} strokeWidth={1.5} />
);

const CheckmarkCircleIcon = ({ active = false }: { active?: boolean }) => (
  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color={active ? "#2d7255" : "#707885"} strokeWidth={1.5} />
);

const ClockIcon = () => (
  <HugeiconsIcon icon={Clock01Icon} size={16} color="#3452bd" strokeWidth={1.25} />
);

// Menu item types
type MenuItemType = 
  | "home" 
  | "ongoing-events" 
  | "event-pipeline" 
  | "attendees-lists"
  | "expenses"
  | "distribution-queue"
  | "suppliers"
  | "benchmark"
  | "event-policies"
  | "workflows";

// Menu item component
const MenuItem = ({
  icon,
  label,
  active = false,
  hasChevron = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasChevron?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-2 py-2 rounded w-full cursor-pointer transition-all duration-200 font-normal ${
      active 
        ? "bg-[rgba(45,114,85,0.1)]" 
        : "hover:bg-grey-light/50 active:bg-grey-light"
    }`}
  >
    <div className="flex items-center gap-2 flex-1">
      {icon}
      <span
        className={`text-[15px] leading-[1.5] transition-colors ${
          active ? "text-primary" : "text-black"
        }`}
      >
        {label}
      </span>
    </div>
    {hasChevron && (
      <ChevronRightIcon color={active ? "#2d7255" : "#737876"} />
    )}
  </button>
);

// Section title component
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="px-0 pb-2">
    <span className="text-[14px] font-medium leading-[1.5] text-grey">
      {children}
    </span>
  </div>
);

// Tab types
type TabType = "needs-action" | "upcoming-events" | "recent-events";

// Event row data
const events = [
  {
    id: 1,
    logo: "/fake_data/cq7_1759329005051.webp",
    company: "The mansion at Glen Cove",
    type: "Séminaire résidentiel",
    amount: "49 350 €",
    participants: "78",
    date: "In 3 days",
    status: "Pending approval",
  },
  {
    id: 2,
    logo: "/fake_data/send-image2183.png",
    company: "Holiday Inn",
    type: "Lunch meeting",
    amount: "3 444 €",
    participants: "3",
    date: "In 3 days",
    status: "Pending approval",
  },
  {
    id: 3,
    logo: "/fake_data/CQuZ1748767898884.webp",
    company: "Tanque Verde Resort",
    type: "Séminaire résidentiel",
    amount: "29 350 €",
    participants: "12",
    date: "In 3 days",
    status: "Pending approval",
  },
];

// Expense details data
const expenseDetails = [
  { category: "Venue", description: "Space and location", percentage: "44%", amount: "226 000€", barWidth: 109, icon: Home02Icon },
  { category: "Catering", description: "Food and banquet", percentage: "42%", amount: "226 000€", barWidth: 89, icon: Restaurant01Icon },
  { category: "Activities", description: "Team activities", percentage: "12.2%", amount: "226 000€", barWidth: 69, icon: GameController01Icon },
];

// Quick action data
const quickActions = [
  { id: 1, label: "Add workflow", icon: WorkflowSquare10Icon },
  { id: 2, label: "Create event", icon: CalendarAdd01Icon },
  { id: 3, label: "Add supplier", icon: Store01Icon },
  { id: 4, label: "View reports", icon: FileSearchIcon },
];

export default function AppDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItemType>("home");
  const [activeTab, setActiveTab] = useState<TabType>("needs-action");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Approval drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [pendingEvents, setPendingEvents] = useState(events);
  const [pendingCount, setPendingCount] = useState(3);

  // Handle clicking on an event card to open the drawer
  const handleEventClick = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    setDrawerOpen(true);
  }, []);

  // Handle removing an event from the list after approval/denial
  const handleRemoveFromList = useCallback((eventId: string) => {
    setPendingEvents((prev) => prev.filter((e) => e.id.toString() !== eventId));
    setPendingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const getIconForMenuItem = (item: MenuItemType, isActive: boolean) => {
    switch (item) {
      case "home": return <HomeIcon active={isActive} />;
      case "ongoing-events": return <CalendarIcon active={isActive} />;
      case "event-pipeline": return <PipelineIcon active={isActive} />;
      case "attendees-lists": return <UsersIcon active={isActive} />;
      case "expenses": return <ExpenseIcon active={isActive} />;
      case "distribution-queue": return <QueueIcon active={isActive} />;
      case "suppliers": return <SuppliersIcon active={isActive} />;
      case "benchmark": return <BenchmarkIcon active={isActive} />;
      case "event-policies": return <PolicyIcon active={isActive} />;
      case "workflows": return <WorkflowIcon active={isActive} />;
    }
  };

  return (
    <ToastProvider>
    <div className="bg-background-secondary relative min-h-screen flex">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-background-secondary border-b border-border z-40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-grey-light rounded-md transition-colors"
        >
          <MenuIcon />
        </button>
        <NabooLogo />
        <button className="p-2 hover:bg-grey-light rounded-md transition-colors">
          <NotificationIcon />
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          bg-background-secondary border-r border-border flex flex-col justify-between px-4 py-4 
          w-[250px] h-screen fixed left-0 top-0 z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Top section */}
        <div className="flex flex-col w-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            {/* <NabooLogo /> */}
            
            <div className="flex items-start">
            
              <button 
                className="p-1.5 hover:bg-grey-light rounded transition-colors lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <CloseIcon />
              </button>
             
            </div>
          </div>
          <button className="flex items-center justify-between px-2 py-2 hover:bg-grey-light/50 rounded transition-colors group">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 rounded-md items-center justify-center vertical-center overflow-hidden bg-white border border-border">
              <Image
                src="/assets/clients/uber.webp"
                alt="Avatar"
                width={40}
                height={40}
                className="object-cover mt-2"
              />
            </div>
            <div className="flex flex-col font-sans text-[14px] leading-[1.5] text-left">
              <span className="text-black">Uber</span>
              <span className="text-grey">flowforgestd@gmail.com</span>
            </div>
          </div>
         
        </button>
          {/* Search */}
          <div className="mt-8 bg-white border border-border rounded-md flex items-center gap-3 px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <SearchIcon color={searchQuery ? "#212724" : "#878787"} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[15px] text-black leading-[1.5] bg-transparent outline-none placeholder:text-grey"
            />
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex flex-col gap-4">
            {/* Home */}
            <MenuItem 
              icon={getIconForMenuItem("home", activeMenuItem === "home")} 
              label="Home" 
             
              active={activeMenuItem === "home"}
              onClick={() => { setActiveMenuItem("home"); setSidebarOpen(false); }}
            />

            {/* Activities section */}
            <div className="flex flex-col">
              <SectionTitle>Activities</SectionTitle>
              <div className="flex flex-col">
                <MenuItem 
                  icon={getIconForMenuItem("ongoing-events", activeMenuItem === "ongoing-events")} 
                  label="Ongoing events"
                  active={activeMenuItem === "ongoing-events"}
                  onClick={() => { setActiveMenuItem("ongoing-events"); setSidebarOpen(false); }}
                />
                <MenuItem 
                  icon={getIconForMenuItem("event-pipeline", activeMenuItem === "event-pipeline")} 
                  label="Event pipeline"
                  active={activeMenuItem === "event-pipeline"}
                  onClick={() => { setActiveMenuItem("event-pipeline"); setSidebarOpen(false); }}
                />
                <MenuItem 
                  icon={getIconForMenuItem("attendees-lists", activeMenuItem === "attendees-lists")} 
                  label="Attendees lists"
                  active={activeMenuItem === "attendees-lists"}
                  onClick={() => { setActiveMenuItem("attendees-lists"); setSidebarOpen(false); }}
                />
              </div>
            </div>

            {/* Data and analyses section */}
            <div className="flex flex-col">
              <SectionTitle>Data and analyses</SectionTitle>
              <div className="flex flex-col">
                <MenuItem 
                  icon={getIconForMenuItem("expenses", activeMenuItem === "expenses")} 
                  label="Expenses"
                  active={activeMenuItem === "expenses"}
                  onClick={() => { setActiveMenuItem("expenses"); setSidebarOpen(false); }}
                />
                <MenuItem 
                  icon={getIconForMenuItem("distribution-queue", activeMenuItem === "distribution-queue")} 
                  label="Distribution queue"
                  active={activeMenuItem === "distribution-queue"}
                  onClick={() => { setActiveMenuItem("distribution-queue"); setSidebarOpen(false); }}
                />
                <MenuItem 
                  icon={getIconForMenuItem("suppliers", activeMenuItem === "suppliers")} 
                  label="Suppliers"
                  active={activeMenuItem === "suppliers"}
                  onClick={() => { setActiveMenuItem("suppliers"); setSidebarOpen(false); }}
                />
                <MenuItem 
                  icon={getIconForMenuItem("benchmark", activeMenuItem === "benchmark")} 
                  label="Benchmark"
                  active={activeMenuItem === "benchmark"}
                  onClick={() => { setActiveMenuItem("benchmark"); setSidebarOpen(false); }}
                />
              </div>
            </div>

            {/* Rules and policies section */}
            <div className="flex flex-col">
              <SectionTitle>Rules and policies</SectionTitle>
              <div className="flex flex-col">
                <MenuItem 
                  icon={getIconForMenuItem("event-policies", activeMenuItem === "event-policies")} 
                  label="Event policies"
                  active={activeMenuItem === "event-policies"}
                  onClick={() => { setActiveMenuItem("event-policies"); setSidebarOpen(false); }}
                />
                <MenuItem 
                  icon={getIconForMenuItem("workflows", activeMenuItem === "workflows")} 
                  label="Workflows"
                  active={activeMenuItem === "workflows"}
                  onClick={() => { setActiveMenuItem("workflows"); setSidebarOpen(false); }}
                />
              </div>
            </div>
          </nav>
        </div>

        {/* Account section */}
     
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 pt-20 lg:pt-8 lg:ml-[270px] lg:p-4">
        {/* Needs your review section */}
        <section className="flex flex-col gap-4 w-full">
          <h2 className="text-[20px] leading-[1.5] text-black">
            Needs your review
          </h2>

          <div className="flex flex-col">
            {/* Tabs header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-0 sm:h-[54px]">
              <div className="flex items-center gap-2 sm:gap-[22px] h-full overflow-x-auto pb-2 sm:pb-0">
                {/* Needs action tab */}
                <button
                  onClick={() => setActiveTab("needs-action")}
                  className={`flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap transition-all ${
                    activeTab === "needs-action" 
                      ? "border-b-2 border-primary" 
                      : "border-b-2 border-transparent hover:border-grey-light"
                  }`}
                >
                  <TransactionHistoryIcon active={activeTab === "needs-action"} />
                  <span className={`text-[14px] tracking-[-0.14px] transition-colors ${
                    activeTab === "needs-action" ? "font-bold text-primary" : "text-[#707885]"
                  }`}>
                    Needs action
                  </span>
                  <div className={`rounded-full px-3 py-[0px] transition-colors ${
                    activeTab === "needs-action" ? "bg-primary" : "bg-grey-light"
                  }`}>
                    <span className={`text-[14px] font-medium tracking-[-0.14px] ${
                      activeTab === "needs-action" ? "text-white" : "text-grey"
                    }`}>
                      {pendingCount}
                    </span>
                  </div>
                </button>

                {/* Upcoming events tab */}
                <button
                  onClick={() => setActiveTab("upcoming-events")}
                  className={`flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap transition-all ${
                    activeTab === "upcoming-events" 
                      ? "border-b-2 border-primary" 
                      : "border-b-2 border-transparent hover:border-grey-light"
                  }`}
                >
                  <ProgressIcon active={activeTab === "upcoming-events"} />
                  <span className={`text-[14px] tracking-[-0.14px] transition-colors ${
                    activeTab === "upcoming-events" ? "font-medium text-primary" : "text-[#707885]"
                  }`}>
                    Upcoming events
                  </span>
                </button>

                {/* Recent events tab */}
                <button
                  onClick={() => setActiveTab("recent-events")}
                  className={`flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap transition-all ${
                    activeTab === "recent-events" 
                      ? "border-b-2 border-primary" 
                      : "border-b-2 border-transparent hover:border-grey-light"
                  }`}
                >
                  <CheckmarkCircleIcon active={activeTab === "recent-events"} />
                  <span className={`text-[14px] tracking-[-0.14px] transition-colors ${
                    activeTab === "recent-events" ? "font-medium text-primary" : "text-[#707885]"
                  }`}>
                    Recent events
                  </span>
                </button>
              </div>

              {/* See all button */}
              <button className="h-8 px-4 py-3.5 rounded text-grey flex items-center justify-center hover:bg-grey-light/100 active:bg-grey-light transition-colors self-start sm:self-auto">
                <span className="text-[14px] font-medium text-grey hover:text-black leading-[1.2]">
                  See all
                </span>
              </button>
            </div>

            {/* Table - Desktop */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded shadow-base hidden lg:block">
              {/* Header row */}
              <div className="grid grid-cols-[320px_130px_130px_130px_170px_1fr] px-5 py-3 border-b border-[rgba(0,0,0,0.1)]">
                <span className="text-[12px] font-medium text-[#7b7b7b] tracking-[-0.12px]">Client</span>
                <span className="text-[12px] font-medium text-[#7b7b7b] tracking-[-0.12px]">Montant HT</span>
                <span className="text-[12px] font-medium text-[#7b7b7b] tracking-[-0.12px]">Participants</span>
                <span className="text-[12px] font-medium text-[#7b7b7b] tracking-[-0.12px]">Date</span>
                <span className="text-[12px] font-medium text-[#7b7b7b] tracking-[-0.12px]">Status</span>
                <span></span>
              </div>

              {/* Data rows */}
              {pendingEvents.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id.toString())}
                  className={`grid grid-cols-[320px_130px_130px_130px_170px_1fr] px-5 py-4 items-center hover:bg-grey-light/30 transition-colors cursor-pointer ${
                    index < pendingEvents.length - 1 ? "border-b border-[rgba(0,0,0,0.1)]" : ""
                  }`}
                >
                  {/* Client */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-[58px] h-[58px] rounded overflow-hidden bg-white">
                      <Image
                        src={event.logo}
                        alt={event.company}
                        width={58}
                        height={58}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 right-0 flex items-center justify-center">
                        <Image
                          src="/assets/type_venue.svg"
                          alt="Venue"
                          width={32}
                          height={32}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-[#2d3748] leading-[1.4]">
                        {event.company}
                      </span>
                      <span className="text-[14px] text-[#7b7b7b]">
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-[#f2f2f2] rounded-full px-2.5 py-1 inline-flex items-center justify-center w-fit">
                    <span className="text-[14px] font-bold text-[#2d3748] leading-[1.4]">
                      {event.amount}
                    </span>
                  </div>

                  {/* Participants */}
                  <span className="text-[14px] font-medium text-[#2d3748] leading-[1.4]">
                    {event.participants}
                  </span>

                  {/* Date */}
                  <span className="text-[14px] text-[#2d3748] leading-[1.4]">
                    {event.date}
                  </span>

                  {/* Status */}
                  <div className="border border-[rgba(0,0,0,0.09)] rounded-full px-2.5 py-[7px] flex items-center gap-[7px] w-fit">
                    <ClockIcon />
                    <span className="text-[14px] font-medium text-[#3452bd] tracking-[-0.14px]">
                      {event.status}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button className="h-11 px-4 py-3.5 border border-[rgba(45,114,85,0.22)] rounded flex items-center justify-center hover:bg-primary-lighter transition-colors">
                      <span className="text-[14px] font-bold text-primary leading-[1.2]">
                       Open
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cards - Mobile/Tablet */}
            <div className="flex flex-col gap-3 lg:hidden">
              {pendingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id.toString())}
                  className="bg-white border rounded-lg shadow-base p-4 active:bg-grey-light/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative w-12 h-12 border  rounded shrink-0 overflow-hidden bg-white">
                      <Image
                        src={event.logo}
                        alt={event.company}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 right-0 flex items-center justify-center">
                        <Image
                          src="/assets/type_venue.svg"
                          alt="Venue"
                          width={32}
                          height={32}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[15px] font-medium text-[#2d3748] leading-[1.4]">
                        {event.company}
                      </span>
                      <span className="text-[13px] text-[#7b7b7b] truncate">
                        {event.type}
                      </span>
                    </div>
                    <div className="bg-[#f2f2f2] rounded-full px-2.5 py-1">
                      <span className="text-[13px] font-semibold text-[#2d3748]">
                        {event.amount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-4 text-[13px] text-[#7b7b7b]">
                      <span>{event.participants} participants</span>
                      <span>{event.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="border border-[rgba(0,0,0,0.09)] rounded-full px-2 py-1 flex items-center gap-1.5">
                      <ClockIcon />
                      <span className="text-[12px] font-medium text-[#3452bd]">
                        {event.status}
                      </span>
                    </div>
                    <button className="h-9 px-3 border border-[rgba(103,103,105,0.22)] rounded shadow-sm flex items-center justify-center hover:bg-grey-light/50 active:bg-grey-light transition-colors">
                      <span className="text-[13px] font-medium text-[#676769]">
                        Send quote
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom section */}
        <section className="flex flex-col xl:flex-row gap-4 xl:gap-2 mt-8 w-full">
          {/* Expenditure analysis */}
          <div className="flex flex-col gap-4 w-full xl:w-[672px]">
            <h2 className="text-[20px] leading-[1.5] text-black">
              Expenditure analysis
            </h2>

            <div className="bg-white border border-border rounded p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-medium text-[#7b7b7b] tracking-[-0.12px]">
                    Total expenses
                  </span>
                  <span className="text-[20px] sm:text-[24px] text-[#2d3748] leading-[1.4]">
                    509 023 €
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-medium text-[#7b7b7b] tracking-[-0.12px]">
                    Budget per participant
                  </span>
                  <span className="text-[20px] sm:text-[24px] text-[#2d3748] leading-[1.4]">
                    227 €
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-medium text-[#7b7b7b] tracking-[-0.12px]">
                    Budget per participant
                  </span>
                  <span className="text-[20px] sm:text-[24px] text-[#2d3748] leading-[1.4]">
                    227 €
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border w-full" />

              {/* Details */}
              <div className="flex flex-col gap-2">
                <span className="text-[14px] text-[#7b7b7b]">Details</span>

                <div className="flex flex-col ">
                  {expenseDetails.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 -mx-2 rounded hover:bg-grey-light/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-grey-light p-2 sm:p-3 rounded flex items-center justify-center">
                          <HugeiconsIcon icon={item.icon} size={20} color="#737876" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col gap-0.5 sm:gap-1 justify-center">
                          <span className="text-[14px] sm:text-[15px] text-black leading-[1.2] tracking-[-0.3px]">
                            {item.category}
                          </span>
                          <span className="text-[13px] sm:text-[15px] text-grey leading-[1.2] tracking-[-0.3px]">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 sm:gap-2 items-end">
                        <div className="flex flex-col gap-0.5 sm:gap-1 items-end">
                          <span className="text-[16px] sm:text-[18px] text-black leading-[1.4]">
                            {item.percentage}
                          </span>
                          <span className="text-[11px] sm:text-[12px] text-grey leading-[1.4]">
                            {item.amount}
                          </span>
                        </div>
                        <div
                          className="bg-primary h-1 rounded-full transition-all duration-500"
                          style={{ width: item.barWidth }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-[20px] leading-[1.5] text-black">
              Quick actions
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="bg-white border border-border rounded shadow-md p-4 h-24 sm:h-28 flex flex-col justify-between hover:border-primary/30 hover:shadow-lg active:bg-grey-light/30 transition-all group"
                >
                  <div className="bg-grey-light p-1.5 rounded-sm w-fit group-hover:bg-primary/10 transition-colors">
                    <HugeiconsIcon icon={action.icon} size={12} color="#737876" strokeWidth={1.5} />
                  </div>
                  <span className="text-[15px] sm:text-[17px] text-black leading-[1.2] tracking-[-0.34px] text-left">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Approval Preview Drawer */}
      <ApprovalPreviewDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        eventId={selectedEventId}
        onRemoveFromList={handleRemoveFromList}
      />
    </div>
    </ToastProvider>
  );
}
