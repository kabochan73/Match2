export type User = {
  id: number;
  name: string;
  email: string;
  comment: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
};

export type EmploymentType = "full_time" | "part_time" | "contract";

export type WorkExperience = {
  id: number;
  user_id: number;
  company_name: string;
  started_on: string;
  ended_on: string | null;
  employment_type: EmploymentType;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: number;
  user_id: number;
  school_name: string;
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: number;
  name: string;
  email: string;
  description: string | null;
  phone_number: string | null;
  prefecture: string | null;
  address_line: string | null;
  stripe_id: string | null;
  pm_type: string | null;
  pm_last_four: string | null;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
};
