import { Injectable, NotFoundException } from '@nestjs/common';
import { email } from 'cast.ts';
import { InjectKnex, Knex } from 'nestjs-knex';
import * as nodemailer from 'nodemailer';
import { receiptList } from 'source/receipt';

@Injectable()
export class CustomerService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'snowmarket011@gmail.com',
      pass: 'qqeigvyszkjdtzkz',
    },
  });
  async addProductToCart(product_id: number) {
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
        this.on('product.id', 'quantity_discount.product_id').orOn(function () {
          this.on('product.brand_id', 'quantity_discount.brand_id').andOn(
            'product.categories_id',
            'quantity_discount.categories_id',
          );
        });
      })
      .where('product.id', product_id)
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
    if (!item) throw new NotFoundException('Product not found or deleted');
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
    if (!price_discount) {
      return { item, price_discount: null };
    }
    return { item, price_discount };
  }

  async postReceipt(receipt) {
    let receipt_id: number;
    let currentPoint: number;
    let receipt_rows = await this.knex('receipt')
      .insert({
        user_id: receipt.user_id,
        pos_id: receipt.pos_id,
        total: receipt.balance,
        discount_total: receipt.discount,
      })
      .returning('id');
    receipt_id = receipt_rows[0].id;
    for (let item of receipt.items) {
      let currentStock: number;
      await this.knex('receipt_item').insert({
        receipt_id: receipt_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        product_id: item.product_id,
        brand_id: item.brand_id,
        category_id: item.category_id,
      });
      let currentStocks = await this.knex
        .select('stock')
        .from('product')
        .where('name', item.name);
      currentStock = currentStocks[0].stock;
      let remainingStock = currentStock - item.quantity;
      await this.knex('product')
        .where('name', item.name)
        .update('stock', remainingStock);
    }
    if (receipt.user_id) {
      let currentPoints = await this.knex
        .select('point')
        .from('users')
        .where('id', receipt.user_id);
      currentPoint = currentPoints[0].point;
      let updatedPoint = currentPoint + Math.floor(receipt.balance / 10);
      await this.knex('users')
        .where('id', receipt.user_id)
        .update('point', updatedPoint);
    }
    let userEmail = await this.knex
      .select('email')
      .from('users')
      .where('id', receipt.user_id)
      .first();
    const mailOptions = {
      from: 'snowmarket011@gmail.com',
      to: userEmail.email,
      subject: 'Snowmarket Receipt',
      html: `
    <Storage>Thank you for your patronage, this is your receipt,please check!</Storage>
    <p>${receiptList}</p>
    `,
    };

    if (!userEmail) throw new NotFoundException('User not found');
    else
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent:' + info.response);
        }
      });
    return {};
  }
}
