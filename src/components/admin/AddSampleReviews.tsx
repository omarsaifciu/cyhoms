import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Loader2 } from "lucide-react";

const AddSampleReviews = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sampleReviews = [
    {
      rating: 5,
      comment: "موقع ممتاز للبحث عن العقارات في قبرص. واجهة سهلة الاستخدام وخدمة عملاء رائعة.",
      user_name: "Omar 22404536",
      user_type: "client"
    },
    {
      rating: 5,
      comment: "تجربة رائعة! وجدت العقار المناسب بسرعة والفريق كان متعاوناً جداً.",
      user_name: "omar saif admin",
      user_type: "agent"
    },
    {
      rating: 4,
      comment: "خدمة احترافية ومعلومات دقيقة عن العقارات. أنصح بالموقع بشدة.",
      user_name: "omar saif admin",
      user_type: "property_owner"
    },
    {
      rating: 5,
      comment: "موقع موثوق وسهل الاستخدام. ساعدني في العثور على منزل أحلامي.",
      user_name: "omar saif admin",
      user_type: "agent"
    },
    {
      rating: 4,
      comment: "فريق محترف وخدمة ممتازة. الموقع يحتوي على خيارات متنوعة من العقارات.",
      user_name: "omar saif admin",
      user_type: "client"
    },
    {
      rating: 5,
      comment: "موقع رائع مع واجهة حديثة وسهلة. الدعم الفني سريع ومفيد.",
      user_name: "omar saif admin",
      user_type: "property_owner"
    }
  ];

  const addSampleReviews = async () => {
    setLoading(true);
    try {
      // أولاً، احصل على المستخدمين الموجودين
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, user_type')
        .in('user_type', ['client', 'agent', 'property_owner'])
        .limit(6);

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        toast({
          title: "خطأ",
          description: "لا توجد مستخدمين في قاعدة البيانات",
          variant: "destructive",
        });
        return;
      }

      // إنشاء التقييمات
      const reviewsToInsert = sampleReviews.slice(0, profiles.length).map((review, index) => ({
        user_id: profiles[index].id,
        rating: review.rating,
        comment: review.comment,
        is_approved: true,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));

      const { error: insertError } = await supabase
        .from('site_reviews')
        .insert(reviewsToInsert);

      if (insertError) throw insertError;

      toast({
        title: "تم بنجاح",
        description: `تم إضافة ${reviewsToInsert.length} تقييم تجريبي`,
      });

    } catch (error) {
      console.error('Error adding sample reviews:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة التقييمات التجريبية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={addSampleReviews}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          جاري الإضافة...
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          إضافة تقييمات تجريبية
        </>
      )}
    </Button>
  );
};

export default AddSampleReviews;
