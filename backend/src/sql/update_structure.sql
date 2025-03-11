-- Drop the old table if it exists
DROP TABLE IF EXISTS car_maintenance_history;

-- First, create the maintenance_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS maintenance_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recurrency INT NOT NULL,
    recurrency_date INT NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Insert maintenance types


-- Create the new car_maintenance_history table with the updated structure
CREATE TABLE car_maintenance_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    maintenance_type_id INT NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_kilometers DECIMAL(10, 2) NOT NULL,
    observation TEXT,
    recurrency INT DEFAULT 0,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci; 