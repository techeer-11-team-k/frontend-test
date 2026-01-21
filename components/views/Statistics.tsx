import React from 'react';
import { Card } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, ReferenceLine, Cell } from 'recharts';

const rvolData = [
    { month: '25.01', value: 0.7 },
    { month: '02', value: 1.15 },
    { month: '03', value: 1.5 },
    { month: '04', value: 1.25 },
    { month: '05', value: 1.38 },
    { month: '06', value: 1.65 },
    { month: '07', value: 1.1 },
    { month: '08', value: 1.05 },
    { month: '09', value: 1.4 },
    { month: '10', value: 1.42 },
    { month: '11', value: 1.28 },
    { month: '12', value: 1.20 },
];

const marketPhases = [
    { region: '서울 강남', phase: '상승기', trend: 'up', change: '+1.5%', color: 'text-brand-red', bg: 'bg-red-50' },
    { region: '서울 마포', phase: '회복기', trend: 'up', change: '+0.8%', color: 'text-orange-500', bg: 'bg-orange-50' },
    { region: '경기 과천', phase: '상승기', trend: 'up', change: '+1.2%', color: 'text-brand-red', bg: 'bg-red-50' },
    { region: '대구 수성', phase: '침체기', trend: 'down', change: '-0.5%', color: 'text-brand-blue', bg: 'bg-blue-50' },
    { region: '부산 해운대', phase: '후퇴기', trend: 'down', change: '-0.2%', color: 'text-slate-500', bg: 'bg-slate-100' },
    { region: '인천 송도', phase: '회복기', trend: 'up', change: '+0.4%', color: 'text-orange-500', bg: 'bg-orange-50' },
];

const hpiData = [
    { name: '서울특별시', value: 104.4, change: 0.51, isPositive: true },
    { name: '세종특별자치시', value: 102.9, change: 0.16, isPositive: true },
    { name: '경기도', value: 101.5, change: 0.23, isPositive: true },
    { name: '인천광역시', value: 100.0, change: 0.18, isPositive: true },
    { name: '부산광역시', value: 99.5, change: -0.07, isPositive: false },
    { name: '대구광역시', value: 98.2, change: -0.15, isPositive: false },
];

const migrationData = [
    { name: '경기', value: 4500, label: '순유입' },
    { name: '인천', value: 1200, label: '순유입' },
    { name: '충남', value: 800, label: '순유입' },
    { name: '서울', value: -3500, label: '순유출' },
    { name: '부산', value: -1500, label: '순유출' },
];

export const Statistics: React.FC = () => {
  return (
    <div className="space-y-8 pb-32 animate-fade-in px-4 md:px-0 pt-6">
      
      <div className="md:hidden pt-2 pb-2">
        <h1 className="text-2xl font-black text-slate-900">통계</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                시장 심층 분석 
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[13px] font-bold">Pro</span>
            </h2>
            <p className="text-[15px] text-slate-500">빅데이터 기반 부동산 시장 흐름 분석</p>
          </div>
          <div className="flex gap-2">
              <select className="bg-white border border-slate-200 text-slate-700 text-[15px] rounded-lg focus:ring-slate-900 block p-2 shadow-sm font-bold">
                <option>전국</option>
                <option>수도권</option>
                <option>지방 5대광역시</option>
              </select>
          </div>
      </div>

      {/* 1. RVOL Chart */}
      <Card className="p-0 overflow-hidden border border-slate-200 shadow-soft bg-white">
          <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-[17px]">상대 거래량 (RVOL)</h3>
              <p className="text-[13px] text-slate-500 font-medium mt-1">최근 12개월 평균 대비 거래량 강도 (1.0 이상: 활발)</p>
          </div>
          <div className="p-6 bg-gradient-to-b from-white to-slate-50/20">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rvolData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} 
                        dy={10} 
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} 
                        domain={[0.5, 'dataMax + 0.2']}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}
                        labelStyle={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}
                    />
                    <ReferenceLine y={1} stroke="#cbd5e1" strokeDasharray="3 3" />
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3182F6" 
                        strokeWidth={2} 
                        dot={{r: 3, strokeWidth: 2, fill: '#fff', stroke: '#3182F6'}} 
                        activeDot={{r: 5, fill: '#3182F6', stroke: '#fff', strokeWidth: 2}} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          </div>
      </Card>

      {/* 2. Market Phases */}
      <Card className="p-0 overflow-hidden border border-slate-200 shadow-soft bg-white">
           <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-[17px]">시장 국면 분석</h3>
              <p className="text-[13px] text-slate-500 font-medium mt-1">가격/거래량 데이터를 기반으로 한 지역별 시장 단계</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketPhases.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                      <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-[12px] ${item.bg} ${item.color}`}>
                              {item.phase.slice(0, 2)}
                          </div>
                          <div>
                              <p className="font-bold text-slate-900 text-[15px]">{item.region}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className={`px-2.5 py-1 rounded text-[12px] font-bold ${item.phase === '상승기' ? 'bg-red-50 text-brand-red' : (item.phase === '회복기' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500')}`}>
                              {item.phase}
                          </div>
                          <p className={`text-[12px] font-bold mt-1 tabular-nums ${item.trend === 'up' ? 'text-brand-red' : 'text-brand-blue'}`}>{item.change}</p>
                      </div>
                  </div>
              ))}
          </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3. HPI */}
          <Card className="p-0 overflow-hidden border border-slate-200 shadow-soft bg-white">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-900 text-[17px]">주택가격지수 (HPI)</h3>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">2025.03 기준</p>
                  </div>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4 bg-slate-50/30">
                  {hpiData.map((region, idx) => (
                      <div key={idx} className={`p-5 rounded-xl border bg-white ${region.isPositive ? 'border-red-100' : 'border-blue-100'} hover:shadow-sm transition-shadow`}>
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-[13px] font-bold text-slate-500">{region.name}</span>
                          </div>
                          <div className="flex items-baseline justify-between">
                              <span className="text-xl font-black text-slate-800 tabular-nums">{region.value}</span>
                              <span className={`text-[14px] font-bold tabular-nums ${region.isPositive ? 'text-brand-red' : 'text-brand-blue'}`}>
                                  {region.isPositive ? '+' : ''}{region.change}%
                              </span>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>

          {/* 4. Migration */}
          <Card className="p-0 overflow-hidden border border-slate-200 shadow-soft bg-white">
               <div className="p-6 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-[17px]">인구 순이동</h3>
                  <p className="text-[13px] text-slate-500 mt-1 font-medium">최근 3개월 지역별 인구 전입/전출</p>
              </div>
              <div className="p-6 h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        layout="vertical" 
                        data={migrationData} 
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            tick={{ fontSize: 13, fontWeight: 'bold', fill: '#475569' }} 
                            axisLine={false} 
                            tickLine={false} 
                            width={40}
                          />
                          <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                          />
                          <ReferenceLine x={0} stroke="#cbd5e1" />
                          <Bar dataKey="value" barSize={20} radius={[4, 4, 4, 4]}>
                              {migrationData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#f59e0b' : '#3182F6'} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>
      </div>
    </div>
  );
};