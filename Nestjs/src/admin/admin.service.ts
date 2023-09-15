import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
@Injectable()
export class AdminService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async deleteProduct(body) {
    // console.log(body.deleteId);
    await this.knex('product')
      .where({ id: body.deleteId })
      .update({ is_delete: 'true' });
    return {};
  }

  async addBrandCategory(body) {
    let param = body.selectValue;
    let name = body.name;
    let result = await this.knex(param).insert({ name: name });
    console.log(result);

    return { param, name };
  }

  async addProduct(body) {
    let name = body.name;
    await this.knex('product').insert({
      brand_id: body.brandID,
      categories_id: body.categoryID,
      name: name,
      price: body.price,
      stock: 100,
      is_delete: false,
    });
    return { name };
  }

  async getBCList() {
    let brandList = await this.knex.select('*').from('brand').orderBy('id');

    let categoriesList = await this.knex
      .select('*')
      .from('categories')
      .orderBy('id');

    return { brandList, categoriesList };
  }

  async getMemberList() {
    let memberList = await this.knex
      .select('id', 'username', 'email', 'birthday', 'point')
      .from('users')
      .where('is_delete', 'false')
      .where('role', 'member');

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
      .leftJoin('categories', 'categories_id', 'categories.id')
      .where('is_delete', 'false')
      .orderBy('product.id');

    let brandList = await this.knex.select('*').from('brand').orderBy('id');

    let categoriesList = await this.knex
      .select('*')
      .from('categories')
      .orderBy('id');

    return { productList, brandList, categoriesList };
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

    let brandList = await this.knex.select('*').from('brand').orderBy('id');

    let categoriesList = await this.knex
      .select('*')
      .from('categories')
      .orderBy('id');

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

  async getTrashList() {
    let deletedProductList = await this.knex
      .select('id', 'name')
      .from('product')
      .where('is_delete', 'true')
      .orderBy('id');

    return { deletedProductList };
  }
}
