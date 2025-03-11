const db = require('../config/db');

// CREATE A NEW TIRE CHANGE ENTRY
exports.createTireChange = async (req, res) => {
  try {
    const { car_id, tire_change_date, tire_change_kilometers, observation } = req.body;

    const [result] = await db.execute(
      'INSERT INTO tire_change_history (car_id, tire_change_date, tire_change_kilometers, observation) VALUES (?, ?, ?, ?)',
      [car_id, tire_change_date, tire_change_kilometers, observation || null]
    );

    // Update car's current kilometers if the new value is higher
    const [carResult] = await db.execute(
      'SELECT current_kilometers FROM cars WHERE id = ?',
      [car_id]
    );

    if (carResult.length > 0) {
      const currentKilometers = carResult[0].current_kilometers;
      
      if (tire_change_kilometers > currentKilometers) {
        await db.execute(
          'UPDATE cars SET current_kilometers = ?, next_tire_change = ? WHERE id = ?',
          [tire_change_kilometers, tire_change_kilometers + 40000, car_id]
        );
      }
    }

    res.status(201).json({ message: 'Tire change history added successfully' });
  } catch (err) {
    console.error('Error adding tire change history: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET ALL TIRE CHANGES with Pagination, Filters, and Sorting
exports.getTireChanges = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sort_field || 'id';
    const sortOrder = req.query.sort_order === 'desc' ? 'desc' : 'asc';

    const validLimits = [10, 20, 50, 100, 200, 500];
    if (!validLimits.includes(limit)) {
      limit = 10;
    }

    const offset = (page - 1) * limit;

    // Filtros
    const carId = req.query.car_id || null;
    const startDate = req.query.start_date || null;
    const endDate = req.query.end_date || null;
    const minKilometers = req.query.min_kilometers || null;
    const maxKilometers = req.query.max_kilometers || null;

    // Lista de campos válidos para ordenação
    const allowedSortFields = ['id', 'car_id', 'tire_change_date', 'tire_change_kilometers'];
    if (!allowedSortFields.includes(sortField)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }

    // Montar a consulta com base nos filtros
    let query = `
      SELECT tch.*, c.make, c.model, c.license_plate 
      FROM tire_change_history tch
      LEFT JOIN cars c ON tch.car_id = c.id
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM tire_change_history WHERE 1=1';
    const queryParams = [];

    if (carId) {
      query += ' AND tch.car_id = ?';
      countQuery += ' AND car_id = ?';
      queryParams.push(carId);
    }

    if (startDate) {
      query += ' AND tch.tire_change_date >= ?';
      countQuery += ' AND tire_change_date >= ?';
      queryParams.push(startDate);
    }

    if (endDate) {
      query += ' AND tch.tire_change_date <= ?';
      countQuery += ' AND tire_change_date <= ?';
      queryParams.push(endDate);
    }

    if (minKilometers) {
      query += ' AND tch.tire_change_kilometers >= ?';
      countQuery += ' AND tire_change_kilometers >= ?';
      queryParams.push(minKilometers);
    }

    if (maxKilometers) {
      query += ' AND tch.tire_change_kilometers <= ?';
      countQuery += ' AND tire_change_kilometers <= ?';
      queryParams.push(maxKilometers);
    }

    // Adicionar ordenação
    query += ` ORDER BY tch.${sortField} ${sortOrder}`;

    // Adicionar paginação
    query += ' LIMIT ?, ?';
    const paginationParams = [...queryParams, offset, limit];

    // Executar consulta de contagem
    const [countResult] = await db.execute(countQuery, queryParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Executar consulta principal
    const [results] = await db.execute(query, paginationParams);

    res.status(200).json({
      tireChangeHistory: results,
      totalPages,
      currentPage: page,
      total
    });
  } catch (err) {
    console.error('Error fetching tire change history: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET ALL TIRE CHANGES FOR A SPECIFIC CAR with Pagination, Filters, and Sorting
exports.getTireChangesByCar = (req, res) => {
  const carId = req.params.carId;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  const validLimits = [10, 20, 50, 100, 200, 500];
  if (!validLimits.includes(limit)) {
    limit = 10;
  }

  const offset = (page - 1) * limit;

  // Filtros
  const startDate = req.query.start_date || null;
  const endDate = req.query.end_date || null;
  const minKilometers = req.query.min_kilometers || null;
  const maxKilometers = req.query.max_kilometers || null;

  // Ordenação
  const sortField = req.query.sort_field || 'id';
  const sortOrder = req.query.sort_order === 'desc' ? 'desc' : 'asc';

  // Montar a consulta com base nos filtros
  let query = 'SELECT * FROM tire_change_history WHERE car_id = ?';
  const queryParams = [carId];

  if (startDate) {
    query += ' AND tire_change_date >= ?';
    queryParams.push(startDate);
  }
  if (endDate) {
    query += ' AND tire_change_date <= ?';
    queryParams.push(endDate);
  }
  if (minKilometers) {
    query += ' AND tire_change_kilometers >= ?';
    queryParams.push(minKilometers);
  }
  if (maxKilometers) {
    query += ' AND tire_change_kilometers <= ?';
    queryParams.push(maxKilometers);
  }

  // Ordenação
  query += ` ORDER BY ${sortField} ${sortOrder}`;

  // Contagem total para paginação
  db.query('SELECT COUNT(*) AS total FROM tire_change_history WHERE car_id = ?' + (startDate ? ' AND tire_change_date >= ?' : '') + (endDate ? ' AND tire_change_date <= ?' : '') + (minKilometers ? ' AND tire_change_kilometers >= ?' : '') + (maxKilometers ? ' AND tire_change_kilometers <= ?' : ''), queryParams, (err, countResult) => {
    if (err) {
      console.error('Error counting tire change entries: ', err);
      return res.status(500).send('Internal Server Error');
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Consulta para pegar os resultados paginados
    query += ' LIMIT ?, ?';
    queryParams.push(offset, limit);

    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error('Error fetching tire change history for car: ', err);
        return res.status(500).send('Internal Server Error');
      }

      res.status(200).json({
        tireChangeHistory: result,
        totalPages: totalPages,
        currentPage: page,
        total: total,
      });
    });
  });
};

// GET A SPECIFIC TIRE CHANGE ENTRY BY ID
exports.getTireChangeById = async (req, res) => {
  try {
    const id = req.params.id;

    const [results] = await db.execute(
      'SELECT * FROM tire_change_history WHERE id = ?',
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Tire change record not found' });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching tire change record: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE A TIRE CHANGE ENTRY BY ID
exports.updateTireChange = async (req, res) => {
  try {
    const id = req.params.id;
    const { car_id, tire_change_date, tire_change_kilometers, observation } = req.body;

    const [result] = await db.execute(
      'UPDATE tire_change_history SET car_id = ?, tire_change_date = ?, tire_change_kilometers = ?, observation = ? WHERE id = ?',
      [car_id, tire_change_date, tire_change_kilometers, observation || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tire change record not found' });
    }

    res.status(200).json({ message: 'Tire change record updated successfully' });
  } catch (err) {
    console.error('Error updating tire change record: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE A TIRE CHANGE ENTRY BY ID
exports.deleteTireChange = async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await db.execute(
      'DELETE FROM tire_change_history WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tire change record not found' });
    }

    res.status(200).json({ message: 'Tire change record deleted successfully' });
  } catch (err) {
    console.error('Error deleting tire change record: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
