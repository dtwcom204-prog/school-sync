export type UserRole = 'student' | 'teacher' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  studentId?: string;
  teacherId?: string;
  username?: string;
  password?: string;
  name: string;
  thaiName: string;
  role: UserRole;
  schoolName: string;
  classroom: string;
  studentNumber?: number;
  gpax?: number;
  avatarUrl: string;
  lineConnected: boolean;
  lineNotifyToken?: string;
  lineId?: string;
  phone?: string;
  email?: string;
  nickname?: string;
  bio?: string;
  googleLinked: boolean;
  googleEmail?: string;
  googleName?: string;
  createdAt?: string;
  status?: 'active' | 'suspended';
}

export interface BulkAccountRow {
  identifier: string; // studentId or teacherId
  thaiName: string;
  englishName?: string;
  role: 'student' | 'teacher';
  classroom: string;
  studentNumber?: number;
  password?: string;
  email?: string;
}

export interface SiteSettings {
  schoolName: string;
  schoolSubName: string;
  academicYear: string;
  semester: string;
  fontFamily: string;
  enableLineNotifications: boolean;
  enableGoogleSync: boolean;
  allowStudentImageHotlinks: boolean;
  allowPublicView: boolean;
  maintenanceMode: boolean;
  themeColor: string;
  enableSound: boolean;
  lineNotifyChannelToken: string;
  googleClientIdDisplay: string;
  adminContactEmail: string;
}

export interface HotlinkedImage {
  id: string;
  url: string;
  caption?: string;
  sourceType: 'raw_url' | 'html_tag';
  originalHtml?: string;
  timestamp: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  dueDate: string;
  dueTime: string;
  totalPoints: number;
  description: string;
  category: 'homework' | 'project' | 'lab' | 'quiz';
  hotlinkImages?: HotlinkedImage[];
  status: 'pending' | 'submitted' | 'graded';
  submittedDate?: string;
  earnedPoints?: number;
  feedback?: string;
  studentSubmission?: {
    textAnswer?: string;
    fileUrl?: string;
    fileName?: string;
    hotlinkedImages?: HotlinkedImage[];
    submittedAt: string;
  };
}

export interface DailySummaryStat {
  dueToday: number;
  dueTomorrow: number;
  dueThisWeek: number;
  overdue: number;
  completed: number;
  completionRate: number;
}

export interface LineAlertMessage {
  id: string;
  title: string;
  body: string;
  type: 'urgent' | 'assignment' | 'grade' | 'daily_morning' | 'daily_evening' | 'broadcast';
  timestamp: string;
  read: boolean;
  flexCardData?: {
    headerColor?: string;
    badgeText?: string;
    subject?: string;
    deadline?: string;
    points?: string;
    actionUrl?: string;
  };
}

export interface SubjectGrade {
  code: string;
  name: string;
  credits: number;
  teacher: string;
  room: string;
  currentScore: number;
  maxScore: number;
  predictedGrade: number;
  isHonor?: boolean;
  assessments: {
    quiz1: { score: number; max: number };
    worksheet: { score: number; max: number };
    midterm: { score: number; max: number };
    behavior: { score: number; max: number };
  };
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: string;
  author: string;
  timeAgo: string;
  urgent: boolean;
  content: string;
  pdfUrl?: string;
  pdfSize?: string;
  coverImage?: string;
  daysRemaining?: number;
}

export interface TimetablePeriod {
  period: number;
  time: string;
  subjectCode: string;
  subjectName: string;
  teacher: string;
  room: string;
  day: 'จันทร์' | 'อังคาร' | 'พุธ' | 'พฤหัสบดี' | 'ศุกร์';
}
