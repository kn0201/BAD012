import { Injectable } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class CustomerService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
}
