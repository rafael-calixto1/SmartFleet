const db = require('../config/db');

// CREATE A NEW DRIVER
exports.createDriver = async (req, res) => {
  const { name, license_number } = req.body;

  if (!name || !license_number) {
    return res.status(400).json({ error: 'Nome e número da licença são obrigatórios.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO drivers (name, license_number) VALUES (?, ?)',
      [name, license_number]
    );
    res.status(201).json({ 
      message: 'Motorista adicionado com sucesso',
      id: result.insertId
    });
  } catch (err) {
    console.error('Erro ao adicionar motorista: ', err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// GET ALL DRIVERS with Pagination and Sorting
exports.getDrivers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 50;
  const sortField = req.query.sortField || 'id';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

  const validLimits = [10, 20, 50, 100, 200, 500];
  if (!validLimits.includes(limit)) {
    limit = 10;
  }

  const offset = (page - 1) * limit;

  const validSortFields = ['id', 'name', 'license_number'];
  if (!validSortFields.includes(sortField)) {
    return res.status(400).json({ message: 'Invalid sort field' });
  }

  try {
    const [countResult] = await db.execute('SELECT COUNT(*) AS total FROM drivers');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    const [drivers] = await db.execute(
      `SELECT * FROM drivers ORDER BY ${sortField} ${sortOrder} LIMIT ?, ?`,
      [offset, limit]
    );

    res.status(200).json({
      drivers: drivers,
      totalPages: totalPages,
      currentPage: page,
      total: total,
    });
  } catch (err) {
    console.error('Error fetching drivers: ', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET A DRIVER BY ID
exports.getDriverById = async (req, res) => {
  const driver_id = req.params.id;

  try {
    const [results] = await db.execute('SELECT * FROM drivers WHERE id = ?', [driver_id]);
    
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (err) {
    console.error('Error retrieving driver: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE DRIVER BY ID
exports.updateDriver = async (req, res) => {
  const driver_id = req.params.id;
  const { name, license_number } = req.body;

  if (!name || !license_number) {
    return res.status(400).json({ message: "Nome e número da CNH são obrigatórios." });
  }

  try {
    const [result] = await db.execute(
      'UPDATE drivers SET name = ?, license_number = ? WHERE id = ?',
      [name, license_number, driver_id]
    );
    
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Driver updated successfully' });
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (err) {
    console.error('Error updating driver: ', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE A DRIVER BY ID
exports.deleteDriver = async (req, res) => {
  const driver_id = req.params.id;

  try {
    // First check if driver has any cars assigned
    const [carCheck] = await db.execute('SELECT COUNT(*) as count FROM cars WHERE driver_id = ?', [driver_id]);
    
    if (carCheck[0].count > 0) {
      return res.status(400).json({
        error: 'Cannot delete driver',
        message: 'Este motorista está atribuído a um ou mais carros. Por favor, remova a atribuição dos carros antes de excluir o motorista.'
      });
    }

    const [result] = await db.execute('DELETE FROM drivers WHERE id = ?', [driver_id]);
    
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Driver deleted successfully' });
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (err) {
    console.error('Error deleting driver: ', err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        error: 'Cannot delete driver',
        message: 'Este motorista está atribuído a um ou mais carros. Por favor, remova a atribuição dos carros antes de excluir o motorista.'
      });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};