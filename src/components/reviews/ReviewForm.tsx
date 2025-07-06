
import React, { useState } from 'react';
import { Star, Send, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteReviews } from '@/hooks/useSiteReviews';

const ReviewForm = () => {
  const { currentLanguage, t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitReview, submitting, hasUserReviewed, userReview } = useSiteReviews();
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(userReview?.comment || '');
  const [open, setOpen] = useState(false);

  const translations = {
    ar: {
      title: hasUserReviewed ? 'تعديل تقييمك' : 'أضف تقييمك',
      ratingLabel: 'تقييم الموقع',
      commentLabel: 'تعليقك (اختياري)',
      commentPlaceholder: 'شاركنا تجربتك مع موقعنا...',
      submitButton: hasUserReviewed ? 'تحديث التقييم' : 'إضافة تقييم',
      submitting: hasUserReviewed ? 'جاري التحديث...' : 'جاري الإرسال...',
      cancel: 'إلغاء',
      selectRating: 'الرجاء تحديد تقييم',
      loginRequired: 'يجب تسجيل الدخول لإضافة تقييم',
      submissionError: 'حدث خطأ أثناء إرسال التقييم',
      submissionSuccess: 'شكراً لك على تقييمك!',
      addReview: 'أضف تقييمك',
      editReview: 'تعديل التقييم'
    },
    en: {
      title: hasUserReviewed ? 'Edit Your Rating' : 'Add Your Rating',
      ratingLabel: 'Rate Our Site',
      commentLabel: 'Your Comment (Optional)',
      commentPlaceholder: 'Share your experience with our site...',
      submitButton: hasUserReviewed ? 'Update Rating' : 'Add Rating',
      submitting: hasUserReviewed ? 'Updating...' : 'Submitting...',
      cancel: 'Cancel',
      selectRating: 'Please select a rating',
      loginRequired: 'You must be logged in to add a rating',
      submissionError: 'Error submitting your rating',
      submissionSuccess: 'Thank you for your rating!',
      addReview: 'Add Your Review',
      editReview: 'Edit Review'
    },
    tr: {
      title: hasUserReviewed ? 'Puanınızı Düzenleyin' : 'Puanınızı Ekleyin',
      ratingLabel: 'Sitemizi Puanlayın',
      commentLabel: 'Yorumunuz (İsteğe Bağlı)',
      commentPlaceholder: 'Sitemizle ilgili deneyiminizi paylaşın...',
      submitButton: hasUserReviewed ? 'Puanı Güncelle' : 'Puan Ekle',
      submitting: hasUserReviewed ? 'Güncelleniyor...' : 'Gönderiliyor...',
      cancel: 'İptal',
      selectRating: 'Lütfen bir puan seçin',
      loginRequired: 'Puan vermek için giriş yapmalısınız',
      submissionError: 'Puanınız gönderilirken hata oluştu',
      submissionSuccess: 'Puanınız için teşekkürler!',
      addReview: 'Yorumunuzu Ekleyin',
      editReview: 'Yorumu Düzenle'
    }
  };

  const localT = translations[currentLanguage];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: localT.loginRequired,
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: localT.selectRating,
        variant: "destructive",
      });
      return;
    }

    const success = await submitReview(rating, comment.trim());
    if (success) {
      toast({
        title: localT.submissionSuccess,
      });
      setOpen(false);
    }
  };

  // Get site gradient colors from :root
  const gradientFrom =
    getComputedStyle(document.documentElement).getPropertyValue('--brand-gradient-from-color') ||
    '#2e90fa';
  const gradientTo =
    getComputedStyle(document.documentElement).getPropertyValue('--brand-gradient-to-color') ||
    '#a855f7';

  return (
    <div className="flex justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="group relative overflow-hidden rounded-xl text-white font-semibold py-3 px-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
            }}
          >
            <MessageSquare className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="hidden sm:inline">{t(hasUserReviewed ? 'editReview' : 'addReview')}</span>
            <span className="sm:hidden">{t(hasUserReviewed ? 'edit' : 'addReview')}</span>
            {!hasUserReviewed && (
              <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-80 sm:w-96 p-0 border-0 shadow-2xl bg-white/95 dark:bg-[#232639]/95 backdrop-blur-sm"
          align="center"
          side="top"
          sideOffset={10}
          alignOffset={0}
          avoidCollisions={false}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50
          }}
        >
          <Card className="border-0 shadow-none bg-transparent">
            {/* Header with gradient */}
            <div 
              className="px-4 sm:px-6 py-4 sm:py-6 text-center relative overflow-hidden rounded-t-xl"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
              }}
            >
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 right-4 w-12 h-12 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-2 left-4 w-8 h-8 bg-white/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="relative z-10 flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
                  {localT.title}
                </h3>
              </div>
              <p className="text-white/90 text-sm font-medium drop-shadow-sm">
                {localT.ratingLabel}
              </p>
            </div>

            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white dark:bg-[#232639] rounded-b-xl">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Star Rating */}
                <div className="text-center space-y-3">
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {localT.ratingLabel}
                  </label>
                  <div className="flex justify-center gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-all duration-300 transform hover:scale-125 focus:outline-none p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Star
                          className={`w-6 sm:w-8 h-6 sm:h-8 transition-all duration-300 ${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-lg'
                              : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300 dark:hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <div className="animate-fade-in">
                      <span className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-700">
                        <Star className="w-3 h-3 fill-current" />
                        {rating} من 5 نجوم
                      </span>
                    </div>
                  )}
                </div>

                {/* Comment Field */}
                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="comment" className="block text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {localT.commentLabel}
                  </label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={localT.commentPlaceholder}
                    className="min-h-[80px] sm:min-h-[100px] resize-none rounded-xl border-2 border-gray-200 dark:border-gray-600 
                      focus:border-brand-accent dark:focus:border-brand-accent transition-all duration-300
                      bg-white dark:bg-[#2a2b3e] text-gray-900 dark:text-gray-100
                      placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base"
                    maxLength={300}
                  />
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    {comment.length}/300
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {localT.cancel}
                  </Button>
                  <Button
                    type="submit"
                    disabled={rating === 0 || submitting}
                    className="flex-1 group relative overflow-hidden rounded-xl text-white font-semibold py-2 px-4 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
                    }}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm sm:text-base">{localT.submitting}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                        <span className="text-sm sm:text-base">{localT.submitButton}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ReviewForm;
