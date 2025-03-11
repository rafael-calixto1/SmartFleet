const express = require('express');
const router = express.Router();
const driversController = require('../controllers/driversController'); // Corrigir a importação

// Define as rotas e associa cada uma às funções do controlador
router.post('/', driversController.createDriver);
router.get('/', driversController.getDrivers);
router.get('/:id', driversController.getDriverById);
router.put('/:id', driversController.updateDriver);
router.delete('/:id', driversController.deleteDriver);

module.exports = router;