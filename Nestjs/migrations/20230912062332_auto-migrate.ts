import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', table => {
      table.increments('id')
      table.string('username', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 255).notNullable()
      table.integer('point').notNullable()
      table.date('birthday').nullable()
      table.string('role', 255).notNullable()
      table.boolean('is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('pos'))) {
    await knex.schema.createTable('pos', table => {
      table.increments('id')
      table.string('code', 255).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('receipt'))) {
    await knex.schema.createTable('receipt', table => {
      table.increments('id')
      table.integer('user_id').unsigned().nullable().references('users.id')
      table.integer('pos_id').unsigned().nullable().references('pos.id')
      table.date('date').notNullable()
      table.decimal('total').notNullable()
      table.decimal('discount_total').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('brand'))) {
    await knex.schema.createTable('brand', table => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('categories'))) {
    await knex.schema.createTable('categories', table => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('price_discount'))) {
    await knex.schema.createTable('price_discount', table => {
      table.increments('id')
      table.string('title', 255).notNullable()
      table.decimal('total_price').notNullable()
      table.decimal('discount_rate').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.boolean('is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('product'))) {
    await knex.schema.createTable('product', table => {
      table.increments('id')
      table.integer('brand_id').unsigned().notNullable().references('brand.id')
      table.integer('categories_id').unsigned().notNullable().references('categories.id')
      table.string('name', 255).notNullable()
      table.decimal('price').notNullable()
      table.boolean('is_delete').notNullable()
      table.integer('stock').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('quantity_discount'))) {
    await knex.schema.createTable('quantity_discount', table => {
      table.increments('id')
      table.string('title', 255).notNullable()
      table.integer('product_id').unsigned().nullable().references('product.id')
      table.integer('brand_id').unsigned().nullable().references('brand.id')
      table.integer('categories_id').unsigned().nullable().references('categories.id')
      table.integer('quantity').notNullable()
      table.decimal('discount_amount').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.boolean('is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('receipt_item'))) {
    await knex.schema.createTable('receipt_item', table => {
      table.increments('id')
      table.integer('receipt_id').unsigned().notNullable().references('receipt.id')
      table.string('name', 255).notNullable()
      table.decimal('price').notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('receipt_item')
  await knex.schema.dropTableIfExists('quantity_discount')
  await knex.schema.dropTableIfExists('product')
  await knex.schema.dropTableIfExists('price_discount')
  await knex.schema.dropTableIfExists('categories')
  await knex.schema.dropTableIfExists('brand')
  await knex.schema.dropTableIfExists('receipt')
  await knex.schema.dropTableIfExists('pos')
  await knex.schema.dropTableIfExists('users')
}
