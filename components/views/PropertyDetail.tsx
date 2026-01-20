import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Plus, ArrowRightLeft, Building2, MapPin, Calendar, Car } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProfessionalChart } from '../ui/ProfessionalChart';

interface PropertyDetailProps {
  propertyId: string;
  onBack: () => void;
  isCompact?: boolean;
}

type TabType = 'chart' | 'info';
type ChartType = '매매' | '전세' | '월세';
type TransactionType = '전체' | '매매' | '전세' | '월세';

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

const detailData = {
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

// Updated FormatPrice: Numbers Bold, Units Medium, Same Size
const FormatPrice = ({ val, sizeClass = "text-[28px]" }: { val: number, sizeClass?: string }) => {
  const eok = Math.floor(val / 10000);
  const man = val % 10000;
  return (
      <span className={`tabular-nums tracking-tight text-slate-900 ${sizeClass}`}>
          <span className="font-bold">{eok}</span>
          <span className="font-medium text-slate-600 ml-0.5 mr-1.5">억</span>
          {man > 0 && (
            <>
                <span className="font-bold">{man.toLocaleString()}</span>
                <span className="font-medium text-slate-600 ml-0.5">만원</span>
            </>
          )}
      </span>
  );
};

const NeighborItem: React.FC<{ item: typeof detailData.neighbors[0], currentPrice: number }> = ({ item, currentPrice }) => {
    const diffRatio = ((item.price - currentPrice) / currentPrice) * 100;
    const isHigher = diffRatio > 0;
    
    return (
        <div className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors bg-white">
            <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="text-[15px] font-bold text-slate-900">{item.name}</p>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${isHigher ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {isHigher ? '비쌈' : '저렴'} {Math.abs(diffRatio).toFixed(1)}%
                    </span>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-[15px] font-bold text-slate-900 tabular-nums">
                    <FormatPrice val={item.price} sizeClass="text-[15px]" />
                </p>
            </div>
        </div>
    );
};

const TransactionRow: React.FC<{ tx: typeof detailData.transactions[0] }> = ({ tx }) => {
    const typeColor = tx.type === '매매' ? 'text-slate-900' : (tx.type === '전세' ? 'text-indigo-600' : 'text-emerald-600');
    
    return (
        <div className="grid grid-cols-4 py-4 text-[15px] border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors items-center h-[52px]">
            <div className="text-slate-500 pl-4 text-[12px] font-medium tabular-nums">{tx.date}</div>
            <div className={`font-bold ${typeColor} text-center text-[13px]`}>{tx.type}</div>
            <div className="text-slate-500 text-center text-[12px] tabular-nums">{tx.floor}</div>
            <div className="text-right tabular-nums pr-4">
                <FormatPrice val={tx.price} sizeClass="text-[15px]" />
            </div>
        </div>
    );
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ propertyId, onBack, isCompact = false }) => {
  const [activeTab, setActiveTab] = useState<TabType>('chart');
  const [chartType, setChartType] = useState<ChartType>('매매');
  const [chartData, setChartData] = useState(generateChartData('매매'));
  const [chartPeriod, setChartPeriod] = useState('1년');
  const [isFavorite, setIsFavorite] = useState(false);
  const [txFilter, setTxFilter] = useState<TransactionType>('전체');

  useEffect(() => {
      setChartData(generateChartData(chartType));
  }, [chartType]);

  const filteredTransactions = detailData.transactions.filter(tx => 
      txFilter === '전체' ? true : tx.type === txFilter
  );

  return (
    <div className={`bg-slate-50 min-h-full font-sans text-slate-900 ${isCompact ? 'p-0' : ''}`}>
      
      {!isCompact && (
          <>
            {/* Header / Nav */}
            <div className="sticky top-0 z-[50] bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-[15px] font-bold text-slate-900">{detailData.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`p-2 rounded-lg transition-colors ${isFavorite ? 'bg-yellow-50 text-yellow-500' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500' : ''}`} />
                        </button>
                        <button className="bg-slate-900 text-white text-[13px] font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                            내 자산 추가
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
                
                {/* 1. Header Card: Refined Layout (Stock App Style) */}
                <Card className="p-8 bg-white">
                    {/* Top Row: Name & Badges */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-slate-100 p-2 rounded-xl">
                            <Building2 className="w-6 h-6 text-slate-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 leading-none mb-1">{detailData.name}</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">아파트</span>
                                <span className="text-[13px] font-medium text-slate-400">{detailData.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Big Price & Change */}
                    <div className="mt-6 flex items-baseline gap-3">
                        <FormatPrice val={detailData.currentPrice} sizeClass="text-[42px]" />
                        
                        <div className="flex flex-col items-start leading-none">
                            <div className={`text-[15px] font-bold flex items-center gap-1 tabular-nums ${detailData.diffRate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                {detailData.diffRate >= 0 ? '▲' : '▼'} {Math.abs(detailData.diff)}만원 ({Math.abs(detailData.diffRate)}%)
                            </div>
                            <span className="text-[12px] font-medium text-slate-400 mt-1">지난 실거래가 대비</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-slate-100 my-6"></div>

                    {/* Bottom Row: Info Specs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] font-bold text-slate-400">위치</span>
                            <span className="text-[15px] font-bold text-slate-700 flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5" /> {detailData.location}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] font-bold text-slate-400">사용승인</span>
                            <span className="text-[15px] font-bold text-slate-700 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> 1997년 (27년차)
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] font-bold text-slate-400">세대수</span>
                            <span className="text-[15px] font-bold text-slate-700 flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" /> 3,129세대
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] font-bold text-slate-400">주차</span>
                            <span className="text-[15px] font-bold text-slate-700 flex items-center gap-1">
                                <Car className="w-3.5 h-3.5" /> 세대당 0.8대
                            </span>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* 2. Chart Card */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="p-6 bg-white min-h-[450px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                                    {(['매매', '전세', '월세'] as ChartType[]).map(type => (
                                        <button
                                                key={type}
                                                onClick={() => setChartType(type)}
                                                className={`px-4 py-1.5 text-[13px] font-bold rounded-md transition-all ${
                                                    chartType === type
                                                    ? 'bg-white text-slate-900 shadow-sm'
                                                    : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Segmented Control for Period */}
                                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                                    {['1년', '3년', '전체'].map(p => (
                                        <button 
                                            key={p} 
                                            onClick={() => setChartPeriod(p)} 
                                            className={`px-3 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                                                chartPeriod === p 
                                                ? 'bg-white text-slate-900 shadow-sm' 
                                                : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
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
                        <div className="">
                            <h3 className="text-[17px] font-black text-slate-900 mb-4 px-1">주변 시세 비교</h3>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col divide-y divide-slate-50">
                                {detailData.neighbors.map((item, i) => (
                                    <NeighborItem key={i} item={item} currentPrice={detailData.currentPrice} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Transaction Table & Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="bg-white overflow-hidden flex flex-col h-[500px]">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="text-[16px] font-black text-slate-900">실거래 내역</h3>
                                <select 
                                    value={txFilter}
                                    onChange={(e) => setTxFilter(e.target.value as TransactionType)}
                                    className="text-[12px] font-bold bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 focus:ring-0 focus:border-slate-300"
                                >
                                    <option value="전체">전체</option>
                                    <option value="매매">매매</option>
                                    <option value="전세">전세</option>
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-4 py-3 px-4 bg-slate-50/50 text-[12px] font-bold text-slate-500 border-b border-slate-100">
                                <div className="pl-4">일자</div>
                                <div className="text-center">구분</div>
                                <div className="text-center">층</div>
                                <div className="text-right pr-4">거래액</div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {filteredTransactions.map((tx, i) => (
                                    <TransactionRow key={i} tx={tx} />
                                ))}
                            </div>
                        </Card>

                        <Card className="bg-white overflow-hidden">
                            <div className="p-5 border-b border-slate-100">
                                <h3 className="text-[16px] font-black text-slate-900">단지 정보</h3>
                            </div>
                            <div className="divide-y divide-slate-50">
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
            </div>
          </>
      )}

      {isCompact && (
          // Compact View for Map Side Panel
          <div className="px-5 py-4 bg-white border-b border-slate-100">
               <div className="flex flex-col gap-1">
                    <FormatPrice val={detailData.currentPrice} sizeClass="text-2xl" />
                    <span className={`text-[15px] font-bold flex items-center tabular-nums ${detailData.diffRate >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                        {detailData.diffRate >= 0 ? '▲' : '▼'} {Math.abs(detailData.diff)}만원 ({Math.abs(detailData.diffRate)}%)
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
      )}
    </div>
  );
};