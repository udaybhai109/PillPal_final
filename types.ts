export type MedicationForm = 'Pill' | 'Injection' | 'Liquid' | 'Drops' | 'Inhaler' | 'Powder' | 'Other';

export interface Medication {
  id: string;
  medication: string;
  dosage: string;
  frequency_per_day: number;
  times: string[];
  duration: string;
  form: MedicationForm;
  condition?: string;
  total_pills: number;
  pills_remaining: number;
  status: 'active' | 'completed';
  dateAdded: number;
  adherenceLog: Record<string, boolean>; // date_time key -> taken status
}

export interface ParseResult {
  medications: Array<{
    medication: string;
    dosage: string;
    frequency_per_day: number;
    times: string[];
    duration: string;
    form: MedicationForm;
    condition?: string;
    total_pills?: number;
  }>;
}

export interface UserProfile {
  name: string;
  email: string;
  dob: string;
  gender: string;
  goals: string[];
  kinName: string;
  kinPhone: string;
  doctorName?: string;
  doctorPhone?: string;
  snoozeTime: number; // in minutes
  alertTone: string;
}

export type ViewState = 'splash' | 'login' | 'onboarding' | 'dashboard' | 'scanner' | 'verify' | 'settings' | 'history' | 'report' | 'premium' | 'help';
