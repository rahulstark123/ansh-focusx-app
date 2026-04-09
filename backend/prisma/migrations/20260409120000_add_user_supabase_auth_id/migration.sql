-- Add Supabase Auth user id (run once on any DB missing this column)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "supabaseAuthId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "User_supabaseAuthId_key" ON "User"("supabaseAuthId");
