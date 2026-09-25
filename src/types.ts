export type ConsultationType = 'in-clinic' | 'house-call' | 'teleconsult';

export interface DoctorService {
  id: string;
  name: string;
  price: number;
  description: string;
  durationMin: number;
}

export interface DoctorReview {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  conditionTreated: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  specialtySlug: string;
  avatar: string;
  clinicName: string;
  address: string;
  distanceKm: number;
  travelTimeMin: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  originalFee?: number; // Foodpanda style discount strikethrough
  homeVisitFee: number;
  teleconsultFee: number;
  isOpenNow: boolean;
  statusText: string; // e.g. "Available in 15 mins", "Open • Low wait time"
  acceptsHouseCalls: boolean;
  acceptsTeleconsult: boolean;
  waitTimeMin: number;
  badges: string[];
  bio: string;
  education: string[];
  languages: string[];
  services: DoctorService[];
  reviews: DoctorReview[];
  availableSlotsToday: string[];
}

export interface SpecialtyCategory {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  tagline: string;
  commonSymptoms: string[];
  color: string;
  bgLight: string;
}

export interface TriageResult {
  symptomQuery: string;
  matchedSpecialty: string;
  matchedSpecialtySlug: string;
  urgency: 'routine' | 'same-day' | 'immediate' | 'emergency-warning';
  urgencyLabel: string;
  possibleConditions: string[];
  clinicalSummary: string;
  suggestedDoctorQuestions: string[];
  homeCareTip: string;
  redFlagsToWatch: string[];
  recommendedDoctors: Doctor[];
}

export interface Appointment {
  id: string;
  queueCode: string; // e.g. "PANDA-04"
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  doctorAvatar: string;
  clinicName: string;
  clinicAddress: string;
  consultType: ConsultationType;
  slotTime: string;
  appointmentDate: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  patientSymptoms: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  consultationFee: number;
  serviceFee: number;
  totalAmount: number;
  createdAt: string;
  doctorNotes?: string;
  prescriptionGiven?: string;
  referralRecommended?: string;
}

export interface ReferralReply {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  clinicName: string;
  createdAt: string;
  message: string;
  differentialDiagnosis?: string[];
  suggestedAction?: string;
  willingToAcceptTransfer: boolean;
}

export interface DiagnosticTest {
  testName: string;
  result: string;
  date: string;
  abnormal: boolean;
}

export interface ReferralCase {
  id: string;
  caseRef: string; // e.g. "REF-204"
  patientInitials: string; // e.g. "K.R., 42F"
  patientAgeGender: string;
  symptomsSummary: string;
  duration: string;
  primaryConcern: string; // e.g. "Atypical epigastric pain not responding to PPIs, mild jaundice"
  referringDoctorId: string;
  referringDoctorName: string;
  referringDoctorSpecialty: string;
  referringClinic: string;
  targetSpecialty: string;
  urgency: 'routine' | 'priority' | 'urgent';
  status: 'open' | 'collaborating' | 'referred' | 'resolved';
  diagnosticTests: DiagnosticTest[];
  currentMedications: string[];
  replies: ReferralReply[];
  referredToDoctorName?: string;
  createdAt: string;
}

export type AppViewMode = 'patient' | 'doctor-portal' | 'inter-doctor-hub';

export type ThemeMode = 'light' | 'dark';

export type UserRole = 'patient' | 'doctor';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  emailOrPhone: string;
  avatar?: string;
  authProvider?: 'google' | 'facebook' | 'demo';
  // Patient details
  age?: number;
  gender?: string;
  location?: string;
  healthNotes?: string;
  // Doctor details
  doctorId?: string;
  specialty?: string;
  clinicName?: string;
  licenseNumber?: string;
  consultationFee?: number;
}
