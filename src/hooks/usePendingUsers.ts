
import { useMemo } from "react";

interface User {
  id: string;
  full_name: string | null;
  phone: string;
  email: string;
  user_type: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner';
  is_approved: boolean;
  created_at: string;
}

export const usePendingUsers = (users: User[]) => {
  return useMemo(() => {
    return users.filter(user =>
      (user.user_type === 'agent' || user.user_type === 'property_owner' || user.user_type === 'real_estate_office' || user.user_type === 'partner_and_site_owner') &&
      !user.is_approved
    );
  }, [users]);
};
