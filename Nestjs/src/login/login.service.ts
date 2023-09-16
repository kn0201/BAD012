import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { knex } from 'utils/knex';
import { comparePassword, hashPassword } from 'utils/hash';
import { string } from 'cast.ts';
import { InjectKnex } from 'nestjs-knex';
@Injectable()
export class LoginService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async addUser(body) {
    let username = body.username;
    let hashedPW = hashPassword(body.password);
    let result = await this.knex('users')
      .insert({
        username: body.username,
        email: body.email,
        password: hashedPW,
        role: 'member',
        point: 0,
        is_delete: false,
      })
      .returning('id');
    let id = result[0].id;
    return { username: username, id: id };
  }

  async login(input) {
    let foundUser = await this.knex('users')
      .select('role', 'id', 'password')
      .where('username', input.username)
      .first();
    let match: boolean = await comparePassword({
      password: input.password,
      password_hash: foundUser.password,
    });
    if (!foundUser || !match) {
      return { error: 'Wrong Username/Password' };
    }
    let role = foundUser.role;
    let id = foundUser.id;
    console.log(role);

    return { role: role, error: null, id: id };
  }
}
