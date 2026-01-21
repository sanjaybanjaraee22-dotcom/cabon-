import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iveygwawxlpneawqodwp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZXlnd2F3eGxwbmVhd3FvZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTU4MzAsImV4cCI6MjA2MzAzMTgzMH0.osoYwVpn261nu0VLPRBkzDCmpf6l3czG32zZoJVeLlI'


export const supabase = createClient(supabaseUrl, supabaseKey) 