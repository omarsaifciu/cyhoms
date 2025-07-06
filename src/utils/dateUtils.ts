/**
 * Date formatting utilities that ensure Gregorian calendar is used for Arabic locale
 */

export interface DateFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  weekday?: 'long' | 'short' | 'narrow';
  timeZone?: string;
  hour12?: boolean;
}

/**
 * Format date using Gregorian calendar for all locales, especially Arabic
 * @param date - Date to format
 * @param locale - Language locale ('ar', 'en', 'tr', etc.)
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDateGregorian = (
  date: Date | string,
  locale: string = 'en',
  options: DateFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options
  const defaultOptions: DateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  // Map locale to proper locale code and force Gregorian calendar
  const localeCode = getLocaleCode(locale);
  
  return new Intl.DateTimeFormat(localeCode, {
    ...defaultOptions,
    calendar: 'gregory' // Always use Gregorian calendar
  }).format(dateObj);
};

/**
 * Format date and time using Gregorian calendar
 * @param date - Date to format
 * @param locale - Language locale
 * @param options - Additional formatting options
 * @returns Formatted date and time string
 */
export const formatDateTimeGregorian = (
  date: Date | string,
  locale: string = 'en',
  options: DateFormatOptions = {}
): string => {
  return formatDateGregorian(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
};

/**
 * Format date in long format using Gregorian calendar
 * @param date - Date to format
 * @param locale - Language locale
 * @returns Formatted date string in long format
 */
export const formatDateLongGregorian = (
  date: Date | string,
  locale: string = 'en'
): string => {
  return formatDateGregorian(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get proper locale code for date formatting
 * @param locale - Language code
 * @returns Proper locale code
 */
const getLocaleCode = (locale: string): string => {
  switch (locale) {
    case 'ar':
      return 'ar-EG'; // Egyptian Arabic with Gregorian calendar
    case 'tr':
      return 'tr-TR';
    case 'en':
    default:
      return 'en-US';
  }
};

/**
 * Format relative time (e.g., "2 hours ago") using date-fns
 * This is a wrapper to maintain consistency with other date utilities
 * @param date - Date to format
 * @param locale - Language locale
 * @returns Relative time string
 */
export const formatRelativeTime = (
  date: Date | string,
  locale: string = 'en'
): string => {
  // This would use date-fns formatDistanceToNow
  // Keeping it here for consistency but implementation would use date-fns
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return locale === 'ar' ? 'منذ قليل' : locale === 'tr' ? 'Az önce' : 'Just now';
  } else if (diffInHours < 24) {
    return locale === 'ar' ? `منذ ${diffInHours} ساعة` : 
           locale === 'tr' ? `${diffInHours} saat önce` : 
           `${diffInHours} hours ago`;
  } else {
    return formatDateGregorian(dateObj, locale);
  }
};
