import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class PosService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async posCheck(body) {
    let result = await this.knex('pos')
      .select('*')
      .where('code', body.pos)
      .first();

    if (!result) {
      return { error: 'Wrong POS' };
    }

    let id = result.id;
    let code = result.code;

    return { id: id, code: code, error: null };
  }
}
