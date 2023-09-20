import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { env } from 'src/env';

@Injectable()
export class EmailService {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_ADDRESS,
      pass: env.EMAIL_PASSWORD,
    },
  });

  async sendMail(
    options: {
      to: string;
      subject: string;
    } & (
      | {
          html: string;
          text?: string;
        }
      | {
          html?: string;
          text: string;
        }
    ),
  ) {
    let info = await this.transporter.sendMail({
      from: env.EMAIL_ADDRESS,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log('send mail response:' + info.response);
  }
}
