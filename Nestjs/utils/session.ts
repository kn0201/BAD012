import session from 'express-session';
import { env } from './env';

export let sessionMiddleware = session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

declare module 'express-session' {
  interface SessionData {
    counter: number;
    user_id: number;
    role: string;
    pos: number;
    username: string;
  }
}

export type RequestSession = session.Session & Partial<session.SessionData>;
