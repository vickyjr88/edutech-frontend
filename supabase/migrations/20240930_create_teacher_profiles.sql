
-- Create teacher_profiles table
CREATE TABLE public.teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact JSONB DEFAULT '{}',
  location JSONB DEFAULT '{}',
  next_of_kin JSONB DEFAULT '{}',
  certification JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.teacher_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to create their own profile
CREATE POLICY "Users can create their own profile" 
ON public.teacher_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.teacher_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);
