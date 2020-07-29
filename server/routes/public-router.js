const router = require('express').Router();

const attendantsController = require('../controllers/AttendantsController');
const instrumentsController = require('../controllers/InstrumentsController');

router.post('/inscriptions', attendantsController.postNewAttendant)
router.get('/instruments',instrumentsController.getInstruments)
// router.post('/instruments', instrumentsController.postInstrument)
// router.put('/instruments/:id', instrumentsController.putInstrument)
// router.delete('/instruments/:id', instrumentsController.deleteInstrument)

// const paymentsController = require('../controllers/PaymentsController');

// router.get('/inscriptions', attendantsController.getAll);
// router.get('/inscriptions/:id', attendantsController.getDetails);
// router.put('/inscriptions/update/:id', attendantsController.putUpdateAttendant)
// router.put('/inscriptions/delete/:id', attendantsController.putDeleteAttendant);

// router.get('/payments/:id', paymentsController.getPaymentsByAttendantId);
// router.post('/payments', paymentsController.postNewPayment);
// router.put('/payments/update/:id', paymentsController.putUpdatePayment);

module.exports = router;