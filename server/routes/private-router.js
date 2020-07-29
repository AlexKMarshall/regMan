const router = require('express').Router();

const paymentsController = require('../controllers/PaymentsController');
const attendantsController = require('../controllers/AttendantsController');
const instrumentsController = require('../controllers/InstrumentsController');

router.get('/inscriptions', attendantsController.getAll);
router.get('/inscriptions/:id', attendantsController.getDetails);
router.put('/inscriptions/update/:id', attendantsController.putUpdateAttendant)
router.put('/inscriptions/delete/:id', attendantsController.putDeleteAttendant);

router.get('/payments/:id', paymentsController.getPaymentsByAttendantId);
router.post('/payments', paymentsController.postNewPayment);
router.put('/payments/update/:id', paymentsController.putUpdatePayment);

router.put('/instruments/:id', instrumentsController.putInstrument)
// router.post('/instruments', instrumentsController.postInstrument)
// router.delete('/instruments/:id', instrumentsController.deleteInstrument)

module.exports = router;