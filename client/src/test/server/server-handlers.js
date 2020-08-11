import { rest } from 'msw';

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
];
