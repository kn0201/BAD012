import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class PosService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async posCheck(body) {
    let result = await this.knex('pos').select('*').where('code', body.pos);

    console.log(result);
    let id = result[0].id;
    let code = result[0].code;
    return { id: id, code: code };
  }
}
