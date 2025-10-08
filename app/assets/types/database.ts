export interface User {
  id: string;
  created_at: string;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  updated_at: string | null;
}

export interface Application {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string | null;
  company: string | null;
  status: string | null;
  appli_title: string | null;
  appli_location: string | null;
  appli_notes: string | null;
  appli_url: string | null;
  appli_deadline: string | null;
  appli_rejected: string | null;
  interview_failed_date: string | null;
  interview_failed_reason: string | null;
}

export interface Interview {
  id: string;
  created_at: string;
  updated_at: string | null;
  appli_id: string | null;
  round: number | null;
  date: string | null;
  type: string | null;
  result: string | null;
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
  Applied = "Application",
  Interview = "Interview",
  Offer = "Offer",
  Rejected = "Rejected",
  Accepted = "Accepted",
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
