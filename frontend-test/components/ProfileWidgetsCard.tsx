import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, FileText, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PortfolioData {
  name: string;
  value: number;
  color: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  daysLeft?: number;
  icon: React.ReactNode;
  type: 'tax' | 'update' | 'deadline' | 'alert';
  description: string;
}

interface RateItem {
  id: string;
  name: string;
  value: number;
  change: number;
  chartData: number[];
}

interface Asset {
  id: string;
  name: string;
  currentPrice: number;
  isVisible: boolean;
  color: string;
}

interface ProfileWidgetsCardProps {
  activeGroupName?: string;
  assets?: Asset[];
}

const mockEvents: EventItem[] = [
  {
    id: '1',
    title: '재산세 납부',
    date: '2024.07.15',
    daysLeft: 15,
    icon: <Calendar className="w-4 h-4" />,
    type: 'tax',
    description: '주택분 재산세 납부 마감일입니다. 7월 16일부터 3%의 가산금이 부과됩니다.',
  },
  {
    id: '2',
    title: '관심 단지 실거래가 업데이트',
    date: '2024.07.01',
    icon: <TrendingUp className="w-4 h-4" />,
    type: 'update',
    description: '관심 등록한 단지들의 최신 실거래가 정보가 업데이트됩니다.',
  },
  {
    id: '3',
    title: '부동산 등기 신고 마감',
    date: '2024.07.20',
    daysLeft: 20,
    icon: <FileText className="w-4 h-4" />,
    type: 'deadline',
    description: '부동산 취득 후 60일 이내 등기 신고를 완료해야 합니다.',
  },
  {
    id: '4',
    title: '임대료 수령일',
    date: '2024.07.05',
    daysLeft: 5,
    icon: <AlertCircle className="w-4 h-4" />,
    type: 'alert',
    description: '월세 수령 예정일입니다. 자동이체 확인 바랍니다.',
  },
];

const rateItems: RateItem[] = [
  { id: '1', name: '기준금리', value: 3.50, change: 0.00, chartData: [3.25, 3.25, 3.50, 3.50, 3.50, 3.50] },
  { id: '2', name: '주담대(고정)', value: 4.21, change: -0.12, chartData: [4.50, 4.45, 4.35, 4.30, 4.25, 4.21] },
  { id: '3', name: '주담대(변동)', value: 4.85, change: 0.08, chartData: [4.60, 4.65, 4.70, 4.75, 4.80, 4.85] },
  { id: '4', name: '전세대출', value: 4.15, change: -0.05, chartData: [4.35, 4.30, 4.25, 4.20, 4.18, 4.15] },
];

const RATE_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

const CHART_COLORS = [
    '#3182F6', 
    '#FF4B4B', 
    '#f59e0b', 
    '#8b5cf6', 
    '#10b981', 
    '#06b6d4', 
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

// Sort events by daysLeft (closest first)
const sortedEvents = [...mockEvents].sort((a, b) => {
  if (a.daysLeft === undefined && b.daysLeft === undefined) return 0;
  if (a.daysLeft === undefined) return 1;
  if (b.daysLeft === undefined) return -1;
  return a.daysLeft - b.daysLeft;
});

export const ProfileWidgetsCard: React.FC<ProfileWidgetsCardProps> = ({ 
  activeGroupName = '내 자산',
  assets = []
}) => {
  const [selectedRateIndex, setSelectedRateIndex] = useState<number | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Generate portfolio data from assets
  const portfolioData: PortfolioData[] = useMemo(() => {
    const visibleAssets = assets.filter(a => a.isVisible);
    if (visibleAssets.length === 0) {
      return [
        { name: '서울', value: 50, color: '#3182F6' },
        { name: '경기', value: 30, color: '#8b5cf6' },
        { name: '기타', value: 20, color: '#10b981' },
      ];
    }

    const total = visibleAssets.reduce((sum, a) => sum + a.currentPrice, 0);
    if (total === 0) return [];

    // Calculate percentages
    let data = visibleAssets.map((asset, idx) => ({
      name: asset.name,
      value: Math.round((asset.currentPrice / total) * 100),
      color: asset.color || CHART_COLORS[idx % CHART_COLORS.length],
    }));

    // Sort by percentage descending
    data = data.sort((a, b) => b.value - a.value);

    // Ensure percentages sum to 100%
    const currentSum = data.reduce((sum, d) => sum + d.value, 0);
    if (currentSum !== 100 && data.length > 0) {
      data[0].value += (100 - currentSum);
    }

    return data;
  }, [assets]);

  return (
    <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80">
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
          <p className="text-[15px] font-black text-slate-900 truncate">건물주</p>
          <p className="text-[12px] text-slate-500 font-medium">투자자</p>
        </div>
      </div>

      {/* Interest Rate Indicators Section */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h3 className="text-[15px] font-black text-slate-900 mb-4">금리 지표</h3>
        <div className="space-y-3">
          {rateItems.map((item, index) => {
            const maxRate = 6; // Maximum rate for progress bar scaling
            const progressWidth = (item.value / maxRate) * 100;
            const color = RATE_COLORS[index % RATE_COLORS.length];
            
            return (
              <div key={item.id}>
                <div 
                  className="p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRateIndex(selectedRateIndex === index ? null : index)}
                >
                  {/* Top row: name and change */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-[12px] font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className={`text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full ${
                      item.change === 0 
                        ? 'text-slate-500 bg-slate-100' 
                        : item.change > 0 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-blue-600 bg-blue-50'
                    }`}>
                      {item.change === 0 ? '동결' : `${item.change > 0 ? '+' : ''}${item.change.toFixed(2)}%`}
                    </span>
                  </div>
                  
                  {/* Middle row: value */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[20px] font-black text-slate-900 tabular-nums">{item.value.toFixed(2)}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${progressWidth}%`,
                        background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Mini Line Chart - shown when clicked */}
                {selectedRateIndex === index && (
                  <div className="mx-3 mb-2 p-3 bg-slate-50 rounded-xl animate-fade-in">
                    <svg viewBox="0 0 120 50" className="w-full h-16">
                      {/* Grid lines */}
                      <line x1="0" y1="12.5" x2="120" y2="12.5" stroke="#e2e8f0" strokeWidth="0.5" />
                      <line x1="0" y1="25" x2="120" y2="25" stroke="#e2e8f0" strokeWidth="0.5" />
                      <line x1="0" y1="37.5" x2="120" y2="37.5" stroke="#e2e8f0" strokeWidth="0.5" />
                      
                      {/* Area fill */}
                      <path
                        d={(() => {
                          const max = Math.max(...item.chartData);
                          const min = Math.min(...item.chartData);
                          const range = max - min || 1;
                          const points = item.chartData.map((val, i) => {
                            const x = (i / (item.chartData.length - 1)) * 120;
                            const y = 50 - ((val - min) / range) * 40 - 5;
                            return `${x},${y}`;
                          });
                          return `M0,50 L${points[0]} ${points.map((p, i) => `L${p}`).join(' ')} L120,50 Z`;
                        })()}
                        fill={`${color}20`}
                      />
                      
                      {/* Line */}
                      <polyline
                        points={(() => {
                          const max = Math.max(...item.chartData);
                          const min = Math.min(...item.chartData);
                          const range = max - min || 1;
                          return item.chartData.map((val, i) => {
                            const x = (i / (item.chartData.length - 1)) * 120;
                            const y = 50 - ((val - min) / range) * 40 - 5;
                            return `${x},${y}`;
                          }).join(' ');
                        })()}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points */}
                      {item.chartData.map((val, i) => {
                        const max = Math.max(...item.chartData);
                        const min = Math.min(...item.chartData);
                        const range = max - min || 1;
                        const x = (i / (item.chartData.length - 1)) * 120;
                        const y = 50 - ((val - min) / range) * 40 - 5;
                        const isLast = i === item.chartData.length - 1;
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r={isLast ? 4 : 2.5}
                            fill={isLast ? color : 'white'}
                            stroke={color}
                            strokeWidth={isLast ? 0 : 1.5}
                          />
                        );
                      })}
                    </svg>
                    <div className="flex justify-between mt-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400 font-medium">6개월 전</span>
                      <span className="text-[10px] text-slate-400 font-medium">현재</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 text-right mt-3">2024.12 기준</p>
      </div>

      {/* Portfolio Donut Chart Section */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h3 className="text-[15px] font-black text-slate-900 mb-4">{activeGroupName} 포트폴리오</h3>
        
        <div className="flex flex-col">
          {/* Donut Chart - Centered, largest slice starts at right (0 degrees) */}
          <div className="w-full flex justify-center mb-4">
            <div className="w-[100px] h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={48}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={0}
                    endAngle={360}
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 px-3 py-2.5 rounded-xl shadow-lg min-w-[120px]">
                            <div className="flex items-center gap-2 mb-1">
                              <div 
                                className="w-2.5 h-2.5 rounded-full" 
                                style={{ backgroundColor: data.color }}
                              ></div>
                              <span className="text-[12px] font-bold text-slate-800">{data.name}</span>
                            </div>
                            <p className="text-[16px] font-black text-slate-900 tabular-nums">{data.value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend List - Below chart */}
          <div className="space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-[12px] font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="text-[13px] font-black text-slate-900 tabular-nums flex-shrink-0">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div>
        <h3 className="text-[15px] font-black text-slate-900 mb-4">주요 일정</h3>
        
        <div className="space-y-0">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="relative group"
              onMouseEnter={() => setHoveredEventId(event.id)}
              onMouseLeave={() => setHoveredEventId(null)}
            >
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${getEventColor(event.type)}`}>
                  {event.icon}
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
              {/* Tooltip - Right side, dark style */}
              {hoveredEventId === event.id && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-lg text-[11px] leading-relaxed w-48 animate-fade-in">
                  {event.description}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
