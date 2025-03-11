const db = require('../config/db');

// CREATE A FUELING ENTRY
const createFuelingEntry = async (req, res) => {
  try {
    const {
      car_id,
      fuel_date,
      fueling_kilometers,
      liters_quantity,
      price_per_liter,
      total_cost,
      fuel_type,
      observation,
    } = req.body;

    // Verificação dos campos obrigatórios
    if (
      !car_id ||
      !fuel_date ||
      !fueling_kilometers ||
      !liters_quantity ||
      !price_per_liter ||
      !total_cost ||
      !fuel_type
    ) {
      return res.status(400).json({
        message: 'Todos os campos (car_id, fuel_date, fueling_kilometers, liters_quantity, price_per_liter, total_cost, fuel_type) são obrigatórios.',
      });
    }

    // Inserção no banco de dados
    const [result] = await db.execute(
      `INSERT INTO fueling_history 
       (car_id, fuel_date, fueling_kilometers, liters_quantity, price_per_liter, total_cost, fuel_type, observation) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        car_id,
        fuel_date,
        fueling_kilometers,
        liters_quantity,
        price_per_liter,
        total_cost,
        fuel_type,
        observation,
      ]
    );

    // Atualizar current_kilometers do carro se o valor for maior
    const [carResult] = await db.execute(
      'SELECT current_kilometers FROM cars WHERE id = ?',
      [car_id]
    );

    if (carResult.length > 0) {
      const currentKilometers = carResult[0].current_kilometers;
      
      if (fueling_kilometers > currentKilometers) {
        await db.execute(
          'UPDATE cars SET current_kilometers = ? WHERE id = ?',
          [fueling_kilometers, car_id]
        );
      }
    }

    res.status(201).json({ message: 'Abastecimento registrado com sucesso' });
  } catch (err) {
    console.error('Erro ao registrar abastecimento:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// GET ALL FUELING ENTRIES WITH PAGINATION
const getFuelingHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

    // Validate and map sort fields
    const validSortFields = {
      'id': 'fh.id',
      'car_id': 'fh.car_id',
      'fuel_date': 'fh.fuel_date',
      'fueling_kilometers': 'fh.fueling_kilometers',
      'liters_quantity': 'fh.liters_quantity',
      'price_per_liter': 'fh.price_per_liter',
      'total_cost': 'fh.total_cost',
      'fuel_type': 'fh.fuel_type',
      'license_plate': 'c.license_plate'
    };

    if (!validSortFields[sortField]) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }

    const offset = (page - 1) * limit;

    // Count total records
    const [countResult] = await db.execute('SELECT COUNT(*) AS total FROM fueling_history');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated records with car information
    const query = `
      SELECT 
        fh.*,
        c.license_plate
      FROM fueling_history fh
      LEFT JOIN cars c ON fh.car_id = c.id
      ORDER BY ${validSortFields[sortField]} ${sortOrder}, fh.id ASC
      LIMIT ? OFFSET ?
    `;

    const [fuelingHistory] = await db.execute(query, [limit, offset]);

    res.status(200).json({
      fuelingHistory,
      totalPages,
      currentPage: page,
      total,
    });
  } catch (err) {
    console.error('Erro ao buscar histórico de abastecimento:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// GET A FUELING ENTRY BY ID
const getFuelingEntryById = async (req, res) => {
  try {
    const id = req.params.id;

    const [results] = await db.execute(
      'SELECT * FROM fueling_history WHERE id = ?',
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Registro de abastecimento não encontrado' });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Erro ao buscar registro de abastecimento:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// UPDATE A FUELING ENTRY
const updateFuelingEntry = async (req, res) => {
  try {
    const id = req.params.id;
  const {
    car_id,
    fuel_amount,
    fuel_date,
    fueling_kilometers,
    liters_quantity,
    price_per_liter,
    total_cost,
    fuel_type,
      observation,
  } = req.body;

  // Verificação dos campos obrigatórios
  if (
    !car_id ||
    !fuel_amount ||
    !fuel_date ||
    !fueling_kilometers ||
    !liters_quantity ||
    !price_per_liter ||
    !total_cost ||
    !fuel_type
  ) {
    return res.status(400).json({
        message: 'Todos os campos (car_id, fuel_amount, fuel_date, fueling_kilometers, liters_quantity, price_per_liter, total_cost, fuel_type) são obrigatórios.',
      });
    }

    const [result] = await db.execute(
      `UPDATE fueling_history 
       SET car_id = ?, fuel_amount = ?, fuel_date = ?, fueling_kilometers = ?, 
           liters_quantity = ?, price_per_liter = ?, total_cost = ?, fuel_type = ?, observation = ? 
       WHERE id = ?`,
    [
      car_id,
      fuel_amount,
      fuel_date,
      fueling_kilometers,
      liters_quantity,
      price_per_liter,
      total_cost,
      fuel_type,
        observation,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registro de abastecimento não encontrado' });
    }

    res.status(200).json({ message: 'Registro de abastecimento atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar registro de abastecimento:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// DELETE A FUELING ENTRY
const deleteFuelingEntry = async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await db.execute(
      'DELETE FROM fueling_history WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registro de abastecimento não encontrado' });
    }

    res.status(200).json({ message: 'Registro de abastecimento excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir registro de abastecimento:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// GET FUELING STATISTICS
const getFuelingStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'As datas inicial e final são obrigatórias.'
      });
    }

    const query = `
      SELECT 
        c.license_plate AS veiculo,
        CONCAT(c.make, ' ', c.model) AS detalhesDoCarro,
        SUM(fh.total_cost) AS custo_total
      FROM 
        fueling_history fh
      JOIN 
        cars c ON fh.car_id = c.id
      WHERE 
        fh.fuel_date BETWEEN ? AND ?
      GROUP BY 
        c.license_plate, c.make, c.model
      ORDER BY 
        custo_total DESC
    `;

    const [results] = await db.execute(query, [startDate, endDate]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar estatísticas de abastecimento:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// GET FUEL BY TYPE STATISTICS
const getFuelByTypeStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const [rows] = await db.execute(
      `SELECT fuel_type AS tipo_combustivel, SUM(liters_quantity) AS total_litros
       FROM fueling_history
       WHERE fuel_date BETWEEN ? AND ?
       GROUP BY fuel_type`,
      [startDate, endDate]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting fuel by type statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET FUEL COST BY TYPE STATISTICS
const getFuelCostByTypeStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const [rows] = await db.execute(
      `SELECT fuel_type AS tipo_combustivel, SUM(total_cost) AS custo_total
       FROM fueling_history
       WHERE fuel_date BETWEEN ? AND ?
       GROUP BY fuel_type`,
      [startDate, endDate]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting fuel cost by type statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET MAINTENANCE BY TYPE STATISTICS
const getMaintenanceByTypeStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const [rows] = await db.execute(
      `SELECT maintenance_type AS tipo_manutencao, COUNT(*) AS total_manutencoes
       FROM car_maintenance_history
       WHERE maintenance_date BETWEEN ? AND ?
       GROUP BY maintenance_type`,
      [startDate, endDate]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting maintenance by type statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET FUELING BY DATE STATISTICS
const getFuelingByDateStatistics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;

    if (!startDate || !endDate || !groupBy) {
      return res.status(400).json({ error: 'Start date, end date, and groupBy are required' });
    }

    let dateFormat;
    let groupByClause;

    switch (groupBy) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        groupByClause = 'DATE(fuel_date)';
        break;
      case 'week':
        dateFormat = '%Y-%u';
        groupByClause = 'YEARWEEK(fuel_date, 1)';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        groupByClause = 'DATE_FORMAT(fuel_date, "%Y-%m")';
        break;
      case 'semester':
        dateFormat = '%Y-%m';
        groupByClause = 'CONCAT(YEAR(fuel_date), "-", IF(MONTH(fuel_date) <= 6, "1", "2"))';
        break;
      case 'year':
        dateFormat = '%Y';
        groupByClause = 'YEAR(fuel_date)';
        break;
      default:
        return res.status(400).json({ error: 'Invalid groupBy parameter' });
    }

    const query = `
      SELECT 
        ${groupByClause} AS periodo,
        DATE_FORMAT(MIN(fuel_date), '${dateFormat}') AS data_inicio,
        DATE_FORMAT(MAX(fuel_date), '${dateFormat}') AS data_fim,
        COUNT(*) AS total_abastecimentos
      FROM 
        fueling_history
      WHERE 
        fuel_date BETWEEN ? AND ?
      GROUP BY 
        ${groupByClause}
      ORDER BY 
        periodo ASC
    `;

    const [rows] = await db.execute(query, [startDate, endDate]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting fueling by date statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export all functions
module.exports = {
  createFuelingEntry,
  getFuelingHistory,
  getFuelingEntryById,
  updateFuelingEntry,
  deleteFuelingEntry,
  getFuelingStatistics,
  getFuelByTypeStatistics,
  getFuelCostByTypeStatistics,
  getMaintenanceByTypeStatistics,
  getFuelingByDateStatistics
};
