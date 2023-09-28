import Knex from 'knex';
import { env } from '../src/env';

let config = require('./knexfile');
let profile = config[env.NODE_ENV];
if (!profile) {
  throw new Error('No knex profile : ' + env.NODE_ENV);
}

export let knex = Knex(profile);
