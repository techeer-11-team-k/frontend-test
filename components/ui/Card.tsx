import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  noise?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false, noise = false, onClick }) => {
  const baseStyle = "rounded-[24px] transition-all duration-300 relative overflow-hidden";
  
  // Updated to use border instead of heavy shadow
  const solidStyle = "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-soft";
  const glassStyle = "glass-morphism shadow-glass";
  
  return (
    <div 
      className={`${baseStyle} ${glass ? glassStyle : solidStyle} ${noise ? 'bg-noise' : ''} ${className} ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};