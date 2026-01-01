-- Helper block to find and drop the name constraint
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    -- Find the constraint that enforces uniqueness on the 'name' column alone
    FOR r IN (
        SELECT con.conname 
        FROM pg_catalog.pg_constraint con 
        INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid 
        INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace 
        WHERE nsp.nspname = 'public' 
          AND rel.relname = 'categories' 
          AND con.contype = 'u'  -- Unique constraint
    ) LOOP 
        -- We want to be careful not to drop the PRIMARY KEY (pkey).
        -- Re-creating the desired constraint is safe, so we can try to drop any unique constraint on name.
        -- Just to be safe, let's target the standard naming convention or try to be specific.
        -- Since we can't easily inspect columns in this block without complex queries,
        -- we will attempt to drop 'categories_name_key' directly and 'categories_name_unique'.
        NULL;
    END LOOP; 
END $$;

-- Try dropping common names for the constraint
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_unique;

-- Force the new constraint (User + Name must be unique, not just Name)
-- Using IF NOT EXISTS (Postgres 9.5+ syntax for ADD CONSTRAINT is not standard, so we wrap)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'categories_user_id_name_key'
    ) THEN
        ALTER TABLE categories ADD CONSTRAINT categories_user_id_name_key UNIQUE (user_id, name);
    END IF;
END $$;
