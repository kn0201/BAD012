import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class ProductService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getProductIdByLabel(label: string) {
    if (label.includes('COCO FLV')) {
      label = 'COCO FLV';
    }
    let product = await this.knex
      .select('id')
      .from('product')
      .whereILike('name', '%' + label + '%')
      .andWhere('is_delete', false)
      .first();
    if (!product) throw new NotFoundException('Product not found or deleted');
    return product.id as number;
  }
}
