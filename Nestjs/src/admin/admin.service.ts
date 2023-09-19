import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
@Injectable()
export class AdminService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async deleteProduct(body) {
    await this.knex('product')
      .where({ id: body.deleteId })
      .update({ is_delete: 'true' });
    return {};
  }

  async deleteDiscount(body) {
    await this.knex(body.value)
      .where({ id: body.deleteId })
      .update({ is_delete: 'true' });
  }

  async reDeleteProduct(body) {
    await this.knex('product')
      .where({ id: body.deleteId })
      .update({ is_delete: 'false' });
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
      .where('role', 'member')
      .orderBy('id');

    return { memberList };
  }

  async getReceiptList() {
    const currentDate = new Date().toISOString().split('T')[0];

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
      .leftJoin('pos', 'pos_id', 'pos.id')
      .orderBy('id');

    let receiptItemList = await this.knex.select('*').from('receipt_item');

    let previousTotal = await this.knex('receipt')
      .sum('total')
      .whereRaw('DATE(created_at) < ?', currentDate);

    let currentDateTotal = await this.knex('receipt')
      .sum('total')
      .whereRaw('DATE(created_at) = ?', currentDate);
    console.log(currentDateTotal);

    let receiptItemBrandList = await this.knex
      .select('brand.name' as 'brand_name')
      .from('receipt_item')
      .leftJoin('brand', 'brand_id', 'brand.id')
      .orderBy('brand.name');
    console.log(receiptItemBrandList);

    return {
      receiptList,
      receiptItemList,
      previousTotal,
      currentDateTotal,
      receiptItemBrandList,
    };
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
      .where('is_delete', 'false')
      .orderBy('id');

    let productDiscountList = await this.knex
      .select(
        'quantity_discount.id',
        'quantity_discount.title',
        'quantity_discount.product_id',
        'quantity_discount.brand_id',
        'quantity_discount.categories_id',
        'quantity_discount.quantity',
        'quantity_discount.discount_amount',
        'quantity_discount.start_date',
        'quantity_discount.end_date',
        'product.name as product_name',
        'brand.name as brand_name',
        'categories.name as category_name',
      )
      .from('quantity_discount')
      .leftJoin('brand', 'brand_id', 'brand.id')
      .leftJoin('categories', 'categories_id', 'categories.id')
      .leftJoin('product', 'product_id', 'product.id')
      .where('quantity_discount.is_delete', 'false')
      .orderBy('id');

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
      .leftJoin('categories', 'categories_id', 'categories.id')
      .where('is_delete', false)
      .orderBy('product.id');

    return {
      productDiscountList,
      priceDiscountList,
      productList,
      brandList,
      categoriesList,
    };
  }

  async addProductDiscount(body) {
    console.log(body);

    await this.knex('quantity_discount').insert({
      title: body.title,
      product_id: body.product_id,
      brand_id: body.brand_id,
      categories_id: body.categories_id,
      quantity: body.quantity,
      discount_amount: body.discount_amount,
      start_date: body.start_date,
      end_date: body.end_date,
      is_delete: false,
    });
    let result = 'Added';
    return { result };
  }

  async addPriceDiscount(body) {
    await this.knex('price_discount').insert({
      title: body.title,
      total_price: body.total_price,
      discount_rate: body.discount_rate,
      start_date: body.start_date,
      end_date: body.end_date,
      is_delete: false,
    });
    let result = 'Added';
    return { result };
  }

  async getTrashList() {
    let deletedProductList = await this.knex
      .select('id', 'name')
      .from('product')
      .where('is_delete', 'true')
      .orderBy('id');

    let deletedProductDiscountList = await this.knex
      .select('id', 'title')
      .from('quantity_discount')
      .where('is_delete', 'true')
      .orderBy('id');

    let deletedPriceDiscountList = await this.knex
      .select('id', 'title')
      .from('price_discount')
      .where('is_delete', 'true')
      .orderBy('id');

    return {
      deletedProductList,
      deletedProductDiscountList,
      deletedPriceDiscountList,
    };
  }
}
