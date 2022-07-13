import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import redis from '../../redis';

const RedisStore = connectRedis(session);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  store: new RedisStore({
    client: redis,
  }),
});

export default sessionMiddleware;
