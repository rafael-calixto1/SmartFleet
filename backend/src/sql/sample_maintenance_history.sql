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