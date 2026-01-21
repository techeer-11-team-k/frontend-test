import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ComparisonData {
  region: string;
  myProperty: number;
  regionAverage: number;
}

const mockData: ComparisonData[] = [
  { region: '수원시 영통구', myProperty: 14.2, regionAverage: 8.5 },
  { region: '시흥시 배곧동', myProperty: 9.7, regionAverage: 6.2 },
  { region: '김포시 장기동', myProperty: -7.1, regionAverage: -3.5 },
];

export const RegionComparisonChart: React.FC = () => {
  return (
    <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">지역 대비 수익률 비교</h2>
        <p className="text-[13px] text-slate-500 font-medium">내 단지 상승률 vs 해당 행정구역 평균 상승률</p>
      </div>
      
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="region" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }}
              textAnchor="middle"
              height={50}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }}
              tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value > 0 ? '+' : ''}${value.toFixed(1)}%`, '']}
            />
            <Bar 
              dataKey="myProperty" 
              name="myProperty"
              radius={[8, 8, 0, 0]}
            >
              {mockData.map((entry, index) => (
                <Cell 
                  key={`cell-my-${index}`} 
                  fill={entry.myProperty >= 0 
                    ? 'url(#myPropertyGradient)' 
                    : 'url(#myPropertyNegativeGradient)'
                  } 
                />
              ))}
            </Bar>
            <Bar 
              dataKey="regionAverage" 
              name="regionAverage"
              radius={[8, 8, 0, 0]}
            >
              {mockData.map((entry, index) => (
                <Cell 
                  key={`cell-avg-${index}`} 
                  fill={entry.regionAverage >= 0 
                    ? 'url(#regionAverageGradient)' 
                    : 'url(#regionAverageNegativeGradient)'
                  } 
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="myPropertyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="myPropertyNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                <stop offset="100%" stopColor="#f87171" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="regionAverageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="regionAverageNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom Legend - Below chart, Centered */}
      <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-[13px] font-bold text-slate-600">내 단지 상승률</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-[13px] font-bold text-slate-600">행정구역 평균</span>
        </div>
      </div>
    </div>
  );
};
