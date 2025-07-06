
export interface PropertyReport {
  id: string;
  property_id: string;
  reporter_user_id: string;
  report_type: 'inappropriate_content' | 'false_information' | 'spam' | 'fraud' | 'duplicate' | 'other';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserReport {
  id: string;
  reported_user_id: string;
  reporter_user_id: string;
  report_type: 'inappropriate_behavior' | 'fake_listings' | 'scam' | 'harassment' | 'fraud' | 'other';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportFormData {
  report_type: string;
  reason: string;
}
