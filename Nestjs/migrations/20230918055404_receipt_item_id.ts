import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('receipt_item', (table) => {
    table.integer('product_id');
    table.integer('brand_id');
    table.integer('category_id');
  });
}

export async function down(knex: Knex): Promise<void> {}
