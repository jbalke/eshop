import { rest } from 'msw';
import { db } from './db';

export const requireAuth = (req, res, ctx, cb) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res(ctx.status(401), ctx.json({ message: 'missing auth' }));
  }

  if (!authHeader.startsWith('Bearer')) {
    return res(ctx.status(401), ctx.json({ message: 'missing token' }));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res(
      ctx.status(401),
      ctx.json({ message: 'missing or expired token' })
    );
  }

  const user = db.user.findFirst({ where: { id: { equals: token } } });

  if (!user) {
    return res(
      ctx.status(400),
      ctx.json({ message: 'invalid email and/or password' })
    );
  }

  cb(user);
};

export const handlers = [
  rest.post('/api/users/login', (req, res, ctx) => {
    const { email, password } = req.body;

    const user = db.user.findFirst({
      where: { email: { equals: email }, password: { equals: password } },
    });

    if (!user) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'incorrect email and/or password' })
      );
    }

    return res(ctx.status(200), ctx.json({ user, token: user.id }));
  }),
  rest.get('/api/users/profile', (req, res, ctx) => {
    requireAuth(req, res, ctx, (user) => {
      res(ctx.status(200), ctx.json({ user: user }));
    });
  }),
  rest.get('/api/products', (req, res, ctx) => {
    res(ctx.status(200), ctx.json(db.product.getAll()));
  }),
  rest.get('/api/products/top', (req, res, ctx) => {
    res(ctx.status(200), ctx.json(db.product.getAll()));
  }),
  rest.get('*', (req, res, ctx) => {
    console.error(`Please add a request handler for ${req.url.toString()}`);
    return res(ctx.status(500), ctx.json({ message: 'Unhandled request' }));
  }),
];
