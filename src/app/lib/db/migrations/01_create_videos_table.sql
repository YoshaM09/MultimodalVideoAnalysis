-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  transcription TEXT,
  tags TEXT[],
  video_length INTERVAL,
  video_size BIGINT NOT NULL,
  summary TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Add indexes for common queries
  CONSTRAINT videos_url_unique UNIQUE (url),
  CONSTRAINT videos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS videos_user_id_idx ON videos (user_id);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos (created_at DESC);
CREATE INDEX IF NOT EXISTS videos_tags_idx ON videos USING GIN (tags);

-- Add RLS policies
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Users can view all videos
CREATE POLICY "Users can view all videos"
  ON videos FOR SELECT
  USING (true);

-- Users can only insert their own videos
CREATE POLICY "Users can insert their own videos"
  ON videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own videos
CREATE POLICY "Users can update their own videos"
  ON videos FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own videos
CREATE POLICY "Users can delete their own videos"
  ON videos FOR DELETE
  USING (auth.uid() = user_id); 