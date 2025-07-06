import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SiteReview {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
    user_type: string;
  };
}

export const useSiteReviews = () => {
  const [reviews, setReviews] = useState<SiteReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [checkingReviewStatus, setCheckingReviewStatus] = useState(true);
  const [userReview, setUserReview] = useState<SiteReview | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      // First get the reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('site_reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Then get the profiles for those users
      const userIds = reviewsData?.map(review => review.user_id) || [];
      if (userIds.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, user_type')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const reviewsWithProfiles = reviewsData?.map(review => ({
        ...review,
        profiles: profilesData?.find(profile => profile.id === review.user_id) || undefined
      })) || [];

      setReviews(reviewsWithProfiles);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل التقييمات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    if (!user) {
      setHasUserReviewed(false);
      setUserReview(null);
      setCheckingReviewStatus(false);
      return;
    }
    setCheckingReviewStatus(true);
    try {
      const { data, error } = await supabase
        .from('site_reviews')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setHasUserReviewed(true);
        setUserReview(data[0]);
      } else {
        setHasUserReviewed(false);
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error checking for existing review:", error);
    } finally {
      setCheckingReviewStatus(false);
    }
  };

  const submitReview = async (rating: number, comment: string) => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يجب تسجيل الدخول لإضافة تقييم",
        variant: "destructive",
      });
      return false;
    }

    setSubmitting(true);
    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('site_reviews')
          .update({
            rating,
            comment,
            is_approved: false, // Reset approval status
            updated_at: new Date().toISOString(),
          })
          .eq('id', userReview.id);

        if (error) throw error;

        toast({
          title: "تم تحديث التقييم",
          description: "سيتم مراجعة تقييمك والموافقة عليه قريباً",
        });
        await checkUserReview();
        await fetchReviews();
      } else {
        // Insert new review
        const { error } = await supabase
          .from('site_reviews')
          .insert({
            user_id: user.id,
            rating,
            comment,
            is_approved: false
          });

        if (error) throw error;
        
        setHasUserReviewed(true);

        toast({
          title: "تم إرسال التقييم",
          description: "سيتم مراجعة تقييمك والموافقة عليه قريباً",
        });
        await checkUserReview();
        await fetchReviews();
      }

      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إرسال التقييم",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    checkUserReview();
  }, [user]);

  return {
    reviews,
    loading,
    submitting,
    submitReview,
    refetch: fetchReviews,
    hasUserReviewed,
    checkingReviewStatus,
    userReview,
  };
};
