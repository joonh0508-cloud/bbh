-- Supabase SQL Editor에 복사하여 붙여넣고 Run을 눌러 실행할 쿼리문입니다.

-- 1. 게시글(posts) 테이블 생성
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 보안 정책(RLS) 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. 누구나 글을 읽을 수 있도록 허용
CREATE POLICY "Allow public read access" ON public.posts FOR SELECT USING (true);

-- 4. 누구나 글을 쓸 수 있도록 허용
CREATE POLICY "Allow public insert access" ON public.posts FOR INSERT WITH CHECK (true);
