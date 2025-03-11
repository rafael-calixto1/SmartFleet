const pool = require('../config/db');

const getMaintenanceStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = `
            SELECT 
                mt.name AS maintenance_type, 
                COUNT(*) AS total_maintenance
            FROM 
                car_maintenance_history cmh
                JOIN maintenance_types mt ON cmh.maintenance_type_id = mt.id
            WHERE 
                cmh.maintenance_date BETWEEN ? AND ?
            GROUP BY 
                mt.name
            ORDER BY 
                total_maintenance DESC;
        `;

        const [rows] = await pool.query(query, [startDate, endDate]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching maintenance statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getMaintenanceStats
}; 