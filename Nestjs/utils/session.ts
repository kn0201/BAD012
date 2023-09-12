import { randomBytes } from "crypto";
import expressSession from "express-session";

declare module "express-session" {
  interface SessionData {
    counter: number;
    user_id: number;
    username: string;
    chatrecord: string;
    msgId: number;
  }
}

export let sessionMiddleware = expressSession({
  resave: false,
  secret: randomBytes(32).toString("hex"),
  saveUninitialized: false,
});
