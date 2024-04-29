const express = require('express');
const sanitizeHtml =  require('sanitize-html');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

//POST endpoint - creating reservation
/*
router.post('/', (req, res) =>{ 
const sanitizedBody = {
customerName: sanitizeHtml(req.body.customerName),
customerPhone: sanitizeHtml(req.body.customerPhone),
resDate: req.body.resDate,
resTime: req.body.resTime,
heads: req.body.heads
};
reservationController.createReservation(sanitizedBody, res);
});
*/
router.post('/', reservationController.createReservation);


//GET endpoint- listing reservations
router.get('/', reservationController.getAllReservations);
//delete
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;