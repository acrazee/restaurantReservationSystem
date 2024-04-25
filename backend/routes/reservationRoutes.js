const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

//POST endpoint - creating reservation
router.post('/', reservationController.createReservation);

//GET endpoint- listing reservations
router.get('/', reservationController.getAllReservations);
//delete
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;