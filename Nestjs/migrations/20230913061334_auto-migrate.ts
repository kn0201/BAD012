import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.unique(['username'])
  })
  await knex.schema.alterTable('pos', table => {
    table.unique(['code'])
  })
  await knex.schema.alterTable('receipt', table => {
    table.dropColumn('date')
    table.decimal('total').notNullable().alter()
    table.decimal('discount_total').notNullable().alter()
  })
  await knex.schema.alterTable('brand', table => {
    table.unique(['name'])
  })
  await knex.schema.alterTable('categories', table => {
    table.unique(['name'])
  })
  await knex.schema.alterTable('price_discount', table => {
    table.decimal('total_price').notNullable().alter()
    table.string('discount_rate', 255).notNullable().alter()
  })
  await knex.schema.alterTable('product', table => {
    table.unique(['name'])
    table.decimal('price').notNullable().alter()
  })
  await knex.schema.alterTable('quantity_discount', table => {
    table.decimal('discount_amount').notNullable().alter()
  })
  await knex.schema.alterTable('receipt_item', table => {
    table.decimal('price').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('receipt_item', table => {
    table.decimal('price').notNullable().alter()
  })
  await knex.schema.alterTable('quantity_discount', table => {
    table.decimal('discount_amount').notNullable().alter()
  })
  await knex.schema.alterTable('product', table => {
    table.decimal('price').notNullable().alter()
    table.dropUnique(['name'])
  })
  await knex.schema.alterTable('price_discount', table => {
    table.decimal('discount_rate').notNullable().alter()
    table.decimal('total_price').notNullable().alter()
  })
  await knex.schema.alterTable('categories', table => {
    table.dropUnique(['name'])
  })
  await knex.schema.alterTable('brand', table => {
    table.dropUnique(['name'])
  })
  await knex.schema.alterTable('receipt', table => {
    table.decimal('discount_total').notNullable().alter()
    table.decimal('total').notNullable().alter()
    table.date('date').notNullable()
  })
  await knex.schema.alterTable('pos', table => {
    table.dropUnique(['code'])
  })
  await knex.schema.alterTable('users', table => {
    table.dropUnique(['username'])
  })
}
