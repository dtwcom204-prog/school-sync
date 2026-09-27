import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  Bell, 
  Search, 
  Calendar, 
  FileText, 
  BarChart3, 
  Newspaper, 
  MessageSquareShare, 
  Clock, 
  LogOut, 
  UserCheck, 
  Layers,
  Settings,
  Key,
  ShieldAlert,
  Users,
  ChevronDown,
  User,
  Sparkles,
  Edit3,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onSwitchRole: () => void;
  onLogout: () => void;
  unreadCount: number;
  onOpenSearch: () => void;
  onOpenEditProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  onLogout,
  unreadCount,
  onOpenSearch,
  onOpenEditProfile,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Primary navigation tabs based on user role
  const primaryNavItems = currentUser.role === 'admin'
    ? [
        { id: 'overview', label: 'ภาพรวมระบบ รร.', icon: ShieldCheck },
        { id: 'users', label: 'จัดการผู้ใช้ทั้งหมด', icon: Users },
        { id: 'assignments', label: 'ภาระงานทั้ง รร.', icon: FileText },
        { id: 'timetable', label: 'หลักสูตร & ตาราง', icon: Calendar },
        { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
      ]
    : currentUser.role === 'teacher'
    ? [
        { id: 'overview', label: 'ห้องเรียนที่สอน', icon: BookOpen },
        { id: 'assignments', label: 'สั่ง & ตรวจงาน', icon: FileText },
        { id: 'timetable', label: 'ตารางสอน', icon: Calendar },
        { id: 'grades', label: 'สมุดคะแนน', icon: BarChart3 },
        { id: 'daily', label: 'สรุปงานรายวัน', icon: Clock },
      ]
    : [
        { id: 'overview', label: 'ภาพรวม', icon: Layers },
        { id: 'daily', label: 'สรุปงานรายวัน', icon: Clock },
        { id: 'assignments', label: 'ภาระงาน & ส่งงาน', icon: FileText },
        { id: 'timetable', label: 'ตารางเรียน', icon: Calendar },
        { id: 'grades', label: 'คะแนน & เกรด', icon: BarChart3 },
      ];

  // Secondary navigation tabs (visible on ultra-wide screens or grouped in "More" menu)
  const secondaryNavItems = currentUser.role === 'admin'
    ? [
        { id: 'grades', label: 'ผลการเรียน รร.', icon: BarChart3 },
        { id: 'line', label: 'แจ้งเตือน LINE', icon: MessageSquareShare, hasBadge: unreadCount > 0 },
        { id: 'news', label: 'บอร์ดข่าวสาร', icon: Newspaper },
        { id: 'daily', label: 'สถิติรายวัน', icon: Clock },
      ]
    : currentUser.role === 'teacher'
    ? [
        { id: 'line', label: 'แจ้งเตือน LINE', icon: MessageSquareShare, hasBadge: unreadCount > 0 },
        { id: 'news', label: 'บอร์ดข่าวสาร', icon: Newspaper },
        { id: 'settings', label: 'ตั้งค่าเว็บไซต์', icon: Settings },
      ]
    : [
        { id: 'line', label: 'แจ้งเตือน LINE', icon: MessageSquareShare, hasBadge: unreadCount > 0 },
        { id: 'news', label: 'บอร์ดข่าวสาร', icon: Newspaper },
        { id: 'settings', label: 'ตั้งค่าเว็บไซต์', icon: Settings },
      ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  const getRoleLabel = () => {
    if (currentUser.role === 'admin') return 'แอดมิน';
    if (currentUser.role === 'teacher') return 'ครูผู้สอน';
    return 'นักเรียน';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] glass-nav transition-all font-thonburi">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2">
          
          {/* Zone 1: Wordmark & School Branding */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 text-left group"
            >
              <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0 ${
                currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-[#0071E3]'
              }`}>
                {currentUser.role === 'admin' ? 'A' : 'S'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold tracking-tight text-[#1D1D1F]">
                    SchoolSync
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="hidden 2xl:block text-[11px] text-[#86868B] font-normal truncate max-w-[150px]">
                  {currentUser.schoolName}
                </p>
              </div>
            </button>
          </div>

          {/* Zone 2: Adaptive Desktop Navigation Bar (No overflow!) */}
          <nav className="hidden lg:flex items-center gap-1 min-w-0 px-1">
            {/* Primary Nav Items */}
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-black/[0.06] text-[#0071E3] font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Secondary Nav Items: Visible on full 2XL screens */}
            <div className="hidden 2xl:flex items-center gap-1">
              {secondaryNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-black/[0.06] text-[#0071E3] font-semibold'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.hasBadge && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* "More..." Dropdown Menu: Visible on standard laptop/desktop (< 2XL) */}
            <div className="2xl:hidden relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                  isSecondaryActive || isMoreMenuOpen
                    ? 'bg-blue-50 text-[#0071E3] font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
                }`}
              >
                <span>เพิ่มเติม</span>
                {unreadCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* More dropdown popup */}
              {isMoreMenuOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-48 rounded-2xl bg-white border border-black/10 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMoreMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-blue-50/80 text-[#0071E3] font-semibold'
                            : 'text-[#1D1D1F] hover:bg-black/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-[#6E6E73]" />
                          <span>{item.label}</span>
                        </div>
                        {item.hasBadge && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#DC2626] text-white text-[10px] font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Search, Notifications, Profile Dropdown */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Pill */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-black/[0.04] hover:bg-black/[0.07] text-[#6E6E73] hover:text-[#1D1D1F] text-xs transition-colors shrink-0"
              title="ค้นหาการบ้านหรือประกาศ (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-xs">ค้นหา...</span>
              <kbd className="hidden xl:inline text-[9px] bg-white px-1 rounded border border-black/10 text-[#86868B]">⌘K</kbd>
            </button>

            {/* LINE Alert Quick Icon */}
            <button
              onClick={() => setActiveTab('line')}
              className="relative p-1.5 rounded-lg text-[#6E6E73] hover:text-[#0071E3] hover:bg-black/[0.04] transition-colors shrink-0"
              title="การแจ้งเตือน LINE"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-3.5 px-1 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Switch Role Quick Button */}
            <button
              onClick={onSwitchRole}
              className={`hidden sm:flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-lg border transition-all hover:shadow-xs shrink-0 ${
                currentUser.role === 'admin'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-white/80 text-[#1D1D1F] border-black/10'
              }`}
              title="สลับสิทธิ์การใช้งาน (นักเรียน ↔ ครู ↔ แอดมิน)"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#0071E3]" />
              <span className="hidden md:inline">{getRoleLabel()}</span>
            </button>

            {/* User Profile Avatar with Interactive Dropdown */}
            <div className="relative pl-1 border-l border-black/[0.08]" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 p-0.5 rounded-xl hover:bg-black/[0.04] transition-colors group"
                title="คลิกเพื่อดูและแก้ไขโปรไฟล์ส่วนตัว"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.thaiName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-black/10 shadow-xs group-hover:ring-2 group-hover:ring-[#0071E3]/40 transition-all"
                />
                <div className="hidden xl:block text-left max-w-[90px] truncate">
                  <p className="text-xs font-semibold text-[#1D1D1F] leading-tight truncate">
                    {currentUser.nickname ? `${currentUser.thaiName} (${currentUser.nickname})` : currentUser.thaiName}
                  </p>
                  <p className="text-[10px] text-[#86868B] leading-tight truncate">
                    {currentUser.role === 'admin' ? 'SuperAdmin' : currentUser.classroom}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-[#86868B] hidden sm:block" />
              </button>

              {/* User Profile Popover Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-black/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Popover Header Card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-black/[0.04] mb-1.5 flex items-center gap-3">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.thaiName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-black/10 shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1D1D1F] truncate">
                        {currentUser.thaiName}
                      </p>
                      <p className="text-[11px] text-[#6E6E73] truncate">
                        {currentUser.classroom} {currentUser.studentNumber ? `· เลขที่ ${currentUser.studentNumber}` : ''}
                      </p>
                      <span className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                        currentUser.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : currentUser.role === 'teacher' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {currentUser.role === 'admin' ? 'ผู้ดูแลระบบ' : currentUser.role === 'teacher' ? 'คุณครู' : 'นักเรียน'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenEditProfile();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left font-semibold text-[#0071E3] hover:bg-blue-50 flex items-center gap-2 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>ปรับแต่งโปรไฟล์ส่วนตัว</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSwitchRole();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left font-medium text-[#1D1D1F] hover:bg-black/[0.04] flex items-center gap-2 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#6E6E73]" />
                      <span>สลับสิทธิ์ ({getRoleLabel()})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setActiveTab('settings');
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left font-medium text-[#1D1D1F] hover:bg-black/[0.04] flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#6E6E73]" />
                      <span>การตั้งค่าเว็บไซต์</span>
                    </button>

                    <div className="my-1 border-t border-black/[0.06]"></div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left font-medium text-[#DC2626] hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Horizontal Submenu Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-3 py-1.5 border-t border-black/[0.04] bg-white/50 scrollbar-none">
          {allNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                  isActive
                    ? 'bg-white text-[#0071E3] font-semibold shadow-xs'
                    : 'text-[#6E6E73]'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'line' && unreadCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Floating Bottom Mobile Touch Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.08] px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] ${
            activeTab === 'overview' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span>ภาพรวม</span>
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] ${
            activeTab === 'assignments' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>การบ้าน</span>
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] ${
            activeTab === 'daily' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
          }`}
        >
          <Clock className="w-4 h-4 mb-0.5" />
          <span>รายวัน</span>
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] ${
            activeTab === 'grades' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>คะแนน</span>
        </button>
        <button
          onClick={onOpenEditProfile}
          className="flex flex-col items-center py-1 px-2 text-[10px] text-[#0071E3]"
        >
          <img
            src={currentUser.avatarUrl}
            alt="โปรไฟล์"
            referrerPolicy="no-referrer"
            className="w-4 h-4 rounded-full object-cover mb-0.5 border border-black/10"
          />
          <span>โปรไฟล์</span>
        </button>
      </div>
    </>
  );
};
