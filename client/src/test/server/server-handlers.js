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
];
