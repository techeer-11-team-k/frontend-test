import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProfessionalChart } from '../ui/ProfessionalChart';
import { ViewProps } from '../../types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { myProperties } from './Dashboard'; 

const generateSparklineData = (trend: 'up' | 'down' | 'flat', basePrice: number) => {
    const data = [];
    let current = basePrice;
    const now = new Date();
    for(let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const change = trend === 'up' ? Math.random() * 0.8 : (trend === 'down' ? -Math.random() * 0.8 : (Math.random() - 0.5));
        current = current * (1 + change / 100);
        data.push({ time: date.toISOString().split('T')[0], value: current });
    }
    return data;
};

const COLORS = ['#3182F6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const comparisonData = [
    { id: '1', myName: '수원 영통 황골', myPrice: 32000, leaderName: '광교 중흥S클래스', leaderPrice: 155000, avgRatio: 25 },
    { id: '2', myName: '시흥 배곧 호반', myPrice: 45000, leaderName: '배곧 써밋플레이스', leaderPrice: 65000, avgRatio: 75 },
    { id: '3', myName: '김포 한강 자이', myPrice: 39000, leaderName: '걸포 메트로자이', leaderPrice: 72000, avgRatio: 60 },
    { id: '4', myName: '인천 송도 더샵', myPrice: 51000, leaderName: '송도 잭니클라우스', leaderPrice: 110000, avgRatio: 50 },
];

export const PortfolioList: React.FC<ViewProps & { onBack: () => void }> = ({ onPropertyClick, onBack }) => {
  const formatPrice = (val: number) => {
    const eok = Math.floor(val / 10000);
    const man = val % 10000;
    
    if (eok === 0) {
      // 1억 미만인 경우
      return `${man.toLocaleString()}만원`;
    } else {
      // 1억 이상인 경우
      return `${eok}억 ${man > 0 ? man.toLocaleString() : ''}만원`;
    }
  };

  const totalPurchase = myProperties.reduce((acc, curr) => acc + curr.purchasePrice, 0);
  const totalCurrent = myProperties.reduce((acc, curr) => acc + curr.currentPrice, 0);
  const totalLoan = myProperties.reduce((acc, curr) => acc + (curr.loan || 0), 0);
  const totalProfit = totalCurrent - totalPurchase;
  const totalReturn = ((totalProfit / totalPurchase) * 100).toFixed(1);
  const netWorth = totalCurrent - totalLoan;
  
  const ltvRatio = ((totalLoan / totalCurrent) * 100).toFixed(1);
  const netWorthRatio = (100 - parseFloat(ltvRatio)).toFixed(1);

  const allocationData = useMemo(() => {
      const regionMap: {[key: string]: number} = {};
      myProperties.forEach(p => {
          const region = p.location.split(' ')[0]; 
          regionMap[region] = (regionMap[region] || 0) + 1;
      });
      const total = myProperties.length;
      return Object.keys(regionMap).map((region, idx) => ({
          name: region,
          value: Math.round((regionMap[region] / total) * 100),
          color: COLORS[idx % COLORS.length]
      }));
  }, []);

  return (
    <div className="animate-fade-in min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-[17px] font-black tracking-tight text-slate-900">포트폴리오 심층 분석</h1>
              </div>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[13px] font-bold text-slate-500">LIVE</span>
          </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white border-slate-200 p-6 hover:shadow-soft transition-all">
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-2">총 자산 규모 (GAV)</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{formatPrice(totalCurrent)}</p>
                  <div className="flex items-center gap-2 mt-2 text-[15px]">
                      <span className="text-brand-red font-bold tabular-nums">+1.2%</span>
                  </div>
              </Card>

              <Card className="bg-white border-slate-200 p-6 hover:shadow-soft transition-all">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">순자산 (NAV)</p>
                    <span className="text-[13px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded tabular-nums">{netWorthRatio}%</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{formatPrice(netWorth)}</p>
                  <div className="w-full h-1.5 mt-4 rounded-full overflow-hidden flex bg-slate-100">
                      <div className="h-full bg-slate-300" style={{ width: `${ltvRatio}%` }}></div>
                      <div className="h-full bg-emerald-500" style={{ width: `${netWorthRatio}%` }}></div>
                  </div>
              </Card>

              <Card className="bg-white border-slate-200 p-6 hover:shadow-soft transition-all">
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-2">총 평가 차익</p>
                  <p className={`text-3xl font-black tracking-tight tabular-nums ${totalProfit >= 0 ? 'text-brand-red' : 'text-brand-blue'}`}>
                      {totalProfit > 0 ? '+' : ''}{formatPrice(totalProfit)}
                  </p>
                  <p className={`text-[15px] font-bold mt-2 tabular-nums ${totalProfit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                       {totalReturn}%
                  </p>
              </Card>

              <Card className="bg-white border-slate-200 p-6 hover:shadow-soft transition-all">
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-2">예상 세금</p>
                  <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-[15px] border-b border-slate-50 pb-1">
                          <span className="text-slate-500 font-bold text-[13px]">보유세</span>
                          <span className="text-slate-800 font-bold tabular-nums">640만원</span>
                      </div>
                      <div className="flex justify-between text-[15px]">
                          <span className="text-slate-500 font-bold text-[13px]">양도세</span>
                          <span className="text-slate-800 font-bold tabular-nums">1.5억</span>
                      </div>
                  </div>
              </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-white border-slate-200 p-8 lg:col-span-1 min-h-[350px] flex flex-col shadow-soft">
                  <h3 className="text-[15px] font-black text-slate-900 mb-6 border-b border-slate-100 pb-3">
                      지역별 자산 비중
                  </h3>
                  <div className="flex-1 w-full min-h-[200px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={allocationData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              stroke="none"
                              cornerRadius={4}
                            >
                              {allocationData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-black text-slate-900 tabular-nums">{myProperties.length}</span>
                      </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                      {allocationData.map((d, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                              <span className="text-[13px] font-bold text-slate-600 tabular-nums">{d.name} {d.value}%</span>
                          </div>
                      ))}
                  </div>
              </Card>

              <Card className="bg-white border-slate-200 p-8 lg:col-span-2 min-h-[350px] flex flex-col shadow-soft">
                  <h3 className="text-[15px] font-black text-slate-900 mb-4 border-b border-slate-100 pb-3">
                      대장주 키맞추기 분석
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1">
                      {comparisonData.map((item, idx) => {
                          const currentRatio = (item.myPrice / item.leaderPrice) * 100;
                          const isUndervalued = currentRatio < item.avgRatio;
                          const gapPercent = (item.avgRatio - currentRatio).toFixed(1);

                          return (
                            <div key={idx} className="border border-slate-100 rounded-xl p-5 hover:border-slate-300 transition-colors">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-slate-400 font-bold mb-0.5">{item.myName}</span>
                                        <span className="text-[15px] font-black text-slate-900 tabular-nums">{formatPrice(item.myPrice)}</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[11px] text-slate-500 font-bold bg-slate-100 px-1.5 rounded">{item.leaderName}</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-400 tabular-nums mt-0.5">{formatPrice(item.leaderPrice)}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[13px] font-bold items-center">
                                        <span className="text-slate-500">비율</span>
                                        <span className={`tabular-nums flex items-center gap-2 ${isUndervalued ? "text-emerald-600" : "text-slate-600"}`}>
                                            {currentRatio.toFixed(1)}% 
                                            {isUndervalued && <span className="text-[11px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">저평가 ({gapPercent}%)</span>}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative">
                                        <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" style={{ left: `${item.avgRatio}%` }}></div>
                                        <div className={`h-full rounded-full ${isUndervalued ? 'bg-emerald-400' : 'bg-slate-400'}`} style={{ width: `${currentRatio}%` }}></div>
                                    </div>
                                </div>
                            </div>
                          );
                      })}
                  </div>
              </Card>
          </div>

          <div className="space-y-4">
              <h3 className="text-[15px] font-black text-slate-900 border-b border-slate-200 pb-3">보유 자산 상세</h3>
              {myProperties.map((prop, idx) => {
                  const trend = prop.changeRate > 0 ? 'up' : 'down';
                  const sparkData = generateSparklineData(trend, prop.currentPrice);
                  const isProfit = prop.changeRate >= 0;

                  return (
                      <div 
                          key={prop.id}
                          onClick={() => onPropertyClick(prop.id)}
                          className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer group grid grid-cols-1 md:grid-cols-12 gap-6 items-center active:scale-[0.99] shadow-sm hover:shadow-soft"
                      >
                          <div className="md:col-span-4">
                              <div className="flex items-center gap-3">
                                  <div>
                                      <h4 className="font-bold text-slate-900 text-[15px] group-hover:text-blue-600 transition-colors">{prop.name}</h4>
                                      <div className="flex items-center gap-1 text-[13px] text-slate-400 font-medium mt-0.5">
                                          {prop.location}
                                          <span className="text-slate-300">|</span>
                                          <span className="tabular-nums">{prop.area}㎡</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="hidden md:block md:col-span-3 h-10 opacity-60">
                              <ProfessionalChart 
                                  data={sparkData} 
                                  height={40} 
                                  theme="light" 
                                  isSparkline={true}
                                  lineColor={isProfit ? '#FF4B4B' : '#3182F6'}
                                  areaTopColor={isProfit ? 'rgba(255, 75, 75, 0.1)' : 'rgba(49, 130, 246, 0.1)'}
                              />
                          </div>
                          <div className="md:col-span-5 flex justify-between items-center pl-4 border-l border-slate-100">
                              <div className="text-right">
                                  <p className="text-[11px] font-bold text-slate-400 uppercase">현재 시세</p>
                                  <p className="text-[15px] font-black text-slate-900 tabular-nums">{formatPrice(prop.currentPrice)}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[11px] font-bold text-slate-400 uppercase">평가 손익</p>
                                  <div className={`text-[15px] font-black tabular-nums ${isProfit ? 'text-brand-red' : 'text-brand-blue'}`}>
                                      {isProfit ? '+' : ''}{prop.changeRate}%
                                  </div>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
};