import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import { sendRefreshToken } from './sendRefreshToken';
import { createAccessToken, createRefreshToken } from './auth';

(async () => {
  const app = express();
  app.use(cookieParser());
  app.get('/', (_req, res) => {
    res.send('Hello');
  });

  app.post('/refresh-token', async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.status(401).json({ ok: false, accessToken: '' });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.status(401).json({ ok: false, accessToken: '', err });
    }

    // token is valid and we can send back an access token

    const user = await User.findOne({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ ok: false, accessToken: '' });
    }
    // Remake refresh token
    sendRefreshToken(res, createRefreshToken(user));
    return res.json({ ok: true, accessTokem: createAccessToken(user) });
  });

  // Connect to DB
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app }); // This will enable graphql server at /graphql

  app.listen(4000, () => {
    console.log(`Express server started`);
  });
})();

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
