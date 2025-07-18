export interface Talent {
  id: string;
  name: string;
  city: string;
  categories: string[];
  skills: string[];
  style_tags: string[];
  budget_range: string;
  experience_years: number;
  platforms: string[];
  soft_skills: Record<string, string>;
  software_skills: Record<string, number>;
  languages: string[];
  past_credits: string[];
  endorsements: string[];
  interest_tags: string[];
  availability_calendar: { city: string; from: string; to: string }[];
  tier_tags: string[];
  portfolio: { title: string; tags: string[]; keywords: string[] }[];
}

export interface Gig {
  clientNeed: string;
  location: string;
  budget: number;
  stylePrefs: string[];
  category: string;
}
