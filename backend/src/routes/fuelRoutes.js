const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');

// Get fuel costs for a specific car
router.get('/costs/:carId', fuelController.getFuelCostsByCar);

module.exports = router; 