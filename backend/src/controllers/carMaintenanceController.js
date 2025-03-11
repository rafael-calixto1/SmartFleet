const db = require('../config/db');

// CREATE A NEW CAR MAINTENANCE ENTRY
exports.createCarMaintenanceEntry = async (req, res) => {
  const { car_id, maintenance_type_id, maintenance_date, maintenance_kilometers, recurrency } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO car_maintenance_history (car_id, maintenance_type_id, maintenance_date, maintenance_kilometers, recurrency) VALUES (?, ?, ?, ?, ?)',
      [car_id, maintenance_type_id, maintenance_date, maintenance_kilometers, recurrency]
    );

    res.status(201).json({ message: 'Car maintenance entry added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error adding car maintenance entry: ', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

// GET A SPECIFIC CAR MAINTENANCE ENTRY BY ID
exports.getCarMaintenanceEntryById = (req, res) => {
  const maintenanceId = req.params.id;

  db.query('SELECT * FROM car_maintenance_history WHERE id = ?', [maintenanceId], (err, results) => {
    if (err) {
      console.error('Error retrieving car maintenance entry: ', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    } else {
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ error: 'Car maintenance entry not found' });
      }
    }
  });
};

// GET ALL CAR MAINTENANCE ENTRIES WITH PAGINATION AND SORTING
exports.getAllCarMaintenanceEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

    const validLimits = [10, 20, 50, 100];
    if (!validLimits.includes(limit)) {
      limit = 10;
    }

    const offset = (page - 1) * limit;

    // Validate sortField to prevent SQL injection
    const validSortFields = ['id', 'car_id', 'maintenance_type', 'maintenance_date', 'maintenance_kilometers', 'recurrency', 'vehicle', 'maintenance_type_name'];
    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({ error: 'Invalid sort field' });
    }

    // First, get the total count
    const [countResult] = await db.query('SELECT COUNT(*) AS total FROM car_maintenance_history');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Modify the ORDER BY clause to handle vehicle and maintenance type sorting
    let orderByClause;
    if (sortField === 'vehicle') {
      orderByClause = `c.make ${sortOrder}, c.model ${sortOrder}`;
    } else if (sortField === 'maintenance_type_name') {
      orderByClause = `mt.name ${sortOrder}`;
    } else {
      orderByClause = `cmh.${sortField} ${sortOrder}`;
    }

    const query = `
      SELECT 
        cmh.*,
        c.make,
        c.model,
        c.license_plate,
        mt.name as maintenance_type
      FROM car_maintenance_history cmh
      LEFT JOIN cars c ON cmh.car_id = c.id
      LEFT JOIN maintenance_types mt ON cmh.maintenance_type_id = mt.id
      ORDER BY ${orderByClause}, cmh.id ASC
      LIMIT ? OFFSET ?
    `;

    const [result] = await db.query(query, [limit, offset]);

    res.status(200).json({
      carMaintenanceHistory: result,
      totalPages: totalPages,
      currentPage: page,
      total: total
    });
  } catch (err) {
    console.error('Error fetching car maintenance entries:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

// GET ALL MAINTENANCE ENTRIES FOR A SPECIFIC CAR WITH PAGINATION AND SORTING
exports.getCarMaintenanceEntriesByCar = (req, res) => {
  const carId = req.params.carId;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sortField || 'id'; // Default sort by ID
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc'; // Default sort order is asc

const validLimits = [10, 20, 50, 100, 200, 500];

// Validate limit
if (!validLimits.includes(limit)) {
  return res.status(400).json({ error: 'Invalid limit value' });
}

const offset = (page - 1) * limit;

db.query('SELECT COUNT(*) AS total FROM car_maintenance_history WHERE car_id = ?', [carId], (err, countResult) => {
  if (err) {
    console.error('Error counting car maintenance entries for car: ', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }

  const total = countResult[0].total;
  const totalPages = Math.ceil(total / limit);

  const query = `
    SELECT 
      cmh.*,
      c.make,
      c.model,
      c.license_plate,
      mt.name as maintenance_type
    FROM car_maintenance_history cmh
    LEFT JOIN cars c ON cmh.car_id = c.id
    LEFT JOIN maintenance_types mt ON cmh.maintenance_type_id = mt.id
    WHERE cmh.car_id = ?
    ORDER BY ?? ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  db.query(query, [carId, sortField, offset, limit], (err, result) => {
    if (err) {
      console.error('Error fetching car maintenance entries: ', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }

    res.status(200).json({
      carMaintenanceHistory: result,
      totalPages: totalPages,
      currentPage: page,
      total: total,
    });
  });
});
};

// UPDATE A CAR MAINTENANCE ENTRY BY ID
exports.updateCarMaintenanceEntry = (req, res) => {
  const maintenanceId = req.params.id;
  const { car_id, maintenance_type_id, maintenance_date, maintenance_kilometers, recurrency } = req.body;

  db.query(
    'UPDATE car_maintenance_history SET car_id = ?, maintenance_type_id = ?, maintenance_date = ?, maintenance_kilometers = ?, recurrency = ? WHERE id = ?',
    [car_id, maintenance_type_id, maintenance_date, maintenance_kilometers, recurrency, maintenanceId],
    (err, result) => {
      if (err) {
        console.error('Error updating car maintenance entry: ', err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
      } else {
        if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Car maintenance entry updated successfully' });
        } else {
          res.status(404).json({ error: 'Car maintenance entry not found' });
        }
      }
    }
  );
};

// DELETE A CAR MAINTENANCE ENTRY BY ID
exports.deleteCarMaintenanceEntry = (req, res) => {
  const maintenanceId = req.params.id;

  db.query('DELETE FROM car_maintenance_history WHERE id = ?', [maintenanceId], (err, result) => {
    if (err) {
      console.error('Error deleting car maintenance entry: ', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Car maintenance entry deleted successfully' });
      } else {
        res.status(404).json({ error: 'Car maintenance entry not found' });
      }
    }
  });
};
