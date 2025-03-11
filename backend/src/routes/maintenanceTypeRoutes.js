const express = require('express');
const router = express.Router();
const maintenanceTypeController = require('../controllers/maintenanceTypeController');

// Get all maintenance types
router.get('/', maintenanceTypeController.getAllMaintenanceTypes);

// Get a single maintenance type
router.get('/:id', maintenanceTypeController.getMaintenanceType);

// Create a new maintenance type
router.post('/', maintenanceTypeController.createMaintenanceType);

// Update a maintenance type
router.put('/:id', maintenanceTypeController.updateMaintenanceType);

// Delete a maintenance type
router.delete('/:id', maintenanceTypeController.deleteMaintenanceType);

module.exports = router; 