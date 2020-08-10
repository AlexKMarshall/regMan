import { rest } from 'msw';

const apiUrl = process.env.REACT_APP_API_URL;

export const handlers = [
  rest.get(`${apiUrl}/greeting`, (req, res, ctx) => {
    return res(ctx.json({ greeting: 'hi there' }));
  }),
  rest.get(`${apiUrl}/instruments`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ instruments: [{ name: 'guitar', max_attendants: 8 }] })
    );
  }),
  // payments
  rest.put(`${apiUrl}/payments/update/:id`, (req, res, ctx) => {
    // console.log(req.body)
    return res(ctx.status(204), ctx.json(req.body));
  }),
  rest.post(`${apiUrl}/payments`, (req, res, ctx) => {
    // console.log(req.body)
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        type_of_payment: req.body.type_of_payment,
        amount_paid: req.body.amounts_paid,
        payment_date: req.body.payment_date,
      })
    );
  }),
];
