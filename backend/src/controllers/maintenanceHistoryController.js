const db = require('../config/db');

// Get all maintenance history records
exports.getAllMaintenanceHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'maintenance_date';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

    const validLimits = [10, 20, 50, 100];
    if (!validLimits.includes(limit)) {
        return res.status(400).json({ error: 'Invalid limit value' });
    }

    const offset = (page - 1) * limit;

    // Validate and map sort fields
    const validSortFields = {
        'id': 'cmh.id',
        'maintenance_date': 'cmh.maintenance_date',
        'maintenance_kilometers': 'cmh.maintenance_kilometers',
        'maintenance_type': 'mt.name',
        'recurrency': 'cmh.recurrency',
        'car_id': 'cmh.car_id',
        'vehicle': 'CONCAT(c.make, " ", c.model)'
    };

    const sortBy = validSortFields[sortField] || 'cmh.maintenance_date';

    try {
        // Get total count
        const [countResult] = await db.execute('SELECT COUNT(*) as total FROM car_maintenance_history');
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        // Get paginated and sorted results
        const query = `
            SELECT 
                cmh.*,
                mt.name as maintenance_type_name,
                c.make,
                c.model,
                c.license_plate
            FROM car_maintenance_history cmh
            JOIN maintenance_types mt ON cmh.maintenance_type_id = mt.id
            JOIN cars c ON cmh.car_id = c.id
            ORDER BY ${sortBy} ${sortOrder}, cmh.id ASC
            LIMIT ? OFFSET ?
        `;

        const [history] = await db.execute(query, [limit, offset]);

        res.json({
            maintenanceHistory: history,
            totalPages: totalPages,
            currentPage: page,
            total: total
        });
    } catch (error) {
        console.error('Error fetching maintenance history:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

// Get maintenance history by car ID
exports.getMaintenanceHistoryByCar = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'maintenance_date';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

    const validLimits = [10, 20, 50, 100];
    if (!validLimits.includes(limit)) {
        return res.status(400).json({ error: 'Invalid limit value' });
    }

    const offset = (page - 1) * limit;

    try {
        // Get total count for specific car
        const [countResult] = await db.execute(
            'SELECT COUNT(*) as total FROM car_maintenance_history WHERE car_id = ?',
            [req.params.carId]
        );
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        // Get paginated and sorted results for specific car
        const [history] = await db.execute(`
            SELECT 
                cmh.*,
                mt.name as maintenance_type_name,
                c.make,
                c.model,
                c.license_plate
            FROM car_maintenance_history cmh
            JOIN maintenance_types mt ON cmh.maintenance_type_id = mt.id
            JOIN cars c ON cmh.car_id = c.id
            WHERE cmh.car_id = ?
            ORDER BY ${sortField} ${sortOrder}
            LIMIT ? OFFSET ?
        `, [req.params.carId, limit, offset]);

        res.json({
            maintenanceHistory: history,
            totalPages: totalPages,
            currentPage: page,
            total: total
        });
    } catch (error) {
        console.error('Error fetching maintenance history for car:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

// Create a new maintenance history record
exports.createMaintenanceHistory = async (req, res) => {
    const {
        car_id,
        maintenance_type_id,
        maintenance_date,
        maintenance_kilometers,
        observation,
        recurrency
    } = req.body;

    let connection;
    try {
        // Get a connection from the pool
        connection = await db.getConnection();
        
        // Start a transaction
        await connection.beginTransaction();

        // Get maintenance type details first
        const [maintenanceType] = await connection.execute(
            'SELECT * FROM maintenance_types WHERE id = ?',
            [maintenance_type_id]
        );

        if (!maintenanceType.length) {
            throw new Error('Invalid maintenance type ID');
        }

        // Insert maintenance history with maintenance type name
        const [result] = await connection.execute(
            `INSERT INTO car_maintenance_history 
            (car_id, maintenance_type_id, maintenance_type, maintenance_date, maintenance_kilometers, observation, recurrency)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [car_id, maintenance_type_id, maintenanceType[0].name, maintenance_date, maintenance_kilometers, observation, recurrency]
        );

        if (maintenanceType[0].recurrency) {
            // Calculate next maintenance based on recurrency
            const nextMaintenanceKm = maintenance_kilometers + maintenanceType[0].recurrency;

            // Update car's maintenance tracking
            await connection.execute(
                `UPDATE cars 
                SET current_kilometers = ?
                WHERE id = ?`,
                [maintenance_kilometers, car_id]
            );
        }

        // Commit the transaction
        await connection.commit();

        res.status(201).json({
            id: result.insertId,
            car_id,
            maintenance_type_id,
            maintenance_type: maintenanceType[0].name,
            maintenance_date,
            maintenance_kilometers,
            observation,
            recurrency
        });
    } catch (error) {
        // Rollback the transaction if there's an error
        if (connection) {
            await connection.rollback();
        }
        console.error('Error creating maintenance history:', error);
        res.status(500).json({ message: error.message });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};

// Update a maintenance history record
exports.updateMaintenanceHistory = async (req, res) => {
    const {
        car_id,
        maintenance_type_id,
        maintenance_date,
        maintenance_kilometers,
        observation,
        recurrency
    } = req.body;

    let connection;
    try {
        // Get a connection from the pool
        connection = await db.getConnection();
        
        // Start a transaction
        await connection.beginTransaction();

        // Get maintenance type details
        const [maintenanceType] = await connection.execute(
            'SELECT * FROM maintenance_types WHERE id = ?',
            [maintenance_type_id]
        );

        if (!maintenanceType.length) {
            throw new Error('Invalid maintenance type ID');
        }

        const [result] = await connection.execute(
            `UPDATE car_maintenance_history 
            SET car_id = ?, maintenance_type_id = ?, maintenance_type = ?, maintenance_date = ?, 
                maintenance_kilometers = ?, observation = ?, recurrency = ?
            WHERE id = ?`,
            [car_id, maintenance_type_id, maintenanceType[0].name, maintenance_date, maintenance_kilometers, 
             observation, recurrency, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Maintenance history record not found' });
        }

        // Commit the transaction
        await connection.commit();

        res.json({
            id: req.params.id,
            car_id,
            maintenance_type_id,
            maintenance_type: maintenanceType[0].name,
            maintenance_date,
            maintenance_kilometers,
            observation,
            recurrency
        });
    } catch (error) {
        // Rollback the transaction if there's an error
        if (connection) {
            await connection.rollback();
        }
        console.error('Error updating maintenance history:', error);
        res.status(500).json({ message: error.message });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};

// Delete a maintenance history record
exports.deleteMaintenanceHistory = async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM car_maintenance_history WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Maintenance history record not found' });
        }

        res.json({ message: 'Maintenance history record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get maintenance history count by month for a specific car
exports.getMaintenanceCountByMonth = async (req, res) => {
    const { carId } = req.params;
    const { startDate, endDate } = req.query;
    
    try {
        const query = `
            SELECT 
                DATE_FORMAT(maintenance_date, '%Y-%m') AS month, 
                COUNT(*) AS maintenance_count
            FROM 
                car_maintenance_history
            WHERE 
                car_id = ?
                AND maintenance_date BETWEEN ? AND ?
            GROUP BY 
                DATE_FORMAT(maintenance_date, '%Y-%m')
            ORDER BY
                month ASC
        `;
        
        const [results] = await db.execute(query, [
            carId,
            startDate || '2000-01-01', 
            endDate || new Date().toISOString().split('T')[0]
        ]);
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching maintenance count by month:', error);
        res.status(500).json({ 
            message: 'Error fetching maintenance count by month', 
            error: error.message 
        });
    }
}; 