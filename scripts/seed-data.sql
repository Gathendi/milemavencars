-- Seed data for MileMaven

-- Insert sample users
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('John Doe', 'john@example.com', '+254700123456', '$2b$10$hashedpassword1', 'user'),
('Jane Smith', 'jane@example.com', '+254711987654', '$2b$10$hashedpassword2', 'user'),
('Admin User', 'admin@milemaven.co.ke', '+254722555666', '$2b$10$hashedpassword3', 'admin');

-- Insert sample cars
INSERT INTO cars (name, category, price, image_url, seats, transmission, fuel_type, description, available) VALUES
('Toyota Corolla', 'Sedan', 3500.00, '/placeholder.svg?height=200&width=300', 5, 'Automatic', 'Petrol', 'Reliable and fuel-efficient sedan perfect for city driving and business trips.', true),
('Toyota Prado', 'SUV', 8000.00, '/placeholder.svg?height=200&width=300', 7, 'Automatic', 'Diesel', 'Spacious SUV ideal for family trips and off-road adventures.', true),
('Nissan X-Trail', 'SUV', 6500.00, '/placeholder.svg?height=200&width=300', 5, 'Automatic', 'Petrol', 'Comfortable crossover SUV perfect for both city and highway driving.', true),
('Honda Civic', 'Sedan', 4000.00, '/placeholder.svg?height=200&width=300', 5, 'Manual', 'Petrol', 'Sporty sedan with excellent fuel economy and modern features.', true),
('Subaru Forester', 'SUV', 7000.00, '/placeholder.svg?height=200&width=300', 5, 'Automatic', 'Petrol', 'All-wheel drive SUV perfect for all weather conditions.', false),
('Volkswagen Polo', 'Hatchback', 2800.00, '/placeholder.svg?height=200&width=300', 5, 'Manual', 'Petrol', 'Compact and economical hatchback ideal for city navigation.', true),
('Mercedes-Benz C-Class', 'Luxury', 12000.00, '/placeholder.svg?height=200&width=300', 5, 'Automatic', 'Petrol', 'Premium luxury sedan for executive travel and special occasions.', true),
('Toyota Hiace', 'Van', 5500.00, '/placeholder.svg?height=200&width=300', 14, 'Manual', 'Diesel', 'Spacious van perfect for group travel and cargo transport.', true);

-- Insert sample bookings
INSERT INTO bookings (user_id, car_id, start_date, end_date, start_time, end_time, pickup_location, dropoff_location, driver_license, phone_number, total_amount, status) VALUES
(1, 1, '2024-01-15', '2024-01-17', '09:00', '18:00', 'Nairobi CBD', 'Nairobi CBD', 'DL123456789', '+254700123456', 7000.00, 'confirmed'),
(2, 2, '2024-01-20', '2024-01-25', '08:00', '20:00', 'JKIA Airport', 'Mombasa', 'DL987654321', '+254711987654', 40000.00, 'pending');

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, phone, subject, message) VALUES
('Alice Johnson', 'alice@example.com', '+254733444555', 'Corporate Rental Inquiry', 'Hi, I would like to inquire about corporate rental packages for our company. We need vehicles for our sales team.'),
('Bob Wilson', 'bob@example.com', '+254744666777', 'Booking Issue', 'I am having trouble completing my booking online. Could you please assist me?');
