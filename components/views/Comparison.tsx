import React, { useState } from 'react';
import { Search, Sparkles, X, Plus, Building2, Car, Calendar, MapPin, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Rectangle } from 'recharts';

const ASSET_COLORS: Record<string, string> = {
  '압구정 현대': '#6366F1', // Indigo
  '반포 아크로': '#3B82F6', // Blue
  '성수 트리마제': '#0EA5E9', // Sky
  '잠실 엘스': '#2DD4BF',   // Teal
  '마포 래미안': '#10B981', // Emerald
};

interface AssetData {
    id: number;
    name: string;
    region: string;
    price: number; 
    jeonse: number;
    gap: number;
    color: string;
}

const initialAssets: AssetData[] = [
  { id: 1, name: '압구정 현대', region: '강남구', price: 45.0, jeonse: 17.0, gap: 28.0, color: ASSET_COLORS['압구정 현대'] },
  { id: 2, name: '반포 아크로', region: '서초구', price: 39.0, jeonse: 20.0, gap: 19.0, color: ASSET_COLORS['반포 아크로'] },
  { id: 3, name: '성수 트리마제', region: '성동구', price: 38.0, jeonse: 18.0, gap: 20.0, color: ASSET_COLORS['성수 트리마제'] },
  { id: 4, name: '잠실 엘스', region: '송파구', price: 26.0, jeonse: 13.0, gap: 14.0, color: ASSET_COLORS['잠실 엘스'] },
  { id: 5, name: '마포 래미안', region: '마포구', price: 18.0, jeonse: 11.0, gap: 7.0, color: ASSET_COLORS['마포 래미안'] },
];

const generateChartData = (assets: AssetData[]) => {
    const categories = [
        { key: 'price', label: '총 매매가 (Volume)' },
        { key: 'jeonse', label: '전세가 (Safety)' },
        { key: 'gap', label: '필요 투자금 (Gap)' }
    ];

    return categories.map(cat => {
        // Sort for Z-Index (Largest first to be in back, smallest last to be in front)
        // Actually, SVG renders later elements on top. So we want largest First (background), or we rely on explicit width.
        // Let's rely on explicit centering. To avoid hiding, smaller bars must be rendered AFTER larger bars.
        // So Sort Ascending for rendering order? No, simpler to just have them all centered.
        // But if we want the "Russian Doll" effect where they are visible, we should render Large -> Small if they share width,
        // OR render them with different widths.
        // Let's try: Same width, but centered. Sort descending so larger bars are rendered first (background), smaller bars rendered last (foreground).
        
        const sortedAssets = [...assets].sort((a, b) => (b[cat.key as keyof AssetData] as number) - (a[cat.key as keyof AssetData] as number));
        const maxValue = sortedAssets[0] ? (sortedAssets[0][cat.key as keyof AssetData] as number) : 0;
        
        return {
            name: cat.label,
            maxValue: maxValue,
            assets: sortedAssets.map(a => ({
                ...a,
                value: a[cat.key as keyof AssetData] as number
            }))
        };
    });
};

export const Comparison: React.FC = () => {
  const [assets, setAssets] = useState<AssetData[]>(initialAssets);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [comparisonMode, setComparisonMode] = useState<'1:1' | 'multi'>('multi'); 
  
  const chartData = generateChartData(assets);

  const handleRemoveAsset = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setAssets(prev => prev.filter(a => a.id !== id));
      if (selectedAssetId === id) setSelectedAssetId(null);
  };

  const handleAssetClick = (id: number) => {
      setSelectedAssetId(prev => prev === id ? null : id);
  };

  const ComparisonCard = ({ title, price, sub, color }: { title: string, price: string, sub: string, color: string }) => (
      <div className="flex-1 p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Building2 className="w-6 h-6" />
              </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">{title}</h3>
          <p className="text-[15px] font-medium text-slate-500 mb-6">{sub}</p>
          <div className="text-4xl font-black text-slate-900 tracking-tight tabular-nums">{price}</div>
      </div>
  );

  const StatRow = ({ label, left, right, unit }: { label: string, left: string, right: string, unit: string }) => {
      // 숫자로 변환하여 비교 (쉼표 제거)
      const leftNum = parseFloat(left.replace(/,/g, ''));
      const rightNum = parseFloat(right.replace(/,/g, ''));
      const isLeftHigher = leftNum > rightNum;
      const isRightHigher = rightNum > leftNum;
      
      return (
          <div className="flex items-center justify-between py-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-6 transition-colors">
              <span className="font-bold text-slate-900 tabular-nums flex-1 text-left text-lg flex items-center gap-2">
                  {left}<span className="text-[12px] text-slate-400 font-normal ml-1">{unit}</span>
                  {isLeftHigher && <ChevronUp className="w-4 h-4 text-red-500" />}
              </span>
              <span className="text-[13px] font-bold text-slate-400 flex-1 text-center uppercase tracking-wide">{label}</span>
              <span className="font-bold text-slate-900 tabular-nums flex-1 text-right text-lg flex items-center justify-end gap-2">
                  {isRightHigher && <ChevronUp className="w-4 h-4 text-red-500" />}
                  {right}<span className="text-[12px] text-slate-400 font-normal ml-1">{unit}</span>
              </span>
          </div>
      );
  };

  // Updated Shape for Overlapping Effect
  const OverlappingBarShape = (props: any) => {
      const { x, y, width, height, payload } = props;
      const assets = payload.assets as (AssetData & { value: number })[];
      const bottomY = y + height;
      
      // We want them centered.
      const BAR_MAX_WIDTH = 40; 
      const centerX = x + width / 2;

      return (
          <g>
              {assets.map((asset, index) => {
                  const isSelected = selectedAssetId === asset.id;
                  const isAnySelected = selectedAssetId !== null;
                  
                  let fillColor = asset.color;
                  let opacity = 1;

                  // Creating a "Russian Doll" effect where smaller bars are narrower? 
                  // No, keeping width same and relying on height difference is better for value comparison,
                  // BUT since we sorted them Descending, the largest is drawn first (behind).
                  // So we can just draw them all centered with same width (or slightly varying).
                  
                  // 모든 막대를 같은 폭으로 설정
                  const currentWidth = BAR_MAX_WIDTH;
                  
                  if (isAnySelected) {
                      if (!isSelected) {
                          fillColor = '#cbd5e1';
                          opacity = 0.3;
                      } else {
                          opacity = 1; // Selected one pops
                      }
                  } else {
                      // If none selected, use opacity to show layers
                      opacity = 0.8 + (index * 0.05); // Front items slightly more opaque
                  }

                  // 각 막대의 값에 따라 높이를 다르게 설정
                  const barHeight = (asset.value / payload.maxValue) * height;
                  const topY = bottomY - barHeight;
                  const startX = centerX - currentWidth / 2;

                  return (
                      <React.Fragment key={asset.id}>
                          <Rectangle
                              x={startX}
                              y={topY}
                              width={currentWidth}
                              height={barHeight}
                              fill={fillColor}
                              fillOpacity={opacity}
                              radius={[6, 6, 0, 0]}
                              stroke={isSelected ? '#fff' : 'white'}
                              strokeWidth={1}
                              style={{ transition: 'all 0.3s ease' }}
                          />
                      </React.Fragment>
                  );
              })}
          </g>
      );
  };

  return (
    <div className="pb-32 animate-fade-in px-4 md:px-0 max-w-[1400px] mx-auto pt-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">아파트 비교 분석</h1>
              <p className="text-slate-500 text-[15px] font-medium">관심 있는 단지들의 가격 구조와 투자 가치를 입체적으로 비교하세요.</p>
          </div>
          
          <div className="bg-slate-100 p-1 rounded-xl flex items-center font-bold text-[13px]">
             <button 
                onClick={() => setComparisonMode('1:1')}
                className={`px-5 py-2.5 rounded-lg transition-all ${comparisonMode === '1:1' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
                1:1 정밀 비교
             </button>
             <button 
                onClick={() => setComparisonMode('multi')}
                className={`px-5 py-2.5 rounded-lg transition-all ${comparisonMode === 'multi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
             >
                다수 아파트 분석
             </button>
          </div>
      </div>

      {comparisonMode === '1:1' ? (
          <div className="animate-fade-in space-y-10">
              {/* 1:1 Layout */}
              <div className="relative">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <ComparisonCard title="래미안 원베일리" sub="서초구 반포동" price="42.5억" color="blue" />
                       <ComparisonCard title="아크로 리버파크" sub="서초구 반포동" price="38.2억" color="emerald" />
                   </div>
                   <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -ml-px"></div>
              </div>

              {/* Analysis Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
                   <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -ml-px z-0"></div>
                   
                   <div className="bg-white rounded-2xl border border-slate-200 p-8 z-10 relative hover:border-slate-300 transition-colors">
                       <h3 className="font-black text-slate-900 text-lg mb-6">핵심 강점</h3>
                       <ul className="space-y-5">
                           <li className="flex items-start gap-4">
                               <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">✓</div>
                               <span className="text-[15px] font-bold text-slate-700">1,378세대 더 많은 대단지 프리미엄</span>
                           </li>
                           <li className="flex items-start gap-4">
                               <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">✓</div>
                               <span className="text-[15px] font-bold text-slate-700">7년 더 신축 아파트 (2023년 준공)</span>
                           </li>
                       </ul>
                   </div>

                   <div className="bg-white rounded-2xl border border-slate-200 p-8 z-10 relative hover:border-slate-300 transition-colors">
                       <h3 className="font-black text-slate-900 text-lg mb-6">핵심 강점</h3>
                       <ul className="space-y-5">
                           <li className="flex items-start gap-4">
                               <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">✓</div>
                               <span className="text-[15px] font-bold text-slate-700">매매가가 약 4억원 더 저렴함</span>
                           </li>
                           <li className="flex items-start gap-4">
                               <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">✓</div>
                               <span className="text-[15px] font-bold text-slate-700">전통적인 반포 대장주 위상</span>
                           </li>
                       </ul>
                   </div>
              </div>

              {/* Detailed Specs Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="font-black text-slate-900 text-lg">상세 스펙 비교</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                      <StatRow label="평당가" left="1.25억" right="1.32억" unit="원" />
                      <StatRow label="세대수" left="2,990" right="1,612" unit="세대" />
                      <StatRow label="입주년도" left="2023" right="2016" unit="년" />
                      <StatRow label="주차대수" left="1.82" right="1.84" unit="대" />
                  </div>
              </div>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
              
              {/* LEFT: Chart Section */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-white rounded-[24px] border border-slate-200 shadow-soft p-8 min-h-[500px] flex flex-col relative overflow-hidden">
                      <div className="mb-8 pb-6 border-b border-slate-100 flex justify-between items-start">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <h2 className="text-xl font-black text-slate-900">포트폴리오 가치 오버레이</h2>
                              </div>
                              <p className="text-slate-500 text-[14px] leading-relaxed">
                                  각 지표별 내 자산의 위치를 겹쳐서 확인하세요. (높을수록 우위)
                              </p>
                          </div>
                          {/* Legend inside Chart Area */}
                          <div className="flex gap-4">
                              {assets.map(a => (
                                  <div key={a.id} className="flex items-center gap-1.5">
                                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }}></div>
                                      <span className="text-[12px] font-bold text-slate-500">{a.name}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="flex-1 w-full min-h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                  data={chartData}
                                  margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
                                  barSize={60} 
                              >
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis 
                                      dataKey="name" 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fontSize: 13, fill: '#64748b', fontWeight: 'bold' }}
                                      dy={15}
                                  />
                                  <YAxis 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }}
                                      tickFormatter={(val) => `${val}억`}
                                      domain={[0, 'auto']}
                                  />
                                  <Tooltip 
                                      cursor={{ fill: 'transparent' }}
                                      content={({ active, payload }) => {
                                          if (active && payload && payload.length) {
                                              const data = payload[0].payload;
                                              return (
                                                  <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-deep rounded-xl p-4 min-w-[200px]">
                                                      <p className="font-bold text-slate-900 mb-3 text-[15px]">{data.name}</p>
                                                      {data.assets.map((a: any) => (
                                                          <div key={a.name} className="flex items-center justify-between gap-4 text-[13px] mb-2 last:mb-0">
                                                              <div className="flex items-center gap-2">
                                                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }}></div>
                                                                  <span className="text-slate-500 font-medium">{a.name}</span>
                                                              </div>
                                                              <span className="font-bold text-slate-900 tabular-nums">{a.value}억</span>
                                                          </div>
                                                      ))}
                                                  </div>
                                              );
                                          }
                                          return null;
                                      }}
                                  />
                                  <Bar 
                                    dataKey="maxValue" 
                                    shape={<OverlappingBarShape />} 
                                    isAnimationActive={true}
                                    animationDuration={1000}
                                  />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* RIGHT: Asset List */}
              <div className="lg:col-span-4 flex flex-col h-full">
                  <div className="bg-white rounded-[24px] border border-slate-200 shadow-soft flex flex-col h-full overflow-hidden">
                      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <h3 className="font-black text-slate-900 text-[17px]">자산 구성</h3>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[11px] font-bold">
                              {assets.length}개
                          </span>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                          {assets.map((asset) => {
                              const isSelected = selectedAssetId === asset.id;
                              const isDimmed = selectedAssetId !== null && !isSelected;

                              return (
                                  <div 
                                    key={asset.id} 
                                    onClick={() => handleAssetClick(asset.id)}
                                    className={`flex items-center justify-between bg-white border rounded-xl px-5 py-4 cursor-pointer transition-all duration-200
                                        ${isSelected 
                                            ? 'border-indigo-500 ring-1 ring-indigo-500/20 shadow-md z-10' 
                                            : 'border-slate-200 hover:border-indigo-300'
                                        }
                                        ${isDimmed ? 'opacity-50 grayscale' : 'opacity-100'}
                                    `}
                                  >
                                      <div className="flex items-center gap-3">
                                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: asset.color }}></div>
                                          <div>
                                              <h4 className={`text-[15px] font-black leading-tight transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{asset.name}</h4>
                                              <p className="text-[13px] text-slate-500 font-medium mt-0.5">{asset.region}</p>
                                          </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                          <span className="text-[15px] font-black text-slate-800 tabular-nums">{asset.price}억</span>
                                          <button 
                                            onClick={(e) => handleRemoveAsset(asset.id, e)}
                                            className="p-1.5 text-slate-300 hover:bg-slate-100 hover:text-red-500 rounded-lg transition-colors"
                                          >
                                              <X className="w-4 h-4" />
                                          </button>
                                      </div>
                                  </div>
                              );
                          })}

                          <button className="w-full py-4 border border-dashed border-slate-300 rounded-xl text-slate-400 font-bold text-[13px] flex items-center justify-center gap-1.5 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all opacity-70 hover:opacity-100">
                              <Plus className="w-4 h-4" /> 비교군 추가하기
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};