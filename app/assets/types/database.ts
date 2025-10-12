export interface User {
  id?: string;
  created_at?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  updated_at?: string;
}

export interface Application {
  id?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  company: string;
  status?: string;
  appli_title?: string;
  appli_location?: string;
  appli_notes?: string;
  appli_url?: string;
  appli_deadline?: string;
  appli_rejected?: string;
  interview_failed_date?: string;
  interview_failed_reason?: string;
}

export interface Interview {
  id?: string;
  created_at?: string;
  updated_at?: string;
  appli_id?: string;
  round?: number;
  date?: string;
  type?: string;
  result?: string;
}

export type UserInsert = Omit<User, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
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

export type UserUpdate = Partial<Omit<User, "id">> & {
  id: string;
};

export type ApplicationUpdate = Partial<Omit<Application, "id">> & {
  id: string;
};

export type InterviewUpdate = Partial<Omit<Interview, "id">> & {
  id: string;
};

export interface ApplicationWithInterviews extends Application {
  interviews?: Interview[];
}

export interface InterviewWithApplication extends Interview {
  application?: Application;
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
