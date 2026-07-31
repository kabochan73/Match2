export type User = {
  id: number;
  name: string;
  email: string;
  comment: string | null;
  portfolio_url: string | null;
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
