CREATE DATABASE IF NOT EXISTS gerenciamento_de_frotas;

USE gerenciamento_de_frotas;

CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cars (
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
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE IF NOT EXISTS fueling_history (
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
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE TABLE IF NOT EXISTS tire_change_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    tire_change_date DATE NOT NULL,
    tire_change_kilometers DECIMAL(10, 2) NOT NULL,
    observation TEXT,
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE TABLE IF NOT EXISTS maintenance_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recurrency INT NOT NULL,
    recurrency_date INT NOT NULL
);


CREATE TABLE IF NOT EXISTS car_maintenance_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    maintenance_type_id INT NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_kilometers DECIMAL(10, 2) NOT NULL,
    observation TEXT,
    recurrency INT DEFAULT 0,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(id)
);

CREATE TABLE IF NOT EXISTS oil_change_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    oil_change_date DATE NOT NULL,
    liters_quantity DECIMAL(10, 2) NOT NULL,  
    price_per_liter DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    oil_change_kilometers DECIMAL(10, 2) NOT NULL,
    observation TEXT,
    FOREIGN KEY (car_id) REFERENCES cars(id)
);


ALTER TABLE drivers ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE cars ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE fueling_history ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE tire_change_history ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE maintenance_types ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE car_maintenance_history ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE oil_change_history ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';


-- Inserindo dados na tabela drivers
INSERT INTO drivers (name, license_number) VALUES
('ALTEMAR ARAUJO MATOS', '05412912612'),
('PETERSON JESUS SILVA', '077981402289'),
('MARCOS ALEXANDRE ALEIXO DA SILVA', 'trocar'),
('LUIZ HENRIQUE MIRANDA MOREIRA', '07596196534'),
('GIOVANE DOS SANTOS FERREIRA', 'trocar'),
('ELDAIR DOUGLAS DE FREITAS SOUZA', 'trocar'),
('DIOGO RODRIGUES DA SILVA', 'GGG7777'),
('DENIS FABIO NOGUEIRA', 'trocar'),
('JOELSON MENDES DA SILVA', 'trocar'),
('JOSE AIRTON DOS SANTOS BORGES', 'trocar'),
('ANTONIO CARLOS DA SILVA', '123456789');

-- Inserindo dados na tabela cars
INSERT INTO cars (make, model, current_kilometers, next_tire_change, is_next_tire_change_bigger, next_oil_change, is_next_oil_change_bigger, driver_id, license_plate)
VALUES
('Toyota', 'Corolla', 50000, 60000, false, 55000, false, 1, 'ABC-1234'),
('Honda', 'Civic', 75000, 80000, false, 77000, false, 2, 'DEF-5678'),
('Ford', 'Focus', 62000, 70000, false, 65000, false, 3, 'GHI-9101'),
('Chevrolet', 'Onix', 40000, 50000, false, 45000, false, 4, 'JKL-1121'),
('Volkswagen', 'Golf', 88000, 95000, false, 90000, false, 5, 'MNO-3141'),
('Hyundai', 'HB20', 35000, 45000, false, 40000, false, 6, 'PQR-5152'),
('Fiat', 'Argo', 47000, 55000, false, 50000, false, 7, 'STU-6263'),
('Renault', 'Kwid', 29000, 40000, false, 35000, false, 8, 'VWX-7374'),
('Nissan', 'Versa', 68000, 75000, false, 70000, false, 9, 'YZA-8485'),
('Peugeot', '208', 55000, 60000, false, 58000, false, 10, 'BCD-9596'),
('Jeep', 'Renegade', 72000, 80000, false, 75000, false, 11, 'EFG-0607');

-- Inserindo dados na tabela fueling_history
INSERT INTO fueling_history (car_id, fuel_amount, fuel_date, fueling_kilometers, liters_quantity, price_per_liter, total_cost, fuel_type, observation)
VALUES
(1, 50, '2025-03-01', 50500, 40, 5.50, 220, 'Gasolina', 'Posto Shell'),
(2, 45, '2025-03-02', 75500, 38, 5.40, 205.20, 'Etanol', 'Posto Ipiranga'),
(3, 55, '2025-03-03', 62500, 42, 5.60, 235.20, 'Diesel', 'Tanque cheio'),
(4, 60, '2025-03-04', 40500, 45, 5.30, 238.50, 'Gasolina', 'Centro'),
(5, 48, '2025-03-05', 88500, 37, 5.70, 210.90, 'Etanol', 'Posto BR'),
(6, 52, '2025-03-06', 35500, 39, 5.20, 202.80, 'Gasolina', 'Promoção'),
(7, 46, '2025-03-07', 47500, 36, 5.40, 194.40, 'Diesel', 'Rodovia'),
(8, 58, '2025-03-08', 29500, 41, 5.60, 229.60, 'Gasolina', 'Interior'),
(9, 43, '2025-03-09', 68500, 35, 5.30, 185.50, 'Etanol', 'Posto BR'),
(10, 51, '2025-03-10', 55500, 38, 5.70, 216.60, 'Gasolina', 'Tanque cheio'),
(11, 49, '2025-03-11', 72500, 39, 5.50, 214.50, 'Diesel', 'Estrada');

-- Inserindo dados na tabela maintenance_types
INSERT INTO maintenance_types (name, recurrency, recurrency_date)
VALUES
('Troca de óleo', 5000, 180),
('Revisão geral', 20000, 365),
('Troca de pastilhas de freio', 10000, 365),
('Troca de correia dentada', 60000, 730),
('Alinhamento e balanceamento', 10000, 180),
('Troca de bateria', 40000, 730),
('Verificação elétrica', 15000, 365),
('Revisão do motor', 25000, 730),
('Verificação da suspensão', 20000, 365),
('Troca de filtro de ar', 10000, 180),
('Troca de velas', 30000, 365);

-- Inserindo dados na tabela oil_change_history
INSERT INTO oil_change_history (car_id, oil_change_date, liters_quantity, price_per_liter, total_cost, oil_change_kilometers, observation)
VALUES
(1, '2025-02-10', 4, 30, 120, 55000, 'Óleo sintético 5W30'),
(2, '2025-01-05', 4.5, 28, 126, 77000, 'Óleo semi-sintético 10W40'),
(3, '2024-12-15', 3.8, 27.5, 104.50, 65000, 'Óleo mineral 20W50'),
(4, '2025-02-20', 4.2, 29, 121.80, 45000, 'Óleo sintético 5W40'),
(5, '2025-03-01', 5, 32, 160, 90000, 'Óleo premium 0W20'),
(6, '2025-02-05', 4.3, 31, 133.30, 35500, 'Óleo 10W30'),
(7, '2025-03-10', 4.1, 28.5, 116.85, 47500, 'Óleo semi-sintético 15W40'),
(8, '2025-02-15', 3.9, 27, 105.30, 29500, 'Óleo mineral 5W50'),
(9, '2025-01-25', 4.4, 30, 132, 68500, 'Óleo sintético 0W40'),
(10, '2025-03-08', 4, 29.5, 118, 55500, 'Óleo sintético 5W20'),
(11, '2025-03-12', 4.6, 30.5, 140.30, 72500, 'Óleo premium 5W40');

INSERT INTO tire_change_history (car_id, tire_change_date, tire_change_kilometers, observation)
VALUES
(1, '2025-02-01', 60000.00, 'Troca de pneus dianteiros'),
(2, '2025-01-15', 80000.00, 'Troca de pneus traseiros'),
(3, '2024-12-10', 70000.00, 'Troca de todos os pneus'),
(4, '2025-02-20', 50000.00, 'Troca de pneus dianteiros e alinhamento'),
(5, '2025-03-01', 95000.00, 'Pneus novos para melhor desempenho');

-- Insert sample maintenance history records
INSERT INTO car_maintenance_history (car_id, maintenance_type_id, maintenance_date, maintenance_kilometers, observation, recurrency)
VALUES
(1, 1, '2024-03-01', 50000, 'Troca de óleo regular', 5000),
(2, 2, '2024-03-02', 75000, 'Revisão completa realizada', 20000),
(3, 3, '2024-03-03', 62000, 'Pastilhas trocadas', 10000),
(4, 5, '2024-03-04', 40000, 'Alinhamento e balanceamento feitos', 10000),
(5, 7, '2024-03-05', 88000, 'Sistema elétrico verificado', 15000),
(6, 10, '2024-03-06', 35000, 'Filtro de ar substituído', 10000),
(7, 1, '2024-03-07', 47000, 'Troca de óleo preventiva', 5000),
(8, 4, '2024-03-08', 29000, 'Correia dentada substituída', 60000),
(9, 6, '2024-03-09', 68000, 'Bateria nova instalada', 40000),
(10, 8, '2024-03-10', 55000, 'Revisão do motor completa', 25000);