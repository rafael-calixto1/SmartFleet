const express = require('express');
const router = express.Router();
const carController = require('../controllers/carsController');

// Criar um novo carro
router.post('/', carController.createCar);

// Obter todos os carros com paginação
router.get('/', carController.getAllCars);

// Obter um carro específico pelo ID
router.get('/:id', carController.getCarById);

// Atualizar um carro pelo ID
router.put('/:id', carController.updateCar);

// Deletar um carro pelo ID
router.delete('/:id', carController.deleteCar);

// Rota para atualizar current_kilometers
router.put('/:id/current-kilometers', carController.updateCurrentKilometers);

// Rota para atualizar next_oil_change
router.put('/:id/next-oil-change', carController.updateNextOilChange);

// Rota para atualizar next_tire_change
router.put('/:id/next-tire-change', carController.updateNextTireChange);

// Rota para atualizar o status do carro
router.patch('/:id/status', carController.updateCarStatus);

module.exports = router;