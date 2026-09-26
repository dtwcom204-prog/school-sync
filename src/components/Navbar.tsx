import React from 'react';
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
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onSwitchRole: () => void;
  onLogout: () => void;
  unreadCount: number;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  onLogout,
  unreadCount,
  onOpenSearch,
}) => {
  const navItems = [
    { id: 'overview', label: 'ภาพรวม', icon: Layers },
    { id: 'daily', label: 'สรุปงานรายวัน', icon: Clock },
    { id: 'assignments', label: currentUser.role === 'teacher' ? 'สั่งงาน & ตรวจงาน' : currentUser.role === 'admin' ? 'จัดการงานทั้งโรงเรียน' : 'ภาระงาน & ส่งงาน', icon: FileText },
    { id: 'timetable', label: 'ตารางเรียน', icon: Calendar },
    { id: 'grades', label: 'คะแนน & ผลการเรียน', icon: BarChart3 },
    { id: 'line', label: 'แจ้งเตือน LINE', icon: MessageSquareShare },
    { id: 'news', label: 'บอร์ดข่าวสาร', icon: Newspaper },
    { id: 'settings', label: 'ตั้งค่าเว็บไซต์', icon: Settings },
  ];

  const getRoleLabel = () => {
    if (currentUser.role === 'admin') return 'แอดมิน pannawit';
    if (currentUser.role === 'teacher') return 'ครูผู้สอน';
    return 'นักเรียน';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] glass-nav transition-all font-thonburi">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 text-left group"
            >
              <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform ${
                currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-[#0071E3]'
              }`}>
                {currentUser.role === 'admin' ? 'A' : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold tracking-tight text-[#1D1D1F]">
                    SchoolSync
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                      ADMIN
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline text-[11px] text-[#86868B] font-normal">
                  {currentUser.schoolName} · {currentUser.classroom}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links for tablet & desktop */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-black/[0.06] text-[#0071E3] font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.id === 'line' && unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions, Search & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-black/[0.04] hover:bg-black/[0.07] text-[#6E6E73] hover:text-[#1D1D1F] text-xs transition-colors"
              title="ค้นหาการบ้านหรือประกาศ (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">ค้นหา...</span>
            </button>

            {/* LINE Alert Quick Icon */}
            <button
              onClick={() => setActiveTab('line')}
              className="relative p-1.5 rounded-lg text-[#6E6E73] hover:text-[#0071E3] hover:bg-black/[0.04] transition-colors"
              title="การแจ้งเตือน LINE"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Switch Role Quick Button */}
            <button
              onClick={onSwitchRole}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all hover:shadow-xs ${
                currentUser.role === 'admin'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-white/80 text-[#1D1D1F] border-black/10'
              }`}
              title="สลับสิทธิ์การใช้งาน (นักเรียน ↔ ครู ↔ แอดมิน pannawit)"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#0071E3]" />
              <span className="hidden sm:inline">{getRoleLabel()}</span>
            </button>

            {/* Settings button shortcut */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#0071E3] text-white'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.04]'
              }`}
              title="ตั้งค่าเว็บไซต์"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User profile dropdown / avatar */}
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 border-l border-black/[0.08]">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.thaiName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-black/10 shadow-xs"
              />
              <div className="hidden 2xl:block text-left">
                <p className="text-xs font-semibold text-[#1D1D1F] leading-tight truncate max-w-[110px]">
                  {currentUser.thaiName}
                </p>
                <p className="text-[10px] text-[#86868B] leading-tight">
                  {currentUser.role === 'admin' ? 'SuperAdmin' : currentUser.role === 'teacher' ? 'ครูประจำชั้น' : `เลขที่ ${currentUser.studentNumber || 14}`}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-1 rounded-lg text-[#86868B] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Submenu bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-3 py-1.5 border-t border-black/[0.04] bg-white/50 scrollbar-none">
          {navItems.map((item) => {
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

      {/* Floating Bottom Mobile Touch Bar (Ultra-convenient for smartphones) */}
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
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] ${
            activeTab === 'settings' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
          }`}
        >
          <Settings className="w-4 h-4 mb-0.5" />
          <span>ตั้งค่า</span>
        </button>
      </div>
    </>
  );
};
