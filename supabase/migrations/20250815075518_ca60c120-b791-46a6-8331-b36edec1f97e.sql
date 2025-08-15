-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  analysis_status TEXT DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create extracted_entities table for AI-analyzed content
CREATE TABLE public.extracted_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('character', 'place', 'plotpoint', 'goal', 'ability')),
  name TEXT NOT NULL,
  description TEXT,
  additional_info JSONB DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for questions and answers
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  message_type TEXT DEFAULT 'question' CHECK (message_type IN ('question', 'analysis_result')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chapters
CREATE POLICY "Users can view their own chapters" 
ON public.chapters 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chapters" 
ON public.chapters 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chapters" 
ON public.chapters 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chapters" 
ON public.chapters 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for extracted_entities
CREATE POLICY "Users can view entities from their chapters" 
ON public.extracted_entities 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.chapters 
  WHERE chapters.id = extracted_entities.chapter_id 
  AND chapters.user_id = auth.uid()
));

CREATE POLICY "Users can create entities for their chapters" 
ON public.extracted_entities 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.chapters 
  WHERE chapters.id = extracted_entities.chapter_id 
  AND chapters.user_id = auth.uid()
));

CREATE POLICY "Users can update entities from their chapters" 
ON public.extracted_entities 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.chapters 
  WHERE chapters.id = extracted_entities.chapter_id 
  AND chapters.user_id = auth.uid()
));

CREATE POLICY "Users can delete entities from their chapters" 
ON public.extracted_entities 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.chapters 
  WHERE chapters.id = extracted_entities.chapter_id 
  AND chapters.user_id = auth.uid()
));

-- Create policies for chat_messages
CREATE POLICY "Users can view their own chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_chapters_user_id ON public.chapters(user_id);
CREATE INDEX idx_extracted_entities_chapter_id ON public.extracted_entities(chapter_id);
CREATE INDEX idx_extracted_entities_type ON public.extracted_entities(entity_type);
CREATE INDEX idx_chat_messages_chapter_id ON public.chat_messages(chapter_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);