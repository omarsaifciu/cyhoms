
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Star, User, Eye, EyeOff, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AddSampleReviews from "./AddSampleReviews";

interface ReviewWithProfile {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
    user_type: string;
  } | null;
}

const ReviewsManagement = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApproved, setShowApproved] = useState(false);

  const fetchReviews = async () => {
    try {
      // First get the reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('site_reviews')
        .select('*')
        .eq('is_approved', showApproved)
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
        profiles: profilesData?.find(profile => profile.id === review.user_id) || null
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

  const handleApproveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('site_reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "تم الموافقة",
        description: "تم الموافقة على التقييم بنجاح",
      });

      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في الموافقة على التقييم",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('site_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف التقييم بنجاح",
      });

      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف التقييم",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [showApproved]);

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'agent':
        return { text: 'وسيط', color: 'bg-blue-500' };
      case 'property_owner':
        return { text: 'مالك عقار', color: 'bg-green-500' };
      case 'real_estate_office':
        return { text: 'مكتب عقارات', color: 'bg-purple-500' };
      default:
        return { text: 'عميل', color: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {currentLanguage === 'ar' ? 'إدارة التقييمات' : 'Reviews Management'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'ar' 
                  ? 'مراجعة والموافقة على تقييمات المستخدمين'
                  : 'Review and approve user reviews'
                }
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <AddSampleReviews />
              <Button
                variant={!showApproved ? "default" : "outline"}
                onClick={() => setShowApproved(false)}
                className="flex items-center gap-2"
              >
                <EyeOff className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'في الانتظار' : 'Pending'}
              </Button>
              <Button
                variant={showApproved ? "default" : "outline"}
                onClick={() => setShowApproved(true)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'المعتمدة' : 'Approved'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {currentLanguage === 'ar' 
                  ? `لا توجد تقييمات ${showApproved ? 'معتمدة' : 'في الانتظار'}`
                  : `No ${showApproved ? 'approved' : 'pending'} reviews`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const userTypeBadge = getUserTypeBadge(review.profiles?.user_type || 'client');
                
                return (
                  <Card key={review.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={review.profiles?.avatar_url || ''} />
                            <AvatarFallback>
                              <User className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">
                                {review.profiles?.full_name || 'مستخدم'}
                              </h4>
                              <Badge className={`${userTypeBadge.color} text-white text-xs`}>
                                {userTypeBadge.text}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">
                                ({review.rating}/5)
                              </span>
                            </div>
                            
                            <p className="text-gray-700 mb-2">"{review.comment}"</p>
                            
                            <p className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        
                        {!showApproved && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleApproveReview(review.id)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        {showApproved && (
                           <div className="flex gap-2 ml-4">
                             <Button
                               size="sm"
                               variant="destructive"
                               onClick={() => handleDeleteReview(review.id)}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManagement;
