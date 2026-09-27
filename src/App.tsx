/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  Assignment, 
  HotlinkedImage, 
  LineAlertMessage,
  SiteSettings 
} from './types';
import { 
  defaultStudent, 
  defaultTeacher, 
  defaultAdmin,
  initialAssignments, 
  initialAnnouncements, 
  initialSubjectGrades, 
  initialLineAlerts,
  initialSiteSettings,
  initialSystemUsers 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { OverviewView } from './components/OverviewView';
import { AssignmentsView } from './components/AssignmentsView';
import { DailyDashboardView } from './components/DailyDashboardView';
import { GradesView } from './components/GradesView';
import { LineNotificationView } from './components/LineNotificationView';
import { TimetableView } from './components/TimetableView';
import { NewsView } from './components/NewsView';
import { SiteSettingsView } from './components/SiteSettingsView';
import { UserManagementView } from './components/UserManagementView';
import { TeacherPortalView } from './components/TeacherPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { SearchModal } from './components/SearchModal';
import { AdvisorChatModal } from './components/QuickActionModals';
import { EditProfileModal } from './components/EditProfileModal';
import { playNotificationSound } from './utils/sound';
import { 
  loadDatabase, 
  saveDatabase, 
  loadCurrentSessionUser, 
  saveCurrentSessionUser,
  exportDatabaseToFile,
  importDatabaseFromString,
  getInitialDatabase 
} from './utils/database';

export default function App() {
  const initialDb = loadDatabase();
  const savedUser = loadCurrentSessionUser();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(savedUser || defaultAdmin);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Data States loaded from persistent database
  const [assignments, setAssignments] = useState<Assignment[]>(initialDb.assignments);
  const [alerts, setAlerts] = useState<LineAlertMessage[]>(initialDb.alerts);
  const [grades, setGrades] = useState(initialDb.grades);
  const [announcements, setAnnouncements] = useState(initialDb.announcements);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialDb.siteSettings);
  const [systemUsers, setSystemUsers] = useState<UserProfile[]>(initialDb.users);

  // Auto-sync persistent database whenever state changes
  useEffect(() => {
    saveDatabase({
      version: '2.5.0',
      lastUpdated: new Date().toISOString(),
      schoolName: siteSettings.schoolName,
      users: systemUsers,
      assignments,
      announcements,
      grades,
      alerts,
      siteSettings,
    });
  }, [systemUsers, assignments, announcements, grades, alerts, siteSettings]);

  // Auto-sync session user
  useEffect(() => {
    saveCurrentSessionUser(currentUser);
  }, [currentUser]);

  // Global modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdvisorChatOpen, setIsAdvisorChatOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Keyboard shortcut ⌘K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const handleLogin = (role: UserRole, identifier: string, isAdmin?: boolean) => {
    // Match against created accounts in systemUsers
    const trimmed = identifier.trim();
    const matched = systemUsers.find(
      (u) =>
        (u.studentId && u.studentId === trimmed) ||
        (u.teacherId && u.teacherId.toLowerCase() === trimmed.toLowerCase()) ||
        (u.username && u.username.toLowerCase() === trimmed.toLowerCase())
    );

    if (matched) {
      setCurrentUser(matched);
      setIsLoggedIn(true);
      setActiveTab('overview');
      return;
    }

    if (isAdmin || role === 'admin' || trimmed === 'pannawit') {
      setCurrentUser(defaultAdmin);
    } else if (role === 'teacher') {
      setCurrentUser(defaultTeacher);
    } else {
      setCurrentUser({
        ...defaultStudent,
        studentId: trimmed || '54892'
      });
    }
    setIsLoggedIn(true);
    setActiveTab('overview');
  };

  const handleCreateSingleUser = (newUser: UserProfile) => {
    setSystemUsers((prev) => [newUser, ...prev]);
    const newAlert: LineAlertMessage = {
      id: `alert-usr-${Date.now()}`,
      title: `👤 สร้างบัญชีผู้ใช้ใหม่สำเร็จ: ${newUser.thaiName}`,
      body: `สร้างบัญชีสำหรับ ${newUser.role === 'teacher' ? 'ครูผู้สอน' : 'นักเรียน'} รหัส ${newUser.studentId || newUser.teacherId} เรียบร้อย`,
      type: 'assignment',
      timestamp: 'เมื่อสักครู่',
      read: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleCreateBulkUsers = (newUsers: UserProfile[]) => {
    setSystemUsers((prev) => [...newUsers, ...prev]);
    const newAlert: LineAlertMessage = {
      id: `alert-bulk-${Date.now()}`,
      title: `👥 นำเข้าบัญชีแบบกลุ่มสำเร็จ (${newUsers.length} บัญชี)`,
      body: `สร้างบัญชีนักเรียน/ครูเข้าสู่ระบบเรียบร้อย สามารถส่งออกข้อมูล CSV หรือให้นักเรียนล็อกอินได้ทันที`,
      type: 'assignment',
      timestamp: 'เมื่อสักครู่',
      read: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setSystemUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleSwitchToTeacherView = () => {
    setCurrentUser(defaultTeacher);
    setActiveTab('overview');
    if (siteSettings.enableSound) playNotificationSound('chime');
  };

  const handleSwitchToStudentView = () => {
    setCurrentUser(defaultStudent);
    setActiveTab('overview');
    if (siteSettings.enableSound) playNotificationSound('chime');
  };

  const handleSwitchToAdminView = () => {
    setCurrentUser(defaultAdmin);
    setActiveTab('overview');
    if (siteSettings.enableSound) playNotificationSound('chime');
  };

  const handleExportDatabase = () => {
    exportDatabaseToFile({
      version: '2.5.0',
      lastUpdated: new Date().toISOString(),
      schoolName: siteSettings.schoolName,
      users: systemUsers,
      assignments,
      announcements,
      grades,
      alerts,
      siteSettings,
    });
    if (siteSettings.enableSound) playNotificationSound('success');
  };

  const handleImportDatabase = (jsonContent: string) => {
    try {
      const restored = importDatabaseFromString(jsonContent);
      setSystemUsers(restored.users);
      setAssignments(restored.assignments);
      setAnnouncements(restored.announcements);
      setGrades(restored.grades);
      setAlerts(restored.alerts);
      setSiteSettings(restored.siteSettings);
      if (siteSettings.enableSound) playNotificationSound('success');
      alert('นำเข้าฐานข้อมูลและอัปเดตระบบสำเร็จ 100%');
    } catch (e: any) {
      alert(e.message || 'ไฟล์ฐานข้อมูลไม่ถูกต้อง');
    }
  };

  const handleResetDatabase = () => {
    if (confirm('คุณต้องการรีเซ็ตฐานข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นโรงเรียนหรือไม่? ข้อมูลที่เพิ่มใหม่จะถูกแทนที่')) {
      const defaults = getInitialDatabase();
      saveDatabase(defaults);
      setSystemUsers(defaults.users);
      setAssignments(defaults.assignments);
      setAnnouncements(defaults.announcements);
      setGrades(defaults.grades);
      setAlerts(defaults.alerts);
      setSiteSettings(defaults.siteSettings);
      setCurrentUser(defaultAdmin);
      if (siteSettings.enableSound) playNotificationSound('alert');
      alert('รีเซ็ตฐานข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleImpersonateUser = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab('overview');
    if (siteSettings.enableSound) {
      playNotificationSound('chime');
    }
  };

  const handleSaveProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    setSystemUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    const newAlert: LineAlertMessage = {
      id: `alert-profile-${Date.now()}`,
      title: '👤 อัปเดตข้อมูลโปรไฟล์ส่วนตัวสำเร็จ',
      body: `บันทึกข้อมูลชื่อ, รูปประจำตัว, และการติดต่อของ ${updatedUser.thaiName} เรียบร้อยแล้ว`,
      type: 'assignment',
      timestamp: 'เมื่อสักครู่',
      read: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleGoogleLogin = () => {
    // Allows logging in with linked Google Account (pp.usuk.mail@gmail.com)
    setCurrentUser({
      ...defaultStudent,
      name: 'Pannawit Usuk (Google Sync)',
      thaiName: 'วรเมธ วิริยพาณิชย์ (Google Workspace)',
      googleLinked: true,
      googleEmail: 'pp.usuk.mail@gmail.com',
    });
    setIsLoggedIn(true);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSwitchRole = () => {
    if (currentUser.role === 'student') {
      setCurrentUser(defaultTeacher);
    } else if (currentUser.role === 'teacher') {
      setCurrentUser(defaultAdmin);
    } else {
      setCurrentUser(defaultStudent);
    }
  };

  const handleToggleGoogleSync = () => {
    const updated = !currentUser.googleLinked;
    setCurrentUser((prev) => ({
      ...prev,
      googleLinked: updated,
      googleEmail: updated ? 'pp.usuk.mail@gmail.com' : undefined,
    }));
  };

  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    // Apply school name if updated
    setCurrentUser((prev) => ({
      ...prev,
      schoolName: newSettings.schoolName,
    }));
  };

  // Add new assignment (Teacher action)
  const handleAddAssignment = (newAsg: Assignment) => {
    setAssignments((prev) => [newAsg, ...prev]);

    if (siteSettings.enableSound) {
      playNotificationSound('new_assignment');
    }

    // Send instant LINE Notification to all students
    const newAlert: LineAlertMessage = {
      id: `alert-${Date.now()}`,
      title: `📝 คุณครูสั่งการบ้านใหม่: ${newAsg.title}`,
      body: `วิชา ${newAsg.subjectName} (${newAsg.subjectCode}) โดย ${currentUser.thaiName} กำหนดส่ง ${newAsg.dueTime} คะแนนเต็ม ${newAsg.totalPoints} คะแนน`,
      type: 'assignment',
      timestamp: 'เมื่อสักครู่',
      read: false,
      flexCardData: {
        headerColor: '#0071E3',
        badgeText: 'การบ้านใหม่',
        subject: newAsg.subjectName,
        deadline: newAsg.dueTime,
        points: `${newAsg.totalPoints} คะแนน`
      }
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Student submit assignment with text answer and hotlinked images
  const handleSubmitAssignment = (
    id: string,
    textAnswer: string,
    images: HotlinkedImage[]
  ) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'submitted',
              submittedDate: new Date().toLocaleString('th-TH'),
              studentSubmission: {
                textAnswer,
                hotlinkedImages: images,
                submittedAt: new Date().toLocaleString('th-TH')
              }
            }
          : a
      )
    );

    if (siteSettings.enableSound) {
      playNotificationSound('success');
    }

    // Send confirmation alert
    const target = assignments.find((a) => a.id === id);
    const newAlert: LineAlertMessage = {
      id: `alert-sub-${Date.now()}`,
      title: `📤 บันทึกการส่งงานสำเร็จ: ${target?.title || 'งานนักเรียน'}`,
      body: `ระบบได้รับคำตอบและรูปภาพฮอตลิงก์เรียบร้อยแล้ว อยู่ระหว่างรอคุณครูประจำวิชาตรวจให้คะแนน`,
      type: 'assignment',
      timestamp: 'เมื่อสักครู่',
      read: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Teacher grade assignment
  const handleGradeAssignment = (id: string, score: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'graded',
              earnedPoints: score,
              feedback
            }
          : a
      )
    );

    if (siteSettings.enableSound) {
      playNotificationSound('grade_update');
    }

    const target = assignments.find((a) => a.id === id);
    // Send LINE Notification to student
    const newAlert: LineAlertMessage = {
      id: `alert-grade-${Date.now()}`,
      title: `✅ ผลการตรวจงาน: ${target?.title || 'วิชาเรียน'}`,
      body: `คุณครูได้ตรวจงานและให้คะแนนแล้ว: ${score} / ${target?.totalPoints || score} คะแนน ข้อเสนอแนะ: "${feedback}"`,
      type: 'grade',
      timestamp: 'เมื่อสักครู่',
      read: false,
      flexCardData: {
        headerColor: '#16A34A',
        badgeText: 'ตรวจงานแล้ว',
        subject: target?.subjectName,
        points: `${score} / ${target?.totalPoints} คะแนน`
      }
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Trigger test LINE notifications
  const handleSendTestNotification = (
    type: 'urgent' | 'assignment' | 'grade' | 'daily_morning'
  ) => {
    if (siteSettings.enableSound) {
      if (type === 'urgent') playNotificationSound('alert');
      else if (type === 'grade') playNotificationSound('grade_update');
      else if (type === 'assignment') playNotificationSound('new_assignment');
      else playNotificationSound('chime');
    }

    const titles = {
      urgent: '⏰ [ด่วน] แจ้งเตือนส่งงานใกล้หมดเวลา (อีก 3 ชม.)',
      assignment: '📝 แจ้งเตือนการบ้านใหม่จากคุณครู',
      grade: '✅ ผลคะแนนสอบ/การบ้านได้รับการตรวจแล้ว',
      daily_morning: '🌅 สรุปภาระงานและตารางเรียนประจำวัน (07:00 น.)'
    };

    const newAlert: LineAlertMessage = {
      id: `alert-test-${Date.now()}`,
      title: titles[type],
      body:
        type === 'urgent'
          ? 'งาน "แล็บรีพอร์ต: การแกว่งของเพนดูลัม (ว32201)" กำหนดส่ง 16:30 น. วันนี้ กรุณาแนบรูปภาพฮอตลิงก์และส่งในระบบ'
          : type === 'daily_morning'
          ? 'สวัสดี นายวรเมธ วิริยพาณิชย์ วันนี้คุณมีเรียน 7 คาบ และมีงานค้างส่ง 1 งาน'
          : 'ผลการทดสอบแจ้งเตือนผ่าน LINE Notify และ LINE Official Account เรียบร้อยสมบูรณ์',
      type,
      timestamp: 'เมื่อสักครู่',
      read: false
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Broadcast message to class LINE group
  const handleBroadcastToClass = (messageText: string) => {
    const newAlert: LineAlertMessage = {
      id: `alert-bc-${Date.now()}`,
      title: `📢 บรอดคาสต์จาก ${currentUser.thaiName} ถึงกลุ่ม ม.5/1`,
      body: messageText,
      type: 'broadcast',
      timestamp: 'เมื่อสักครู่',
      read: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleToggleAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  if (!isLoggedIn) {
    return (
      <LoginView 
        onLogin={handleLogin} 
        onGoogleLogin={handleGoogleLogin}
        isGoogleLinked={currentUser.googleLinked}
        linkedGoogleEmail={currentUser.googleEmail || 'pp.usuk.mail@gmail.com'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col justify-between font-thonburi selection:bg-[#0071E3] selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        unreadCount={unreadAlertsCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Main View Container (pb-20 on mobile for thumb dock bar clearance) */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-24 lg:pb-8">
        {activeTab === 'overview' && (
          currentUser.role === 'admin' ? (
            <AdminPortalView
              currentUser={currentUser}
              systemUsers={systemUsers}
              siteSettings={siteSettings}
              assignments={assignments}
              onNavigateToUserManagement={() => setActiveTab('users')}
              onNavigateToSettings={() => setActiveTab('settings')}
              onNavigateToAssignments={() => setActiveTab('assignments')}
              onSwitchToTeacherView={handleSwitchToTeacherView}
              onSwitchToStudentView={handleSwitchToStudentView}
              onUpdateSiteSettings={handleUpdateSiteSettings}
              onExportDatabase={handleExportDatabase}
              onImportDatabase={handleImportDatabase}
            />
          ) : currentUser.role === 'teacher' ? (
            <TeacherPortalView
              currentUser={currentUser}
              assignments={assignments}
              onAddAssignment={handleAddAssignment}
              onGradeAssignment={handleGradeAssignment}
              onBroadcastToClass={handleBroadcastToClass}
              onNavigateToAssignments={() => setActiveTab('assignments')}
              onNavigateToGrades={() => setActiveTab('grades')}
            />
          ) : (
            <OverviewView
              currentUser={currentUser}
              assignments={assignments}
              announcements={announcements}
              onNavigateToAssignments={() => setActiveTab('assignments')}
              onNavigateToGrades={() => setActiveTab('grades')}
              onNavigateToTimetable={() => setActiveTab('timetable')}
              onSubmitAssignment={(id, text, imgs) =>
                handleSubmitAssignment(id, text, imgs)
              }
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
            />
          )
        )}

        {activeTab === 'daily' && (
          <DailyDashboardView
            currentUser={currentUser}
            assignments={assignments}
            onNavigateToAssignments={() => setActiveTab('assignments')}
            onNavigateToLine={() => setActiveTab('line')}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView
            currentUser={currentUser}
            assignments={assignments}
            onAddAssignment={handleAddAssignment}
            onSubmitAssignment={handleSubmitAssignment}
            onGradeAssignment={handleGradeAssignment}
          />
        )}

        {activeTab === 'grades' && (
          <GradesView
            currentUser={currentUser}
            grades={grades}
            onOpenAdvisorChat={() => setIsAdvisorChatOpen(true)}
          />
        )}

        {activeTab === 'line' && (
          <LineNotificationView
            currentUser={currentUser}
            alerts={alerts}
            onSendTestNotification={handleSendTestNotification}
            onBroadcastToClass={handleBroadcastToClass}
            onToggleAlertRead={handleToggleAlertRead}
          />
        )}

        {activeTab === 'timetable' && <TimetableView />}

        {activeTab === 'news' && <NewsView announcements={announcements} />}

        {activeTab === 'users' && (
          <UserManagementView
            currentUser={currentUser}
            users={systemUsers}
            onCreateSingleUser={handleCreateSingleUser}
            onCreateBulkUsers={handleCreateBulkUsers}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onImpersonateUser={handleImpersonateUser}
          />
        )}

        {activeTab === 'settings' && (
          <SiteSettingsView
            currentUser={currentUser}
            settings={siteSettings}
            onUpdateSettings={handleUpdateSiteSettings}
            onToggleGoogleSync={handleToggleGoogleSync}
            onNavigateToUserManagement={() => setActiveTab('users')}
            onExportDatabase={handleExportDatabase}
            onImportDatabase={handleImportDatabase}
            onResetDatabase={handleResetDatabase}
            dbUserCount={systemUsers.length}
            dbTaskCount={assignments.length}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-black/[0.06] bg-white/70 backdrop-blur-md py-4 text-xs text-[#86868B] mb-14 lg:mb-0">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1D1D1F]">
              {siteSettings.schoolName} · SchoolSync OS
            </span>
            <span>·</span>
            <span>ระบบบันทึกผลการเรียนรู้และติดตามภาระงาน (Thonburi Edition)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('settings')}
              className="hover:text-[#0071E3] transition-colors"
            >
              ตั้งค่าเว็บไซต์
            </button>
            <span>·</span>
            <button
              onClick={() => alert(`แอดมินระบบ: pannawit (รหัสผ่าน pp1234) อีเมล: ${siteSettings.adminContactEmail}`)}
              className="hover:text-[#0071E3] transition-colors"
            >
              ข้อมูลผู้ดูแลระบบ
            </button>
            <span>·</span>
            <button
              onClick={() => alert('นโยบายความเป็นส่วนตัวและคุ้มครองข้อมูลการศึกษา PDPA โรงเรียนดอนตาลวิทยา')}
              className="hover:text-[#0071E3] transition-colors"
            >
              PDPA
            </button>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assignments={assignments}
        grades={grades}
        announcements={announcements}
        onSelectAssignment={() => setActiveTab('assignments')}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Advisor Chat Modal */}
      <AdvisorChatModal
        isOpen={isAdvisorChatOpen}
        onClose={() => setIsAdvisorChatOpen(false)}
        currentUser={currentUser}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
