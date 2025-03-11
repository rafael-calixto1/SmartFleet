ALTER TABLE fueling_history DROP COLUMN fuel_amount;

-- Adicionar colunas na tabela cars, se ainda não existirem
ALTER TABLE cars ADD COLUMN IF NOT EXISTS current_kilometers DECIMAL(10, 2) NOT NULL DEFAULT 0;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS next_tire_change INT DEFAULT NULL;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS is_next_tire_change_bigger BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS next_oil_change INT DEFAULT NULL;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS is_next_oil_change_bigger BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS license_plate VARCHAR(15) NOT NULL;
ALTER TABLE car_maintenance_history
ADD COLUMN recurrency INT DEFAULT 0;

-- Criar tabela maintenance_types, se ainda não existir
CREATE TABLE IF NOT EXISTS maintenance_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recurrency INT NOT NULL,
    recurrency_date INT NOT NULL
);

-- Adicionar colunas novas em fueling_history, se não existirem
ALTER TABLE fueling_history ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(255) NOT NULL;
ALTER TABLE fueling_history ADD COLUMN IF NOT EXISTS observation TEXT;


-- Adicionar a coluna `maintenance_type_id` permitindo valores nulos inicialmente
ALTER TABLE car_maintenance_history
ADD COLUMN maintenance_type_id INT NOT NULL;

-- Adicionar a chave estrangeira referenciando `maintenance_types`
ALTER TABLE car_maintenance_history
ADD CONSTRAINT fk_maintenance_type FOREIGN KEY (maintenance_type_id) REFERENCES maintenance_types(id);




ALTER TABLE drivers ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE cars ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE fueling_history ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE tire_change_history ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE maintenance_types ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE car_maintenance_history ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
ALTER TABLE oil_change_history ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';