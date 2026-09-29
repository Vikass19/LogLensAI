import React from 'react';

interface LogLensLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  showBadge?: boolean;
}

export const LogLensLogo: React.FC<LogLensLogoProps> = ({
  className = '',
  size = 32,
  showText = true,
  showBadge = true,
}) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* SVG Icon matching Image 11 and 12 */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-[#090d16] border border-[#1e293b] p-1 shadow-md shadow-cyan-950/30 shrink-0"
        style={{ width: size, height: size }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dashed outer orbit ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="38" 
            stroke="#0284c7" 
            strokeWidth="5" 
            strokeDasharray="6 7" 
            opacity="0.85" 
          />
          
          {/* Inner solid glowing ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="26" 
            stroke="#6366f1" 
            strokeWidth="5.5" 
          />
          
          {/* Orbiting glowing cyan satellite dot */}
          <circle 
            cx="68" 
            cy="32" 
            r="5" 
            fill="#06b6d4" 
          />

          {/* Terminal Command Prompt Chevron `>` */}
          <path 
            d="M40 39L49 49.5L40 60" 
            stroke="#38bdf8" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Terminal Underscore/Cursor `_` */}
          <path 
            d="M54 58.5H62" 
            stroke="#c084fc" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {showText && (
        <span className="font-semibold text-[17px] tracking-tight text-[#dfe2ed] flex items-center">
          LogLens<span className="text-[#4cd7f6] font-bold">AI</span>
        </span>
      )}

      {showBadge && (
        <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#262a32] text-[#4cd7f6] border border-[#4cd7f6]/30 font-semibold tracking-wider ml-1">
          PRO
        </span>
      )}
    </div>
  );
};
