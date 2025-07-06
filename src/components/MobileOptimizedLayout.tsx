
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MobileOptimizedLayout = ({ children, className = "" }: MobileOptimizedLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`
      ${isMobile ? 'px-4 py-6' : 'px-6 py-8'} 
      w-full max-w-none
      ${className}
    `}>
      {children}
    </div>
  );
};

export default MobileOptimizedLayout;
