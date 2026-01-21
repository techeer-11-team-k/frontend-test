import React from 'react';
import { SemiCircleGauge } from './ui/SemiCircleGauge';
import { Calendar, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PortfolioData {
  region: string;
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
}

const portfolioData: PortfolioData[] = [
  { region: '서울', value: 50, color: '#3b82f6' },
  { region: '경기', value: 30, color: '#8b5cf6' },
  { region: '기타', value: 20, color: '#10b981' },
];

const mockEvents: EventItem[] = [
  {
    id: '1',
    title: '재산세 납부',
    date: '2024.07.15',
    daysLeft: 15,
    icon: <Calendar className="w-4 h-4" />,
    type: 'tax',
  },
  {
    id: '2',
    title: '관심 단지 실거래가 업데이트',
    date: '2024.07.01',
    icon: <TrendingUp className="w-4 h-4" />,
    type: 'update',
  },
  {
    id: '3',
    title: '부동산 등기 신고 마감',
    date: '2024.07.20',
    daysLeft: 20,
    icon: <FileText className="w-4 h-4" />,
    type: 'deadline',
  },
  {
    id: '4',
    title: '임대료 수령일',
    date: '2024.07.05',
    daysLeft: 5,
    icon: <AlertCircle className="w-4 h-4" />,
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

export const ProfileWidgetsCard: React.FC = () => {
  const currentReturnRate = 8.5;
  const targetReturnRate = 12.0;

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
          <p className="text-[15px] font-black text-slate-900 truncate">김부자님</p>
          <p className="text-[12px] text-slate-500 font-medium">투자자</p>
        </div>
      </div>

      {/* Gauge Chart Section */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <div className="mb-4">
          <h3 className="text-[13px] font-black text-slate-900 mb-1">부동산 투자 목표치 달성률</h3>
          <p className="text-[11px] text-slate-500 font-medium">연간 수익률 목표 대비</p>
        </div>
        <div className="flex justify-center py-2">
          <SemiCircleGauge 
            value={currentReturnRate}
            target={targetReturnRate}
            currentValue={currentReturnRate}
            size={140}
          />
        </div>
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-bold text-slate-600">현재 수익률</span>
            <span className="text-[15px] font-black text-slate-900 tabular-nums">{currentReturnRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-slate-600">목표 수익률</span>
            <span className="text-[15px] font-black text-slate-500 tabular-nums">{targetReturnRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Portfolio Donut Chart Section */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h3 className="text-[15px] font-black text-slate-900 mb-4">자산 포트폴리오</h3>
        
        <div className="flex flex-col items-center">
          <div className="w-[160px] h-[160px] relative mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  label={({ value }) => `${value}%`}
                  labelLine={false}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full space-y-1.5">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-[12px] font-bold text-slate-900">{item.region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div>
        <h3 className="text-[15px] font-black text-slate-900 mb-4">부동산 주요 일정</h3>
        
        <div className="space-y-0">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
            >
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
          ))}
        </div>
      </div>
    </div>
  );
};
