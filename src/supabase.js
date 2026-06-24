import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://llzncfalpehhdwypzhld.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsem5jZmFscGVoaGR3eXB6aGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTE3NzgsImV4cCI6MjA5NzgyNzc3OH0.9WnThBzKM2FxzYkV8ugewgtp12jdnhiCQ4FOVrAiqO4'

export const supabase = createClient(supabaseUrl, supabaseKey)
