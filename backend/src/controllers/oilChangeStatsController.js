const pool = require('../config/db');
const db = require('../config/database');

const getOilChangeCostStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = `
            SELECT 
                CONCAT(c.make, ' ', c.model) AS car_model,
                SUM(o.total_cost) AS total_cost
            FROM 
                oil_change_history o
                JOIN cars c ON o.car_id = c.id
            WHERE 
                o.oil_change_date BETWEEN ? AND ?
            GROUP BY 
                c.id, c.make, c.model
            ORDER BY 
                total_cost DESC;
        `;

        const [rows] = await pool.query(query, [startDate, endDate]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching oil change cost statistics:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
};

const getOilChangeStats = async (req, res) => {
    const { startDate, endDate } = req.query;
    
    try {
        const query = `
            SELECT 
                COUNT(*) as total_oil_changes,
                SUM(total_cost) as total_cost
            FROM 
                oil_change_history
            WHERE 
                oil_change_date BETWEEN ? AND ?
        `;
        
        const [results] = await db.query(query, [startDate || '2000-01-01', endDate || new Date().toISOString().split('T')[0]]);
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching oil change statistics:', error);
        res.status(500).json({ message: 'Error fetching oil change statistics', error: error.message });
    }
};

const getOilChangeCostsByCar = async (req, res) => {
    const { startDate, endDate } = req.query;
    
    try {
        const query = `
            SELECT 
                c.model AS car_model, 
                SUM(och.total_cost) AS total_cost
            FROM 
                oil_change_history och
            JOIN 
                cars c ON och.car_id = c.id
            WHERE 
                och.oil_change_date BETWEEN ? AND ?
            GROUP BY 
                c.model
            ORDER BY
                total_cost DESC
        `;
        
        const [results] = await db.query(query, [startDate || '2000-01-01', endDate || new Date().toISOString().split('T')[0]]);
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching oil change costs by car:', error);
        res.status(500).json({ message: 'Error fetching oil change costs by car', error: error.message });
    }
};

const getOilChangeCostsByMonth = async (req, res) => {
    const { carId } = req.params;
    const { startDate, endDate } = req.query;
    
    try {
        const query = `
            SELECT 
                DATE_FORMAT(och.oil_change_date, '%Y-%m') AS month, 
                SUM(och.total_cost) AS total_cost
            FROM 
                oil_change_history och
            WHERE 
                och.car_id = ?
                AND och.oil_change_date BETWEEN ? AND ?
            GROUP BY 
                DATE_FORMAT(och.oil_change_date, '%Y-%m')
            ORDER BY
                month ASC
        `;
        
        const [results] = await db.query(query, [
            carId,
            startDate || '2000-01-01', 
            endDate || new Date().toISOString().split('T')[0]
        ]);
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching oil change costs by month:', error);
        res.status(500).json({ 
            message: 'Error fetching oil change costs by month', 
            error: error.message 
        });
    }
};

module.exports = {
    getOilChangeCostStats,
    getOilChangeStats,
    getOilChangeCostsByCar,
    getOilChangeCostsByMonth
}; 