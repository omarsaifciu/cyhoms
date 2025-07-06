
import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const VerifiedBadge = ({ className, size = 'md' }: VerifiedBadgeProps) => {
  return (
    <div 
      className={cn("relative inline-flex items-center justify-center group overflow-hidden", className)}
      title="Verified Account"
    >
      <BadgeCheck 
        className={cn(
          sizeClasses[size],
          "text-yellow-400"
        )}
        strokeWidth={2.5}
        fill="gold"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
  );
};

export default VerifiedBadge;
