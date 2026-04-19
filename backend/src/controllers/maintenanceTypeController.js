const db = require('../config/db');

// Get all maintenance types
exports.getAllMaintenanceTypes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sortField || 'id';
        const sortOrder = req.query.sortOrder || 'asc';
        const status = req.query.status || 'active'; // Default to 'active'

        // Validate limit to only allow specific values
        const validLimits = [10, 20, 50, 100];
        if (!validLimits.includes(limit)) {
            limit = 10;
        }

        const offset = (page - 1) * limit;

        // Validate sortField to prevent SQL injection
        const allowedSortFields = ['id', 'name', 'recurrency', 'recurrency_date', 'status'];
        if (!allowedSortFields.includes(sortField)) {
            return res.status(400).json({ message: 'Invalid sort field' });
        }

        // Build the WHERE clause based on status
        let statusCondition = '';
        let statusParams = [];

        if (status === 'active') {
            statusCondition = ' WHERE status = ?';
            statusParams = ['active'];
        } else if (status === 'inactive') {
            statusCondition = ' WHERE status = ?';
            statusParams = ['inactive'];
        }

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM maintenance_types${statusCondition}`;
        const [countResult] = await db.execute(countQuery, statusParams);
        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // Get paginated and sorted results
        const [types] = await db.execute(
            `SELECT * FROM maintenance_types ${statusCondition} ORDER BY ${sortField} ${sortOrder} LIMIT ${limit} OFFSET ${offset}`,
            statusParams
        );

        res.json({
            maintenanceTypes: types,
            currentPage: page,
            totalPages,
            totalItems,
            limit,
            validLimits
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... (other methods unchanged)

// Update a maintenance type status
exports.updateMaintenanceTypeStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be either "active" or "inactive".' });
    }

    try {
        const [result] = await db.execute(
            'UPDATE maintenance_types SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Maintenance type not found' });
        }

        res.json({ message: 'Maintenance type status updated successfully' });
    } catch (err) {
        console.error('Error updating maintenance type status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single maintenance type
exports.getMaintenanceType = async (req, res) => {
    try {
        const [type] = await db.execute('SELECT * FROM maintenance_types WHERE id = ?', [req.params.id]);
        if (type.length === 0) {
            return res.status(404).json({ message: 'Maintenance type not found' });
        }
        res.json(type[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new maintenance type
exports.createMaintenanceType = async (req, res) => {
    const { name, recurrency, recurrency_date } = req.body;
    try {
        // Validate that recurrency is a positive integer
        if (!Number.isInteger(recurrency) || recurrency < 0) {
            return res.status(400).json({ message: 'Recurrency must be a positive integer' });
        }

        const [result] = await db.execute(
            'INSERT INTO maintenance_types (name, recurrency, recurrency_date) VALUES (?, ?, ?)',
            [name, recurrency, recurrency_date]
        );
        res.status(201).json({
            id: result.insertId,
            name,
            recurrency,
            recurrency_date
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a maintenance type
exports.updateMaintenanceType = async (req, res) => {
    const { name, recurrency, recurrency_date } = req.body;
    try {
        // Validate that recurrency is a positive integer
        if (!Number.isInteger(recurrency) || recurrency < 0) {
            return res.status(400).json({ message: 'Recurrency must be a positive integer' });
        }

        const [result] = await db.execute(
            'UPDATE maintenance_types SET name = ?, recurrency = ?, recurrency_date = ? WHERE id = ?',
            [name, recurrency, recurrency_date, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Maintenance type not found' });
        }
        res.json({ id: req.params.id, name, recurrency, recurrency_date });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a maintenance type
exports.deleteMaintenanceType = async (req, res) => {
    try {
        // First check if there are any maintenance history records using this type
        const [references] = await db.execute(
            'SELECT COUNT(*) as count FROM car_maintenance_history WHERE maintenance_type_id = ?',
            [req.params.id]
        );

        if (references[0].count > 0) {
            return res.status(400).json({
                message: 'Não é possível excluir este tipo de manutenção pois existem registros de manutenção associados a ele.'
            });
        }

        // If no references exist, proceed with deletion
        const [result] = await db.execute('DELETE FROM maintenance_types WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Maintenance type not found' });
        }
        res.json({ message: 'Maintenance type deleted successfully' });
    } catch (error) {
        console.error('Error deleting maintenance type:', error);
        res.status(500).json({ message: error.message });
    }
}; 