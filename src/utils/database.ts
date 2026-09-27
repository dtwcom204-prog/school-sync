/**
 * SchoolSync OS - Universal Database Engine
 * Provides persistent database storage, JSON export/import, and Cloud DB sync capabilities.
 */

import { 
  UserProfile, 
  Assignment, 
  LineAlertMessage, 
  SubjectGrade, 
  AnnouncementItem, 
  SiteSettings 
} from '../types';
import { 
  defaultAdmin, 
  defaultTeacher, 
  defaultStudent,
  initialSystemUsers,
  initialAssignments,
  initialAnnouncements,
  initialSubjectGrades,
  initialLineAlerts,
  initialSiteSettings
} from '../data/mockData';

export interface SchoolSyncDatabase {
  version: string;
  lastUpdated: string;
  schoolName: string;
  users: UserProfile[];
  assignments: Assignment[];
  announcements: AnnouncementItem[];
  grades: SubjectGrade[];
  alerts: LineAlertMessage[];
  siteSettings: SiteSettings;
}

const DB_STORAGE_KEY = 'schoolsync_database_v2';
const CURRENT_USER_KEY = 'schoolsync_current_user_v2';

export const getInitialDatabase = (): SchoolSyncDatabase => {
  return {
    version: '2.5.0',
    lastUpdated: new Date().toISOString(),
    schoolName: initialSiteSettings.schoolName,
    users: initialSystemUsers,
    assignments: initialAssignments,
    announcements: initialAnnouncements,
    grades: initialSubjectGrades,
    alerts: initialLineAlerts,
    siteSettings: initialSiteSettings,
  };
};

/**
 * Load database from persistent browser storage or fallback to defaults
 */
export const loadDatabase = (): SchoolSyncDatabase => {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDatabase();
      saveDatabase(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as SchoolSyncDatabase;
    // Basic schema integrity check
    if (!parsed.users || !parsed.assignments) {
      const fallback = getInitialDatabase();
      saveDatabase(fallback);
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load database from localStorage, using fallback:', err);
    return getInitialDatabase();
  }
};

/**
 * Save entire database state to persistent browser storage
 */
export const saveDatabase = (db: SchoolSyncDatabase): void => {
  try {
    db.lastUpdated = new Date().toISOString();
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save database to localStorage:', err);
  }
};

/**
 * Save current session user so refresh keeps logged in user
 */
export const saveCurrentSessionUser = (user: UserProfile | null): void => {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save session user:', err);
  }
};

/**
 * Load current session user
 */
export const loadCurrentSessionUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Download complete database as a timestamped .json file
 */
export const exportDatabaseToFile = (db: SchoolSyncDatabase): void => {
  try {
    const jsonStr = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `SchoolSync_Database_Backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export failed:', err);
    alert('เกิดข้อผิดพลาดในการส่งออกฐานข้อมูล');
  }
};

/**
 * Import and validate database from a JSON string or file
 */
export const importDatabaseFromString = (jsonContent: string): SchoolSyncDatabase => {
  const parsed = JSON.parse(jsonContent);
  if (!parsed.users || !Array.isArray(parsed.users)) {
    throw new Error('รูปแบบไฟล์ฐานข้อมูลไม่ถูกต้อง: ไม่พบรายการ users');
  }
  if (!parsed.assignments || !Array.isArray(parsed.assignments)) {
    throw new Error('รูปแบบไฟล์ฐานข้อมูลไม่ถูกต้อง: ไม่พบรายการ assignments');
  }
  // Ensure version exists
  const validatedDb: SchoolSyncDatabase = {
    version: parsed.version || '2.5.0',
    lastUpdated: new Date().toISOString(),
    schoolName: parsed.schoolName || initialSiteSettings.schoolName,
    users: parsed.users,
    assignments: parsed.assignments,
    announcements: parsed.announcements || initialAnnouncements,
    grades: parsed.grades || initialSubjectGrades,
    alerts: parsed.alerts || initialLineAlerts,
    siteSettings: parsed.siteSettings || initialSiteSettings,
  };
  saveDatabase(validatedDb);
  return validatedDb;
};
