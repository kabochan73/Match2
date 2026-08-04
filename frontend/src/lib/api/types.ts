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

export type Certification = {
  id: number;
  user_id: number;
  name: string;
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

export type JobPosting = {
  id: number;
  title: string;
  description: string;
  desired_candidate: string | null;
  employment_type: EmploymentType;
  prefecture: string;
  salary_min: number | null;
  salary_max: number | null;
  published_at: string;
  company: {
    id: number;
    name: string;
  };
};

export type JobPostingStatus = "draft" | "published" | "unpublished" | "closed";

export type CompanyJobPosting = {
  id: number;
  company_id: number;
  title: string;
  description: string;
  desired_candidate: string | null;
  employment_type: EmploymentType;
  prefecture: string;
  salary_min: number | null;
  salary_max: number | null;
  status: JobPostingStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LikeType = "standard" | "super";

export type LikeStatus = "applied" | "matched" | "expired";

export type Like = {
  id: number;
  user_id: number;
  job_posting_id: number;
  like_type: LikeType;
  motivation: string;
  status: LikeStatus;
  applied_at: string;
  response_deadline: string;
  company_responded_at: string | null;
  created_at: string;
  updated_at: string;
  job_posting: {
    id: number;
    title: string;
    company: {
      id: number;
      name: string;
    };
  };
};

export type CompanyLike = {
  id: number;
  user_id: number;
  job_posting_id: number;
  like_type: LikeType;
  motivation: string;
  status: LikeStatus;
  applied_at: string;
  response_deadline: string;
  company_responded_at: string | null;
  created_at: string;
  updated_at: string;
  job_posting: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    name: string;
  };
};

export type CandidateProfile = {
  id: number;
  like_type: LikeType;
  motivation: string;
  status: LikeStatus;
  applied_at: string;
  response_deadline: string;
  company_responded_at: string | null;
  user: {
    id: number;
    name: string;
    comment: string | null;
    portfolio_url: string | null;
    work_experiences: WorkExperience[];
    educations: Education[];
    certifications: Certification[];
  };
};

export type MessageSenderType = "user" | "company";

export type Message = {
  id: number;
  like_id: number;
  sender_type: MessageSenderType;
  sender_id: number;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
