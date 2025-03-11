-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS gerenciamento_de_frotas;
USE gerenciamento_de_frotas;

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    cnh VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    current_kilometers INT NOT NULL DEFAULT 0,
    next_tire_change DATE,
    is_next_tire_change_bigger BOOLEAN DEFAULT FALSE,
    next_oil_change DATE,
    is_next_oil_change_bigger BOOLEAN DEFAULT FALSE,
    driver_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Create maintenance_types table
CREATE TABLE IF NOT EXISTS maintenance_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    recurrency INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create car_maintenance_history table
CREATE TABLE IF NOT EXISTS car_maintenance_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    maintenance_type_id INT NOT NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_kilometers INT NOT NULL,
    observation TEXT,
    recurrency INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(id)
);

-- Create oil_change_history table
CREATE TABLE IF NOT EXISTS oil_change_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    oil_change_date DATE NOT NULL,
    oil_change_kilometers INT NOT NULL,
    liters_quantity DECIMAL(10,2) NOT NULL,
    price_per_liter DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- Create tire_change_history table
CREATE TABLE IF NOT EXISTS tire_change_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    tire_change_date DATE NOT NULL,
    tire_change_kilometers INT NOT NULL,
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- Insert some maintenance types
INSERT INTO maintenance_types (name, recurrency) VALUES
    ('Revisão Geral', 10000),
    ('Troca de Filtro de Ar', 15000),
    ('Alinhamento e Balanceamento', 10000),
    ('Troca de Freios', 30000),
    ('Troca de Bateria', 40000),
    ('Troca de Correia', 60000),
    ('Sistema Elétrico', NULL),
    ('Suspensão', NULL),
    ('Ar Condicionado', NULL),
    ('Outros', NULL)
ON DUPLICATE KEY UPDATE name = VALUES(name), recurrency = VALUES(recurrency); 
CREATE DATABASE IF NOT EXISTS gerenciamento_de_frotas;
USE gerenciamento_de_frotas;

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    cnh VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    current_kilometers INT NOT NULL DEFAULT 0,
    next_tire_change DATE,
    is_next_tire_change_bigger BOOLEAN DEFAULT FALSE,
    next_oil_change DATE,
    is_next_oil_change_bigger BOOLEAN DEFAULT FALSE,
    driver_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Create maintenance_types table
CREATE TABLE IF NOT EXISTS maintenance_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    recurrency INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create car_maintenance_history table
CREATE TABLE IF NOT EXISTS car_maintenance_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    maintenance_type_id INT NOT NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_kilometers INT NOT NULL,
    observation TEXT,
    recurrency INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(id)
);

-- Create oil_change_history table
CREATE TABLE IF NOT EXISTS oil_change_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    oil_change_date DATE NOT NULL,
    oil_change_kilometers INT NOT NULL,
    liters_quantity DECIMAL(10,2) NOT NULL,
    price_per_liter DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- Create tire_change_history table
CREATE TABLE IF NOT EXISTS tire_change_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    tire_change_date DATE NOT NULL,
    tire_change_kilometers INT NOT NULL,
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- Insert some maintenance types
INSERT INTO maintenance_types (name, recurrency) VALUES
    ('Revisão Geral', 10000),
    ('Troca de Filtro de Ar', 15000),
    ('Alinhamento e Balanceamento', 10000),
    ('Troca de Freios', 30000),
    ('Troca de Bateria', 40000),
    ('Troca de Correia', 60000),
    ('Sistema Elétrico', NULL),
    ('Suspensão', NULL),
    ('Ar Condicionado', NULL),
    ('Outros', NULL)
ON DUPLICATE KEY UPDATE name = VALUES(name), recurrency = VALUES(recurrency); 
 