import React, { useState, useEffect, useRef } from 'react';
import { Home, Compass, ArrowRightLeft, PieChart, Bell, Search, LogOut, X, Sparkles } from 'lucide-react';
import { ViewType, TabItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  isDetailOpen?: boolean;
  isDockVisible?: boolean;
}

const tabs: TabItem[] = [
  { id: 'dashboard', label: '홈', icon: Home },
  { id: 'map', label: '지도', icon: Compass },
  { id: 'compare', label: '비교', icon: ArrowRightLeft },
  { id: 'stats', label: '통계', icon: PieChart },
];

const Logo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-2xl font-black tracking-tight text-deep-900 font-sans">SweetHome</span>
    </div>
);

// Search Overlay Component - Centered Popup for PC
const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [isAiMode, setIsAiMode] = useState(false);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4">
            {/* Backdrop with Blur */}
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6">
                    {/* Search Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`flex-1 flex items-center h-14 px-5 rounded-2xl border transition-all duration-300 ${isAiMode ? 'border-transparent ring-2 ring-indigo-500 shadow-glow bg-white' : 'border-slate-200 bg-slate-50'}`}>
                            <Search className={`w-5 h-5 ${isAiMode ? 'text-indigo-500' : 'text-slate-400'}`} />
                            <input 
                                type="text" 
                                placeholder={isAiMode ? "AI에게 부동산 질문을 해보세요..." : "지역, 아파트, 학교명 검색"} 
                                className="flex-1 ml-3 bg-transparent border-none focus:ring-0 text-[17px] font-bold text-slate-900 placeholder:text-slate-400 h-full"
                                autoFocus
                            />
                            <button 
                                onClick={() => setIsAiMode(!isAiMode)}
                                className={`p-2 rounded-lg transition-all ${isAiMode ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Sparkles className="w-5 h-5" />
                            </button>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-3 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="space-y-8 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                        {/* Recent Searches */}
                        <section>
                            <h3 className="text-[15px] font-black text-slate-900 mb-3">최근 검색</h3>
                            <div className="flex flex-wrap gap-2">
                                {['반포 래미안', '한강뷰', '강남 신축', '학군지'].map((term, i) => (
                                    <button key={i} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-[13px] font-bold text-slate-600 flex items-center gap-2 transition-colors border border-slate-200">
                                        {term}
                                        <X className="w-3 h-3 text-slate-400" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Popular Searches */}
                        <section>
                            <div className="flex justify-between items-end mb-3">
                                <h3 className="text-[15px] font-black text-slate-900">인기 검색</h3>
                                <span className="text-[11px] font-bold text-slate-400">오늘 22:30 기준</span>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { rank: 1, name: '반포 래미안 원베일리', change: '+8.54%', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop' },
                                    { rank: 2, name: '개포 자이 프레지던스', change: '+0.58%', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&h=100&fit=crop' },
                                    { rank: 3, name: '송도 더샵 센트럴파크', change: '-5.53%', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop' },
                                    { rank: 4, name: '압구정 현대 힐스테이트', change: '-2.59%', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=100&h=100&fit=crop' },
                                    { rank: 5, name: '잠실 롯데캐슬 골드', change: '+1.42%', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=100&h=100&fit=crop' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className={`w-4 text-center font-black text-[15px] ${i < 3 ? 'text-brand-blue' : 'text-slate-400'}`}>{item.rank}</span>
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-100">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-slate-900 text-[15px]">{item.name}</span>
                                        </div>
                                        <span className={`text-[13px] font-bold tabular-nums ${item.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                            {item.change}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curated Picks */}
                        <section>
                             <h3 className="text-[15px] font-black text-slate-900 mb-3">인기있는 아파트 골라보기</h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                 {[
                                     { title: '저평가 지수 단지', desc: '가치 대비 저렴한 아파트' },
                                     { title: '랜드마크 대장주', desc: '지역 시세를 이끄는 대장주' },
                                     { title: '재건축 유망주', desc: '미래 가치가 기대되는 단지' },
                                 ].map((card, i) => (
                                     <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:bg-white hover:border-slate-200 hover:shadow-soft transition-all cursor-pointer">
                                         <h4 className="font-black text-slate-900 text-[15px] mb-1">{card.title}</h4>
                                         <p className="text-[13px] text-slate-500 font-medium">{card.desc}</p>
                                     </div>
                                 ))}
                             </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, isDetailOpen = false, isDockVisible = true }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const isMapMode = currentView === 'map' && !isDetailOpen;
  const isDashboard = currentView === 'dashboard';
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Mesh Gradient Background */}
      <div className="mesh-gradient-bg" />
      
      <div className={`min-h-screen text-slate-900 selection:bg-brand-blue selection:text-white ${
        isMapMode ? 'overflow-hidden' : ''
      }`}>
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* ----------------------------------------------------------------------
          PC HEADER (Original Design - Restored)
      ----------------------------------------------------------------------- */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 items-center justify-between px-8 bg-white/95 backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80 mx-8 mt-4 rounded-[28px]">
        <div className="flex items-center gap-12">
          <div onClick={() => onChangeView('dashboard')} className="cursor-pointer">
              <Logo />
          </div>
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onChangeView(tab.id)}
                className={`px-4 py-2 rounded-lg text-[15px] font-bold transition-all duration-300 flex items-center gap-2 ${
                  currentView === tab.id 
                    ? 'text-deep-900 bg-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={19} strokeWidth={currentView === tab.id ? 2.5 : 2} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
                <Search className="w-5 h-5" />
            </button>
            <div className="relative group cursor-pointer p-2 rounded-full hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-coral rounded-full border border-white"></span>
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
                <div 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white shadow-md cursor-pointer hover:ring-2 hover:ring-slate-100 transition-all active:scale-95"
                >
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
                </div>
                
                {isProfileOpen && (
                    <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-deep border border-slate-200 p-2 animate-enter origin-top-right overflow-hidden z-50">
                        <div className="p-3 border-b border-slate-50 mb-1">
                             <p className="font-bold text-slate-900 text-[15px]">김부자님</p>
                             <p className="text-[13px] text-slate-400">rich.kim@sweethome.com</p>
                        </div>
                        <div className="mt-1 pt-1">
                             <button className="w-full text-left px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium">
                                 <LogOut className="w-4 h-4" /> 로그아웃
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`${
        isMapMode 
          ? 'h-screen w-full p-0 md:pt-16 md:px-0' 
          : (isDashboard ? 'pt-0 md:pt-24 px-0 md:px-8' : 'pt-14 md:pt-24 px-4 md:px-8')
      } ${isDashboard ? 'max-w-[1600px] 2xl:max-w-[1760px]' : 'max-w-[1400px]'} ${isMapMode ? '' : 'mx-auto'} min-h-screen relative`}>
        
        {/* Mobile Header */}
        {isDashboard && !isDetailOpen && !isMapMode && (
          <div className={`md:hidden flex justify-between items-center mb-0 pt-6 pb-4 px-6 z-20 relative animate-fade-in`}>
              <div className="flex items-center gap-3" onClick={() => setIsProfileOpen(true)}>
                 <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white shadow-md">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
                 </div>
                 <div>
                    <p className="text-[13px] font-medium mb-0.5 text-slate-500">Good Morning</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">김부자님</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 rounded-full shadow-sm border border-slate-200/60 bg-white text-slate-400 active:bg-slate-50 active:scale-95 transition-all"
                >
                    <Search className="w-5 h-5" />
                </button>
                <div className="relative p-2.5 rounded-full shadow-sm border border-slate-200/60 bg-white text-slate-400 active:bg-slate-50 active:scale-95 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-coral rounded-full border border-white"></span>
                </div>
              </div>
          </div>
        )}
        
        <div key={currentView} className="animate-fade-in">
             {children}
        </div>
      </main>

      {/* Footer */}
      {!isMapMode && (
          <footer className="mt-20 border-t border-slate-200 bg-white py-12 px-8">
              <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-1">
                      <Logo className="mb-4" />
                      <p className="text-[13px] text-slate-400 leading-relaxed">
                          스위트홈은 데이터 기반의 부동산 의사결정을 지원하는<br/>
                          프리미엄 자산 관리 서비스입니다.
                      </p>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-900 mb-4 text-[15px]">서비스</h4>
                      <ul className="space-y-2 text-[13px] text-slate-500">
                          <li className="hover:text-slate-900 cursor-pointer">자산 분석</li>
                          <li className="hover:text-slate-900 cursor-pointer">시장 동향</li>
                          <li className="hover:text-slate-900 cursor-pointer">세금 계산기</li>
                      </ul>
                  </div>
                   <div>
                      <h4 className="font-bold text-slate-900 mb-4 text-[15px]">고객지원</h4>
                      <ul className="space-y-2 text-[13px] text-slate-500">
                          <li className="hover:text-slate-900 cursor-pointer">자주 묻는 질문</li>
                          <li className="hover:text-slate-900 cursor-pointer">문의하기</li>
                          <li className="hover:text-slate-900 cursor-pointer">이용약관</li>
                      </ul>
                  </div>
                  <div>
                      <p className="text-[13px] text-slate-400">
                          (주)스위트홈 | 대표: 홍길동<br/>
                          서울시 강남구 테헤란로 123<br/>
                          사업자등록번호: 123-45-67890<br/>
                          Copyright © SweetHome. All rights reserved.
                      </p>
                  </div>
              </div>
          </footer>
      )}

      {/* Mobile Floating Dock */}
      {!isDetailOpen && (
        <nav 
            className={`md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[280px] h-[64px]
                        bg-white/80 backdrop-blur-2xl 
                        rounded-full 
                        shadow-[0_8px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.2)] 
                        flex justify-between items-center px-6 z-[90] 
                        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                        ${isDockVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[200%] opacity-0 scale-90'}`}
        >
          {tabs.map((tab) => {
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeView(tab.id)}
                className="relative z-10 flex flex-col items-center justify-center w-12 h-12 group"
              >
                <div 
                  className={`flex items-center justify-center p-2.5 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-deep-900 text-white shadow-lg scale-110' 
                      : 'text-slate-400 hover:text-slate-600 active:scale-95'
                  }`}
                >
                  <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </button>
            );
          })}
        </nav>
      )}
    </div>
    </>
  );
};