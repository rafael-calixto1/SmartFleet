const db = require('../config/db');

// CREATE A NEW OIL CHANGE RECORD
exports.createOilChange = async (req, res) => {
  const {
    car_id,
    oil_change_date,
    oil_change_kilometers,
    liters_quantity,
    price_per_liter,
    total_cost,
    observation
  } = req.body;

  // Verificação dos campos obrigatórios
  if (
    !car_id ||
    !oil_change_date ||
    !oil_change_kilometers ||
    !liters_quantity ||
    !price_per_liter ||
    !total_cost
  ) {
    return res.status(400).json({
      message: 'Todos os campos (car_id, oil_change_date, oil_change_kilometers, liters_quantity, price_per_liter, total_cost) são obrigatórios.'
    });
  }

  try {
    // Inserção no banco de dados
    const [result] = await db.execute(
      `INSERT INTO oil_change_history 
       (car_id, oil_change_date, oil_change_kilometers, liters_quantity, price_per_liter, total_cost, observation) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        car_id,
        oil_change_date,
        oil_change_kilometers,
        liters_quantity,
        price_per_liter,
        total_cost,
        observation || null
      ]
    );

    // Atualizar current_kilometers, next_oil_change e is_next_oil_change_bigger do carro
    const [carResults] = await db.execute(
      'SELECT next_tire_change FROM cars WHERE id = ?',
      [car_id]
    );

    if (carResults.length === 0) {
      return res.status(404).json({ message: 'Carro não encontrado' });
    }

    const next_tire_change = carResults[0].next_tire_change;
    const is_next_tire_change_bigger = oil_change_kilometers >= next_tire_change;

    await db.execute(
      'UPDATE cars SET current_kilometers = ?, next_oil_change = ?, is_next_oil_change_bigger = ?, is_next_tire_change_bigger = ? WHERE id = ?',
      [
        oil_change_kilometers,
        oil_change_kilometers + 10000, // Exemplo: próxima troca de óleo em 10.000 km
        oil_change_kilometers >= oil_change_kilometers + 10000,
        is_next_tire_change_bigger,
        car_id
      ]
    );

    res.status(201).json({ message: 'Registro de troca de óleo adicionado e quilometragem atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao adicionar registro de troca de óleo: ', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// GET ALL OIL CHANGE RECORDS WITH PAGINATION AND SORTING
exports.getOilChangeHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 50;
    const sortField = req.query.sortField || 'oil_change_date';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

    const validSortFields = [
      'id',
      'car_id',
      'oil_change_date',
      'oil_change_kilometers',
      'liters_quantity',
      'price_per_liter',
      'total_cost',
    ];
    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }

    const offset = (page - 1) * limit;

    const [countResult] = await db.execute('SELECT COUNT(*) AS total FROM oil_change_history');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get oil change history with car information
    const [result] = await db.execute(
      `SELECT och.*, c.make, c.model, c.license_plate 
       FROM oil_change_history och
       LEFT JOIN cars c ON och.car_id = c.id
       ORDER BY och.${sortField} ${sortOrder} 
       LIMIT ?, ?`,
      [offset, limit]
    );

    res.status(200).json({
      oilChangeHistory: result,
      totalPages,
      currentPage: page,
      total,
    });
  } catch (err) {
    console.error('Erro ao buscar registros: ', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// GET AN OIL CHANGE RECORD BY ID
exports.getOilChangeById = async (req, res) => {
  try {
    const id = req.params.id;

    const [results] = await db.execute('SELECT * FROM oil_change_history WHERE id = ?', [id]);

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Registro de troca de óleo não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao recuperar registro: ', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// UPDATE AN OIL CHANGE RECORD BY ID
exports.updateOilChange = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      car_id,
      oil_change_date,
      oil_change_kilometers,
      liters_quantity,
      price_per_liter,
      total_cost,
      observation
    } = req.body;

    // Verificação dos campos obrigatórios
    if (
      !car_id ||
      !oil_change_date ||
      !oil_change_kilometers ||
      !liters_quantity ||
      !price_per_liter ||
      !total_cost
    ) {
      return res.status(400).json({
        message: 'Todos os campos (car_id, oil_change_date, oil_change_kilometers, liters_quantity, price_per_liter, total_cost) são obrigatórios.'
      });
    }

    // Atualização no banco de dados
    const [result] = await db.execute(
      `UPDATE oil_change_history 
       SET car_id = ?, oil_change_date = ?, oil_change_kilometers = ?, liters_quantity = ?, price_per_liter = ?, total_cost = ?, observation = ? 
       WHERE id = ?`,
      [
        car_id,
        oil_change_date,
        oil_change_kilometers,
        liters_quantity,
        price_per_liter,
        total_cost,
        observation || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Registro de troca de óleo não encontrado' });
    } else {
      res.status(200).json({ message: 'Registro de troca de óleo atualizado com sucesso' });
    }
  } catch (err) {
    console.error('Erro ao atualizar registro de troca de óleo: ', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// DELETE AN OIL CHANGE RECORD BY ID
exports.deleteOilChange = async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await db.execute('DELETE FROM oil_change_history WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Registro excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Registro não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao excluir registro: ', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
