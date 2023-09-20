import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Knex } from 'knex';
import { comparePassword, hashPassword } from 'utils/hash';
import { InjectKnex } from 'nestjs-knex';
import { EmailService } from 'src/email/email.service';
import { env } from 'src/env';

@Injectable()
export class LoginService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private emailService: EmailService,
  ) {}

  async register(body: { username: any; email: any; password: any }) {
    let username = body.username;
    let hashedPW = await hashPassword(body.password);
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

    await this.emailService.sendMail({
      to: body.email,
      subject: env.APP_NAME + ' Register',
      text: `Welcome to ${env.APP_NAME}, enjoy your member benefits!`,
    });

    return { username: username, id: id, role: 'member' };
  }

  async login(input, req) {
    let foundUser = await this.knex('users')
      .select('role', 'id', 'password')
      .where('username', input.username)
      .first();
    if (!foundUser) throw new UnauthorizedException('Wrong Username/Password');

    let match: boolean = await comparePassword({
      password: input.password,
      password_hash: foundUser.password,
    });
    if (!match) throw new UnauthorizedException('Wrong Username/Password');

    let role = foundUser.role;
    let id = foundUser.id;
    req.session.role = role;
    req.session.save();
    console.log(req.session);

    return { role: role, error: null, id: id };
  }
}
