const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const corsOptions = {
  origin: '*',  // Permitir qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],  // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeçalhos permitidos
};

// Import routes
const carsRoutes = require('./routes/carsRoutes');
const driversRoutes = require('./routes/driversRoutes');
const fuelingRoutes = require('./routes/fuelingRoutes');
const oilChangeRoutes = require('./routes/oilChangeRoutes');
const tireChangeRoutes = require('./routes/tireChangeRoutes');
const carMaintenanceRoutes = require('./routes/carMaintenanceRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const maintenanceTypeRoutes = require('./routes/maintenanceTypeRoutes');
const maintenanceStatsRoutes = require('./routes/maintenanceStatsRoutes');
const vehicleStatusRoutes = require('./routes/vehicleStatusRoutes');
const fuelRoutes = require('./routes/fuelRoutes');

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/cars', carsRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/fueling', fuelingRoutes);
app.use('/api/oil-changes', oilChangeRoutes);
app.use('/api/tire-changes', tireChangeRoutes);
app.use('/api/car-maintenance', carMaintenanceRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/maintenance-types', maintenanceTypeRoutes);
app.use('/api/maintenance-stats', maintenanceStatsRoutes);
app.use('/api', vehicleStatusRoutes);
app.use('/api/fuel', fuelRoutes);

module.exports = app;
