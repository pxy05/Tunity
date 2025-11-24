export interface User {
  id?: string;
  created_at?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  updated_at?: string;
}

export interface Position {
  id?: string;
  user_id: string;
  company_name?: string;
  position_name?: string;
  location?: string;
  company_img?: string;
  rejected?: boolean;
  applied_deadline?: string;
  applied_date?: string;
  company_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Application {
  id?: string;
  user_id?: string;
  position_id?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
}

export interface Interview {
  id?: string;
  position_id?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  date?: string;
  round?: number;
  completed?: boolean;
}

export interface Assessment {
  id?: string;
  position_id?: string;
  created_at?: string;
  updated_at?: string;
  pre_notes?: string;
  post_notes?: string;
  date?: string;
  round?: number;
  completed?: boolean;
  assessment_type?: 'in_person_interview' | 'online_interview' | 'assessment_center' | 'hirevue' | 'online_assessment';
}

export interface Offer {
  id?: string;
  user_id?: string;
  position_id?: string;
  received_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type UserInsert = Omit<User, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type PositionInput = Omit<Position, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type ApplicationInput = Omit<Application, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
  user_id?: string;
  position_id?: string;
};

export type InterviewInput = Omit<Interview, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
  position_id?: string;
};

export type ApplicationInsert = Omit<Application, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
  user_id?: string;
};

export type InterviewInsert = Omit<Interview, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type AssessmentInput = Omit<Assessment, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
  position_id?: string;
};

export type OfferInput = Omit<Offer, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
  user_id?: string;
  position_id?: string;
};

export type UserUpdate = Partial<Omit<User, "id">> & {
  id: string;
};

export type PositionUpdate = Partial<Omit<Position, "id">> & {
  id: string;
};

export type ApplicationUpdate = Partial<Omit<Application, "id">> & {
  id: string;
};

export type InterviewUpdate = Partial<Omit<Interview, "id">> & {
  id: string;
};

export type AssessmentUpdate = Partial<Omit<Assessment, "id">> & {
  id: string;
};

export type OfferUpdate = Partial<Omit<Offer, "id">> & {
  id: string;
};

export interface ApiError {
  error: string;
  code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'DUPLICATE_ERROR' | 'DATABASE_ERROR' | 'INVALID_INPUT';
}

export interface ApplicationWithPosition extends Application {
  position?: Position;
}

export interface PositionWithApplication extends Position {
  application?: Application;
  interviews?: Interview[];
  assessments?: Assessment[];
  offer?: Offer;
}

export interface ApplicationWithInterviews extends Application {
  interviews?: Interview[];
}

export interface InterviewWithApplication extends Interview {
  application?: Application;
}

export interface InterviewWithPosition {
  interview: Interview;
  position: Position;
}

export interface AssessmentWithPosition {
  assessment: Assessment;
  position: Position;
}

export interface OfferWithPosition {
  offer: Offer;
  position: Position;
}

export enum ApplicationStatus {
  Applied = "applied",
  Rejected = "rejected",
  Interview = "interview",
  Offer = "offer",
  OfferAccepted = "offer_accepted",
  OfferRejected = "offer_rejected",
}

export enum InterviewResult {
  Pending = "Pending",
  Passed = "Passed",
  Failed = "Failed",
}

export type DatabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

export type DatabaseArrayResponse<T> = {
  data: T[] | null;
  error: Error | null;
};
