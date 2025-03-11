const express = require('express');
const router = express.Router();
const oilChangeController = require('../controllers/oilChangeController');
const oilChangeStatsController = require('../controllers/oilChangeStatsController');

// Get oil change statistics
router.get('/stats', oilChangeStatsController.getOilChangeStats);
router.get('/costs-by-car', oilChangeStatsController.getOilChangeCostsByCar);
router.get('/costs-by-month/:carId', oilChangeStatsController.getOilChangeCostsByMonth);

// Route to create a new oil change record
router.post('/', oilChangeController.createOilChange);

// Route to get all oil change records with pagination
router.get('/', oilChangeController.getOilChangeHistory);

// Route to get an oil change record by ID
router.get('/:id', oilChangeController.getOilChangeById);

// Route to update an oil change record by ID
router.put('/:id', oilChangeController.updateOilChange);

// Route to delete an oil change record by ID
router.delete('/:id', oilChangeController.deleteOilChange);

module.exports = router;
