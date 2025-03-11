const express = require('express');
const router = express.Router();
const vehicleStatusController = require('../controllers/vehicleStatusController');

router.get('/vehicle-status', vehicleStatusController.getVehicleStatus);

module.exports = router; 