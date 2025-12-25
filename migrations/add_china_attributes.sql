-- Add China Dataset attributes to tasks table
-- These replace the old SEE attributes (RELY, CPLX, ACAP, PCAP, TOOL, SCED)

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS attr_afp numeric DEFAULT 200,
  ADD COLUMN IF NOT EXISTS attr_input numeric DEFAULT 30,
  ADD COLUMN IF NOT EXISTS attr_output numeric DEFAULT 40,
  ADD COLUMN IF NOT EXISTS attr_enquiry numeric DEFAULT 20,
  ADD COLUMN IF NOT EXISTS attr_file numeric DEFAULT 15,
  ADD COLUMN IF NOT EXISTS attr_interface numeric DEFAULT 10,
  ADD COLUMN IF NOT EXISTS attr_resource numeric DEFAULT 5,
  ADD COLUMN IF NOT EXISTS attr_duration numeric DEFAULT 12;

-- Optional: Drop old SEE attributes if you want to fully migrate
-- Uncomment these lines if you want to remove the old columns:
-- ALTER TABLE public.tasks DROP COLUMN IF EXISTS attr_rely;
-- ALTER TABLE public.tasks DROP COLUMN IF EXISTS attr_cplx;
-- ALTER TABLE public.tasks DROP COLUMN IF EXISTS attr_acap;
-- ALTER TABLE public.tasks DROP COLUMN IF EXISTS attr_pcap;
-- ALTER TABLE public.tasks DROP COLUMN IF EXISTS attr_tool;
-- ALTER TABLE public.tasks DROP COLUMN IF EXISTS attr_sced;

-- Add comments for documentation
COMMENT ON COLUMN public.tasks.attr_afp IS 'Adjusted Function Points';
COMMENT ON COLUMN public.tasks.attr_input IS 'Number of input transactions';
COMMENT ON COLUMN public.tasks.attr_output IS 'Number of output transactions';
COMMENT ON COLUMN public.tasks.attr_enquiry IS 'Number of enquiry transactions';
COMMENT ON COLUMN public.tasks.attr_file IS 'Number of internal files';
COMMENT ON COLUMN public.tasks.attr_interface IS 'Number of external interfaces';
COMMENT ON COLUMN public.tasks.attr_resource IS 'Resource constraint level (1-10)';
COMMENT ON COLUMN public.tasks.attr_duration IS 'Project duration in months';
