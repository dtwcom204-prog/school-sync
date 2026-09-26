import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { playNotificationSound } from '../utils/sound';
import { artisticAvatars } from '../data/artisticAvatars';
import { 
  X, 
  User, 
  Camera, 
  Check, 
  Sparkles, 
  Mail, 
  Phone, 
  MessageSquare, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Key,
  Globe,
  UploadCloud,
  Trash2,
  Palette,
  Heart,
  FileCheck
} from 'lucide-react';
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updatedUser: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'avatar' | 'security' | 'contact'>('avatar');

  // Avatar Selection Subtab: 'artistic' | 'upload' | 'standard' | 'url'
  const [avatarMode, setAvatarMode] = useState<'artistic' | 'upload' | 'standard' | 'url'>('artistic');
  const [artisticFilter, setArtisticFilter] = useState<'all' | 'origami' | 'food' | 'lifestyle'>('all');

  // Form states
  const [thaiName, setThaiName] = useState(currentUser.thaiName || '');
  const [englishName, setEnglishName] = useState(currentUser.name || '');
  const [nickname, setNickname] = useState(currentUser.nickname || '');
  const [classroom, setClassroom] = useState(currentUser.classroom || '');
  const [studentNumber, setStudentNumber] = useState(currentUser.studentNumber || 14);
  const [phone, setPhone] = useState(currentUser.phone || '089-123-4567');
  const [email, setEmail] = useState(currentUser.email || currentUser.googleEmail || '');
  const [lineId, setLineId] = useState(currentUser.lineId || '');
  const [bio, setBio] = useState(currentUser.bio || 'มุ่งมั่นพัฒนาตนเอง สู้เพื่อเกรด 4 และอนาคตที่ดี 🎓');
  
  // Avatar states
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatarUrl || studentMaleAvatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [avatarPreviewError, setAvatarPreviewError] = useState(false);

  // File upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Status feedback
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle direct file upload from user's device
  const handleFileUpload = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP, GIF)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('ขนาดไฟล์ภาพต้องไม่เกิน 8 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64Url = event.target.result as string;
        setSelectedAvatar(base64Url);
        setUploadedFileName(file.name);
        setUploadedFileSize((file.size / 1024).toFixed(1) + ' KB');
        setAvatarPreviewError(false);
        playNotificationSound('chime');
      }
    };
    reader.onerror = () => {
      setUploadError('เกิดข้อผิดพลาดในการอ่านไฟล์ภาพ กรุณาลองใหม่อีกครั้ง');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setSelectedAvatar(currentUser.avatarUrl || studentMaleAvatar);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customAvatarUrl.trim()) return;
    setSelectedAvatar(customAvatarUrl.trim());
    setAvatarPreviewError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check password if user tried to change it
    if (newPassword.trim()) {
      if (newPassword !== confirmPassword) {
        setPasswordError('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
        setActiveTab('security');
        return;
      }
      if (newPassword.length < 4) {
        setPasswordError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
        setActiveTab('security');
        return;
      }
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      thaiName: thaiName.trim() || currentUser.thaiName,
      name: englishName.trim() || currentUser.name,
      nickname: nickname.trim(),
      classroom: classroom.trim(),
      studentNumber: currentUser.role === 'student' ? Number(studentNumber) : undefined,
      phone: phone.trim(),
      email: email.trim(),
      lineId: lineId.trim(),
      bio: bio.trim(),
      avatarUrl: selectedAvatar,
      password: newPassword.trim() ? newPassword.trim() : currentUser.password
    };

    onSaveProfile(updatedUser);
    playNotificationSound('success');
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const filteredArtisticAvatars = artisticAvatars.filter((av) => {
    if (artisticFilter === 'all') return true;
    return av.category === artisticFilter;
  });

  const getRoleBadge = () => {
    if (currentUser.role === 'admin') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">ผู้ดูแลระบบ (Admin)</span>;
    }
    if (currentUser.role === 'teacher') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">คุณครูผู้สอน (Teacher)</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">นักเรียน (Student)</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 font-sukhumvit">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-black/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-black/[0.06] bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                  แก้ไขและปรับแต่งโปรไฟล์ส่วนตัว
                </h2>
                {getRoleBadge()}
              </div>
              <p className="text-xs text-[#6E6E73]">
                {currentUser.schoolName} · รหัส {currentUser.studentId || currentUser.teacherId || currentUser.username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#6E6E73] hover:text-[#1D1D1F] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Profile Header Preview Banner with Circular Avatar Badge */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 border-b border-black/[0.06]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group shrink-0">
              <img
                src={selectedAvatar}
                alt="Avatar Preview"
                onError={() => setAvatarPreviewError(true)}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-3 border-white shadow-md bg-white transition-all group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setActiveTab('avatar')}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                title="เปลี่ยนรูปภาพโปรไฟล์"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-[#1D1D1F]">
                  {thaiName || currentUser.thaiName}
                </h3>
                {nickname && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-[#0071E3] border border-blue-200 shadow-2xs">
                    ({nickname})
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#6E6E73] bg-black/[0.04] px-2 py-0.5 rounded-md">
                  {currentUser.studentId ? `ID: ${currentUser.studentId}` : currentUser.teacherId ? `T-ID: ${currentUser.teacherId}` : currentUser.username}
                </span>
              </div>
              <p className="text-xs text-[#6E6E73]">
                {englishName || currentUser.name} · {classroom || currentUser.classroom} 
                {currentUser.role === 'student' && studentNumber ? ` · เลขที่ ${studentNumber}` : ''}
              </p>
              <p className="text-xs text-[#414753] italic pt-0.5 line-clamp-1">
                "{bio}"
              </p>
            </div>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-black/[0.06] bg-white overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'avatar'
                ? 'border-[#0071E3] text-[#0071E3] bg-blue-50/50'
                : 'border-transparent text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>เปลี่ยนรูปโปรไฟล์ (ศิลปะ / อัปโหลด)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-[#0071E3] text-[#0071E3] bg-blue-50/50'
                : 'border-transparent text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>ข้อมูลส่วนตัว</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-[#0071E3] text-[#0071E3] bg-blue-50/50'
                : 'border-transparent text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ช่องทางติดต่อ & LINE</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#0071E3] text-[#0071E3] bg-blue-50/50'
                : 'border-transparent text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>รหัสผ่าน & บัญชี</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          
          {/* TAB: Avatar Customization (Artistic / Direct Upload / Standard / URL) */}
          {activeTab === 'avatar' && (
            <div className="space-y-4">
              
              {/* Avatar Source Modes Selector */}
              <div className="flex items-center gap-1 p-1 bg-black/[0.04] rounded-2xl overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setAvatarMode('artistic')}
                  className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    avatarMode === 'artistic'
                      ? 'bg-white text-[#0071E3] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>โปรไฟล์แนวศิลปะ (25 แบบ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAvatarMode('upload')}
                  className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    avatarMode === 'upload'
                      ? 'bg-white text-[#0071E3] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>อัปโหลดภาพจากเครื่อง</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAvatarMode('url')}
                  className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    avatarMode === 'url'
                      ? 'bg-white text-[#0071E3] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>ใส่ลิงก์ภาพ / ฮอตลิงก์</span>
                </button>
              </div>

              {/* Mode 1: Artistic Origami & Pop-Art Avatars (Matching image.png!) */}
              {avatarMode === 'artistic' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#1D1D1F]">
                        ชุดภาพโปรไฟล์แนวศิลปะ Origami & Pop-Art (25 แบบในภาพ)
                      </h4>
                      <p className="text-[11px] text-[#6E6E73]">
                        คลิกที่ภาพเพื่อเลือกเป็นรูปโปรไฟล์วงกลมทันที
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setArtisticFilter('all')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                          artisticFilter === 'all'
                            ? 'bg-[#0071E3] text-white'
                            : 'bg-black/[0.04] text-[#6E6E73] hover:bg-black/[0.08]'
                        }`}
                      >
                        ทั้งหมด (25)
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtisticFilter('origami')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                          artisticFilter === 'origami'
                            ? 'bg-[#0071E3] text-white'
                            : 'bg-black/[0.04] text-[#6E6E73] hover:bg-black/[0.08]'
                        }`}
                      >
                        สัตว์พับ Origami (10)
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtisticFilter('food')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                          artisticFilter === 'food'
                            ? 'bg-[#0071E3] text-white'
                            : 'bg-black/[0.04] text-[#6E6E73] hover:bg-black/[0.08]'
                        }`}
                      >
                        อาหาร & ญี่ปุ่น (8)
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtisticFilter('lifestyle')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                          artisticFilter === 'lifestyle'
                            ? 'bg-[#0071E3] text-white'
                            : 'bg-black/[0.04] text-[#6E6E73] hover:bg-black/[0.08]'
                        }`}
                      >
                        ไลฟ์สไตล์ (7)
                      </button>
                    </div>
                  </div>

                  {/* 25 Artistic Grid */}
                  <div className="grid grid-cols-5 gap-3 p-3 bg-slate-900 rounded-2xl max-h-[340px] overflow-y-auto">
                    {filteredArtisticAvatars.map((av) => {
                      const isSelected = selectedAvatar === av.dataUrl;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(av.dataUrl);
                            setUploadedFileName(null);
                            playNotificationSound('chime');
                          }}
                          className={`relative p-1 rounded-2xl transition-all flex flex-col items-center gap-1 group ${
                            isSelected
                              ? 'ring-3 ring-[#0071E3] bg-white/10 scale-105'
                              : 'hover:bg-white/5 hover:scale-105'
                          }`}
                          title={av.name}
                        >
                          <img
                            src={av.dataUrl}
                            alt={av.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-md"
                          />
                          <span className="text-[10px] text-slate-300 truncate w-full text-center group-hover:text-white">
                            {av.name.split(' (')[0]}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode 2: Direct File Upload */}
              {avatarMode === 'upload' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#1D1D1F]">
                      อัปโหลดรูปภาพโปรไฟล์จากอุปกรณ์ของคุณ
                    </h4>
                    <p className="text-[11px] text-[#6E6E73]">
                      เลือกไฟล์จากคอมพิวเตอร์หรือแท็บเล็ต รูปภาพจะถูกปรับเข้าสู่กรอบวงกลมอย่างสวยงาม
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                  />

                  {/* Drop zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                      isDragging
                        ? 'border-[#0071E3] bg-blue-50/60 scale-[1.01]'
                        : 'border-black/15 hover:border-[#0071E3] bg-slate-50/50 hover:bg-blue-50/20'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-[#0071E3] flex items-center justify-center shadow-xs">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1D1D1F]">
                        คลิกเพื่อเลือกไฟล์ หรือลากรูปภาพมาวางที่นี่
                      </p>
                      <p className="text-xs text-[#6E6E73] mt-1">
                        รองรับไฟล์ JPG, PNG, WebP, GIF ขนาดไม่เกิน 8 MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005bb5] shadow-xs"
                    >
                      เลือกไฟล์จากเครื่อง
                    </button>
                  </div>

                  {uploadError && (
                    <div className="p-3 rounded-xl bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {uploadedFileName && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold text-[#1D1D1F] truncate max-w-[280px]">
                            {uploadedFileName}
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            ขนาด: {uploadedFileSize} · อัปโหลดสำเร็จ
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveUploadedFile}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบภาพนี้</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: Custom Image URL / Hotlink */}
              {avatarMode === 'url' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="text-xs font-bold text-[#1D1D1F]">
                      ใส่ลิงก์รูปภาพโดยตรง (Direct Image URL / HTML Hotlink)
                    </h4>
                    <p className="text-[11px] text-[#6E6E73]">
                      คัดลอก URL ของรูปภาพจากอินเทอร์เน็ตเพื่อนำมาใช้เป็นภาพโปรไฟล์
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      placeholder="https://example.com/my-profile-photo.png"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-4 py-2.5 rounded-xl bg-[#0071E3] text-white font-semibold text-xs hover:bg-[#005bb5] transition-colors shrink-0 shadow-xs"
                    >
                      ใช้งานรูปนี้
                    </button>
                  </div>

                  <p className="text-[11px] text-[#86868B]">
                    รองรับ URL รูปภาพ HTTPS จาก Imgur, Cloudinary, หรือเว็บไซต์สถานศึกษา
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 1: General Info */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1D1D1F]">
                    ชื่อ-นามสกุล (ภาษาไทย) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={thaiName}
                    onChange={(e) => setThaiName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                    placeholder="เช่น นายวรเมธ วิริยพาณิชย์"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1D1D1F]">
                    ชื่อ-นามสกุล (ภาษาอังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={englishName}
                    onChange={(e) => setEnglishName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                    placeholder="เช่น Worameth Wiriyapanit"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1D1D1F]">
                    ชื่อเล่น (Nickname)
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                    placeholder="เช่น เมธ, ฟลุ๊ค, แนน"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1D1D1F]">
                    ห้องเรียน / กลุ่มสาระการเรียนรู้
                  </label>
                  <input
                    type="text"
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                    placeholder="เช่น ม.5/1 (1/2567)"
                  />
                </div>

                {currentUser.role === 'student' && (
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#1D1D1F]">
                      เลขที่ (Student Number)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1D1D1F]">
                    รหัสประจำตัว (ระบุโดยสถานศึกษา):
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={currentUser.studentId || currentUser.teacherId || currentUser.username || '-'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.04] text-[#6E6E73] font-mono outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-2">
                <label className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-pink-500" />
                  <span>คติประจำใจ / ข้อความสถานะ (Bio / Status)</span>
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="เขียนข้อความหรือคติประจำใจที่จะแสดงบนหน้าโปรไฟล์ของคุณ..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Contact & LINE Channels */}
          {activeTab === 'contact' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>เบอร์โทรศัพท์ติดต่อ (Phone Number)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>อีเมลสำหรับรับผลการเรียน & ประกาศ (Email)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@dontan.ac.th"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>LINE ID ส่วนตัว (สำหรับคุณครูติดต่อด่วน)</span>
                </label>
                <input
                  type="text"
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  placeholder="เช่น @student_line_id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#06C755] focus:bg-white outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-800">สถานะการแจ้งเตือนผ่าน LINE Notify:</p>
                  <p className="text-[11px] text-emerald-700">
                    {currentUser.lineConnected ? 'เชื่อมโยงกับ LINE เรียบร้อยแล้ว (รับการบ้านและคะแนนสอบทันที)' : 'ยังไม่ได้เชื่อมต่อกับ LINE Notify'}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  currentUser.lineConnected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-[#6E6E73]'
                }`}>
                  {currentUser.lineConnected ? 'ออนไลน์' : 'ออฟไลน์'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: Password & Security */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1 text-amber-900">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>ความปลอดภัยของบัญชีผู้ใช้</span>
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  หากต้องการเปลี่ยนรหัสผ่าน ให้กรอกรหัสผ่านใหม่ด้านล่าง หรือเว้นว่างไว้หากไม่ต้องการเปลี่ยนแปลง
                </p>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-red-50 text-[#DC2626] border border-red-200 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">รหัสผ่านใหม่ (New Password)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 4 ตัวอักษร)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#86868B] hover:text-[#1D1D1F]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">ยืนยันรหัสผ่านใหม่อีกครั้ง</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="พิมพ์รหัสผ่านใหม่อีกครั้งเพื่อยืนยัน"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                />
              </div>

              {/* Google Workspace status */}
              <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0071E3]" />
                  <span className="font-semibold text-[#1D1D1F]">การเชื่อมโยงกับบัญชี Google:</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  currentUser.googleLinked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-[#6E6E73]'
                }`}>
                  {currentUser.googleLinked ? 'เชื่อมโยงแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
                </span>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
            <div>
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>บันทึกโปรไฟล์เรียบร้อยแล้ว!</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-[#6E6E73] text-xs font-semibold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกการเปลี่ยนแปลง</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
