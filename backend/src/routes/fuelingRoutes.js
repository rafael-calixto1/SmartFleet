const express = require('express');
const router = express.Router();
const fuelingController = require('../controllers/fuelingController');

// Statistics routes
router.get('/statistics/fuel-by-type', fuelingController.getFuelByTypeStatistics);
router.get('/statistics/fuel-cost-by-type', fuelingController.getFuelCostByTypeStatistics);
router.get('/statistics/maintenance-by-type', fuelingController.getMaintenanceByTypeStatistics);
router.get('/statistics/fueling-by-date', fuelingController.getFuelingByDateStatistics);
router.get('/statistics', fuelingController.getFuelingStatistics);

// CRUD routes
router.get('/', fuelingController.getFuelingHistory);
router.get('/:id', fuelingController.getFuelingEntryById);
router.post('/', fuelingController.createFuelingEntry);
router.put('/:id', fuelingController.updateFuelingEntry);
router.delete('/entry/:id', fuelingController.deleteFuelingEntry);

module.exports = router;
