
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Infinity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TrialCountdownProps {
  trialStartedAt: string;
  trialDays: number;
  userId: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TrialCountdown = ({ trialStartedAt, trialDays, userId }: TrialCountdownProps) => {
  const { currentLanguage } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  // التحقق من كون التجربة دائمة (تاريخ بداية قديم)
  const isPermanentTrial = trialStartedAt && new Date(trialStartedAt) < new Date('2010-01-01');

  useEffect(() => {
    // إذا كانت التجربة دائمة، لا نحتاج لحساب الوقت
    if (isPermanentTrial) {
      return;
    }

    const calculateTimeRemaining = () => {
      const trialStart = new Date(trialStartedAt);
      const trialEnd = new Date(trialStart.getTime() + (trialDays * 24 * 60 * 60 * 1000));
      const now = new Date();
      const diff = trialEnd.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
      setIsExpired(false);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [trialStartedAt, trialDays, isPermanentTrial]);

  // إذا كانت التجربة دائمة
  if (isPermanentTrial) {
    return (
      <div className="flex flex-col gap-1">
        <Badge variant="default" className="flex items-center gap-1 justify-center">
          <Infinity className="w-3 h-3" />
          {currentLanguage === 'ar' ? 'دائمة' : 'Permanent'}
        </Badge>
        <div className="text-xs text-center font-mono text-green-600">
          {currentLanguage === 'ar' ? 'لا تنتهي' : 'Never expires'}
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {currentLanguage === 'ar' ? 'منتهية' : 'Expired'}
      </Badge>
    );
  }

  const getVariant = () => {
    if (timeRemaining.days > 3) return "default";
    if (timeRemaining.days > 1) return "secondary";
    return "destructive";
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge variant={getVariant()} className="flex items-center gap-1 justify-center">
        <Clock className="w-3 h-3" />
        {currentLanguage === 'ar' ? 'متبقي' : 'Remaining'}
      </Badge>
      <div className="text-xs text-center font-mono">
        {currentLanguage === 'ar' ? (
          <>
            {timeRemaining.days > 0 && <span>{timeRemaining.days} يوم </span>}
            <span>{timeRemaining.hours.toString().padStart(2, '0')}:</span>
            <span>{timeRemaining.minutes.toString().padStart(2, '0')}:</span>
            <span>{timeRemaining.seconds.toString().padStart(2, '0')}</span>
          </>
        ) : (
          <>
            {timeRemaining.days > 0 && <span>{timeRemaining.days}d </span>}
            <span>{timeRemaining.hours.toString().padStart(2, '0')}:</span>
            <span>{timeRemaining.minutes.toString().padStart(2, '0')}:</span>
            <span>{timeRemaining.seconds.toString().padStart(2, '0')}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default TrialCountdown;
