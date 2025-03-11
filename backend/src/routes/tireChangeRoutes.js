const express = require('express');
const router = express.Router();
const tireChangeController = require('../controllers/tireChangeController');

// Define as rotas e associa cada uma às funções do controlador
router.post('/', tireChangeController.createTireChange);
router.get('/', tireChangeController.getTireChanges);
router.get('/:carId', tireChangeController.getTireChangesByCar);
router.get('/entry/:id', tireChangeController.getTireChangeById);
router.put('/entry/:id', tireChangeController.updateTireChange);
router.delete('/entry/:id', tireChangeController.deleteTireChange);

module.exports = router;
