-- Add deleted_at column to cars table if it doesn't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cars'
        AND column_name = 'deleted_at'
) THEN
ALTER TABLE cars
ADD COLUMN deleted_at TIMESTAMP;
CREATE INDEX idx_cars_deleted_at ON cars(deleted_at);
END IF;
END $$;