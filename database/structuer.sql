CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    current_kilometers DECIMAL(10, 2) NOT NULL DEFAULT 0,
    next_tire_change INT DEFAULT NULL,
    is_next_tire_change_bigger BOOLEAN NOT NULL DEFAULT false,
    next_oil_change INT DEFAULT NULL,
    is_next_oil_change_bigger BOOLEAN NOT NULL DEFAULT false,
    license_plate VARCHAR(15) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active'
);

CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active'
);

CREATE TABLE maintenance_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recurrency INT NOT NULL,
    recurrency_date INT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active'
);

CREATE TABLE car_maintenance_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    maintenance_type_id INT NOT NULL,
    recurrency INT DEFAULT 0,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(id)
);

CREATE TABLE fueling_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    driver_id INT NOT NULL,
    fuel_type VARCHAR(255) NOT NULL,
    observation TEXT,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE tire_change_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE TABLE oil_change_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (car_id) REFERENCES cars(id)
);
