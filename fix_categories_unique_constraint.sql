-- Drop the old unique constraint on 'name' only (guessing the name, usually keys are table_column_key)
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;

-- Add a new composite unique constraint so different users can use the same category name
ALTER TABLE categories ADD CONSTRAINT categories_user_id_name_key UNIQUE (user_id, name);
