import React from "react";

interface LogoIconProps {
  className?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 100 110" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* 1. Curved document outline */}
      <path 
        d="M 22 10 
           H 68 
           L 90 32 
           V 95 
           C 90 100, 85 105, 80 105 
           H 25 
           C 20 105, 15 100, 15 95 
           V 17 
           C 15 12, 18 10, 22 10 
           Z" 
        stroke="currentColor" 
        strokeWidth="6.5" 
        strokeLinecap="round"
        strokeLinejoin="round" 
      />
      
      {/* 2. Top-right page corner fold */}
      <path 
        d="M 68 10 
           V 32 
           H 90 
           Z" 
        fill="currentColor" 
      />
      
      {/* 3. Stylized R character inside document */}
      <path 
        d="M 40 40
           V 82
           M 40 43
           H 58
           C 66 43, 68 58, 58 60
           H 40
           M 53 60
           L 68 82" 
        stroke="currentColor" 
        strokeWidth="7" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* 4. Elegant node decoration above the R */}
      <circle cx="58" cy="35" r="4.5" fill="currentColor" />
    </svg>
  );
};
