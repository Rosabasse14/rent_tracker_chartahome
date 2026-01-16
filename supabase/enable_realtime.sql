-- Enable Realtime for critical tables
-- This allows the dashboard to update instantly when data changes

-- Add tables to the supabase_realtime publication
-- Note: If you get an error saying "relation is already member of publication", that's fine!
-- It means Realtime is already enabled for that table.

-- We use separate statements so if one fails (already exists), the others still run.

DO $$
BEGIN
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE properties; EXCEPTION WHEN duplicate_object OR define_element_already_exists THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE units; EXCEPTION WHEN duplicate_object OR define_element_already_exists THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE tenants; EXCEPTION WHEN duplicate_object OR define_element_already_exists THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE managers; EXCEPTION WHEN duplicate_object OR define_element_already_exists THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE payments; EXCEPTION WHEN duplicate_object OR define_element_already_exists THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE notifications; EXCEPTION WHEN duplicate_object OR define_element_already_exists THEN NULL; END;
END $$;
