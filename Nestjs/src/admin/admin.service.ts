import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { productList } from 'source/product';

@Injectable()
export class AdminService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  addBrandCategory(req) {
    let param = req.selectValue;
    if (param === 'brand') {
      console.log(param + ':' + req.msgName);
      let result = 'brand';
      return { result };
    } else if (param === 'category') {
      console.log(param + ':' + req.msgName);
      let result = 'Category';
      return { result };
    } else {
      return;
    }
  }

  async getBCList() {
    let brandList = await this.knex.select('*').from('brand');

    let categoriesList = await this.knex.select('*').from('categories');

    return { brandList, categoriesList };
  }

  async getMemberList() {
    let memberList = await this.knex
      .select('id', 'username', 'email', 'birthday', 'point')
      .from('users')
      .where('is_delete', 'false');

    return { memberList };
  }

  async getReceiptList() {
    let receiptList = await this.knex
      .select(
        'receipt.id',
        'users.username as username',
        'pos.code as pos_name',
        'receipt.total',
        'receipt.discount_total',
        'receipt.created_at as date',
      )
      .from('receipt')
      .leftJoin('users', 'user_id', 'users.id')
      .leftJoin('pos', 'pos_id', 'pos.id');
    receiptList = receiptList.map((receipt) => {
      return {
        ...receipt,
        date: receipt.date.toISOString().split('T')[0],
      };
    });

    let receiptItemList = await this.knex.select('*').from('receipt_item');
    console.log(receiptItemList);

    return { receiptList, receiptItemList };
  }

  async getProductList() {
    let productList = await this.knex
      .select(
        'product.id',
        'product.brand_id',
        'product.categories_id',
        'product.name',
        'product.price',
        'product.stock',
        'brand.name as brand_name',
        'categories.name as category_name',
      )
      .from('product')
      .leftJoin('brand', 'brand_id', 'brand.id')
      .leftJoin('categories', 'categories_id', 'categories.id');

    console.log(productList);

    return { productList };
  }

  async getDiscountList() {
    let priceDiscountList = await this.knex
      .select('*')
      .from('price_discount')
      .where('is_delete', 'false');

    let productDiscountList = await this.knex
      .select('*')
      .from('quantity_discount')
      .where('is_delete', 'false');

    let brandList = await this.knex.select('*').from('brand');

    let categoriesList = await this.knex.select('*').from('categories');

    let productList = await this.knex
      .select(
        'product.id',
        'product.brand_id',
        'product.categories_id',
        'product.name',
        'product.price',
        'product.stock',
        'brand.name as brand_name',
        'categories.name as category_name',
      )
      .from('product')
      .leftJoin('brand', 'brand_id', 'brand.id')
      .leftJoin('categories', 'categories_id', 'categories.id');

    console.log(productDiscountList);

    return {
      productDiscountList,
      priceDiscountList,
      productList,
      brandList,
      categoriesList,
    };
  }

  getHello() {
    let result = 'Hello World';
    return { result };
  }
}
