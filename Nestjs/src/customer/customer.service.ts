import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class CustomerService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async postID(id) {
    try {
      let param = id.id;
      const currentDate = new Date();
      let item = await this.knex
        .select(
          'product.id',
          'product.name',
          'product.brand_id as product_brand_id',
          'product.categories_id as product_categories_id',
          'product.price as unit_price',
          'product.stock as product_stock',
          'product.is_delete',
          'quantity_discount.id as discount_id',
          'quantity_discount.title as discount_title',
          'quantity_discount.product_id as discount_product_id',
          'quantity_discount.brand_id as discount_brand_id',
          'quantity_discount.categories_id as discount_categories_id',
          'quantity_discount.quantity as discount_quantity',
          'quantity_discount.discount_amount',
          'quantity_discount.is_delete',
        )
        .from('product')
        .leftJoin('quantity_discount', function () {
          this.on('product.id', 'quantity_discount.product_id').orOn(
            function () {
              this.on('product.brand_id', 'quantity_discount.brand_id').andOn(
                'product.categories_id',
                'quantity_discount.categories_id',
              );
            },
          );
        })
        .where('product.id', param)
        .andWhere('product.stock', '>', 0)
        .andWhere('product.is_delete', '=', false)
        .andWhere(function () {
          this.whereNull('quantity_discount.start_date').orWhere(function () {
            this.where('quantity_discount.start_date', '<=', currentDate)
              .andWhere('quantity_discount.end_date', '>=', currentDate)
              .andWhere('quantity_discount.is_delete', '=', false);
          });
        })
        .first();
      console.log(item);
      let price_discount = await this.knex
        .select(
          'id as price_discount_id',
          'title as price_discount_title',
          'total_price as price_discount_total',
          'discount_rate as price_discount_rate',
        )
        .from('price_discount')
        .where('start_date', '<=', currentDate)
        .andWhere('end_date', '>=', currentDate)
        .andWhere('is_delete', '=', false);
      return { item, price_discount };
    } catch (err) {
      throw new Error(err);
    }
  }

  async postReceipt(receipt) {
    try {
      console.log(receipt);
    } catch (err) {
      throw new Error(err);
    }
  }
}
