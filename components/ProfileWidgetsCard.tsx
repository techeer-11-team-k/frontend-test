import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, TrendingUp, FileText, AlertCircle, X, TrendingDown, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Sector, Area, AreaChart } from 'recharts';

interface PortfolioData {
  region: string;
  value: number;
  color: string;
}

interface FavoriteApartment {
  id: string;
  name: string;
  location: string;
  area: number;
  currentPrice: number;
  changeRate: number;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  daysLeft?: number;
  iconType: 'tax' | 'update' | 'deadline' | 'alert';
  type: 'tax' | 'update' | 'deadline' | 'alert';
}

interface InterestRateData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  history: { month: string; value: number }[];
}

// 내 자산 아파트 데이터 (Dashboard의 내 자산 탭 기반)
const myAssetApartments: FavoriteApartment[] = [
  { id: 'a1', name: '시흥 배곧 호반써밋', location: '시흥시 배곧동', area: 84, currentPrice: 45000, changeRate: 9.7 },
  { id: 'a2', name: '김포 한강 센트럴자이', location: '김포시 장기동', area: 84, currentPrice: 39000, changeRate: -7.1 },
  { id: 'a3', name: '수원 영통 황골마을', location: '수원시 영통구', area: 84, currentPrice: 32000, changeRate: 14.2 },
];

// 관심 리스트 아파트 데이터 (Dashboard에서 가져온 데이터 기반)
const favoriteApartments: FavoriteApartment[] = [
  { id: 'f1-1', name: '성동구 옥수 파크힐스', location: '서울시 성동구', area: 59, currentPrice: 145000, changeRate: 3.5 },
  { id: 'f1-2', name: '마포 래미안 푸르지오', location: '서울시 마포구', area: 84, currentPrice: 182000, changeRate: 2.2 },
  { id: 'f2-1', name: '천안 불당 지웰', location: '천안시 서북구', area: 84, currentPrice: 75000, changeRate: -1.3 },
  { id: 'f2-2', name: '청주 지웰시티 1차', location: '청주시 흥덕구', area: 99, currentPrice: 62000, changeRate: 3.3 },
];

// 관심 리스트 기반 포트폴리오 데이터 계산
const calculatePortfolioData = (): PortfolioData[] => {
  const regionMap = new Map<string, { total: number; count: number }>();
  
  favoriteApartments.forEach(apt => {
    const region = apt.location.split(' ')[0]; // '서울시' -> '서울', '천안시' -> '천안'
    const regionKey = region.replace('시', '').replace('도', '');
    const existing = regionMap.get(regionKey) || { total: 0, count: 0 };
    existing.total += apt.currentPrice;
    existing.count += 1;
    regionMap.set(regionKey, existing);
  });
  
  const total = Array.from(regionMap.values()).reduce((sum, item) => sum + item.total, 0);
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  
  return Array.from(regionMap.entries()).map(([region, data], index) => ({
    region,
    value: Math.round((data.total / total) * 100),
    color: colors[index % colors.length],
  }));
};

const mockEvents: EventItem[] = [
  {
    id: '1',
    title: '재산세 납부',
    date: '2024.07.15',
    daysLeft: 15,
    iconType: 'tax',
    type: 'tax',
  },
  {
    id: '2',
    title: '관심 단지 실거래가 업데이트',
    date: '2024.07.01',
    iconType: 'update',
    type: 'update',
  },
  {
    id: '3',
    title: '부동산 등기 신고 마감',
    date: '2024.07.20',
    daysLeft: 20,
    iconType: 'deadline',
    type: 'deadline',
  },
  {
    id: '4',
    title: '임대료 수령일',
    date: '2024.07.05',
    daysLeft: 5,
    iconType: 'alert',
    type: 'alert',
  },
];

const getEventColor = (type: string) => {
  const colors: Record<string, string> = {
    tax: 'text-blue-600 bg-blue-50',
    update: 'text-purple-600 bg-purple-50',
    deadline: 'text-orange-600 bg-orange-50',
    alert: 'text-green-600 bg-green-50',
  };
  return colors[type] || 'text-slate-600 bg-slate-50';
};

const lineChartData = [
  { period: '6개월 전', value: 8.5 },
  { period: '5개월 전', value: 7.8 },
  { period: '4개월 전', value: 6.2 },
  { period: '3개월 전', value: 5.1 },
  { period: '2개월 전', value: 4.8 },
  { period: '1개월 전', value: 4.5 },
  { period: '현재', value: 4.21 },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case 'tax':
      return <Calendar className="w-4 h-4" />;
    case 'update':
      return <TrendingUp className="w-4 h-4" />;
    case 'deadline':
      return <FileText className="w-4 h-4" />;
    case 'alert':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

interface ProfileWidgetsCardProps {
  activeGroupName?: string;
  assets?: any[];
}

export const ProfileWidgetsCard: React.FC<ProfileWidgetsCardProps> = ({ activeGroupName = '내 자산', assets }) => {
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedApartmentIndex, setSelectedApartmentIndex] = useState<number | null>(null);
  const [selectedRateIndex, setSelectedRateIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentValue = 4.21;

  // 현재 탭에 따른 아파트 데이터 선택
  const currentApartments = useMemo(() => {
    // assets가 전달되면 해당 데이터 사용, 아니면 기본 데이터 사용
    if (assets && assets.length > 0) {
      return assets.map((asset, index) => ({
        id: asset.id || `asset-${index}`,
        name: asset.name,
        location: asset.location || '위치 정보 없음',
        area: asset.area || 84,
        currentPrice: asset.currentPrice || 50000,
        changeRate: asset.profitRate || 0,
      }));
    }
    // activeGroupName이 '내 자산'이면 내 자산 데이터, 아니면 관심단지 데이터
    if (activeGroupName === '내 자산') {
      return myAssetApartments;
    }
    return favoriteApartments;
  }, [activeGroupName, assets]);

  // 디데이 순으로 정렬 (daysLeft가 작을수록 위에)
  const sortedEvents = useMemo(() => {
    return [...mockEvents].sort((a, b) => {
      // daysLeft가 없는 경우 맨 아래로
      if (!a.daysLeft && !b.daysLeft) return 0;
      if (!a.daysLeft) return 1;
      if (!b.daysLeft) return -1;
      return a.daysLeft - b.daysLeft;
    });
  }, []);

  // 금리 지표 데이터 (히스토리 포함)
  const interestRates: InterestRateData[] = [
    { 
      label: '기준금리', 
      value: 3.50, 
      change: 0.00, 
      trend: 'stable',
      history: [
        { month: '7월', value: 3.50 },
        { month: '8월', value: 3.50 },
        { month: '9월', value: 3.50 },
        { month: '10월', value: 3.50 },
        { month: '11월', value: 3.50 },
        { month: '12월', value: 3.50 },
      ]
    },
    { 
      label: '주담대(고정)', 
      value: 4.21, 
      change: -0.12, 
      trend: 'down',
      history: [
        { month: '7월', value: 4.45 },
        { month: '8월', value: 4.38 },
        { month: '9월', value: 4.35 },
        { month: '10월', value: 4.30 },
        { month: '11월', value: 4.25 },
        { month: '12월', value: 4.21 },
      ]
    },
    { 
      label: '주담대(변동)', 
      value: 4.85, 
      change: 0.08, 
      trend: 'up',
      history: [
        { month: '7월', value: 4.65 },
        { month: '8월', value: 4.70 },
        { month: '9월', value: 4.72 },
        { month: '10월', value: 4.78 },
        { month: '11월', value: 4.80 },
        { month: '12월', value: 4.85 },
      ]
    },
    { 
      label: '전세대출', 
      value: 4.15, 
      change: -0.05, 
      trend: 'down',
      history: [
        { month: '7월', value: 4.30 },
        { month: '8월', value: 4.28 },
        { month: '9월', value: 4.25 },
        { month: '10월', value: 4.22 },
        { month: '11월', value: 4.18 },
        { month: '12월', value: 4.15 },
      ]
    },
  ];
  
  // 이벤트 툴팁 위치 계산
  const handleEventClick = (event: EventItem, index: number) => {
    const el = eventRefs.current[index];
    if (el) {
      const rect = el.getBoundingClientRect();
      setTooltipPosition({ x: rect.right + 10, y: rect.top });
      setSelectedEvent(event);
    }
  };

  // 외부 클릭시 툴팁 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectedEvent && !(e.target as HTMLElement).closest('.event-tooltip')) {
        setSelectedEvent(null);
        setTooltipPosition(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedEvent]);

  return (
    <>
      <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80 h-fit">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User" 
              className="w-full h-full" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-black text-slate-900 truncate">김부자님</p>
            <p className="text-[12px] text-slate-500 font-medium">투자자</p>
          </div>
        </div>

        {/* 금리 지표 Section - 클릭시 미니 차트 표시 */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-black text-slate-900">금리 지표</h3>
            <span className="text-[10px] text-slate-400">2024.12 기준</span>
          </div>
          <div className="space-y-1">
            {interestRates.map((rate, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedRateIndex(selectedRateIndex === index ? null : index)}
                className={`rounded-xl transition-all cursor-pointer ${
                  selectedRateIndex === index 
                    ? 'bg-slate-50 p-3' 
                    : 'hover:bg-slate-50 p-2'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      rate.trend === 'up' ? 'bg-red-100' : 
                      rate.trend === 'down' ? 'bg-blue-100' : 
                      'bg-purple-100'
                    }`}>
                      {rate.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-red-500" />
                      ) : rate.trend === 'down' ? (
                        <TrendingDown className="w-3 h-3 text-blue-500" />
                      ) : (
                        <span className="text-[8px] font-black text-purple-500">—</span>
                      )}
                    </div>
                    <span className="text-[12px] text-slate-600 font-medium">{rate.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-black text-slate-900">{rate.value.toFixed(2)}%</span>
                    <span className={`text-[10px] font-bold ${
                      rate.trend === 'stable' ? 'text-slate-400' :
                      rate.change > 0 ? 'text-red-500' : 
                      'text-blue-500'
                    }`}>
                      {rate.trend === 'stable' ? '동결' : 
                       rate.change > 0 ? `+${rate.change.toFixed(2)}%` : 
                       `${rate.change.toFixed(2)}%`}
                    </span>
                    <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${
                      selectedRateIndex === index ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
                
                {/* 미니 차트 */}
                {selectedRateIndex === index && (
                  <div className="mt-3 h-[60px] animate-fade-in">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={rate.history} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={rate.trend === 'up' ? '#ef4444' : rate.trend === 'down' ? '#3b82f6' : '#8b5cf6'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={rate.trend === 'up' ? '#ef4444' : rate.trend === 'down' ? '#3b82f6' : '#8b5cf6'} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 9, fill: '#94a3b8' }}
                          interval={1}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={rate.trend === 'up' ? '#ef4444' : rate.trend === 'down' ? '#3b82f6' : '#8b5cf6'}
                          strokeWidth={2}
                          fill={`url(#gradient-${index})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


      {/* 내 자산 포트폴리오 Section - 현재 탭에 따라 변경 */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h3 className="text-[15px] font-black text-slate-900 mb-4">내 자산 포트폴리오</h3>
        
        <div className="flex flex-col items-center">
          <div className="w-[140px] h-[140px] relative mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(() => {
                    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];
                    const totalPrice = currentApartments.reduce((sum, a) => sum + a.currentPrice, 0);
                    return currentApartments.map((apt, index) => ({
                      name: apt.name,
                      value: Math.round((apt.currentPrice / totalPrice) * 100),
                      color: colors[index % colors.length],
                    }));
                  })()}
                  cx="50%"
                  cy="50%"
                  innerRadius={selectedApartmentIndex !== null ? 35 : 40}
                  outerRadius={selectedApartmentIndex !== null ? 68 : 65}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  labelLine={false}
                  activeIndex={selectedApartmentIndex !== null ? selectedApartmentIndex : undefined}
                  activeShape={(props: any) => {
                    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                    return (
                      <g>
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius - 3}
                          outerRadius={outerRadius + 5}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                        />
                      </g>
                    );
                  }}
                  onMouseEnter={(_, index) => setSelectedApartmentIndex(index)}
                  onMouseLeave={() => setSelectedApartmentIndex(null)}
                  onClick={(_, index) => setSelectedApartmentIndex(selectedApartmentIndex === index ? null : index)}
                >
                  {currentApartments.map((_, index) => {
                    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index % colors.length]}
                        style={{ 
                          cursor: 'pointer',
                          opacity: selectedApartmentIndex !== null && selectedApartmentIndex !== index ? 0.4 : 1,
                          transition: 'opacity 0.2s ease'
                        }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg text-[11px]">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-slate-300">{data.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 지역별 범례 - 아파트 이름과 퍼센트 */}
          <div className="w-full space-y-2">
            {currentApartments.map((apt, index) => {
              const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];
              const totalPrice = currentApartments.reduce((sum, a) => sum + a.currentPrice, 0);
              const percentage = Math.round((apt.currentPrice / totalPrice) * 100);
              const isSelected = selectedApartmentIndex === index;
              return (
                <div 
                  key={apt.id} 
                  className={`flex items-center justify-between cursor-pointer p-1.5 rounded-lg transition-all ${
                    isSelected ? 'bg-slate-100 scale-[1.02]' : 'hover:bg-slate-50'
                  } ${selectedApartmentIndex !== null && !isSelected ? 'opacity-50' : ''}`}
                  onClick={() => setSelectedApartmentIndex(isSelected ? null : index)}
                  onMouseEnter={() => setSelectedApartmentIndex(index)}
                  onMouseLeave={() => setSelectedApartmentIndex(null)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform ${isSelected ? 'scale-125' : ''}`}
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className={`text-[12px] font-medium truncate max-w-[100px] transition-colors ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>{apt.name}</span>
                  </div>
                  <span className={`text-[12px] font-bold transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-0">
        <h3 className="text-[15px] font-black text-slate-900 mb-4">부동산 주요 일정</h3>
        
        <div className="space-y-0 relative">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              ref={(el) => { eventRefs.current[index] = el; }}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event, index);
              }}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors border cursor-pointer event-tooltip ${
                selectedEvent?.id === event.id 
                  ? 'bg-slate-100 border-slate-200' 
                  : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
              }`}
            >
              <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${getEventColor(event.type)}`}>
                {getEventIcon(event.iconType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[12px] font-bold text-slate-900 truncate">{event.title}</span>
                  {event.daysLeft && (
                    <span className="text-[10px] font-black text-red-500 tabular-nums flex-shrink-0 ml-2">
                      D-{event.daysLeft}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{event.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Event Tooltip - 검은색 말풍선 */}
      {selectedEvent && tooltipPosition && (
        <div 
          className="fixed z-[300] event-tooltip animate-fade-in"
          style={{ 
            left: tooltipPosition.x, 
            top: tooltipPosition.y,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="relative bg-slate-900 text-white rounded-xl shadow-2xl p-4 w-56">
            {/* 말풍선 화살표 */}
            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2">
              <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-slate-900"></div>
            </div>
            
            <div className="flex items-start gap-3 mb-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                selectedEvent.type === 'tax' ? 'bg-blue-500/20 text-blue-400' :
                selectedEvent.type === 'update' ? 'bg-purple-500/20 text-purple-400' :
                selectedEvent.type === 'deadline' ? 'bg-orange-500/20 text-orange-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {getEventIcon(selectedEvent.iconType)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-white mb-0.5">{selectedEvent.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>{selectedEvent.date}</span>
                  {selectedEvent.daysLeft && (
                    <span className="text-red-400 font-bold">D-{selectedEvent.daysLeft}</span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {selectedEvent.type === 'tax' && '재산세 납부 기한입니다. 기한 내 납부하지 않으면 가산세가 부과됩니다.'}
              {selectedEvent.type === 'update' && '관심 단지의 최신 실거래가 정보가 업데이트되었습니다.'}
              {selectedEvent.type === 'deadline' && '부동산 등기 신고 마감일입니다. 기한 내 신고해주세요.'}
              {selectedEvent.type === 'alert' && '월세 수령 예정일입니다. 입금을 확인해주세요.'}
            </p>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(null);
                setTooltipPosition(null);
              }}
              className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}


      {/* Chart Modal */}
      {isChartModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsChartModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900">{currentValue.toFixed(2)}%</h3>
              <button 
                onClick={() => setIsChartModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                style={{ width: `${(currentValue / 8.5) * 100}%` }}
              ></div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }}
                    height={60}
                    tickFormatter={(value, index) => {
                      if (index === 0) return '6개월 전';
                      if (index === 3) return '4.21%';
                      if (index === 6) return '현재';
                      return '';
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }}
                    tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
