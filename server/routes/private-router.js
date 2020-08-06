const router = require('express').Router();

const paymentsController = require('../controllers/PaymentsController');
const attendantsController = require('../controllers/AttendantsController');
const instrumentsController = require('../controllers/InstrumentsController');

// List of private routes. The headers will have to provide an authorisation token to access them.
// This verification is done in the JWT service.
router.get('/inscriptions', attendantsController.getAll);
router.get('/inscriptions/:id', attendantsController.getDetails);
router.put('/inscriptions/update/:id', attendantsController.putUpdateAttendant);
router.put('/inscriptions/delete/:id', attendantsController.putDeleteAttendant);

router.get('/payments/:id', paymentsController.getPaymentsByAttendantId);
router.post('/payments', paymentsController.postNewPayment);
router.put('/payments/update/:id', paymentsController.putUpdatePayment);
router.post('/payments/sendStatus', paymentsController.sendStatus);

router.put('/instruments', instrumentsController.putInstruments);

// Disabled routes: only used in development to edit the groups.

// router.post('/instruments', instrumentsController.postInstrument)
// router.delete('/instruments/:id', instrumentsController.deleteInstrument)

module.exports = router;
