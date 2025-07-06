import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateGregorian, formatDateLongGregorian, formatDateTimeGregorian } from "@/utils/dateUtils";
import { useLanguage } from "@/contexts/LanguageContext";

const DateFormatTest = () => {
  const { currentLanguage } = useLanguage();
  const testDate = new Date('2024-03-15T10:30:00Z');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-sm">
          Date Format Test ({currentLanguage})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Original:</strong> {testDate.toISOString()}
        </div>
        <div>
          <strong>Short:</strong> {formatDateGregorian(testDate, currentLanguage)}
        </div>
        <div>
          <strong>Long:</strong> {formatDateLongGregorian(testDate, currentLanguage)}
        </div>
        <div>
          <strong>With Time:</strong> {formatDateTimeGregorian(testDate, currentLanguage)}
        </div>
        <div>
          <strong>Old ar-SA:</strong> {testDate.toLocaleDateString('ar-SA')}
        </div>
        <div>
          <strong>New ar-EG:</strong> {testDate.toLocaleDateString('ar-EG', { calendar: 'gregory' })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DateFormatTest;
