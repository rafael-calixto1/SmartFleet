const db = require('../config/db');

// Get all maintenance types
exports.getAllMaintenanceTypes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sortField || 'id';
        const sortOrder = req.query.sortOrder || 'asc';

        // Validate limit to only allow specific values
        const validLimits = [10, 20, 50, 100];
        if (!validLimits.includes(limit)) {
            limit = 10;
        }

        const offset = (page - 1) * limit;

        // Validate sortField to prevent SQL injection
        const allowedSortFields = ['id', 'name', 'recurrency', 'recurrency_date'];
        if (!allowedSortFields.includes(sortField)) {
            return res.status(400).json({ message: 'Invalid sort field' });
        }

        // Get total count
        const [countResult] = await db.execute('SELECT COUNT(*) as total FROM maintenance_types');
        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // Get paginated and sorted results
        const [types] = await db.execute(
            `SELECT * FROM maintenance_types ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`,
            [limit, offset]
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