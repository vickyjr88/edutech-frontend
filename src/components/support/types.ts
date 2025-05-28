export interface IntercomSettings {
  app_id: string;
  user_id?: string;
  email?: string;
  name?: string;
  user_hash?: string;
  company?: {
    id: string;
    name: string;
    created_at?: number;
  };
  custom_attributes?: Record<string, any>;
  hide_default_launcher?: boolean;
  alignment?: 'left' | 'right';
  horizontal_padding?: number;
  vertical_padding?: number;
}

export interface IntercomUser {
  user_id?: string;
  email?: string;
  name?: string;
  phone?: string;
  avatar?: {
    type: 'avatar';
    image_url: string;
  };
  user_hash?: string;
  unsubscribed_from_emails?: boolean;
  language_override?: string;
  custom_attributes?: Record<string, any>;
}

export interface IntercomCompany {
  id: string;
  name: string;
  created_at?: number;
  plan?: string;
  size?: number;
  website?: string;
  industry?: string;
  custom_attributes?: Record<string, any>;
}

export interface IntercomConfig {
  appId: string;
  enabledForRoles?: UserRole[];
  customLauncherSelector?: string;
  autoboot?: boolean;
}

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin' | 'institution';