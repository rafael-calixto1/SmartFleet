const db = require('../config/db');

// CREATE A NEW CAR
exports.createCar = async (req, res) => {
  const {
    make,
    model,
    current_kilometers,
    next_tire_change,
    is_next_tire_change_bigger,
    next_oil_change,
    is_next_oil_change_bigger,
    driver_id,
    license_plate
  } = req.body;

  // Garantir valores padrão e verificar se os dados são válidos
  const validKilometers = current_kilometers && current_kilometers > 0 ? current_kilometers : 0;
  const validDriverId = driver_id ? driver_id : null;

  // Definir valores padrão para os campos booleanos
  const isNextTireChangeBigger = is_next_tire_change_bigger !== undefined ? is_next_tire_change_bigger : false;
  const isNextOilChangeBigger = is_next_oil_change_bigger !== undefined ? is_next_oil_change_bigger : false;

  // Verificar se campos obrigatórios estão presentes
  if (!make || !model || !license_plate) {
    return res.status(400).json({ error: 'Missing required fields: make, model, or license_plate' });
  }

  try {
    // Query para adicionar o carro
    const [result] = await db.execute(
      'INSERT INTO cars (make, model, current_kilometers, next_tire_change, is_next_tire_change_bigger, next_oil_change, is_next_oil_change_bigger, driver_id, license_plate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        make,
        model,
        validKilometers,
        next_tire_change || null,
        isNextTireChangeBigger,
        next_oil_change || null,
        isNextOilChangeBigger,
        validDriverId,
        license_plate
      ]
    );
    res.status(201).json({ message: 'Car added successfully', carId: result.insertId });
  } catch (err) {
    console.error('Error adding car:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

// GET ALL CARS with Pagination and Sorting
exports.getAllCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const validLimits = [10, 20, 50, 100];
    const status = req.query.status || 'active'; // Default to 'active'
    
    // Validate and adjust limit if needed
    if (!validLimits.includes(limit)) {
      limit = 10;
    }

    const offset = (page - 1) * limit;
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Validate sort field to prevent SQL injection
    const validSortFields = ['id', 'make', 'model', 'current_kilometers', 'next_tire_change', 'next_oil_change', 'license_plate', 'driver_id', 'status', 'driver_name'];
    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({ error: 'Invalid sort field' });
    }

    // Build the WHERE clause based on status
    let statusCondition = '';
    let statusParams = [];

    if (status === 'active') {
      statusCondition = ' WHERE c.status = ?';
      statusParams = ['active'];
    } else if (status === 'inactive') {
      statusCondition = ' WHERE c.status = ?';
      statusParams = ['inactive'];
    }

    const countQuery = `SELECT COUNT(*) as total FROM cars c${statusCondition}`;
    const [countResult] = await db.execute(
      countQuery,
      statusParams
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Modify the ORDER BY clause to handle driver_name sorting
    const orderByClause = sortField === 'driver_name' 
      ? `d.name ${sortOrder}, c.id ASC` 
      : `c.${sortField} ${sortOrder}`;

    const query = `
      SELECT c.*, d.name as driver_name 
      FROM cars c 
      LEFT JOIN drivers d ON c.driver_id = d.id 
      ${statusCondition}
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...statusParams, limit, offset];
    const [cars] = await db.execute(query, queryParams);

    res.json({
      cars,
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      validLimits
    });
  } catch (error) {
    console.error('Error in getAllCars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET A CAR BY ID
exports.getCarById = async (req, res) => {
  const carId = req.params.id;

  try {
    const [results] = await db.execute('SELECT * FROM cars WHERE id = ?', [carId]);
    
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    console.error('Error retrieving car: ', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE CAR BY ID
exports.updateCar = async (req, res) => {
  const carId = req.params.id;
  const {
    make,
    model,
    current_kilometers,
    next_tire_change,
    is_next_tire_change_bigger,
    next_oil_change,
    is_next_oil_change_bigger,
    driver_id,
    license_plate
  } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE cars SET make = ?, model = ?, current_kilometers = ?, next_tire_change = ?, is_next_tire_change_bigger = ?, next_oil_change = ?, is_next_oil_change_bigger = ?, driver_id = ?, license_plate = ? WHERE id = ?',
      [
        make,
        model,
        current_kilometers,
        next_tire_change,
        is_next_tire_change_bigger,
        next_oil_change,
        is_next_oil_change_bigger,
        driver_id,
        license_plate,
        carId
      ]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Car not found' });
    } else {
      res.status(200).json({ message: 'Car updated successfully' });
    }
  } catch (err) {
    console.error('Error updating car: ', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE CURRENT KILOMETERS BY CAR ID
exports.updateCurrentKilometers = async (req, res) => {
  const carId = req.params.id;
  const { current_kilometers } = req.body;

  try {
    // Primeiro, obtenha os valores atuais de next_tire_change e next_oil_change
    const [results] = await db.execute('SELECT next_tire_change, next_oil_change FROM cars WHERE id = ?', [carId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const { next_tire_change, next_oil_change } = results[0];

    // Determine os novos valores para is_next_tire_change_bigger e is_next_oil_change_bigger
    const is_next_tire_change_bigger = current_kilometers >= next_tire_change;
    const is_next_oil_change_bigger = current_kilometers >= next_oil_change;

    // Atualize current_kilometers, is_next_tire_change_bigger e is_next_oil_change_bigger
    const [result] = await db.execute(
      'UPDATE cars SET current_kilometers = ?, is_next_tire_change_bigger = ?, is_next_oil_change_bigger = ? WHERE id = ?',
      [current_kilometers, is_next_tire_change_bigger, is_next_oil_change_bigger, carId]
    );
    
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Current kilometers and change statuses updated successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    console.error('Error updating current kilometers: ', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE NEXT OIL CHANGE BY CAR ID
exports.updateNextOilChange = async (req, res) => {
  const carId = req.params.id;
  const { next_oil_change } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE cars SET next_oil_change = ? WHERE id = ?',
      [next_oil_change, carId]
    );
    
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Next oil change updated successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    console.error('Error updating next oil change: ', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE NEXT TIRE CHANGE BY CAR ID
exports.updateNextTireChange = async (req, res) => {
  const carId = req.params.id;
  const { next_tire_change } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE cars SET next_tire_change = ? WHERE id = ?',
      [next_tire_change, carId]
    );
    
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Next tire change updated successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    console.error('Error updating next tire change: ', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE A CAR BY ID
exports.deleteCar = async (req, res) => {
  const carId = req.params.id;

  try {
    // First check if car has any related records
    const [fuelingCheck] = await db.execute('SELECT COUNT(*) as count FROM fueling_history WHERE car_id = ?', [carId]);
    const [maintenanceCheck] = await db.execute('SELECT COUNT(*) as count FROM car_maintenance_history WHERE car_id = ?', [carId]);
    const [tireCheck] = await db.execute('SELECT COUNT(*) as count FROM tire_change_history WHERE car_id = ?', [carId]);
    const [oilCheck] = await db.execute('SELECT COUNT(*) as count FROM oil_change_history WHERE car_id = ?', [carId]);

    if (fuelingCheck[0].count > 0 || maintenanceCheck[0].count > 0 || tireCheck[0].count > 0 || oilCheck[0].count > 0) {
      return res.status(400).json({
        error: 'Cannot delete car',
        message: 'Este carro possui registros de histórico (abastecimento, manutenção, troca de pneus ou troca de óleo). Por favor, exclua primeiro esses registros antes de excluir o carro.'
      });
    }

    const [result] = await db.execute('DELETE FROM cars WHERE id = ?', [carId]);
    
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Car deleted successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    console.error('Error deleting car: ', err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        error: 'Cannot delete car',
        message: 'Este carro possui registros relacionados. Por favor, exclua primeiro esses registros antes de excluir o carro.'
      });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE CAR STATUS
exports.updateCarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be either "active" or "inactive".' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE cars SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ message: 'Car status updated successfully' });
  } catch (err) {
    console.error('Error updating car status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
