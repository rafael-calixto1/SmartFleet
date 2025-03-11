const express = require('express');
const router = express.Router();
const maintenanceHistoryController = require('../controllers/maintenanceHistoryController');

// Get maintenance count by month for a specific car
router.get('/count-by-month/:carId', maintenanceHistoryController.getMaintenanceCountByMonth);

module.exports = router; 