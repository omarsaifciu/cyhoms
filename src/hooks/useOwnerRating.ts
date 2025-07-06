
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OwnerRatingData {
  averageRating: number;
  ratingCount: number;
}

export const useOwnerRating = (ownerId: string | null | undefined) => {
  const [ownerRatingData, setOwnerRatingData] = useState<OwnerRatingData | null>(null);
  const [ratingLoading, setRatingLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!ownerId) {
      console.log("useOwnerRating: No ownerId provided, skipping rating fetch.");
      setRatingLoading(false);
      setOwnerRatingData({ averageRating: 0, ratingCount: 0 }); // Default for no owner or if preferred
      return;
    }
    console.log(`useOwnerRating: Starting to fetch owner rating for ownerId: ${ownerId}`);

    const fetchOwnerRating = async () => {
      setRatingLoading(true);
      try {
        const { data: reviews, error } = await supabase
          .from('user_reviews')
          .select('rating')
          .eq('reviewed_user_id', ownerId)
          .eq('is_approved', true);

        console.log(`useOwnerRating: Fetched reviews for ownerId ${ownerId}:`, reviews, "Error:", error);

        if (error) {
          console.error("useOwnerRating: Error fetching owner ratings:", error);
          setOwnerRatingData({ averageRating: 0, ratingCount: 0 });
          return;
        }

        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / reviews.length;
          const newOwnerRatingData = {
            averageRating: parseFloat(averageRating.toFixed(1)),
            ratingCount: reviews.length,
          };
          console.log(`useOwnerRating: Calculated ownerRatingData for ${ownerId}:`, newOwnerRatingData);
          setOwnerRatingData(newOwnerRatingData);
        } else {
          console.log(`useOwnerRating: No approved reviews found for ${ownerId}, setting default rating data.`);
          setOwnerRatingData({ averageRating: 0, ratingCount: 0 });
        }
      } catch (e) {
        console.error(`useOwnerRating: Exception fetching owner ratings for ${ownerId}:`, e);
        setOwnerRatingData({ averageRating: 0, ratingCount: 0 });
      } finally {
        console.log(`useOwnerRating: Finished rating fetch for ${ownerId}, ratingLoading set to false.`);
        setRatingLoading(false);
      }
    };

    fetchOwnerRating();
  }, [ownerId]);

  return { ownerRatingData, ratingLoading };
};
