import { rest } from 'msw';
import { buildPayments, buildParticipant } from '../../../test/test-utils';

const apiUrl = process.env.REACT_APP_API_URL;

export const handlers = [
  rest.get(`${apiUrl}/greeting`, (req, res, ctx) => {
    return res(ctx.json({ greeting: 'hi there' }));
  }),
  rest.get(`${apiUrl}/instruments`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, name: 'guitar', max_attendants: 8 }])
    );
  }),
  rest.post(`${apiUrl}/inscriptions`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'ok' }));
  }),

  rest.get(`${apiUrl}/inscriptions/:id`, (req, res, ctx) => {
    const participant = buildParticipant();
    participant.id = req.params.id;
    participant.first_name = 'Phil';
    participant.last_name = 'Dunphy';
    return res(ctx.status(200), ctx.json(participant));
  }),

  // payments
  rest.get(`${apiUrl}/payments/:id`, (req, res, ctx) => {
    const payments = req.params.id === '1' ? [] : buildPayments({ number: 3 });
    return res(ctx.status(200), ctx.json([...payments]));
  }),
  rest.put(`${apiUrl}/payments/update/:id`, (req, res, ctx) => {
    // console.log(req.body)
    return res(
      ctx.status(200),
      ctx.json({
        id: req.body.id,
        type_of_payment: req.body.type_of_payment,
        amount_paid: req.body.amount_paid,
        payment_date: req.body.payment_date,
      })
    );
  }),
  rest.post(`${apiUrl}/payments`, (req, res, ctx) => {
    // console.log(req.body)
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        type_of_payment: req.body.type_of_payment,
        amount_paid: req.body.amount_paid,
        payment_date: req.body.payment_date,
      })
    );
  }),
];
