import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { knex } from 'utils/knex';
import { hashPassword } from 'utils/hash';
import { string } from 'cast.ts';
import { InjectKnex } from 'nestjs-knex';
@Injectable()
export class LoginService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async addUser(body) {
    let username = body.username;
    password_hash: await hashPassword(body.password),
      await this.knex('users').insert({
        username: body.username,
        email: body.email,
        password: body.password,
        role: 'member',
        point: 0,
        is_delete: false,
      });
    return { username };
  }

  async login(input) {
    let foundUser = await this.knex('users')
      .select('role')
      .where('username', input.username)
      .where('password', input.password)
      .first();

    if (!foundUser) {
      return { error: 'Wrong Username/Password' };
    }
    let role = foundUser.role;
    console.log(role);

    return { role: role, error: null };
  }
}
