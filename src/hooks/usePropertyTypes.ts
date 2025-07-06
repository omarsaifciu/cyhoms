
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyType } from "@/types/property";

export type { PropertyType };

const fetchPropertyTypes = async (): Promise<PropertyType[]> => {
  const { data, error } = await supabase
    .from('property_types')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase error fetching property types:', error.message);
    throw new Error(error.message);
  }
  
  console.log('Fetched property types:', data);
  return data || [];
};

export const usePropertyTypes = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<PropertyType[], Error>({
    queryKey: ['propertyTypes'],
    queryFn: fetchPropertyTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: `${currentLanguage === 'ar' ? 'فشل في تحميل أنواع العقارات' : 'Failed to load property types'}: ${error?.message}`,
        variant: 'destructive'
      });
    }
  }, [isError, error, currentLanguage, toast]);

  useEffect(() => {
    const channel = supabase
      .channel('property_types_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'property_types' },
        (payload) => {
          console.log('Property types changed, invalidating query.', payload);
          queryClient.invalidateQueries({ queryKey: ['propertyTypes'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return {
    propertyTypes: data ?? [],
    loading: isLoading,
    isError: isError,
  };
};
