
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ContactSubject = {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  is_active: boolean;
};

export const useContactSubjects = () => {
  return useQuery<ContactSubject[]>({
    queryKey: ["contactSubjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_subjects")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    }
  });
};
