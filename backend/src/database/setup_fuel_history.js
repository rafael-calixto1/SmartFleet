const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function setupFuelHistory() {
    try {
        // Read and execute the SQL file
        const sqlFile = path.join(__dirname, 'fuel_history.sql');
        const createTableSQL = fs.readFileSync(sqlFile, 'utf8');
        await db.query(createTableSQL);
        console.log('Fuel history table created successfully');

        // Insert sample data
        const sampleData = [
            // Last 6 months of data for car_id 1
            { car_id: 1, date: '2024-03-01', liters: 45.5, price_per_liter: 5.89, total_cost: 267.99 },
            { car_id: 1, date: '2024-02-15', liters: 42.0, price_per_liter: 5.79, total_cost: 243.18 },
            { car_id: 1, date: '2024-01-20', liters: 48.0, price_per_liter: 5.99, total_cost: 287.52 },
            { car_id: 1, date: '2023-12-10', liters: 40.0, price_per_liter: 5.69, total_cost: 227.60 },
            { car_id: 1, date: '2023-11-05', liters: 43.5, price_per_liter: 5.59, total_cost: 243.17 },
            { car_id: 1, date: '2023-10-01', liters: 46.0, price_per_liter: 5.49, total_cost: 252.54 },

            // Last 6 months of data for car_id 2
            { car_id: 2, date: '2024-03-05', liters: 50.0, price_per_liter: 5.89, total_cost: 294.50 },
            { car_id: 2, date: '2024-02-10', liters: 48.5, price_per_liter: 5.79, total_cost: 280.82 },
            { car_id: 2, date: '2024-01-15', liters: 52.0, price_per_liter: 5.99, total_cost: 311.48 },
            { car_id: 2, date: '2023-12-20', liters: 47.0, price_per_liter: 5.69, total_cost: 267.43 },
            { car_id: 2, date: '2023-11-25', liters: 49.5, price_per_liter: 5.59, total_cost: 276.71 },
            { car_id: 2, date: '2023-10-30', liters: 51.0, price_per_liter: 5.49, total_cost: 279.99 }
        ];

        for (const record of sampleData) {
            await db.query(
                'INSERT INTO fuel_history (car_id, date, liters, price_per_liter, total_cost) VALUES (?, ?, ?, ?, ?)',
                [record.car_id, record.date, record.liters, record.price_per_liter, record.total_cost]
            );
        }
        console.log('Sample fuel history data inserted successfully');

    } catch (error) {
        console.error('Error setting up fuel history:', error);
    } finally {
        process.exit();
    }
}

setupFuelHistory(); 
const path = require('path');
const db = require('../config/database');

async function setupFuelHistory() {
    try {
        // Read and execute the SQL file
        const sqlFile = path.join(__dirname, 'fuel_history.sql');
        const createTableSQL = fs.readFileSync(sqlFile, 'utf8');
        await db.query(createTableSQL);
        console.log('Fuel history table created successfully');

        // Insert sample data
        const sampleData = [
            // Last 6 months of data for car_id 1
            { car_id: 1, date: '2024-03-01', liters: 45.5, price_per_liter: 5.89, total_cost: 267.99 },
            { car_id: 1, date: '2024-02-15', liters: 42.0, price_per_liter: 5.79, total_cost: 243.18 },
            { car_id: 1, date: '2024-01-20', liters: 48.0, price_per_liter: 5.99, total_cost: 287.52 },
            { car_id: 1, date: '2023-12-10', liters: 40.0, price_per_liter: 5.69, total_cost: 227.60 },
            { car_id: 1, date: '2023-11-05', liters: 43.5, price_per_liter: 5.59, total_cost: 243.17 },
            { car_id: 1, date: '2023-10-01', liters: 46.0, price_per_liter: 5.49, total_cost: 252.54 },

            // Last 6 months of data for car_id 2
            { car_id: 2, date: '2024-03-05', liters: 50.0, price_per_liter: 5.89, total_cost: 294.50 },
            { car_id: 2, date: '2024-02-10', liters: 48.5, price_per_liter: 5.79, total_cost: 280.82 },
            { car_id: 2, date: '2024-01-15', liters: 52.0, price_per_liter: 5.99, total_cost: 311.48 },
            { car_id: 2, date: '2023-12-20', liters: 47.0, price_per_liter: 5.69, total_cost: 267.43 },
            { car_id: 2, date: '2023-11-25', liters: 49.5, price_per_liter: 5.59, total_cost: 276.71 },
            { car_id: 2, date: '2023-10-30', liters: 51.0, price_per_liter: 5.49, total_cost: 279.99 }
        ];

        for (const record of sampleData) {
            await db.query(
                'INSERT INTO fuel_history (car_id, date, liters, price_per_liter, total_cost) VALUES (?, ?, ?, ?, ?)',
                [record.car_id, record.date, record.liters, record.price_per_liter, record.total_cost]
            );
        }
        console.log('Sample fuel history data inserted successfully');

    } catch (error) {
        console.error('Error setting up fuel history:', error);
    } finally {
        process.exit();
    }
}

setupFuelHistory(); 
 