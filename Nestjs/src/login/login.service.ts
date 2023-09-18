import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { comparePassword, hashPassword } from 'utils/hash';
import * as nodemailer from 'nodemailer';
import { InjectKnex } from 'nestjs-knex';

const nodemailer = require('nodemailer');
@Injectable()
export class LoginService {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'snowmarket011@gmail.com',
      pass: 'qqeigvyszkjdtzkz',
    },
  });
  constructor(@InjectKnex() private readonly knex: Knex) {}

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

    const mailOptions = {
      from: 'snowmarket011@gmail.com',
      to: body.email,
      subject: 'Snowmarket Register',
      text: 'Welcome to Snowmarket, enjoy your member benefits!',
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent:' + info.response);
      }
    });
    return { username: username, id: id, role: 'member' };
  }

  async login(input) {
    let foundUser = await this.knex('users')
      .select('role', 'id', 'password')
      .where('username', input.username)
      .first();
    if (!foundUser) {
      return { error: 'Wrong Username/Password' };
    } else {
      let match: boolean = await comparePassword({
        password: input.password,
        password_hash: foundUser.password,
      });
      if (!match) {
        return { error: 'Wrong Username/Password' };
      }
      let role = foundUser.role;
      let id = foundUser.id;

      return { role: role, error: null, id: id };
    }
  }
}

// const nodemailer = require('nodemailer');

// transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'snowmarket011@gmail.com',
//     pass: 'qqeigvyszkjdtzkz',
//   },
// });
// const mailOptions = {
//   from: 'snowmarket011@gmail.com',
//   to: body.email,
//   subject: 'Snowmarket Register',
//   text: 'Welcome to Snowmarket, enjoy your member benefits!',
// };

// this.transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent:' + info.response);
//   }
// });
