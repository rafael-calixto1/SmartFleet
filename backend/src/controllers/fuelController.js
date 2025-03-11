const db = require('../config/database');

const getFuelCostsByCar = async (req, res) => {
    const { carId } = req.params;
    const { startDate, endDate } = req.query;

    try {
        const query = `
            SELECT 
                DATE_FORMAT(f.fuel_date, '%Y-%m') as month,
                SUM(f.total_cost) as totalCost,
                SUM(f.liters_quantity) as totalLiters
            FROM 
                fueling_history f
            WHERE 
                f.car_id = ?
                ${startDate ? 'AND f.fuel_date >= ?' : ''}
                ${endDate ? 'AND f.fuel_date <= ?' : ''}
            GROUP BY 
                DATE_FORMAT(f.fuel_date, '%Y-%m')
            ORDER BY 
                month DESC
            LIMIT 12
        `;

        const queryParams = [carId];
        if (startDate) queryParams.push(startDate);
        if (endDate) queryParams.push(endDate);

        const [results] = await db.query(query, queryParams);

        // Format the results
        const formattedResults = results.map(row => ({
            month: row.month,
            totalCost: parseFloat(row.totalCost),
            totalLiters: parseFloat(row.totalLiters)
        }));

        res.json(formattedResults);
    } catch (error) {
        console.error('Error fetching fuel costs:', error);
        res.status(500).json({ 
            message: 'Erro ao buscar custos de combustível',
            error: error.message 
        });
    }
};

module.exports = {
    getFuelCostsByCar
}; 