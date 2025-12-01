import React from 'react';

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className} 
    >
        <defs>
            <linearGradient id="ultraEcoGrad" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stopColor="#10b981" />   {/* Green */}
                <stop offset="92%" stopColor="#3b82f6" />  {/* Ultra Green */}
                <stop offset="100%" stopColor="#2563eb" /> {/* Blue Tail */}
            </linearGradient>
        </defs>
        <circle 
            cx="50" cy="50" r="38" 
            stroke="url(#ultraEcoGrad)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeDasharray="185" 
            strokeDashoffset="0" 
            transform="rotate(135 50 50)" 
        />
        <path 
            d="M50 30 V70 M35 45 L50 30 L65 45" 
            stroke="white" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
  );
};