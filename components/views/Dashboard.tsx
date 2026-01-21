import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Plus, MoreHorizontal, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import { Property, ViewProps } from '../../types';
import { ProfessionalChart, ChartSeriesData } from '../ui/ProfessionalChart';
import { Skeleton } from '../ui/Skeleton';
import { NumberTicker } from '../ui/NumberTicker';
import { PolicyNewsList } from './PolicyNewsList';
import { RegionComparisonChart } from './RegionComparisonChart';
import { ProfileWidgetsCard } from '../ProfileWidgetsCard';

// ----------------------------------------------------------------------
// DATA & UTILS
// ----------------------------------------------------------------------

const generateAssetHistory = (startPrice: number, volatility: number) => {
    const data = [];
    let basePrice = startPrice; 
    const startDate = new Date('2023-06-01');

    for (let i = 0; i < 300; i++) { 
        const change = (Math.random() - 0.48) * volatility;
        basePrice = basePrice + change;
        
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        data.push({
            time: date.toISOString().split('T')[0],
            value: Math.floor(basePrice),
        });
    }
    return data;
};

export const myProperties: Property[] = [
  { id: '1', name: '수원 영통 황골마을', location: '수원시 영통구', area: 84, currentPrice: 32000, purchasePrice: 28000, purchaseDate: '2019-05', changeRate: 14.2, jeonsePrice: 24000, gapPrice: 8000, jeonseRatio: 75.0, loan: 10000 },
  { id: '2', name: '시흥 배곧 호반써밋', location: '시흥시 배곧동', area: 84, currentPrice: 45000, purchasePrice: 41000, purchaseDate: '2020-08', changeRate: 9.7, jeonsePrice: 28000, gapPrice: 17000, jeonseRatio: 62.2, loan: 15000 },
  { id: '3', name: '김포 한강 센트럴자이', location: '김포시 장기동', area: 84, currentPrice: 39000, purchasePrice: 42000, purchaseDate: '2021-10', changeRate: -7.1, jeonsePrice: 25000, gapPrice: 14000, jeonseRatio: 64.1, loan: 20000 },
];

const rawFav1Properties: Property[] = [
  { id: 'f1-1', name: '성동구 옥수 파크힐스', location: '서울시 성동구', area: 59, currentPrice: 145000, purchasePrice: 140000, purchaseDate: '-', changeRate: 3.5, jeonsePrice: 80000, gapPrice: 65000, jeonseRatio: 55.1 },
  { id: 'f1-2', name: '마포 래미안 푸르지오', location: '서울시 마포구', area: 84, currentPrice: 182000, purchasePrice: 178000, purchaseDate: '-', changeRate: 2.2, jeonsePrice: 95000, gapPrice: 87000, jeonseRatio: 52.1 },
];

const rawFav2Properties: Property[] = [
  { id: 'f2-1', name: '천안 불당 지웰', location: '천안시 서북구', area: 84, currentPrice: 75000, purchasePrice: 76000, purchaseDate: '-', changeRate: -1.3, jeonsePrice: 45000, gapPrice: 30000, jeonseRatio: 60.0 },
  { id: 'f2-2', name: '청주 지웰시티 1차', location: '청주시 흥덕구', area: 99, currentPrice: 62000, purchasePrice: 60000, purchaseDate: '-', changeRate: 3.3, jeonsePrice: 38000, gapPrice: 24000, jeonseRatio: 61.2 },
];

// Helper for formatted price: Same Size, Bold Number, Medium Unit
const FormatPriceWithUnit = ({ value, isDiff = false }: { value: number, isDiff?: boolean }) => {
    const absVal = Math.abs(value);
    const eok = Math.floor(absVal / 10000);
    const man = absVal % 10000;
    
    // For diff, if it's less than 1 eok, just show manwon
    if (isDiff && eok === 0) {
        return (
            <span className="tabular-nums tracking-tight">
                <span className="font-bold">{man.toLocaleString()}</span>
                <span className="font-medium opacity-70 ml-0.5">만원</span>
            </span>
        );
    }

    return (
        <span className="tabular-nums tracking-tight">
            <span className="font-bold">{eok}</span>
            <span className="font-medium opacity-70 ml-0.5 mr-1">억</span>
            {man > 0 && (
                <>
                    <span className="font-bold">{man.toLocaleString()}</span>
                    <span className="font-medium opacity-70 ml-0.5">만원</span>
                </>
            )}
        </span>
    );
};

// Simple text formatter for NumberTicker or strings
const formatPriceString = (v: number) => {
    const eok = Math.floor(v / 10000);
    const man = v % 10000;
    return `${eok}억 ${man > 0 ? man.toLocaleString() : '0000'}만원`;
};

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

interface DashboardAsset extends Property {
    isVisible: boolean;
    chartData: { time: string; value: number }[];
    color: string;
}

interface AssetGroup {
    id: string;
    name: string;
    assets: DashboardAsset[];
}

const CHART_COLORS = [
    '#3182F6', 
    '#FF4B4B', 
    '#f59e0b', 
    '#8b5cf6', 
    '#10b981', 
    '#06b6d4', 
];

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

const AssetRow: React.FC<{ 
    item: DashboardAsset; 
    onClick: () => void;
    onToggleVisibility: (e: React.MouseEvent) => void; 
}> = ({ item, onClick, onToggleVisibility }) => {
    const isProfit = item.changeRate >= 0;
    
    return (
        <div 
            onClick={onClick} 
            className={`group flex items-center justify-between py-4 border-b border-slate-100 last:border-0 px-2 transition-all duration-300 cursor-pointer rounded-2xl ${item.isVisible ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50'}`}
        >
            <div className="flex items-center gap-4">
                {/* Eye Icon for Visibility Toggle */}
                <button 
                    onClick={onToggleVisibility}
                    className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {item.isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5 opacity-50" />}
                </button>

                <div className="relative flex-shrink-0">
                     <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 transition-colors ${item.isVisible ? (isProfit ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600') : 'bg-slate-200 text-slate-400'}`}>
                        <span className="text-[15px] font-bold tabular-nums tracking-tight leading-none">
                            {isProfit ? '▲' : '▼'}
                        </span>
                        <span className="text-[11px] font-bold tabular-nums tracking-tighter mt-0.5">{Math.abs(item.changeRate)}%</span>
                    </div>
                    {item.isVisible && (
                        <div 
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10"
                            style={{ backgroundColor: item.color }}
                        ></div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className={`font-bold text-[17px] md:text-[17px] truncate leading-tight mb-1 transition-colors ${item.isVisible ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-400'}`}>
                        {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[13px] text-slate-500 truncate font-medium">
                        <span className="truncate">{item.location}</span>
                        <span className="w-px h-2.5 bg-slate-200 flex-shrink-0"></span>
                        <span className="flex-shrink-0 tabular-nums">{item.area}㎡</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0 pl-2">
                <div className="text-right">
                    <p className={`font-bold text-[17px] md:text-lg tabular-nums tracking-tight ${item.isVisible ? 'text-slate-900' : 'text-slate-400'}`}>
                        <FormatPriceWithUnit value={item.currentPrice} />
                    </p>
                    {item.purchasePrice > 0 && (
                        <p className={`text-[13px] mt-0.5 font-bold tabular-nums ${isProfit ? 'text-red-500' : 'text-blue-500'}`}>
                            {isProfit ? '+' : '-'}<FormatPriceWithUnit value={item.currentPrice - item.purchasePrice} isDiff />
                        </p>
                    )}
                </div>
                
                <div className="hidden md:block transform transition-transform duration-300 group-hover:translate-x-1 text-slate-300 group-hover:text-blue-500">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// DASHBOARD
// ----------------------------------------------------------------------
export const Dashboard: React.FC<ViewProps> = ({ onPropertyClick, onViewAllPortfolio }) => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>(() => {
      const mapToDashboardAsset = (raw: Property[], startIndex: number) => {
          return raw.map((p, idx) => ({
              ...p,
              isVisible: true,
              chartData: generateAssetHistory(p.currentPrice, idx % 2 === 0 ? 500 : 1500),
              color: CHART_COLORS[(startIndex + idx) % CHART_COLORS.length]
          }));
      };

      return [
          { id: 'my', name: '내 자산', assets: mapToDashboardAsset(myProperties, 0) },
          { id: 'fav1', name: '관심 단지 1', assets: mapToDashboardAsset(rawFav1Properties, 3) },
          { id: 'fav2', name: '관심 단지 2', assets: mapToDashboardAsset(rawFav2Properties, 5) },
      ];
  });

  const [activeGroupId, setActiveGroupId] = useState<string>('my');
  const [viewMode, setViewMode] = useState<'separate' | 'combined'>('separate');
  const [sortOption, setSortOption] = useState<string>('currentPrice-desc');
  const [rankingScope, setRankingScope] = useState<'mine' | 'national'>('mine');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    const handleScroll = () => { setScrolled(window.scrollY > 40); };
    window.addEventListener('scroll', handleScroll);
    return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleTabChange = (groupId: string) => setActiveGroupId(groupId);
  const handleViewModeChange = (mode: 'separate' | 'combined') => setViewMode(mode);

  const toggleAssetVisibility = (groupId: string, assetId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setAssetGroups(prev => prev.map(group => {
          if (group.id !== groupId) return group;
          return {
              ...group,
              assets: group.assets.map(asset => 
                  asset.id === assetId ? { ...asset, isVisible: !asset.isVisible } : asset
              )
          };
      }));
  };

  const activeGroup = assetGroups.find(g => g.id === activeGroupId) || assetGroups[0];

  const sortedAssets = useMemo(() => {
      const assets = [...activeGroup.assets];
      const [key, dir] = sortOption.split('-');

      return assets.sort((a, b) => {
          let valA: any = a[key as keyof DashboardAsset];
          let valB: any = b[key as keyof DashboardAsset];
          if (valA === undefined) valA = 0;
          if (valB === undefined) valB = 0;
          if (typeof valA === 'string') return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          return dir === 'asc' ? valA - valB : valB - valA;
      });
  }, [activeGroup.assets, sortOption]);

  // Ranking data source
  const rankingSourceAssets = useMemo(() => {
      if (rankingScope === 'mine') return activeGroup.assets;
      // "전국"은 데모 데이터이므로 모든 그룹의 자산을 합쳐 보여줍니다.
      return assetGroups.flatMap(g => g.assets);
  }, [rankingScope, activeGroup.assets, assetGroups]);

  const rankingUp = useMemo(() => {
      return [...rankingSourceAssets]
          .filter(a => a.isVisible && a.changeRate > 0)
          .sort((a, b) => b.changeRate - a.changeRate)
          .slice(0, 5);
  }, [rankingSourceAssets]);

  const rankingDown = useMemo(() => {
      return [...rankingSourceAssets]
          .filter(a => a.isVisible && a.changeRate < 0)
          .sort((a, b) => a.changeRate - b.changeRate) // more negative first
          .slice(0, 5);
  }, [rankingSourceAssets]);

  const calculateAverageData = (assets: DashboardAsset[]) => {
      if (assets.length === 0) return [];
      const length = assets[0].chartData.length;
      const avgData = [];
      for (let i = 0; i < length; i++) {
          let sum = 0;
          let count = 0;
          const time = assets[0].chartData[i]?.time;
          if (!time) continue;
          assets.forEach(asset => {
              if (asset.chartData[i]) { sum += asset.chartData[i].value; count++; }
          });
          if (count > 0) { avgData.push({ time, value: Math.floor(sum / count) }); }
      }
      return avgData;
  };

  const { totalValue, totalProfit, totalProfitRate } = useMemo(() => {
      const visibleAssets = activeGroup.assets.filter(a => a.isVisible);
      const currentSum = visibleAssets.reduce((sum, a) => sum + a.currentPrice, 0);
      const purchaseSum = visibleAssets.reduce((sum, a) => sum + a.purchasePrice, 0);
      const profit = currentSum - purchaseSum;
      const profitRate = purchaseSum > 0 ? (profit / purchaseSum) * 100 : 0;
      return { totalValue: currentSum, totalProfit: profit, totalProfitRate: profitRate };
  }, [activeGroup]);

  const chartSeries: ChartSeriesData[] = useMemo(() => {
      const visibleAssets = activeGroup.assets.filter(asset => asset.isVisible);

      if (viewMode === 'combined') {
          if (visibleAssets.length === 0) return [];
          const avgData = calculateAverageData(visibleAssets);
          let color = '#ffffff'; 
          if (avgData.length > 0) {
              const start = avgData[0].value;
              const end = avgData[avgData.length - 1].value;
              color = end >= start ? '#FF4B4B' : '#3182F6';
          }
          return [{ name: `${activeGroup.name} 평균`, data: avgData, color: color, visible: true }];
      }
      return visibleAssets.map(asset => ({
            name: asset.name, data: asset.chartData, color: asset.color, visible: true
      }));
  }, [activeGroup, viewMode]);

  const ControlsContent = () => (
      <>
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
            {assetGroups.map((group) => (
                <button 
                    key={group.id}
                    onClick={() => handleTabChange(group.id)}
                    className={`px-4 py-2 rounded-lg text-[15px] font-bold transition-all whitespace-nowrap border ${
                        activeGroupId === group.id 
                        ? 'bg-deep-900 text-white border-deep-900 shadow-sm' 
                        : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'
                    }`}
                >
                    {group.name}
                </button>
            ))}
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm flex-shrink-0">
                <Plus className="w-5 h-5" />
            </button>
        </div>

        {/* View Options */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 gap-3">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ArrowUpDown className="h-4 w-4 text-slate-400" />
                </div>
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full pl-9 pr-8 h-10 text-[15px] font-bold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                    <option value="currentPrice-desc">시세 높은순</option>
                    <option value="currentPrice-asc">시세 낮은순</option>
                    <option value="changeRate-desc">상승률 높은순</option>
                    <option value="changeRate-asc">상승률 낮은순</option>
                </select>
            </div>

            <div className="bg-slate-100 p-1 rounded-lg flex items-center shadow-inner h-10 flex-shrink-0">
                <button
                    onClick={() => handleViewModeChange('separate')}
                    className={`flex-1 md:flex-none px-4 h-full flex items-center justify-center text-[13px] md:text-[15px] font-bold rounded-md transition-all ${
                        viewMode === 'separate' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    따로 보기
                </button>
                <button
                    onClick={() => handleViewModeChange('combined')}
                    className={`flex-1 md:flex-none px-4 h-full flex items-center justify-center text-[13px] md:text-[15px] font-bold rounded-md transition-all ${
                        viewMode === 'combined' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    같이 보기
                </button>
            </div>
        </div>
      </>
  );

  return (
    <div className="relative">
        {/* PC Layout - Restored */}
        <div className="hidden md:flex flex-col gap-8 pb-24">
            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left: Profile & Widgets Card - Reduced width */}
                <div className="col-span-2">
                    <ProfileWidgetsCard />
                </div>
                
                {/* Right: Main Content Area - Increased width */}
                <div className="col-span-10">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Top Row: Asset List and Chart */}
                        <div className="col-span-12 grid grid-cols-12 gap-8 min-h-[600px]">
                            {/* LEFT COLUMN (Asset List) - Increased width */}
                            <div className="col-span-5 h-full flex flex-col">
                    <div className="bg-white rounded-[28px] p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80 flex flex-col h-full min-h-0 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">자산 리스트</h2>
                            <button className="text-[13px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                <MoreHorizontal className="w-4 h-4" /> 편집
                            </button>
                        </div>
                        
                        <ControlsContent />

                        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar -mr-2 pr-2 mt-2">
                             {isLoading ? (
                                [1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                             ) : (
                                sortedAssets.length > 0 ? (
                                    sortedAssets.map(prop => (
                                        <AssetRow 
                                            key={prop.id} 
                                            item={prop} 
                                            onClick={() => onPropertyClick(prop.id)}
                                            onToggleVisibility={(e) => toggleAssetVisibility(activeGroup.id, prop.id, e)}
                                        />
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <Plus className="w-8 h-8 opacity-20" />
                                        <p className="text-[15px] font-medium">등록된 자산이 없습니다.</p>
                                    </div>
                                )
                             )}
                        </div>

                        <button className="w-full mt-6 py-4 rounded-xl border border-dashed border-slate-300 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-900 hover:border-slate-900 transition-all flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 text-[15px]">
                            <Plus className="w-4 h-4" /> {activeGroup.name}에 추가하기
                        </button>
                    </div>
                </div>

                            {/* RIGHT COLUMN (Chart) - Adjusted width */}
                            <div className="col-span-7 h-full flex flex-col gap-6">
                                <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] bg-noise rounded-[28px] p-10 text-white shadow-deep relative overflow-hidden group flex flex-col flex-1 min-h-0 border border-white/5">
                                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] glow-blue blur-[120px] pointer-events-none"></div>
                                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] glow-cyan blur-[100px] pointer-events-none"></div>

                                    <div className="flex flex-col items-start mb-8 relative z-10">
                                        <div className="flex items-start gap-2 mb-2 text-slate-400 text-[15px] font-bold uppercase tracking-wide">
                                            {activeGroup.name}
                                        </div>
                                        <div className="flex items-start gap-4">
                                            {isLoading ? (
                                                <Skeleton className="h-14 w-60 rounded-lg bg-white/10" />
                                            ) : (
                                                <div className="flex flex-col items-start">
                                                    <span className="text-[clamp(2.5rem,2.5vw,4rem)] font-black tracking-normal tabular-nums animate-enter leading-none -ml-[0.09em]">
                                                        <NumberTicker value={totalValue} formatter={formatPriceString} />
                                                    </span>
                                                    <span className="mt-1 text-[16px] font-normal text-white/80">
                                                        저번달 대비 {Math.abs(totalProfitRate).toFixed(1)}% 올랐어요
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {!isLoading && (
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border ${totalProfit >= 0 ? 'bg-red-500/20 border-red-500/30 text-red-100' : 'bg-blue-500/20 border-blue-500/30 text-blue-100'} mt-1.5`}>
                                                    <span className="text-lg font-bold tabular-nums">
                                                        <FormatPriceWithUnit value={Math.abs(totalProfit)} isDiff />
                                                    </span>
                                                    <span className="text-[13px] font-medium opacity-80">({totalProfitRate.toFixed(1)}%)</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute right-0 top-0 flex flex-col items-end gap-2">
                                                <button 
                                                onClick={onViewAllPortfolio}
                                                className="flex items-center gap-2 text-[13px] font-bold text-white transition-all bg-white/10 hover:bg-brand-mint hover:text-deep-900 border border-white/20 px-5 py-2.5 rounded-full backdrop-blur-md group-hover:shadow-glow"
                                            >
                                                자산 분석 상세 <ChevronRight className="w-3 h-3" />
                                            </button>
                                            <span className="text-[11px] text-slate-500 font-medium">2024.12.15 기준</span>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col">
                                        <div className="flex justify-end gap-2 mb-4">
                                            {['3개월', '6개월', '1년', '전체'].map(t => (
                                                <button key={t} className={`text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all ${t === '1년' ? 'bg-white text-deep-900 border-white shadow-neon-mint' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex-1 w-full min-h-0">
                                            {isLoading ? (
                                                <Skeleton className="w-full h-full rounded-xl bg-white/5" />
                                            ) : (
                                                <ProfessionalChart 
                                                    series={chartSeries}
                                                    height={420} 
                                                    theme="dark"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Policy News & Region Comparison - Same gap as top row */}
                    <div className="grid grid-cols-12 gap-8 mt-8">
                        <div className="col-span-7 h-[466px]">
                            <PolicyNewsList />
                        </div>
                        <div className="col-span-5 h-[466px]">
                            <RegionComparisonChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Mobile View remains largely the same but with style updates inherited */}
        <div className="md:hidden min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pb-24 relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-transparent z-0"></div>
             <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] glow-blue blur-[100px] pointer-events-none z-0"></div>
             <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] glow-cyan blur-[80px] pointer-events-none z-0"></div>
             
            <div className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/80 backdrop-blur-xl py-3 shadow-lg border-b border-white/5' : 'bg-transparent py-6'} px-6`}>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className={`text-[13px] font-bold text-slate-400 mb-1 transition-all origin-left duration-300 ${scrolled ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}`}>
                            {activeGroup.name}
                        </span>
                        <div className="flex items-baseline gap-2">
                             {isLoading ? (
                                <Skeleton className="h-8 w-32 rounded bg-white/10" />
                             ) : (
                                <span className={`font-black text-white tracking-normal tabular-nums transition-all duration-300 ${scrolled ? 'text-xl' : 'text-[clamp(1.5rem,5vw,2.25rem)]'}`}>
                                    <NumberTicker value={totalValue} formatter={formatPriceString} />
                                </span>
                             )}
                             
                            {!isLoading && (
                                <span className={`font-bold transition-all duration-300 tabular-nums ${scrolled ? 'text-[13px] opacity-0 w-0 overflow-hidden' : 'text-[15px] opacity-100'} ${totalProfit >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                    {totalProfit > 0 ? '+' : ''}{formatPriceString(Math.abs(totalProfit))} ({totalProfitRate.toFixed(1)}%)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Rest of mobile view... (inherits styles) */}
             <div className="px-2 h-[300px] mb-6 relative z-10">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                         <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <ProfessionalChart 
                        series={chartSeries}
                        height={300}
                        theme="dark"
                    />
                )}
            </div>
             <div className="bg-[#f8f9fa] rounded-t-[24px] min-h-[calc(100vh-100px)] relative z-20 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                 <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
                 <ControlsContent />
                 <div className="flex-1 space-y-1 -mr-2 pr-2">
                    {isLoading ? (
                        [1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl mb-2" />)
                    ) : (
                        sortedAssets.length > 0 ? (
                            sortedAssets.map(prop => (
                                <AssetRow 
                                    key={prop.id} 
                                    item={prop} 
                                    onClick={() => onPropertyClick(prop.id)}
                                    onToggleVisibility={(e) => toggleAssetVisibility(activeGroup.id, prop.id, e)}
                                />
                            ))
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-400 gap-3">
                                <Plus className="w-10 h-10 opacity-20" />
                                <p className="text-[15px] font-medium">등록된 자산이 없습니다.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};