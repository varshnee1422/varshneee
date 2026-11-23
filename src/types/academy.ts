export type AcademyPage = 'home' | 'features' | 'courses' | 'combos' | 'fees';
export type CourseCategory = 'makeup' | 'hair' | 'draping' | 'nails' | 'skincare';
export type CourseLevel = 'Foundation' | 'Pro Mastery' | 'Masterclass';
export type ProgramType = 'course' | 'combo' | 'consultation';
export type PaymentPlan = 'full' | 'emi_3' | 'emi_6' | 'consultation';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Working Artist';
export type EnrollmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  durationWeeks: number;
  totalHours: number;
  feeAmount: number;
  kitIncluded: boolean;
  kitValue: number;
  certification: string;
  imageUrl: string;
  summary: string;
  modules: string[];
  nextBatchDate: string;
  seatsAvailable: number;
  sortOrder: number;
  isFromDatabase?: boolean;
}

export interface ComboPackage {
  id: string;
  title: string;
  tagline: string;
  includedCourseTitles: string[];
  durationWeeks: number;
  regularFee: number;
  comboFee: number;
  installmentMonths: number;
  perks: string[];
  isFeatured: boolean;
  nextBatchDate: string;
  sortOrder: number;
  isFromDatabase?: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  studentName: string;
  email: string;
  phone: string;
  programType: ProgramType;
  programId: string;
  programTitle: string;
  totalFee: number;
  paymentPlan: PaymentPlan;
  preferredBatch: string;
  experienceLevel: ExperienceLevel;
  notes: string;
  status: EnrollmentStatus;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface AcademyFeature {
  index: string;
  title: string;
  detail: string;
  metric: string;
}

export interface MentorProfile {
  name: string;
  role: string;
  specialty: string;
  experience: string;
  outcome: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
