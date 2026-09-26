import React, { useState } from 'react';
import { AnnouncementItem } from '../types';
import { 
  heroCampusImg, 
  scienceFairBanner 
} from '../data/mockData';
import { 
  Newspaper, 
  Calendar, 
  Download, 
  Share2, 
  ExternalLink, 
  Sparkles,
  ChevronRight,
  School
} from 'lucide-react';

interface NewsViewProps {
  announcements: AnnouncementItem[];
}

export const NewsView: React.FC<NewsViewProps> = ({ announcements }) => {
  const [selectedNews, setSelectedNews] = useState<AnnouncementItem | null>(null);

  const schoolGalleries = [
    {
      title: 'ภูมิทัศน์และศูนย์การเรียนรู้ อาคารเรียนเฉลิมพระเกียรติ',
      img: heroCampusImg,
      tag: 'บรรยากาศโรงเรียนดอนตาลวิทยา'
    },
    {
      title: 'นิทรรศการโครงงานสะเต็มและนวัตกรรมวิทยาศาสตร์',
      img: scienceFairBanner,
      tag: 'กิจกรรมวิชาการ ม.ปลาย'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium mb-1">
          <span>ข่าวสาร ประชาสัมพันธ์ และกิจกรรม</span>
          <span>•</span>
          <span className="text-[#0071E3]">โรงเรียนดอนตาลวิทยา</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          บอร์ดประชาสัมพันธ์ & กิจกรรมโรงเรียน
        </h1>
      </div>

      {/* Featured Campus Image Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-black/[0.06] group">
        <img
          src={heroCampusImg}
          alt="โรงเรียนดอนตาลวิทยา"
          referrerPolicy="no-referrer"
          className="w-full h-56 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium self-start mb-2">
            ภาพถ่ายสถาบันการศึกษา
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            ยินดีต้อนรับสู่ระบบสารสนเทศเพื่อการศึกษา โรงเรียนดอนตาลวิทยา
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl font-light">
            มุ่งมั่นจัดการศึกษาอย่างมีคุณภาพ พัฒนานวัตกรรมการเรียนรู้ดิจิทัล ส่งเสริมคุณธรรม จริยธรรม สู่ความเป็นเลิศทางวิชาการ
          </p>
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div className="space-y-3">
              {news.coverImage && (
                <div className="w-full h-40 rounded-2xl overflow-hidden">
                  <img
                    src={news.coverImage}
                    alt={news.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                <span className="font-semibold text-[#0071E3]">{news.category}</span>
                <span>{news.timeAgo}</span>
              </div>

              <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#0071E3] transition-colors">
                {news.title}
              </h3>

              <p className="text-xs text-[#6E6E73] leading-relaxed line-clamp-3">
                {news.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-[#86868B]">{news.author}</span>
              <button
                onClick={() => setSelectedNews(news)}
                className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
              >
                <span>อ่านต่อฉบับเต็ม</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Campus Activities Photo Cards */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-[#1D1D1F]">
          ภาพบรรยากาศการเรียนรู้ & ห้องปฏิบัติการ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {schoolGalleries.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-black/[0.06] shadow-xs space-y-2 overflow-hidden"
            >
              <img
                src={item.img}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover rounded-xl"
              />
              <div className="px-1">
                <span className="text-[10px] text-[#0071E3] font-semibold">{item.tag}</span>
                <p className="text-xs font-bold text-[#1D1D1F]">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-black/10 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            {selectedNews.coverImage && (
              <img
                src={selectedNews.coverImage}
                alt="ข่าว"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover rounded-2xl shadow-xs"
              />
            )}
            <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
              <span className="font-semibold text-[#0071E3]">{selectedNews.category}</span>
              <span>•</span>
              <span>{selectedNews.author}</span>
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F]">{selectedNews.title}</h3>
            <p className="text-xs sm:text-sm text-[#414753] leading-relaxed">
              {selectedNews.content}
            </p>
            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
              <button
                onClick={() => alert('เริ่มดาวน์โหลดไฟล์แนบข่าวสาร')}
                className="px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005bb5]"
              >
                ดาวน์โหลดเอกสารประกาศ
              </button>
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 rounded-xl bg-black/[0.04] text-[#6E6E73] text-xs font-medium"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
