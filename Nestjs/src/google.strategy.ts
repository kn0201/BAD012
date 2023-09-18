import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '475193973398-nh5o3qb8s8pua0pp8l2hk57s4hvdp2is.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8100/auth/google/callback',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
    };
    done(null, user);
  }
}
