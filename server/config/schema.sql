-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('sedan', 'suv', 'hatchback', 'luxury', 'van')
    ),
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    seats INTEGER NOT NULL CHECK (seats > 0),
    transmission VARCHAR(20) NOT NULL CHECK (transmission IN ('manual', 'automatic')),
    fuel_type VARCHAR(20) NOT NULL CHECK (
        fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')
    ),
    description TEXT,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Insert some sample data
INSERT INTO cars (
        name,
        category,
        price,
        image_url,
        seats,
        transmission,
        fuel_type,
        description
    )
VALUES (
        'Toyota Camry',
        'sedan',
        50.00,
        'https://example.com/camry.jpg',
        5,
        'automatic',
        'petrol',
        'Comfortable sedan for family trips'
    ),
    (
        'Honda CR-V',
        'suv',
        65.00,
        'https://example.com/crv.jpg',
        5,
        'automatic',
        'petrol',
        'Spacious SUV with great fuel economy'
    ),
    (
        'Volkswagen Golf',
        'hatchback',
        45.00,
        'https://example.com/golf.jpg',
        5,
        'manual',
        'petrol',
        'Fun to drive hatchback'
    );