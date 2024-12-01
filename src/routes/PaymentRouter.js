const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const PaymentController = require ('../controllers/PaymentController');

router.post('/create_payment', PaymentController.createPayment)

module.exports = router;
=======
const PaymentController = require("../controllers/PaymentController");

router.post("/create_payment", PaymentController.createPayment);

module.exports = router;
>>>>>>> 6a6d2cec9539510d72d84b4d76f057705280b7cb
