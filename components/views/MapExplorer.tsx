import React, { useState } from 'react';
import { Search, MapPin, Sparkles, SlidersHorizontal, Map } from 'lucide-react';
import { ViewProps } from '../../types';
import { MapSideDetail } from './MapSideDetail';

const MapMarker = ({ price, onClick, selected }: { price: string, onClick: () => void, selected: boolean }) => (
    <div 
        className={`relative group cursor-pointer transition-all duration-300 ${selected ? 'z-30 scale-110' : 'z-10 hover:z-20 hover:scale-105'}`} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
        <div className={`px-4 py-2 rounded-full flex items-center justify-center border transition-all
            ${selected 
                ? 'bg-deep-900 text-white border-white ring-4 ring-indigo-500/20 shadow-pop' 
                : 'bg-white text-slate-900 border-white/80 hover:bg-deep-900 hover:text-white shadow-pop'
            }`}
        >
            <span className="text-[13px] font-black tabular-nums">{price}</span>
        </div>
        {selected && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-500/30 rounded-full animate-ping pointer-events-none"></div>
        )}
    </div>
);

export const MapExplorer: React.FC<ViewProps> = ({ onPropertyClick, onToggleDock }) => {
  const [isAiActive, setIsAiActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const handleMarkerClick = (id: string) => {
      const isSelecting = selectedMarkerId !== id;
      setSelectedMarkerId(isSelecting ? id : null);
      if (onToggleDock) onToggleDock(!isSelecting); 
  };

  const handleCloseDetail = () => {
      setSelectedMarkerId(null);
      if (onToggleDock) onToggleDock(true);
  }

  const selectedProperty = selectedMarkerId ? {
      id: selectedMarkerId,
      name: '래미안 원베일리',
      price: '42.5억',
      change: 11.8,
      location: '서초구 반포동',
      area: '84㎡'
  } : null;

  return (
    <div 
        className="relative w-full h-[100vh] md:h-[calc(100vh-4rem)] md:mt-0 overflow-hidden shadow-none bg-slate-100"
        onClick={() => { if(selectedMarkerId) handleCloseDetail(); }}
    >
      <div 
        className={`absolute top-5 left-4 right-4 md:top-6 md:left-8 md:right-auto md:w-[420px] z-20 flex flex-col gap-2 transition-all duration-300 opacity-100`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex gap-2 w-full">
            <div className="relative flex-1 h-[52px] rounded-xl shadow-deep md:shadow-sharp transition-all duration-300 transform bg-white">
                <div className="absolute inset-0 bg-white rounded-xl flex items-center overflow-hidden z-10 px-3 border border-slate-200/50">
                    <div className="w-8 h-full flex items-center justify-center flex-shrink-0">
                         <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    
                    <input 
                        type="text" 
                        className="flex-1 py-3 px-2 border-none bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 text-[15px] font-medium min-w-0" 
                        placeholder={isAiActive ? "AI에게 물어보세요..." : "지역, 아파트 검색"} 
                    />
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                         <button 
                            onClick={() => setIsAiActive(!isAiActive)}
                            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isAiActive ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                         >
                             <Sparkles className={`w-4 h-4 ${isAiActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                         </button>

                         <div className="w-px h-4 bg-slate-200"></div>

                         <button 
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${isSettingsOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                             <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <button className="hidden md:flex w-[52px] h-[52px] rounded-xl bg-white border border-slate-200 shadow-sharp items-center justify-center text-slate-600 hover:text-blue-600 transition-colors active:scale-95">
                <Map className="w-5 h-5" />
            </button>
        </div>

        {(isSettingsOpen || isAiActive) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 shadow-deep border border-slate-100 animate-slide-up origin-top">
                {isAiActive ? (
                    <div className="space-y-3">
                         <p className="text-[13px] font-bold text-indigo-500 mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI 추천 질문
                         </p>
                         <div className="flex flex-wrap gap-2">
                             {['한강뷰 아파트 찾아줘', '5억 이하 갭투자', '학군 좋은 곳'].map(q => (
                                 <button key={q} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[13px] font-bold hover:bg-indigo-100 transition-colors">
                                     {q}
                                 </button>
                             ))}
                         </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                         <div className="flex justify-between items-center">
                             <span className="text-[15px] font-bold text-slate-700">매매/전세</span>
                             <div className="flex bg-slate-100 rounded-lg p-0.5">
                                 <button className="px-3 py-1.5 bg-white rounded-md shadow-sm text-[13px] font-bold text-slate-900">매매</button>
                                 <button className="px-3 py-1.5 text-slate-400 text-[13px] font-bold hover:text-slate-600">전세</button>
                             </div>
                         </div>
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="w-full h-full bg-[#e3e8f0] relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
             <MapMarker price="42.5억" selected={selectedMarkerId === '1'} onClick={() => handleMarkerClick('1')} />
        </div>
        <div className="absolute top-1/3 right-1/4">
             <MapMarker price="15.2억" selected={selectedMarkerId === '2'} onClick={() => handleMarkerClick('2')} />
        </div>
      </div>

      <div className={`md:hidden fixed inset-x-0 bottom-0 z-[100] transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${selectedProperty ? 'translate-y-0' : 'translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
           <div className="bg-white/95 backdrop-blur-2xl rounded-t-[24px] p-6 shadow-deep border-t border-slate-100 pb-10">
               <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
               {selectedProperty && (
                   <div onClick={() => onPropertyClick(selectedProperty.id)}>
                       <div className="flex justify-between items-start mb-4">
                           <div>
                               <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{selectedProperty.name}</h3>
                               <p className="text-slate-500 font-medium text-[15px]">{selectedProperty.area} • {selectedProperty.location}</p>
                           </div>
                       </div>
                       <div className="flex items-end gap-2 mb-6">
                           <span className="text-2xl font-black text-slate-900 tabular-nums">{selectedProperty.price}</span>
                           <span className="text-[15px] font-bold text-brand-red mb-1 flex items-center tabular-nums">
                               ▲ {selectedProperty.change}%
                           </span>
                       </div>
                       <button className="w-full bg-deep-900 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-[15px]">
                           상세 정보 전체보기
                       </button>
                   </div>
               )}
           </div>
      </div>

      <div 
        className={`hidden md:block absolute top-0 right-0 bottom-0 w-[420px] bg-white z-40 shadow-deep transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${selectedMarkerId ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
          {selectedMarkerId && (
              <MapSideDetail 
                  propertyId={selectedMarkerId} 
                  onClose={handleCloseDetail} 
                  onOpenDetail={onPropertyClick} 
              />
          )}
      </div>

    </div>
  );
};