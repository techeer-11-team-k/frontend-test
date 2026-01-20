import React from 'react';
import { X, MapPin, ExternalLink } from 'lucide-react';
import { PropertyDetail } from './PropertyDetail';

interface MapSideDetailProps {
  propertyId: string;
  onClose: () => void;
  onOpenDetail?: (id: string) => void;
}

export const MapSideDetail: React.FC<MapSideDetailProps> = ({ propertyId, onClose, onOpenDetail }) => {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative border-l border-slate-200">
      {/* Revised Header for Side Panel */}
      <div className="sticky top-0 z-[100] px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-md">
         <div className="flex items-start justify-between mb-1">
             <div>
                 <h2 className="text-xl font-black text-slate-900 leading-tight">래미안 원베일리</h2>
                 <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[15px] font-medium">서울시 서초구 반포동</span>
                 </div>
             </div>
             <div className="flex items-center gap-2">
                 <button 
                    onClick={() => onOpenDetail && onOpenDetail(propertyId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[13px] font-bold rounded-lg transition-colors"
                 >
                     <ExternalLink className="w-3.5 h-3.5" />
                     더 자세히 보기
                 </button>
                 <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                 >
                     <X className="w-5 h-5" />
                 </button>
             </div>
         </div>
      </div>
      
      {/* Content Area - Pass isCompact={true} to adjust layout */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50">
          <PropertyDetail propertyId={propertyId} onBack={() => {}} isCompact={true} />
      </div>
    </div>
  );
};