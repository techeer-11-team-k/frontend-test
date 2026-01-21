import React from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  source: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '안산지역 재개발 예정',
    description: '사업 구역 검토 단계 · 인허가/일정은 변동될 수 있어요',
    date: '2024.12.15',
    category: '정책',
    source: '국토교통부',
  },
  {
    id: '2',
    title: '수원 영통구 신규 아파트 분양 예정',
    description: '2025년 상반기 분양 예정인 신규 아파트 단지 정보',
    date: '2024.12.14',
    category: '분양',
    source: 'LH',
  },
  {
    id: '3',
    title: '김포 한강 신도시 개발 가속화',
    description: '인프라 구축 속도가 빨라지며 주변 시세 상승 기대',
    date: '2024.12.13',
    category: '시장동향',
    source: '부동산114',
  },
  {
    id: '4',
    title: '시흥 배곧 신규 상업시설 입점',
    description: '대형 마트 및 쇼핑몰 입점으로 주변 부동산 가치 상승',
    date: '2024.12.12',
    category: '인프라',
    source: '시흥시청',
  },
];

export const PolicyNewsList: React.FC = () => {
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
    <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">부동산 정책 및 뉴스</h2>
        <button className="text-[13px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 hover:bg-slate-50 p-2 rounded-lg transition-colors">
          전체보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 min-h-0">
        {mockNews.map((news) => (
          <div
            key={news.id}
            className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
          >
            <span className={`flex-shrink-0 text-[11px] font-black px-2.5 py-1 rounded-full ${getCategoryColor(news.category)}`}>
              {news.category}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-black text-slate-900 mb-1 group-hover:text-brand-blue transition-colors">
                {news.title}
              </h3>
              <p className="text-[13px] text-slate-500 font-medium mb-2 line-clamp-1">
                {news.description}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                <span>{news.date}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>{news.source}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
};
