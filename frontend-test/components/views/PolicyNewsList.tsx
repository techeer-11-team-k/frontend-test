import React, { useState, useMemo } from 'react';
import { ChevronRight, X, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  source: string;
  content: string;
  image: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '안산지역 재개발 예정',
    description: '사업 구역 검토 단계 · 인허가/일정은 변동될 수 있어요',
    date: '2024.12.15',
    category: '정책',
    source: '국토교통부',
    content: '국토교통부는 안산 지역의 노후 주거지 정비를 위한 재개발 사업을 본격 추진한다고 밝혔습니다. 해당 사업은 안산시 상록구 일대 약 15만㎡ 규모로, 2025년 상반기 중 사업 구역 지정을 목표로 하고 있습니다. 이번 재개발을 통해 약 3,000세대 규모의 신규 아파트가 공급될 예정이며, 주변 인프라 개선도 함께 진행됩니다.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
  },
  {
    id: '2',
    title: '수원 영통구 신규 아파트 분양 예정',
    description: '2025년 상반기 분양 예정인 신규 아파트 단지 정보',
    date: '2024.12.14',
    category: '분양',
    source: 'LH',
    content: '한국토지주택공사(LH)는 수원 영통구에 신규 아파트 단지를 2025년 상반기에 분양할 예정이라고 발표했습니다. 총 1,200세대 규모로 전용면적 59㎡~84㎡ 타입으로 구성됩니다. 분양가는 주변 시세 대비 80% 수준으로 책정될 예정이며, 신혼부부 및 생애최초 특별공급 물량이 50% 이상 배정됩니다.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    title: '김포 한강 신도시 개발 가속화',
    description: '인프라 구축 속도가 빨라지며 주변 시세 상승 기대',
    date: '2024.12.13',
    category: '시장동향',
    source: '부동산114',
    content: '김포 한강신도시의 인프라 개발이 예상보다 빠르게 진행되고 있습니다. 특히 GTX-D 노선 확정과 함께 김포골드라인 연장이 추진되면서 교통 여건이 크게 개선될 전망입니다. 이에 따라 주변 아파트 시세도 상승세를 보이고 있으며, 전문가들은 향후 2~3년간 10~15% 상승을 예상하고 있습니다.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    title: '시흥 배곧 신규 상업시설 입점',
    description: '대형 마트 및 쇼핑몰 입점으로 주변 부동산 가치 상승',
    date: '2024.12.12',
    category: '인프라',
    source: '시흥시청',
    content: '시흥 배곧 신도시에 대형 복합쇼핑몰이 2025년 하반기 개장을 목표로 건설 중입니다. 연면적 약 10만㎡ 규모로 대형마트, 영화관, 다양한 브랜드 매장이 입점할 예정입니다. 이로 인해 배곧 지역의 생활 인프라가 크게 개선될 것으로 기대되며, 주변 아파트 시세에도 긍정적인 영향을 미칠 것으로 전망됩니다.',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=400&fit=crop',
  },
];

export const PolicyNewsList: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Sort news by date (oldest first, so 12일 → 13일 → 14일 → 15일)
  const sortedNews = useMemo(() => {
    return [...mockNews].sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '-'));
      const dateB = new Date(b.date.replace(/\./g, '-'));
      return dateA.getTime() - dateB.getTime();
    });
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '정책': 'bg-brand-blue text-white',
      '분양': 'bg-purple-500 text-white',
      '시장동향': 'bg-green-500 text-white',
      '인프라': 'bg-orange-500 text-white',
    };
    return colors[category] || 'bg-slate-500 text-white';
  };

  return (
    <>
      {/* News Detail Modal */}
      {selectedNews && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
          onClick={() => setSelectedNews(null)}
          onWheel={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div 
            className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-enter max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header Image - Larger */}
            <div className="relative h-64 overflow-hidden flex-shrink-0">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className={`inline-block text-[12px] font-black px-3 py-1.5 rounded-full mb-3 ${getCategoryColor(selectedNews.category)}`}>
                  {selectedNews.category}
                </span>
                <h2 className="text-2xl font-black text-white leading-tight">{selectedNews.title}</h2>
              </div>
            </div>
            
            {/* Content - Scrollable */}
            <div 
              className="flex-1 overflow-y-auto overscroll-contain p-8"
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-[13px] text-slate-400 font-medium mb-6 pb-4 border-b border-slate-100">
                <span className="text-slate-600 font-bold">{selectedNews.date}</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                <span>{selectedNews.source}</span>
              </div>
              <p className="text-[16px] text-slate-700 leading-[1.8] whitespace-pre-wrap">
                {selectedNews.content}
              </p>
              
              {/* Related Tags */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[12px] font-bold text-slate-400 mb-3">관련 지역</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-full">
                    {selectedNews.category === '정책' ? '안산시' : 
                     selectedNews.category === '분양' ? '수원시 영통구' :
                     selectedNews.category === '시장동향' ? '김포시' : '시흥시 배곧동'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">정책 및 뉴스</h2>
          <button className="text-[13px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 hover:bg-slate-50 p-2 rounded-lg transition-colors">
            전체보기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 min-h-0">
          {sortedNews.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="group relative p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
            >
              {/* External Link Icon - Top Right */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <span className={`flex-shrink-0 text-[11px] font-black px-2.5 py-1 rounded-full ${getCategoryColor(news.category)}`}>
                  {news.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{news.date}</span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-slate-400 font-medium">{news.source}</span>
              </div>
              <h3 className="text-[15px] font-black text-slate-900 mb-1.5 group-hover:text-brand-blue transition-colors pr-6">
                {news.title}
              </h3>
              <p className="text-[13px] text-slate-500 font-medium line-clamp-2">
                {news.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
