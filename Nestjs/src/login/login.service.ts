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
  //   } catch (error) {
  //     if (String(error).includes('username_unique')) {
  //       throw new ConflictException('this username is already used');
  //     } else {
  //       throw error;
  //     }
  //   }
  // }
  constructor(@InjectKnex() private readonly knex: Knex) {}

  // async reregister(input: {
  //   username: string;
  //   password: string;
  //   email: string;
  // }) {
  //   try {
  //     return await knex.transaction(async (knew) => {
  //       let [{ id: user_id }] = await knex('user')
  //         .insert({
  //           username: input.username,
  //           password_hash: await hashPassword(input.password),
  //           email: input.email,
  //         })
  //         .returning('id');
  //     });
  //   } catch (error) {
  //     if (String(error).includes('username_unique')) {
  //       throw new ConflictException('this username is already used');
  //     } else {
  //       throw error;
  //     }
  //   }
  // }

  // async getUserProfile(user_id: number) {
  //   let user = await knex('user')
  //     .select('username')
  //     .where('id', user_id)
  //     .first();
  //   if (!user) throw new NotFoundException('user not found');
  //   return user as { username: string };
  // }

  // async login(input: { username: string; password: string }) {
  //   try {
  //     return await knex.transaction(async (knex) => {
  //       let [{ id: user_id }] = await knex('user')
  //         .insert({
  //           username: input.username,
  //           password_hash: await hashPassword(input.password),
  //         })
  //         .returning('id');
  //       return { id: user_id };
  //     });
  //   } catch (error) {
  //     if (String(error).includes('username_unique')) {
  //       throw new ConflictException('this username is already used');
  //     } else {
  //       throw error;
  //     }
  //   }
  // }

  async addUser(body) {
    let name = body.name;
    await this.knex('users').insert({
      username: body.username,
      email: body.email,
      password: body.password,
      role: 'member',
      point: 0,
      is_delete: false,
    });
    return { name };
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
