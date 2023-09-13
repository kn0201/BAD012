import session from 'express-session';
import { env } from './env';

export let sessionMiddleware = session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

declare module 'express-session' {
  interface SessionData {
    user_id: number;
  }
}

export type RequestSession = session.Session & Partial<session.SessionData>;
