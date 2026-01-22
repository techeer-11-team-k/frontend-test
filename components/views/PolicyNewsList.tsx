import React, { useState, useEffect } from 'react';
import { ChevronRight, X, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  source: string;
  image: string;
  fullContent: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '시흥 배곧 신규 상업시설 입점',
    description: '대형 마트 및 쇼핑몰 입점으로 주변 부동산 가치 상승',
    date: '2024.12.12',
    category: '인프라',
    source: '시흥시청',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    fullContent: '시흥시 배곧신도시에 대규모 상업시설이 입점합니다. 이마트, 롯데마트 등 대형 마트와 함께 CGV 멀티플렉스 영화관, 올리브영, 다이소 등 생활 편의시설이 대거 들어설 예정입니다. 2025년 상반기 오픈을 목표로 현재 공사가 진행 중이며, 이에 따라 배곧 일대 아파트 시세가 평균 5-8% 상승할 것으로 전문가들은 예측하고 있습니다. 특히 배곧 호반써밋, 배곧 SK뷰 등 인근 단지의 거래량이 최근 20% 이상 증가한 것으로 나타났습니다.',
  },
  {
    id: '2',
    title: '김포 한강 신도시 개발 가속화',
    description: '인프라 구축 속도가 빨라지며 주변 시세 상승 기대',
    date: '2024.12.13',
    category: '시장동향',
    source: '부동산114',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop',
    fullContent: '김포 한강신도시 개발이 본격화되면서 지역 부동산 시장에 활기가 돌고 있습니다. GTX-D 노선 확정과 함께 김포골드라인 연장 사업이 추진되면서 서울 접근성이 크게 개선될 전망입니다. 한강변 공원 조성, 복합문화시설 건립 등 생활 인프라 확충도 동시에 진행 중입니다. 김포시에 따르면 2025년까지 총 3조 2천억 원 규모의 개발 사업이 완료될 예정이며, 이에 따라 장기동, 구래동 일대 아파트 시세가 10-15% 상승할 것으로 예상됩니다.',
  },
  {
    id: '3',
    title: '수원 영통구 신규 아파트 분양 예정',
    description: '2025년 상반기 분양 예정인 신규 아파트 단지 정보',
    date: '2024.12.14',
    category: '분양',
    source: 'LH',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    fullContent: '수원 영통구에 대규모 신규 아파트 단지가 분양됩니다. 총 2,500세대 규모의 이 단지는 삼성전자 본사와 인접해 있어 직주근접 수요가 높을 것으로 예상됩니다. 전용면적 59㎡~114㎡로 구성되며, 분양가는 3.3㎡당 1,800만~2,200만 원 수준으로 책정될 전망입니다. 청약 일정은 2025년 3월로 예정되어 있으며, 무순위 청약 물량도 일부 포함될 예정입니다. 영통구 평균 아파트 시세 대비 약 15% 저렴한 분양가로 실수요자들의 관심이 집중되고 있습니다.',
  },
  {
    id: '4',
    title: '안산지역 재개발 사업 본격 추진',
    description: '사업 구역 검토 단계 · 인허가/일정은 변동될 수 있어요',
    date: '2024.12.15',
    category: '정책',
    source: '국토교통부',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
    fullContent: '국토교통부가 안산시 단원구 일대 재개발 사업을 본격 추진합니다. 총 면적 45만㎡ 규모로 노후 주거지역을 현대적인 주거단지로 탈바꿈시키는 이번 사업은 2026년 착공, 2030년 완공을 목표로 하고 있습니다. 기존 거주민 이주 대책과 함께 공공임대주택 1,500세대가 포함될 예정입니다. 재개발 구역 내 토지 소유자들은 조합원 자격을 얻게 되며, 감정평가액 기준으로 새 아파트 입주권을 받을 수 있습니다. 다만 사업 추진 과정에서 인허가 절차 및 일정이 변동될 수 있으니 지속적인 관심이 필요합니다.',
  },
];

export const PolicyNewsList: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // 모달이 열릴 때 스크롤 고정
  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedNews]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '정책': 'bg-brand-blue text-white',
      '분양': 'bg-purple-500 text-white',
      '시장동향': 'bg-green-500 text-white',
      '인프라': 'bg-orange-500 text-white',
    };
    return colors[category] || 'bg-slate-500 text-white';
  };

  const handleExternalLink = (e: React.MouseEvent, news: NewsItem) => {
    e.stopPropagation();
    // 실제 링크가 있다면 여기서 열기
    console.log('External link clicked for:', news.title);
  };

  return (
    <>
      <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">정책 및 뉴스</h2>
          <button className="text-[13px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 hover:bg-slate-50 p-2 rounded-lg transition-colors">
            전체보기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 min-h-0">
          {mockNews.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="group relative flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
            >
              {/* 외부 링크 아이콘 */}
              <button
                onClick={(e) => handleExternalLink(e, news)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                title="원문 보기"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              
              {/* 썸네일 이미지 */}
              <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`flex-shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full ${getCategoryColor(news.category)}`}>
                    {news.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{news.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-[11px] text-slate-400">{news.source}</span>
                </div>
                <h3 className="text-[15px] font-black text-slate-900 mb-1 group-hover:text-brand-blue transition-colors line-clamp-1">
                  {news.title}
                </h3>
                <p className="text-[13px] text-slate-500 font-medium line-clamp-2">
                  {news.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedNews(null)}
          ></div>
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* 헤더 이미지 */}
            <div className="relative h-48 w-full flex-shrink-0">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${getCategoryColor(selectedNews.category)}`}>
                    {selectedNews.category}
                  </span>
                  <span className="text-[12px] text-white/90">{selectedNews.date}</span>
                  <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                  <span className="text-[12px] text-white/90">{selectedNews.source}</span>
                </div>
                <h2 className="text-2xl font-black text-white">{selectedNews.title}</h2>
              </div>
            </div>
            
            {/* 본문 */}
            <div className="p-6 overflow-y-auto">
              <p className="text-[15px] text-slate-700 font-medium leading-relaxed mb-6">
                {selectedNews.description}
              </p>
              
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-[15px] font-black text-slate-900 mb-4">상세 내용</h4>
                <p className="text-[14px] text-slate-600 leading-[1.8]">
                  {selectedNews.fullContent}
                </p>
              </div>
              
              {/* 관련 태그 */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-[12px] font-bold text-slate-500 mb-3">관련 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {['부동산', selectedNews.category, selectedNews.source, '투자', '시세'].map((tag, index) => (
                    <span key={index} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
