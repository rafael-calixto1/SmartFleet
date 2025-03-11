const db = require('../db');

const getVehicleStatus = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Data inicial e final são obrigatórias'
      });
    }

    const query = `
      SELECT 
        c.id AS carro_id,
        c.make AS marca_carro,
        c.model AS modelo_carro,
        c.license_plate AS placa_carro,
        c.current_kilometers AS quilometragem_atual,
        c.next_tire_change_km AS data_proxima_troca_pneu,
        c.is_next_tire_change_bigger AS pneu_atrasado,
        c.next_oil_change_km AS data_proxima_troca_oleo,
        c.is_next_oil_change_bigger AS oleo_atrasado,
        d.name AS nome_motorista,
        d.license_number AS cnh_motorista,
        
        SUM(fh.liters_quantity) AS total_combustivel,
        SUM(fh.total_cost) AS custo_total_combustivel,
        CASE 
          WHEN SUM(fh.liters_quantity) > 0 
          THEN CAST((MAX(fh.fueling_kilometers) - MIN(fh.fueling_kilometers)) / SUM(fh.liters_quantity) AS DECIMAL(10,2))
          ELSE 0 
        END AS media_consumo_km_por_litro,

        COUNT(och.id) AS total_trocas_oleo,
        MAX(och.oil_change_date) AS ultima_troca_oleo_data,
        MAX(och.oil_change_kilometers) AS ultima_troca_oleo_km,

        COUNT(tch.id) AS total_trocas_pneu,
        MAX(tch.tire_change_date) AS ultima_troca_pneu_data,
        MAX(tch.tire_change_kilometers) AS ultima_troca_pneu_km,

        COUNT(cmh.id) AS total_manutencoes,
        GROUP_CONCAT(DISTINCT cmh.maintenance_type SEPARATOR ', ') AS tipos_manutencao,
        MAX(cmh.maintenance_date) AS ultima_manutencao_data

      FROM cars c
      LEFT JOIN drivers d ON c.driver_id = d.id
      LEFT JOIN fueling_history fh ON fh.car_id = c.id 
        AND fh.fuel_date BETWEEN ? AND ?
      LEFT JOIN oil_change_history och ON och.car_id = c.id 
        AND och.oil_change_date BETWEEN ? AND ?
      LEFT JOIN tire_change_history tch ON tch.car_id = c.id 
        AND tch.tire_change_date BETWEEN ? AND ?
      LEFT JOIN car_maintenance_history cmh ON cmh.car_id = c.id 
        AND cmh.maintenance_date BETWEEN ? AND ?

      GROUP BY c.id
      ORDER BY c.id
    `;

    const [results] = await db.execute(query, [
      startDate, endDate,
      startDate, endDate,
      startDate, endDate,
      startDate, endDate
    ]);

    // Process null values and format numbers
    const formattedResults = results.map(row => ({
      ...row,
      total_combustivel: Number(row.total_combustivel || 0),
      custo_total_combustivel: Number(row.custo_total_combustivel || 0),
      media_consumo_km_por_litro: Number(row.media_consumo_km_por_litro || 0),
      total_trocas_oleo: Number(row.total_trocas_oleo || 0),
      total_trocas_pneu: Number(row.total_trocas_pneu || 0),
      total_manutencoes: Number(row.total_manutencoes || 0),
      data_proxima_troca_oleo: Number(row.data_proxima_troca_oleo || 0),
      data_proxima_troca_pneu: Number(row.data_proxima_troca_pneu || 0)
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error in getVehicleStatus:', error);
    res.status(500).json({
      error: 'Erro ao buscar status dos veículos'
    });
  }
};

module.exports = {
  getVehicleStatus
}; 