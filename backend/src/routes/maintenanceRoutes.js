const express = require('express');
const router = express.Router();
const maintenanceTypeController = require('../controllers/maintenanceTypeController');
const maintenanceHistoryController = require('../controllers/maintenanceHistoryController');
const maintenanceStatsController = require('../controllers/maintenanceStatsController');

// Maintenance Types Routes
router.get('/types', maintenanceTypeController.getAllMaintenanceTypes);
router.get('/types/:id', maintenanceTypeController.getMaintenanceType);
router.post('/types', maintenanceTypeController.createMaintenanceType);
router.put('/types/:id', maintenanceTypeController.updateMaintenanceType);
router.delete('/types/:id', maintenanceTypeController.deleteMaintenanceType);

// Maintenance History Routes
router.get('/history', maintenanceHistoryController.getAllMaintenanceHistory);
router.get('/history/car/:carId', maintenanceHistoryController.getMaintenanceHistoryByCar);
router.post('/history', maintenanceHistoryController.createMaintenanceHistory);
router.put('/history/:id', maintenanceHistoryController.updateMaintenanceHistory);
router.delete('/history/:id', maintenanceHistoryController.deleteMaintenanceHistory);

// Statistics route
router.get('/stats', maintenanceStatsController.getMaintenanceStats);

module.exports = router; 