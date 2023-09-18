import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('receipt_item', (table) => {
    table.integer('quantity');
  });
}

export async function down(knex: Knex): Promise<void> {}
