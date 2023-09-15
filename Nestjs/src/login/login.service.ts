import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { knex } from 'utils/knex';
import { hashPassword } from 'utils/hash';
import { string } from 'cast.ts';
@Injectable()
export class LoginService {
  constructor() {}

  async reregister(input: {
    username: string;
    password: string;
    email: string;
    e;
  }) {
    try {
      return await knex.transaction(async (knew) => {
        let [{ id: user_id }] = await knex('user')
          .insert({
            username: input.username,
            password_hash: await hashPassword(input.password),
            email: input.email,
          })
          .returning('id');
      });
    } catch (error) {
      if (String(error).includes('username_unique')) {
        throw new ConflictException('this username is already used');
      } else {
        throw error;
      }
    }
  }

  async getUserProfile(user_id: number) {
    let user = await knex('user')
      .select('username')
      .where('id', user_id)
      .first();
    if (!user) throw new NotFoundException('user not found');
    return user as { username: string };
  }

  async login(input: { username: string; password: string }) {
    try {
      return await knex.transaction(async (knex) => {
        let [{ id: user_id }] = await knex('user')
          .insert({
            username: input.username,
            password_hash: await hashPassword(input.password),
          })
          .returning('id');
        return { id: user_id };
      });
    } catch (error) {
      if (String(error).includes('username_unique')) {
        throw new ConflictException('this username is already used');
      } else {
        throw error;
      }
    }
  }
}
