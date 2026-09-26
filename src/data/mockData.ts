import { Assignment, AnnouncementItem, SubjectGrade, TimetablePeriod, UserProfile, LineAlertMessage, SiteSettings } from '../types';

import heroCampusImg from '../assets/images/hero_school_campus_1790417598348.jpg';
import studentMaleAvatar from '../assets/images/avatar_student_male_1790417611514.jpg';
import teacherFemaleAvatar from '../assets/images/avatar_teacher_female_1790417624905.jpg';
import scienceFairBanner from '../assets/images/science_fair_banner_1790417636743.jpg';

export { heroCampusImg, studentMaleAvatar, teacherFemaleAvatar, scienceFairBanner };

export const defaultStudent: UserProfile = {
  id: 'std-54892',
  studentId: '54892',
  password: 'password123',
  name: 'Worameth Wiriyapanich',
  thaiName: 'วรเมธ วิริยพาณิชย์',
  role: 'student',
  schoolName: 'โรงเรียนดอนตาลวิทยา',
  classroom: 'ม.5/1 (1/2567)',
  studentNumber: 14,
  gpax: 3.84,
  avatarUrl: studentMaleAvatar,
  lineConnected: true,
  lineNotifyToken: 'LINE-TOKEN-DTT-54892',
  googleLinked: true,
  googleEmail: 'pp.usuk.mail@gmail.com',
  googleName: 'Worameth (Google Workspace)',
  createdAt: '2026-05-15 08:30',
  status: 'active'
};

export const defaultTeacher: UserProfile = {
  id: 'tch-2201',
  teacherId: 'T-2201',
  password: 'password123',
  name: 'Dr. Somboon Pornprasert',
  thaiName: 'ดร. สมบูรณ์ พรประเสริฐ',
  role: 'teacher',
  schoolName: 'โรงเรียนดอนตาลวิทยา',
  classroom: 'ที่ปรึกษา ม.5/1 (กลุ่มสาระวิทยาศาสตร์)',
  avatarUrl: teacherFemaleAvatar,
  lineConnected: true,
  lineNotifyToken: 'LINE-TEACHER-TOKEN-883',
  googleLinked: false,
  googleEmail: 'somboon.p@dontan.ac.th',
  googleName: 'Dr. Somboon P.',
  createdAt: '2026-05-01 09:00',
  status: 'active'
};

export const defaultAdmin: UserProfile = {
  id: 'adm-001',
  username: 'pannawit',
  password: 'pp1234',
  name: 'Pannawit Usuk',
  thaiName: 'ปัณณวิชญ์ อุสุข (ผู้ดูแลระบบกลาง)',
  role: 'admin',
  schoolName: 'โรงเรียนดอนตาลวิทยา',
  classroom: 'กลุ่มงานบริหารสารสนเทศ ICT',
  avatarUrl: studentMaleAvatar,
  lineConnected: true,
  lineNotifyToken: 'LINE-ADMIN-MASTER-TOKEN',
  googleLinked: true,
  googleEmail: 'pp.usuk.mail@gmail.com',
  googleName: 'Pannawit Usuk',
  createdAt: '2026-04-20 10:00',
  status: 'active'
};

export const initialSystemUsers: UserProfile[] = [
  defaultAdmin,
  defaultTeacher,
  defaultStudent,
  {
    id: 'std-54893',
    studentId: '54893',
    password: 'password123',
    name: 'Kittisak Prommin',
    thaiName: 'นายกิตติศักดิ์ พรหมมินทร์',
    role: 'student',
    schoolName: 'โรงเรียนดอนตาลวิทยา',
    classroom: 'ม.5/1 (1/2567)',
    studentNumber: 15,
    gpax: 3.72,
    avatarUrl: studentMaleAvatar,
    lineConnected: true,
    googleLinked: false,
    googleEmail: 'kittisak.p@dontan.ac.th',
    createdAt: '2026-05-15 08:35',
    status: 'active'
  },
  {
    id: 'std-54894',
    studentId: '54894',
    password: 'password123',
    name: 'Natthida Suwannasri',
    thaiName: 'นางสาวณัฐธิดา สุวรรณศรี',
    role: 'student',
    schoolName: 'โรงเรียนดอนตาลวิทยา',
    classroom: 'ม.5/1 (1/2567)',
    studentNumber: 16,
    gpax: 3.91,
    avatarUrl: teacherFemaleAvatar,
    lineConnected: false,
    googleLinked: true,
    googleEmail: 'natthida.s@gmail.com',
    createdAt: '2026-05-15 08:40',
    status: 'active'
  },
  {
    id: 'tch-2202',
    teacherId: 'T-2202',
    password: 'password123',
    name: 'Siriporn Hiranpong',
    thaiName: 'อ. ศิริพร หิรัญพงศ์',
    role: 'teacher',
    schoolName: 'โรงเรียนดอนตาลวิทยา',
    classroom: 'กลุ่มสาระคณิตศาสตร์ (ม.5/1, ม.5/2)',
    avatarUrl: teacherFemaleAvatar,
    lineConnected: true,
    googleLinked: true,
    googleEmail: 'siriporn.h@dontan.ac.th',
    createdAt: '2026-05-01 09:30',
    status: 'active'
  },
  {
    id: 'tch-2203',
    teacherId: 'T-2203',
    password: 'password123',
    name: 'Johnathan Miller',
    thaiName: 'Teacher Johnathan Miller',
    role: 'teacher',
    schoolName: 'โรงเรียนดอนตาลวิทยา',
    classroom: 'กลุ่มสาระภาษาต่างประเทศ (EP/IEP)',
    avatarUrl: studentMaleAvatar,
    lineConnected: false,
    googleLinked: true,
    googleEmail: 'johnathan.m@dontan.ac.th',
    createdAt: '2026-05-01 10:00',
    status: 'active'
  }
];

export const initialSiteSettings: SiteSettings = {
  schoolName: 'โรงเรียนดอนตาลวิทยา',
  schoolSubName: 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา มุกดาหาร',
  academicYear: '2567',
  semester: '1',
  fontFamily: 'Sukhumvit Set (สุขุมวิท เซต)',
  enableLineNotifications: true,
  enableGoogleSync: true,
  allowStudentImageHotlinks: true,
  allowPublicView: true,
  maintenanceMode: false,
  themeColor: '#0071E3',
  enableSound: true,
  lineNotifyChannelToken: 'LINE-NOTIFY-DTT-OAUTH2',
  googleClientIdDisplay: '553825974456-schoolsync.apps.googleusercontent.com',
  adminContactEmail: 'it-support@dontan.ac.th'
};


export const initialAnnouncements: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'กำหนดการสอบกลางภาค 1/2567 และเปิดรับโครงงานนิทรรศการวิทยาศาสตร์',
    category: 'วิชาการ & กิจกรรม',
    author: 'ฝ่ายวิชาการ โรงเรียนดอนตาลวิทยา',
    timeAgo: 'โพสต์เมื่อ 1 ชม. ที่แล้ว',
    urgent: true,
    content: 'ขอให้นักเรียนตรวจสอบตารางสอบกลางภาค เลขที่นั่ง และระเบียบการเข้าห้องสอบอย่างเคร่งครัด พร้อมทั้งเปิดรับสมัครโครงงานนวัตกรรมวิทยาศาสตร์เพื่อชิงทุนการศึกษาประจำปี 2567 ณ ศูนย์การเรียนรู้ศตวรรษที่ 21 อาคาร 3',
    pdfUrl: '#download-pdf',
    pdfSize: '2.4 MB',
    coverImage: scienceFairBanner,
    daysRemaining: 5
  },
  {
    id: 'ann-2',
    title: 'โครงการอบรมปัญญาประดิษฐ์และสะเต็มศึกษา (AI & STEM in Action)',
    category: 'โครงการพิเศษ',
    author: 'กลุ่มสาระวิทยาศาสตร์และเทคโนโลยี',
    timeAgo: 'เมื่อวานนี้',
    urgent: false,
    content: 'ขอเชิญนักเรียนชั้น ม.ปลาย ที่สนใจเข้าร่วมเวิร์กช็อป Machine Learning เบื้องต้นและการเขียนโปรแกรมหุ่นยนต์เพื่อส่งประกวดระดับเขตพื้นที่การศึกษา',
    pdfUrl: '#download-ai-doc',
    pdfSize: '1.8 MB',
    daysRemaining: 12
  }
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'แล็บรีพอร์ต: การแกว่งของเพนดูลัมอย่างง่าย (Simple Pendulum)',
    subjectCode: 'ว32201',
    subjectName: 'ฟิสิกส์ 3',
    teacherName: 'ดร. สมบูรณ์ พรประเสริฐ',
    dueDate: '2026-09-26',
    dueTime: '16:30 น.',
    totalPoints: 20,
    description: 'บันทึกผลการทดลองหาค่าความเร่งโน้มถ่วง (g) จากคาบการแกว่ง เขียนกราฟความสัมพันธ์ระหว่าง T² กับ L และวิเคราะห์ค่าความคลาดเคลื่อน (สามารถแนบรูปภาพฮอตลิงก์ตารางและกราฟได้)',
    category: 'lab',
    status: 'pending',
    hotlinkImages: [
      {
        id: 'img-ref-1',
        url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80',
        caption: 'ภาพชุดการทดลองลูกตุ้มเพนดูลัมในห้องปฏิบัติการ',
        sourceType: 'raw_url',
        timestamp: '2026-09-25 10:00'
      }
    ]
  },
  {
    id: 'asg-2',
    title: 'แบบฝึกหัดเมทริกซ์ 4.2: การหาดีเทอร์มิแนนต์และเมทริกซ์ผกผัน',
    subjectCode: 'ค32205',
    subjectName: 'คณิตศาสตร์ขั้นสูง',
    teacherName: 'อ. ศิริพร หิรัญพงศ์',
    dueDate: '2026-09-27',
    dueTime: '23:59 น.',
    totalPoints: 15,
    description: 'ทำแบบฝึกหัดหน้า 84-86 ข้อ 1 ถึง 10 ลงในสมุด แสดงวิธีทำโดยละเอียด ถ่ายรูปหน้าสมุด หรือใช้ฮอตลิงก์รูปภาพส่งในระบบ',
    category: 'homework',
    status: 'pending'
  },
  {
    id: 'asg-3',
    title: 'Essay: Ethical Implications of Generative AI in High School',
    subjectCode: 'อ32201',
    subjectName: 'ภาษาอังกฤษเชิงวิชาการ',
    teacherName: 'Teacher Johnathan Miller',
    dueDate: '2026-09-28',
    dueTime: '17:00 น.',
    totalPoints: 25,
    description: 'Write a 450-word academic argumentative essay outlining both benefits and academic integrity risks of AI tools in schools. Include proper citations.',
    category: 'project',
    status: 'pending'
  },
  {
    id: 'asg-4',
    title: 'ใบงานการทดสอบสมดุลเคมีและการรบกวนสมดุล เลอชาเตอลิเย',
    subjectCode: 'ว32221',
    subjectName: 'เคมีเพิ่มเติม 3',
    teacherName: 'อ. กัลยา วงศ์สว่าง',
    dueDate: '2026-09-24',
    dueTime: '15:00 น.',
    totalPoints: 20,
    description: 'สรุปการเปลี่ยนแปลงสีของสารละลายเมื่อเปลี่ยนอุณหภูมิและความดัน พร้อมเขียนสมการเคมีประกอบ',
    category: 'lab',
    status: 'graded',
    submittedDate: '2026-09-24 13:45',
    earnedPoints: 19,
    feedback: 'เขียนอธิบายหลักการเลอชาเตอลิเยได้ชัดเจนมาก การจัดรูปสมดุลถูกต้อง',
    studentSubmission: {
      textAnswer: 'สรุปผล: ปฏิกิริยาดูดความร้อนเมื่อเพิ่มอุณหภูมิจะเลื่อนไปทางขวา สีสารละลายเปลี่ยนเป็นสีน้ำเงินเข้มขึ้นตามที่คาดการณ์',
      submittedAt: '2026-09-24 13:45',
      hotlinkedImages: [
        {
          id: 'img-sub-chem',
          url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
          caption: 'ภาพถ่ายหลอดทดลองการเปลี่ยนสีที่อุณหภูมิ 60°C',
          sourceType: 'html_tag',
          originalHtml: '<img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80" alt="ผลการทดลอง" />',
          timestamp: '2026-09-24 13:45'
        }
      ]
    }
  },
  {
    id: 'asg-5',
    title: 'วิเคราะห์โครงสร้างเซลล์พืชและโฟลเอ็ม (Plant Vascular Systems)',
    subjectCode: 'ว32243',
    subjectName: 'ชีววิทยา 3',
    teacherName: 'ดร. ภาวิณี เจริญสุข',
    dueDate: '2026-09-22',
    dueTime: '16:00 น.',
    totalPoints: 25,
    description: 'วาดไดอะแกรมตัดขวางของลำต้นพืชใบเลี้ยงคู่ ระบุตำแหน่งไซเลม โฟลเอ็ม และแคมเบียม',
    category: 'homework',
    status: 'graded',
    submittedDate: '2026-09-22 14:10',
    earnedPoints: 24,
    feedback: 'ภาพวาดไดอะแกรมสวยงาม ระบุจุดโครงสร้างถูกต้องครบถ้วนยอดเยี่ยม',
    studentSubmission: {
      textAnswer: 'ส่งแบบจำลองโครงสร้างเนื้อเยื่อพืชพร้อมการจัดเรียง vascular bundle แบบเป็นระเบียบ',
      submittedAt: '2026-09-22 14:10'
    }
  }
];

export const initialSubjectGrades: SubjectGrade[] = [
  {
    code: 'ว32203',
    name: 'ฟิสิกส์ 3',
    credits: 1.5,
    teacher: 'อ. ณัฐวุฒิ • ห้องปฏิบัติการฟิสิกส์ 402',
    room: 'ห้อง 402',
    currentScore: 86,
    maxScore: 100,
    predictedGrade: 4,
    isHonor: true,
    assessments: {
      quiz1: { score: 10, max: 10 },
      worksheet: { score: 18, max: 20 },
      midterm: { score: 28, max: 30 },
      behavior: { score: 30, max: 40 }
    }
  },
  {
    code: 'ค32205',
    name: 'คณิตศาสตร์ขั้นสูง',
    credits: 2.0,
    teacher: 'อ. ศิริพร • ห้อง 312 ตึกวิทย์-คณิต',
    room: 'ห้อง 312',
    currentScore: 89,
    maxScore: 100,
    predictedGrade: 4,
    isHonor: true,
    assessments: {
      quiz1: { score: 15, max: 15 },
      worksheet: { score: 19, max: 20 },
      midterm: { score: 28, max: 35 },
      behavior: { score: 27, max: 30 }
    }
  },
  {
    code: 'อ32201',
    name: 'ภาษาอังกฤษเชิงวิชาการ',
    credits: 1.5,
    teacher: 'Teacher John • Language Center Room 1',
    room: 'ห้อง LC-1',
    currentScore: 94,
    maxScore: 100,
    predictedGrade: 4,
    isHonor: true,
    assessments: {
      quiz1: { score: 25, max: 25 },
      worksheet: { score: 22, max: 25 },
      midterm: { score: 27, max: 30 },
      behavior: { score: 20, max: 20 }
    }
  },
  {
    code: 'ว32221',
    name: 'เคมีเพิ่มเติม 3',
    credits: 1.5,
    teacher: 'อ. กัลยา • ห้องแล็บเคมี 301',
    room: 'ห้อง 301',
    currentScore: 88,
    maxScore: 100,
    predictedGrade: 4,
    assessments: {
      quiz1: { score: 10, max: 10 },
      worksheet: { score: 19, max: 20 },
      midterm: { score: 29, max: 35 },
      behavior: { score: 30, max: 35 }
    }
  },
  {
    code: 'ว32243',
    name: 'ชีววิทยา 3',
    credits: 1.5,
    teacher: 'ดร. ภาวิณี • ห้องชีวะ 404',
    room: 'ห้อง 404',
    currentScore: 91,
    maxScore: 100,
    predictedGrade: 4,
    isHonor: true,
    assessments: {
      quiz1: { score: 10, max: 10 },
      worksheet: { score: 24, max: 25 },
      midterm: { score: 29, max: 35 },
      behavior: { score: 28, max: 30 }
    }
  }
];

export const weeklyTimetable: TimetablePeriod[] = [
  { period: 1, time: '08:30 – 09:20 น.', subjectCode: 'ค32205', subjectName: 'คณิตศาสตร์ขั้นสูง', teacher: 'อ. ศิริพร', room: '312', day: 'พุธ' },
  { period: 2, time: '09:20 – 10:10 น.', subjectCode: 'ค32205', subjectName: 'คณิตศาสตร์ขั้นสูง', teacher: 'อ. ศิริพร', room: '312', day: 'พุธ' },
  { period: 3, time: '10:10 – 10:30 น.', subjectCode: 'พักเบรก', subjectName: 'พักรับประทานอาหารว่าง', teacher: '-', room: '-', day: 'พุธ' },
  { period: 4, time: '10:30 – 11:20 น.', subjectCode: 'ว32201', subjectName: 'ฟิสิกส์ 3', teacher: 'ดร. สมบูรณ์ พรประเสริฐ', room: 'อาคาร 4 ห้อง 421', day: 'พุธ' },
  { period: 5, time: '11:20 – 12:10 น.', subjectCode: 'ว32201', subjectName: 'ฟิสิกส์ 3 (ปฏิบัติการ)', teacher: 'ดร. สมบูรณ์ พรประเสริฐ', room: 'แล็บฟิสิกส์ 402', day: 'พุธ' },
  { period: 6, time: '12:10 – 13:00 น.', subjectCode: 'พักเที่ยง', subjectName: 'พักรับประทานอาหารกลางวัน', teacher: '-', room: 'โรงอาหาร', day: 'พุธ' },
  { period: 7, time: '13:00 – 13:50 น.', subjectCode: 'อ32201', subjectName: 'ภาษาอังกฤษเชิงวิชาการ', teacher: 'Teacher John', room: 'LC-1', day: 'พุธ' },
  { period: 8, time: '13:50 – 14:40 น.', subjectCode: 'ส32101', subjectName: 'ประวัติศาสตร์สากล', teacher: 'อ. วรรณา', room: '204', day: 'พุธ' }
];

export const initialLineAlerts: LineAlertMessage[] = [
  {
    id: 'line-msg-1',
    title: '🌅 สรุปภาระงานประจำวันรอบเช้า (07:00 น.)',
    body: 'สวัสดีตอนเช้า นายวรเมธ วิริยพาณิชย์ (ม.5/1) วันนี้คุณมี 1 งานด่วนต้องส่งก่อน 16:30 น. (แล็บรีพอร์ตฟิสิกส์ 3) และมีเรียน 7 คาบ',
    type: 'daily_morning',
    timestamp: 'วันนี้ 07:00 น.',
    read: true,
    flexCardData: {
      headerColor: '#0071E3',
      badgeText: 'สรุปงานเช้าวันนี้',
      subject: 'มีงานค้าง 3 รายการ (ด่วน 1 งาน)',
      deadline: 'วันนี้ 16:30 น.',
      actionUrl: '#assignments'
    }
  },
  {
    id: 'line-msg-2',
    title: '⏰ เตือนงานใกล้หมดเวลาส่ง (อีก 3 ชั่วโมง)',
    body: 'งาน "แล็บรีพอร์ต: การแกว่งของเพนดูลัมอย่างง่าย (ว32201)" กำหนดส่ง 16:30 น. วันนี้ ยังไม่พบการส่งในระบบ',
    type: 'urgent',
    timestamp: 'วันนี้ 13:30 น.',
    read: false,
    flexCardData: {
      headerColor: '#DC2626',
      badgeText: 'ด่วนที่สุด (Urgent)',
      subject: 'ฟิสิกส์ 3 (ว32201)',
      deadline: '16:30 น. วันนี้',
      points: '20 คะแนน'
    }
  },
  {
    id: 'line-msg-3',
    title: '✅ แจ้งผลคะแนน: เคมีเพิ่มเติม 3 ตรวจแล้ว',
    body: 'อ. กัลยา ได้ตรวจ "ใบงานการทดสอบสมดุลเคมี เลอชาเตอลิเย" แล้ว ได้คะแนน 19/20 คะแนน พร้อมข้อเสนอแนะ',
    type: 'grade',
    timestamp: 'เมื่อวานนี้ 15:30 น.',
    read: true,
    flexCardData: {
      headerColor: '#16A34A',
      badgeText: 'ตรวจงานแล้ว',
      subject: 'เคมีเพิ่มเติม 3 (ว32221)',
      points: '19 / 20 คะแนน'
    }
  },
  {
    id: 'line-msg-4',
    title: '📢 ประกาศจากโรงเรียนดอนตาลวิทยา',
    body: 'กำหนดการสอบกลางภาค 1/2567 จะเริ่มในอีก 5 วัน ขอให้นักเรียนดาวน์โหลดผังห้องสอบและระเบียบการในระบบ',
    type: 'broadcast',
    timestamp: '25 ก.ย. 2567',
    read: true
  }
];
