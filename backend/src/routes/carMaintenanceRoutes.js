const express = require('express');
const router = express.Router();
const carMaintenanceController = require('../controllers/carMaintenanceController');

// Define routes for car maintenance without the '/api' prefix
router.post('/', carMaintenanceController.createCarMaintenanceEntry);
router.get('/', carMaintenanceController.getAllCarMaintenanceEntries);
router.get('/:id', carMaintenanceController.getCarMaintenanceEntryById);
router.put('/:id', carMaintenanceController.updateCarMaintenanceEntry);
router.delete('/:id', carMaintenanceController.deleteCarMaintenanceEntry);
router.get('/car/:carId', carMaintenanceController.getCarMaintenanceEntriesByCar);
router.get('/entry/:id', carMaintenanceController.getCarMaintenanceEntryById);

module.exports = router;
