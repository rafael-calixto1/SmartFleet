-- database/test_db.sql

-- Test database creation
CREATE DATABASE IF NOT EXISTS test_gerenciamento_de_frotas;
USE test_gerenciamento_de_frotas;

-- Test table creation
CREATE TABLE IF NOT EXISTS test_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS test_cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    current_kilometers DECIMAL(10, 2) NOT NULL DEFAULT 0,
    next_tire_change INT DEFAULT NULL,
    is_next_tire_change_bigger BOOLEAN NOT NULL DEFAULT false,
    next_oil_change INT DEFAULT NULL,
    is_next_oil_change_bigger BOOLEAN NOT NULL DEFAULT false,
    driver_id INT,
    license_plate VARCHAR(15) NOT NULL,  
    FOREIGN KEY (driver_id) REFERENCES test_drivers(id)
);

CREATE TABLE IF NOT EXISTS test_fueling_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    fuel_amount DECIMAL(10, 2) NOT NULL,
    fuel_date DATE NOT NULL,
    fueling_kilometers DECIMAL(10, 2) NOT NULL,
    liters_quantity DECIMAL(10, 2) NOT NULL,  
    price_per_liter DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    fuel_type VARCHAR(255) NOT NULL,
    observation TEXT,
    FOREIGN KEY (car_id) REFERENCES test_cars(id)
);

CREATE TABLE IF NOT EXISTS test_tire_change_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    tire_change_date DATE NOT NULL,
    tire_change_kilometers DECIMAL(10, 2) NOT NULL,
    observation TEXT,
    FOREIGN KEY (car_id) REFERENCES test_cars(id)
);

CREATE TABLE IF NOT EXISTS test_car_maintenance_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    maintenance_type VARCHAR(255) NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_kilometers DECIMAL(10, 2) NOT NULL,
    observation TEXT,
    FOREIGN KEY (car_id) REFERENCES test_cars(id)
);

CREATE TABLE IF NOT EXISTS test_oil_change_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    oil_change_date DATE NOT NULL,
    liters_quantity DECIMAL(10, 2) NOT NULL,  
    price_per_liter DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    oil_change_kilometers DECIMAL(10, 2) NOT NULL,
    observation TEXT,
    FOREIGN KEY (car_id) REFERENCES test_cars(id)
);

-- Test data insertion
INSERT INTO test_drivers (name, license_number) VALUES
('Test Driver 1', '1234567890'),
('Test Driver 2', '0987654321');

INSERT INTO test_cars (make, model, current_kilometers, license_plate, driver_id) VALUES
('Toyota', 'Corolla', 10000, 'ABC1234', 1),
('Honda', 'Civic', 20000, 'XYZ5678', 2);

INSERT INTO test_fueling_history (car_id, fuel_amount, fuel_date, fueling_kilometers, liters_quantity, price_per_liter, total_cost, fuel_type, observation) VALUES
(1, 50, '2023-01-01', 10000, 40, 1.25, 50, 'Gasoline', 'First fueling'),
(2, 60, '2023-01-02', 20000, 48, 1.25, 60, 'Gasoline', 'Second fueling');

INSERT INTO test_tire_change_history (car_id, tire_change_date, tire_change_kilometers, observation) VALUES
(1, '2023-01-01', 10000, 'First tire change'),
(2, '2023-01-02', 20000, 'Second tire change');

INSERT INTO test_car_maintenance_history (car_id, maintenance_type, maintenance_date, maintenance_kilometers, observation) VALUES
(1, 'Oil Change', '2023-01-01', 10000, 'First oil change'),
(2, 'Brake Check', '2023-01-02', 20000, 'Second brake check');

INSERT INTO test_oil_change_history (car_id, oil_change_date, liters_quantity, price_per_liter, total_cost, oil_change_kilometers, observation) VALUES
(1, '2023-01-01', 4, 10, 40, 10000, 'First oil change'),
(2, '2023-01-02', 5, 10, 50, 20000, 'Second oil change');

-- Test data integrity
SELECT * FROM test_drivers;
SELECT * FROM test_cars;
SELECT * FROM test_fueling_history;
SELECT * FROM test_tire_change_history;
SELECT * FROM test_car_maintenance_history;
SELECT * FROM test_oil_change_history;

-- Clean up
DROP DATABASE test_gerenciamento_de_frotas;