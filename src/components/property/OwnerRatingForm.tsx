
import React, { useEffect, useState } from 'react';
import { Star, Send, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OwnerRatingFormProps {
  ownerId: string;
  ownerName: string;
  onClose: () => void;
}

const OwnerRatingForm: React.FC<OwnerRatingFormProps> = ({ ownerId, ownerName, onClose }) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [hasRatedBefore, setHasRatedBefore] = useState(false);
  const [previousRatingId, setPreviousRatingId] = useState<string | null>(null);

  const translations = {
    ar: {
      rateUser: `تقييم ${ownerName}`,
      yourRating: "تقييمك:",
      submitReview: "إرسال التقييم",
      updateReview: "تعديل التقييم",
      submitting: "جاري الإرسال...",
      updating: "جاري التعديل...",
      cancel: "إلغاء",
      selectRating: "الرجاء تحديد تقييم",
      loginRequired: "يجب تسجيل الدخول للتقييم.",
      submissionError: "حدث خطأ أثناء إرسال التقييم.",
      submissionSuccessTitle: "تم إرسال التقييم",
      submissionSuccessDescription: `شكراً لك على تقييم ${ownerName}.`,
      editingSuccess: "تم تحديث تقييمك.",
      alreadyRated: "لقد قمت بتقييم هذا المستخدم بالفعل. يمكنك تعديل تقييمك.",
    },
    en: {
      rateUser: `Rate ${ownerName}`,
      yourRating: "Your Rating:",
      submitReview: "Submit Review",
      updateReview: "Update Rating",
      submitting: "Submitting...",
      updating: "Updating...",
      cancel: "Cancel",
      selectRating: "Please select a rating",
      loginRequired: "You must be logged in to rate.",
      submissionError: "Error submitting your rating.",
      submissionSuccessTitle: "Rating Submitted",
      submissionSuccessDescription: `Thank you for rating ${ownerName}.`,
      editingSuccess: "Your rating has been updated.",
      alreadyRated: "You have already rated this user. You can update your rating.",
    },
    tr: {
      rateUser: `${ownerName} Değerlendir`,
      yourRating: "Puanınız:",
      submitReview: "Yorumu Gönder",
      updateReview: "Puanı Güncelle",
      submitting: "Gönderiliyor...",
      updating: "Güncelleniyor...",
      cancel: "İptal",
      selectRating: "Lütfen bir puan seçin",
      loginRequired: "Puan vermek için giriş yapmalısınız.",
      submissionError: "Puanınız gönderilirken hata oluştu.",
      submissionSuccessTitle: "Puan Gönderildi",
      submissionSuccessDescription: `${ownerName} puanladığınız için teşekkürler.`,
      editingSuccess: "Puanınız güncellendi.",
      alreadyRated: "Daha önce puan verdiniz. Puanınızı güncelleyebilirsiniz.",
    },
  };

  const t = translations[currentLanguage];

  useEffect(() => {
    // عند فتح الفورم، نبحث عن تقييم سابق لنفس المالك
    const fetchPreviousRating = async () => {
      if (!user || !ownerId) return;
      const { data, error } = await supabase
        .from('user_reviews')
        .select('id, rating')
        .eq('reviewed_user_id', ownerId)
        .eq('reviewer_user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (data && data.rating) {
        setRating(data.rating);
        setHasRatedBefore(true);
        setPreviousRatingId(data.id);
      } else {
        setRating(0);
        setHasRatedBefore(false);
        setPreviousRatingId(null);
      }
    };
    fetchPreviousRating();
  }, [user, ownerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: t.loginRequired, variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: t.selectRating, variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      if (hasRatedBefore && previousRatingId) {
        // UPDATE إذا كان قيم من قبل:
        const { error } = await supabase
          .from('user_reviews')
          .update({ rating })
          .eq('id', previousRatingId);

        if (error) {
          console.error("Error updating rating:", error);
          toast({
            title: t.submissionError,
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: t.editingSuccess,
          });
          onClose();
        }
      } else {
        // INSERT تقييم جديد
        const { error } = await supabase
          .from('user_reviews')
          .insert({ 
            reviewed_user_id: ownerId, 
            reviewer_user_id: user.id, 
            rating: rating,
            is_approved: true,
            comment: null,
            property_id: null
          });

        if (error) {
          console.error("Error submitting rating:", error);
          toast({
            title: t.submissionError,
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: t.submissionSuccessTitle,
            description: t.submissionSuccessDescription,
          });
          onClose();
        }
      }
    } catch (submissionError) {
      console.error("Exception during rating submission:", submissionError);
      toast({
        title: t.submissionError,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">{t.yourRating}</p>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-all duration-300 transform hover:scale-125 focus:outline-none p-1"
            >
              <Star
                className={`w-10 h-10 transition-all duration-300 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400 scale-110'
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
        </div>
        {hasRatedBefore && (
          <div className="flex items-center justify-center gap-1 mt-2 text-blue-500 dark:text-blue-400">
            <Pencil className="w-4 h-4" />
            <span className="text-sm">{t.alreadyRated}</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="px-6 py-2 rounded-full border-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
        >
          {t.cancel}
        </Button>
        <Button
          type="submit"
          disabled={rating === 0 || submitting}
          className="group bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to hover:brightness-110 text-white px-8 py-2 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {hasRatedBefore ? t.updating : t.submitting}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
              {hasRatedBefore ? t.updateReview : t.submitReview}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default OwnerRatingForm;
