import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from './MyContext';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  try {
    const authorization = context.req.headers['authorization'];
    if (!authorization) {
      throw new Error('Not authorized');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new Error('No token, Not authorized');
    }
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
    return next();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
