import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Star, Plus, ArrowRightLeft, Building2, MapPin, Calendar, Car, ChevronDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProfessionalChart } from '../ui/ProfessionalChart';
import { ToggleButtonGroup } from '../ui/ToggleButtonGroup';

interface PropertyDetailProps {
  propertyId: string;
  onBack: () => void;
  isCompact?: boolean;
  isSidebar?: boolean;
}

type TabType = 'chart' | 'info';
type ChartType = '매매' | '전세' | '월세';
type TransactionType = '전체' | '매매' | '전/월세';

const generateChartData = (type: ChartType) => {
    const data = [];
    const startDate = new Date('2023-01-01');
    let basePrice = type === '매매' ? 32000 : (type === '전세' ? 24000 : 100); 
    const volatility = type === '월세' ? 5 : 500;
    
    for (let i = 0; i < 365; i += 3) { 
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const change = (Math.random() - 0.48) * volatility; 
        basePrice += change;
        data.push({
            time: date.toISOString().split('T')[0],
            value: Math.floor(basePrice)
        });
    }
    return data;
};

const propertyDataMap: Record<string, typeof detailData1> = {
  '1': {
    id: '1',
    name: '래미안 원베일리',
    location: '서울시 서초구 반포동',
    currentPrice: 42500, 
    diff: 4500, 
    diffRate: 11.8,
    jeonsePrice: 32000,
    jeonseRatio: 75.3,
    info: [
      { label: '전용면적', value: '84.00㎡' },
      { label: '공급면적', value: '114.00㎡' },
      { label: '세대수', value: '892세대' },
      { label: '총 주차대수', value: '1,200대 (세대당 1.3대)' },
      { label: '사용승인일', value: '2015.03.20' },
      { label: '건설사', value: '삼성물산(주)' },
      { label: '난방', value: '지역난방' },
      { label: '현관구조', value: '계단식' },
    ],
    transactions: [
        { date: '24.03.20', floor: '25층', price: 42500, type: '매매' },
        { date: '24.03.15', floor: '18층', price: 42000, type: '매매' },
        { date: '24.03.10', floor: '12층', price: 41500, type: '매매' },
        { date: '24.03.05', floor: '20층', price: 32000, type: '전세' },
        { date: '24.02.28', floor: '15층', price: 41000, type: '매매' },
        { date: '24.02.20', floor: '8층', price: 40000, type: '매매' },
        { date: '24.02.15', floor: '22층', price: 31500, type: '전세' },
        { date: '24.02.01', floor: '10층', price: 39500, type: '매매' },
        { date: '24.01.28', floor: '5층', price: 38000, type: '매매' },
        { date: '24.01.10', floor: '16층', price: 31000, type: '전세' },
    ],
    news: [
        { title: "반포 한강뷰 아파트 가격 상승세 지속", source: "부동산경제", time: "2시간 전" },
        { title: "서초구 전세가율 상승, 갭투자 관심 증가", source: "머니투데이", time: "5시간 전" },
        { title: "래미안 원베일리 신고가 갱신", source: "한국경제", time: "1일 전" },
    ],
    neighbors: [
        { name: '래미안 반포리버뷰', price: 45000, diff: 5.9 },
        { name: '반포 힐스테이트', price: 48000, diff: 12.9 },
        { name: '반포 자이', price: 41000, diff: -3.5 },
        { name: '래미안 반포팰리스', price: 52000, diff: 22.4 },
    ],
  },
  '2': {
    id: '2',
    name: '래미안 강남파크',
    location: '서울시 강남구 역삼동',
    currentPrice: 58300, 
    diff: 4800, 
    diffRate: 8.2,
    jeonsePrice: 45000,
    jeonseRatio: 77.2,
    info: [
      { label: '전용면적', value: '114.00㎡' },
      { label: '공급면적', value: '152.00㎡' },
      { label: '세대수', value: '1,234세대' },
      { label: '총 주차대수', value: '1,800대 (세대당 1.5대)' },
      { label: '사용승인일', value: '2018.06.15' },
      { label: '건설사', value: '삼성물산(주)' },
      { label: '난방', value: '지역난방' },
      { label: '현관구조', value: '계단식' },
    ],
    transactions: [
        { date: '24.03.22', floor: '30층', price: 58300, type: '매매' },
        { date: '24.03.18', floor: '25층', price: 57500, type: '매매' },
        { date: '24.03.12', floor: '20층', price: 57000, type: '매매' },
        { date: '24.03.08', floor: '28층', price: 45000, type: '전세' },
        { date: '24.02.28', floor: '15층', price: 56000, type: '매매' },
        { date: '24.02.20', floor: '10층', price: 55000, type: '매매' },
        { date: '24.02.15', floor: '22층', price: 44500, type: '전세' },
        { date: '24.02.01', floor: '18층', price: 54000, type: '매매' },
        { date: '24.01.28', floor: '8층', price: 53000, type: '매매' },
        { date: '24.01.10', floor: '24층', price: 44000, type: '전세' },
    ],
    news: [
        { title: "강남구 투기 규제지역 지정, 시장 영향 주목", source: "부동산경제", time: "1시간 전" },
        { title: "역삼동 아파트 가격 상승세 둔화", source: "머니투데이", time: "4시간 전" },
        { title: "래미안 강남파크 전세가율 상승", source: "한국경제", time: "1일 전" },
    ],
    neighbors: [
        { name: '래미안 역삼', price: 56000, diff: -3.9 },
        { name: '역삼 힐스테이트', price: 61000, diff: 4.6 },
        { name: '역삼 자이', price: 55000, diff: -5.7 },
        { name: '래미안 강남힐스', price: 65000, diff: 11.5 },
    ],
  }
};

const detailData1 = {
  id: '1',
  name: '수원 영통 황골마을 1단지',
  location: '경기도 수원시 영통구 영통동',
  currentPrice: 32500, 
  diff: 1500, 
  diffRate: 4.8,
  jeonsePrice: 24000,
  jeonseRatio: 73.8,
  info: [
    { label: '전용면적', value: '59.99㎡' },
    { label: '공급면적', value: '81.53㎡' },
    { label: '세대수', value: '3,129세대' },
    { label: '총 주차대수', value: '2,500대 (세대당 0.8대)' },
    { label: '사용승인일', value: '1997.12.15' },
    { label: '건설사', value: '현대건설(주)' },
    { label: '난방', value: '지역난방/열병합' },
    { label: '현관구조', value: '복도식' },
  ],
  transactions: [
      { date: '24.03.20', floor: '15층', price: 32500, type: '매매' },
      { date: '24.03.19', floor: '10층', price: 32000, type: '매매' },
      { date: '24.03.15', floor: '8층', price: 31800, type: '매매' },
      { date: '24.03.12', floor: '12층', price: 24000, type: '전세' },
      { date: '24.02.28', floor: '19층', price: 31500, type: '매매' },
      { date: '24.02.20', floor: '5층', price: 30500, type: '매매' },
      { date: '24.02.15', floor: '7층', price: 23500, type: '전세' },
      { date: '24.02.01', floor: '11층', price: 31000, type: '매매' },
      { date: '24.01.28', floor: '3층', price: 29500, type: '매매' },
      { date: '24.01.10', floor: '9층', price: 23000, type: '전세' },
  ],
  news: [
      { title: "영통 리모델링 기대감 솔솔... 저가 매수세 유입", source: "부동산경제", time: "2시간 전" },
      { title: "수원 영통구 전세가율 상승, 갭투자 다시 고개드나", source: "머니투데이", time: "5시간 전" },
      { title: "GTX-C 착공 호재, 인근 단지 신고가 갱신", source: "한국경제", time: "1일 전" },
  ],
  neighbors: [
      { name: '황골마을 주공 2단지', price: 31000, diff: 0.5 },
      { name: '청명마을 주공 4단지', price: 34500, diff: -0.2 },
      { name: '영통 벽적골 주공', price: 33000, diff: 0.0 },
      { name: '신나무실 건영 2차', price: 38000, diff: 1.2 },
  ],
};

const getDetailData = (propertyId: string) => {
  return propertyDataMap[propertyId] || detailData1;
};

// Updated FormatPrice: Numbers Bold, Units Medium, Same Size
const FormatPrice = ({ val, sizeClass = "text-[28px]" }: { val: number, sizeClass?: string }) => {
  const eok = Math.floor(val / 10000);
  const man = val % 10000;
  
  if (eok === 0) {
    // 1억 미만인 경우
    return (
      <span className={`tabular-nums tracking-tight text-slate-900 ${sizeClass}`}>
        <span className="font-bold">{man.toLocaleString()}</span>
      </span>
    );
  }
  
  return (
      <span className={`tabular-nums tracking-tight text-slate-900 ${sizeClass}`}>
          <span className="font-bold">{eok}</span>
          <span className="font-bold text-slate-900 ml-0.5 mr-1.5">억</span>
          {man > 0 && (
            <>
                <span className="font-bold">{man.toLocaleString()}</span>
            </>
          )}
      </span>
  );
};

const NeighborItem: React.FC<{ item: typeof detailData.neighbors[0], currentPrice: number }> = ({ item, currentPrice }) => {
    const diffRatio = ((item.price - currentPrice) / currentPrice) * 100;
    const isHigher = diffRatio > 0;
    
    return (
        <div className="flex justify-between p-4 text-[15px]">
            <span className="font-medium text-slate-500">
                {item.name} <span className={`text-[15px] font-bold px-1.5 py-0.5 rounded ${isHigher ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {Math.abs(diffRatio).toFixed(1)}% {isHigher ? '비쌈' : '저렴'}
                </span>
            </span>
            <span className="font-bold text-slate-900 text-right tabular-nums">
                <FormatPrice val={item.price} sizeClass="text-[15px]" />
            </span>
        </div>
    );
};

const TransactionRow: React.FC<{ tx: typeof detailData.transactions[0] }> = ({ tx }) => {
    const typeColor = tx.type === '매매' ? 'text-slate-900' : (tx.type === '전세' ? 'text-indigo-600' : 'text-emerald-600');
    
    return (
        <div className="grid grid-cols-4 py-4 px-5 text-[15px] border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors items-center h-[52px]">
            <div className="text-slate-500 text-[15px] font-medium tabular-nums text-center">{tx.date}</div>
            <div className={`font-bold ${typeColor} text-center text-[15px]`}>{tx.type}</div>
            <div className="text-slate-500 text-center text-[15px] tabular-nums">{tx.floor}</div>
            <div className="text-center tabular-nums">
                <FormatPrice val={tx.price} sizeClass="text-[15px]" />
            </div>
        </div>
    );
}

const CustomDropdown: React.FC<{ 
    value: TransactionType;
    onChange: (value: TransactionType) => void;
    options: { value: TransactionType; label: string }[];
}> = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[12px] font-bold bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 focus:ring-0 focus:border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
                <span>{selectedOption?.label || value}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div 
                className={`absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 transition-all duration-200 ease-out origin-top ${
                    isOpen 
                        ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto max-h-96' 
                        : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none max-h-0 overflow-hidden'
                }`}
            >
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => {
                            onChange(option.value);
                            setIsOpen(false);
                        }}
                        className={`w-full text-left text-[12px] font-bold py-2 px-3 hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            value === option.value ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 면적별 가격 데이터 생성 함수
const getAreaBasedData = (basePrice: number, area: string) => {
  const areaMultiplier: Record<string, number> = {
    '84': 1.0,
    '90': 1.15,
    '102': 1.35,
    '114': 1.55,
  };
  const multiplier = areaMultiplier[area] || 1.0;
  return Math.floor(basePrice * multiplier);
};

// 면적별 거래 내역 생성 함수
const generateAreaTransactions = (baseTransactions: typeof detailData1.transactions, area: string) => {
  return baseTransactions.map(tx => ({
    ...tx,
    price: getAreaBasedData(tx.price, area),
  }));
};

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ propertyId, onBack, isCompact = false, isSidebar = false }) => {
  const [activeTab, setActiveTab] = useState<TabType>('chart');
  const [chartType, setChartType] = useState<ChartType>('매매');
  const [chartData, setChartData] = useState(generateChartData('매매'));
  const [chartPeriod, setChartPeriod] = useState('1년');
  const [isFavorite, setIsFavorite] = useState(false);
  const [txFilter, setTxFilter] = useState<TransactionType>('전체');
  const [selectedArea, setSelectedArea] = useState('84');
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const detailData = getDetailData(propertyId);
  
  // 면적별 데이터 계산
  const areaBasedPrice = getAreaBasedData(detailData.currentPrice, selectedArea);
  const areaBasedDiff = getAreaBasedData(detailData.diff, selectedArea);
  const areaBasedDiffRate = detailData.diffRate; // 비율은 동일
  const areaBasedTransactions = generateAreaTransactions(detailData.transactions, selectedArea);

  useEffect(() => {
      setChartData(generateChartData(chartType));
  }, [chartType]);

  const filteredTransactions = areaBasedTransactions.filter(tx => 
      txFilter === '전체' ? true : tx.type === txFilter
  );

  return (
    <div className={`${isSidebar ? 'bg-transparent' : 'bg-transparent'} min-h-full font-sans text-slate-900 ${isCompact ? 'p-0' : ''} ${isSidebar ? 'p-0' : ''}`}>
      
      {!isCompact && (
          <>
            {!isSidebar && (
              <>
              </>
            )}

            <div className={`${isSidebar ? 'p-5 space-y-5' : 'max-w-[1400px] mx-auto'}`}>
                
                {/* 1. Header Card: Refined Layout (Stock App Style) */}
                <Card className={`${isSidebar ? 'bg-transparent shadow-none border-0 p-5' : 'bg-white p-8'}`}>
                    {/* Apartment Name */}
                    {!isSidebar && (
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h1 className="text-2xl font-bold text-slate-900 leading-none">{detailData.name}</h1>
                            </div>
                            <button 
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isFavorite ? 'bg-yellow-50 text-yellow-500' : 'text-slate-400 hover:bg-slate-100'}`}
                            >
                                <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500' : ''}`} />
                            </button>
                        </div>
                    )}
                    
                    {/* Middle Row: Big Price & Change */}
                    <div className={`${isSidebar ? 'mt-0' : 'mt-0'} flex items-center justify-between gap-4 flex-wrap`}>
                        <div className="flex items-center gap-4 flex-wrap">
                            <FormatPrice val={isSidebar ? areaBasedPrice : detailData.currentPrice} sizeClass={isSidebar ? "text-[32px]" : "text-[42px]"} />
                            
                            <div className="flex flex-col items-center leading-none">
                                <span className={`${isSidebar ? 'text-[16px]' : 'text-[15px]'} font-medium text-slate-400 mb-0.5`}>지난 실거래가 대비</span>
                                <div className={`${isSidebar ? 'text-[16px]' : 'text-[15px]'} font-bold flex items-center gap-1 tabular-nums ${areaBasedDiffRate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                    {areaBasedDiffRate >= 0 ? '▲' : '▼'} {Math.abs(isSidebar ? areaBasedDiff : detailData.diff).toLocaleString()} ({Math.abs(areaBasedDiffRate)}%)
                                </div>
                            </div>
                        </div>
                        {!isSidebar && (
                            <div className="flex flex-row gap-2">
                                <button className="bg-white text-slate-700 border border-slate-300 text-[13px] font-bold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5">
                                    <ArrowRightLeft className="w-3.5 h-3.5" />
                                    비교함 담기
                                </button>
                                <button className="bg-slate-900 text-white text-[13px] font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                                    내 자산 추가
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className={`h-px w-full bg-slate-100 ${isSidebar ? 'my-4' : 'my-6'}`}></div>

                    {/* Bottom Row: Info Specs */}
                    <div className={`grid ${isSidebar ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} ${isSidebar ? 'gap-5' : 'gap-4'}`}>
                        <div className="flex flex-col gap-1.5">
                            <span className={`${isSidebar ? 'text-[15px]' : 'text-[13px]'} font-bold text-slate-400 flex items-center gap-1.5`}>
                                위치
                                <MapPin className={`${isSidebar ? 'w-3.5 h-3.5' : 'w-3 h-3'} text-slate-300`} />
                            </span>
                            <span className={`${isSidebar ? 'text-[17px]' : 'text-[15px]'} font-bold text-slate-700 truncate`}>
                                {detailData.location}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className={`${isSidebar ? 'text-[15px]' : 'text-[13px]'} font-bold text-slate-400 flex items-center gap-1.5`}>
                                건축연도
                                <Calendar className={`${isSidebar ? 'w-3.5 h-3.5' : 'w-3 h-3'} text-slate-300`} />
                            </span>
                            <span className={`${isSidebar ? 'text-[17px]' : 'text-[15px]'} font-bold text-slate-700`}>
                                1997년 (27년차)
                            </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className={`${isSidebar ? 'text-[15px]' : 'text-[13px]'} font-bold text-slate-400 flex items-center gap-1.5`}>
                                세대수
                                <Building2 className={`${isSidebar ? 'w-3.5 h-3.5' : 'w-3 h-3'} text-slate-300`} />
                            </span>
                            <span className={`${isSidebar ? 'text-[17px]' : 'text-[15px]'} font-bold text-slate-700`}>
                                3,129세대
                            </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className={`${isSidebar ? 'text-[15px]' : 'text-[13px]'} font-bold text-slate-400 flex items-center gap-1.5`}>
                                주차
                                <Car className={`${isSidebar ? 'w-3.5 h-3.5' : 'w-3 h-3'} text-slate-300`} />
                            </span>
                            <span className={`${isSidebar ? 'text-[17px]' : 'text-[15px]'} font-bold text-slate-700`}>
                                세대당 0.8대
                            </span>
                        </div>
                    </div>

                    {/* ChevronDown icon at bottom center - Expandable */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                        >
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isInfoExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Expanded Info Section */}
                    <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            isInfoExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className={`mt-4 pt-4 border-t border-slate-100 transition-all duration-500 ${
                            isInfoExpanded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                        }`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {detailData.info
                                    .filter(info => {
                                        // 기존에 표시된 정보 제외
                                        const excludedLabels = ['세대수'];
                                        return !excludedLabels.includes(info.label);
                                    })
                                    .map((info, i) => (
                                        <div 
                                            key={i} 
                                            className="flex justify-between p-3 text-[14px] hover:bg-slate-50 rounded-lg transition-all duration-300"
                                            style={{
                                                transitionDelay: isInfoExpanded ? `${i * 50}ms` : `${(detailData.info.length - i) * 30}ms`,
                                                opacity: isInfoExpanded ? 1 : 0,
                                                transform: isInfoExpanded ? 'translateY(0)' : 'translateY(-10px)'
                                            }}
                                        >
                                            <span className="font-medium text-slate-500">{info.label}</span>
                                            <span className="font-bold text-slate-900 text-right">{info.value}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {isSidebar ? (
                    <>
                        {/* Sidebar Layout: Single Column */}
                        <div className="space-y-4">
                        {/* Area Tabs Container - Wraps all content below */}
                        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden">
                            {/* Area Tabs */}
                            <div className="flex bg-white rounded-t-xl p-1.5 gap-2 overflow-x-auto border-b border-slate-200/50">
                                {['84', '90', '102', '114'].map(area => (
                                    <button
                                        key={area}
                                        onClick={() => setSelectedArea(area)}
                                        className={`${isSidebar ? 'px-4 py-2 text-[15px]' : 'px-4 py-2 text-[13px]'} font-bold rounded-lg transition-all whitespace-nowrap ${
                                            selectedArea === area
                                            ? 'bg-slate-900 text-white border border-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
                                        }`}
                                    >
                                        {area}m²
                                    </button>
                                ))}
                            </div>

                            {/* Content wrapped by area tabs */}
                            <div className="p-5 space-y-4">
                        {/* Chart - List Style */}
                        <div className="bg-transparent flex flex-col">
                            <div className={`flex items-center justify-between ${isSidebar ? 'mb-5' : 'mb-6'} flex-wrap gap-2`}>
                                <ToggleButtonGroup
                                    options={['매매', '전세', '월세']}
                                    value={chartType}
                                    onChange={(value) => setChartType(value as ChartType)}
                                    className="bg-slate-100/80"
                                />
                                
                                {/* Segmented Control for Period */}
                                <ToggleButtonGroup
                                    options={['1년', '3년', '전체']}
                                    value={chartPeriod}
                                    onChange={(value) => setChartPeriod(value)}
                                    className="bg-slate-100/80"
                                />
                            </div>

                            <div className="flex-1 w-full relative">
                                <ProfessionalChart 
                                    data={chartData} 
                                    height={isSidebar ? 240 : 320} 
                                    lineColor={chartType === '매매' ? '#3182F6' : (chartType === '전세' ? '#10b981' : '#f59e0b')}
                                    areaTopColor={chartType === '매매' ? 'rgba(49, 130, 246, 0.15)' : (chartType === '전세' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)')}
                                />
                            </div>
                        </div>

                        {/* Transaction Table - List Style */}
                        <div className="bg-transparent overflow-hidden flex flex-col" style={{ maxHeight: isSidebar ? '360px' : '500px' }}>
                            <div className={`${isSidebar ? 'pb-3' : 'pb-3'} border-b border-slate-200/50 flex justify-between items-center bg-transparent sticky top-0 z-10`}>
                                <h3 className={`${isSidebar ? 'text-[19px]' : 'text-[16px]'} font-black text-slate-900`}>실거래 내역</h3>
                                <select 
                                    value={txFilter}
                                    onChange={(e) => setTxFilter(e.target.value as TransactionType)}
                                    className={`${isSidebar ? 'text-[14px]' : 'text-[11px]'} font-bold bg-white border border-slate-200 rounded-lg py-1.5 px-3 focus:ring-0 focus:border-slate-300`}
                                >
                                    <option value="전체">전체</option>
                                    <option value="매매">매매</option>
                                    <option value="전세">전세</option>
                                </select>
                            </div>
                            
                            <div className={`grid grid-cols-4 ${isSidebar ? 'py-3 px-0 text-[14px]' : 'py-3 px-0 text-[12px]'} font-bold text-slate-500 border-b border-slate-200/50 mt-3`}>
                                <div className={isSidebar ? '' : ''}>일자</div>
                                <div className="text-center">구분</div>
                                <div className="text-center">층</div>
                                <div className={`text-right ${isSidebar ? '' : ''}`}>거래액</div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {filteredTransactions.map((tx, i) => (
                                    <div key={i} className={`grid grid-cols-4 ${isSidebar ? 'py-3' : 'py-4'} text-[15px] border-b border-slate-100/50 last:border-0 hover:bg-slate-50/50 transition-colors items-center ${isSidebar ? 'h-[48px]' : 'h-[52px]'}`}>
                                        <div className={`text-slate-500 ${isSidebar ? 'text-[14px]' : 'text-[12px]'} font-medium tabular-nums`}>{tx.date}</div>
                                        <div className={`font-bold ${tx.type === '매매' ? 'text-slate-900' : (tx.type === '전세' ? 'text-indigo-600' : 'text-emerald-600')} text-center ${isSidebar ? 'text-[14px]' : 'text-[13px]'}`}>{tx.type}</div>
                                        <div className={`text-slate-500 text-center ${isSidebar ? 'text-[14px]' : 'text-[12px]'} tabular-nums`}>{tx.floor}</div>
                                        <div className={`text-right tabular-nums ${isSidebar ? '' : ''}`}>
                                            <FormatPrice val={tx.price} sizeClass={isSidebar ? "text-[15px]" : "text-[15px]"} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Neighbors List - List Style (No Card) */}
                        <div className="bg-transparent overflow-hidden">
                            <div className={`${isSidebar ? 'pb-3' : 'pb-3'} border-b border-slate-200/50`}>
                                <h3 className={`${isSidebar ? 'text-[19px]' : 'text-[17px]'} font-black text-slate-900`}>주변 시세 비교</h3>
                            </div>
                            <div className="overflow-hidden flex flex-col divide-y divide-slate-100/50 mt-3">
                                {detailData.neighbors.map((item, i) => (
                                    <NeighborItem key={i} item={item} currentPrice={areaBasedPrice} />
                                ))}
                            </div>
                        </div>

                        {/* Info List - List Style (No Card) */}
                        <div className="bg-transparent overflow-hidden">
                            <div className={`${isSidebar ? 'pb-3' : 'pb-3'} border-b border-slate-200/50`}>
                                <h3 className={`${isSidebar ? 'text-[16px]' : 'text-[16px]'} font-black text-slate-900`}>단지 정보</h3>
                            </div>
                            <div className="divide-y divide-slate-100/50 mt-3">
                                {detailData.info.map((info, i) => (
                                    <div key={i} className={`flex justify-between ${isSidebar ? 'py-3 text-[15px]' : 'py-3 text-[14px]'}`}>
                                        <span className="font-medium text-slate-500">{info.label}</span>
                                        <span className="font-bold text-slate-900 text-right">{info.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                            </div>
                        </div>
                    </div>
                    </>
                ) : (
                    <>
                        {/* Full Layout: Multi Column */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        
                        {/* 2. Chart Card */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="p-6 bg-white h-[500px] flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <ToggleButtonGroup
                                        options={['매매', '전세', '월세']}
                                        value={chartType}
                                        onChange={(value) => setChartType(value as ChartType)}
                                    />
                                    
                                    {/* Segmented Control for Period */}
                                    <ToggleButtonGroup
                                        options={['1년', '3년', '전체']}
                                        value={chartPeriod}
                                        onChange={(value) => setChartPeriod(value)}
                                    />
                                </div>

                                <div className="flex-1 w-full relative">
                                    <ProfessionalChart 
                                        data={chartData} 
                                        height={320} 
                                        lineColor={chartType === '매매' ? '#3182F6' : (chartType === '전세' ? '#10b981' : '#f59e0b')}
                                        areaTopColor={chartType === '매매' ? 'rgba(49, 130, 246, 0.15)' : (chartType === '전세' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)')}
                                    />
                                </div>
                            </Card>

                            {/* Neighbors List */}
                            <Card className="bg-white overflow-hidden flex flex-col h-[400px]">
                                <div className="p-5 border-b border-slate-100 flex-shrink-0">
                                    <h3 className="text-[16px] font-black text-slate-900">주변 시세 비교</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50" style={{ scrollbarGutter: 'stable' }}>
                                    {detailData.neighbors.map((item, i) => (
                                        <NeighborItem key={i} item={item} currentPrice={detailData.currentPrice} />
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* 3. Transaction Table & Info */}
                        <div className="lg:col-span-1 space-y-8">
                            <Card className="bg-white overflow-hidden flex flex-col h-[500px]">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <h3 className="text-[16px] font-black text-slate-900">실거래 내역</h3>
                                    <CustomDropdown
                                        value={txFilter}
                                        onChange={setTxFilter}
                                        options={[
                                            { value: '전체', label: '전체' },
                                            { value: '매매', label: '매매' },
                                            { value: '전세', label: '전세' }
                                        ]}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-4 py-3 px-4 bg-slate-50/50 text-[12px] font-bold text-slate-500 border-b border-slate-100">
                                    <div className="pl-4">일자</div>
                                    <div className="text-center">구분</div>
                                    <div className="text-center">층</div>
                                    <div className="text-right pr-4">거래액</div>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ scrollbarGutter: 'stable' }}>
                                    {filteredTransactions.map((tx, i) => (
                                        <TransactionRow key={i} tx={tx} />
                                    ))}
                                </div>
                            </Card>

                            <Card className="bg-white overflow-hidden flex flex-col h-[400px]">
                                <div className="p-5 border-b border-slate-100 flex-shrink-0">
                                    <h3 className="text-[16px] font-black text-slate-900">단지 정보</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50" style={{ scrollbarGutter: 'stable' }}>
                                    {detailData.info.map((info, i) => (
                                        <div key={i} className="flex justify-between p-4 text-[14px]">
                                            <span className="font-medium text-slate-500">{info.label}</span>
                                            <span className="font-bold text-slate-900 text-right">{info.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                    </>
                )}
            </div>
          </>
      )}

      {isCompact && (
          <>
              {/* Compact View for Map Side Panel */}
              <div className="px-5 py-4 bg-white border-b border-slate-100">
               <div className="flex flex-col gap-1">
                    <FormatPrice val={detailData.currentPrice} sizeClass="text-2xl" />
                    <span className={`text-[15px] font-bold flex items-center tabular-nums ${detailData.diffRate >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                        {detailData.diffRate >= 0 ? '▲' : '▼'} {Math.abs(detailData.diff)} ({Math.abs(detailData.diffRate)}%)
                    </span>
               </div>
               
               <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  {[
                      { id: 'chart', label: '차트' },
                      { id: 'info', label: '정보' },
                  ].map(tab => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as TabType)}
                          className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${
                              activeTab === tab.id 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-400 hover:bg-slate-50'
                          }`}
                      >
                          {tab.label}
                      </button>
                  ))}
               </div>
               
               {activeTab === 'chart' && (
                   <div className="mt-4">
                       <ProfessionalChart data={chartData} height={200} />
                   </div>
               )}
               {activeTab === 'info' && (
                   <div className="mt-4 space-y-2">
                       {detailData.info.slice(0, 4).map((info, i) => (
                           <div key={i} className="flex justify-between text-[13px]">
                               <span className="text-slate-500">{info.label}</span>
                               <span className="font-bold">{info.value}</span>
                           </div>
                       ))}
                   </div>
               )}
              </div>
          </>
      )}
    </div>
  );
};
