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
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
        </defs>
        {/* The Gauge Ring */}
        <circle 
            cx="50" cy="50" r="38" 
            stroke="url(#blueGrad)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeDasharray="185" 
            strokeDashoffset="0" 
            transform="rotate(135 50 50)" 
        />
        {/* The T / Arrow */}
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