import { config } from 'dotenv';
import populateEnv from 'populate-env';

config();

export let env = {
  NODE_ENV: 'development',
  SESSION_SECRET: 'my-secret',
  DB_NAME: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  DB_HOST: '',
  DB_PORT: 5432,
  WEBP_PORT: 8300,
  EMAIL_ADDRESS: '',
  EMAIL_PASSWORD: '',
  APP_NAME: 'Pufferct Market',
};

populateEnv(env, { mode: 'halt' });
