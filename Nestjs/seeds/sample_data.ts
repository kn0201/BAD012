import { readFileSync } from 'fs'
import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
	let brands = JSON.parse(readFileSync('source/brand.json').toString())
	for (let brand of brands) {
		let row = await knex
			.select('id')
			.from('brand')
			.where('name', brand.name)
			.first()
		if (!row) {
			await knex.insert(brand).into('brand')
			continue
		}
		await knex.update(brand).from('brand').where('id', row.id)
	}

	let categories = JSON.parse(readFileSync('source/categories.json').toString())
	for (let category of categories) {
		let row = await knex
			.select('id')
			.from('categories')
			.where('name', category.name)
			.first()
		if (!row) {
			await knex.insert(category).into('categories')
			continue
		}
		await knex.update(category).from('categories').where('id', row.id)
	}

	let products = JSON.parse(readFileSync('source/product.json').toString())
	for (let product of products) {
		let row = await knex
			.select('id')
			.from('product')
			.where('name', product.name)
			.first()
		let { brand, category, ...productData } = product
		if (!row) {
			await knex
				.insert({
					brand_id: knex.select('id').from('brand').where('name', brand),
					categories_id: knex
						.select('id')
						.from('categories')
						.where('name', category),
					name: productData.name,
					price: productData.price,
					stock: productData.stock,
					is_delete: productData.is_delete,
				})
				.into('product')
			continue
		}
		await knex
			.update({
				brand_id: knex.select('id').from('brand').where('name', brand),
				categories_id: knex
					.select('id')
					.from('categories')
					.where('name', category),
				name: productData.name,
				price: productData.price,
				stock: productData.stock,
				is_delete: productData.is_delete,
			})
			.from('product')
			.where('id', row.id)
	}

	// let price_discounts = JSON.parse(
	// 	readFileSync('source/discount_price.json').toString(),
	// )
	// for (let price_discount of price_discounts) {
	// 	let row = await knex
	// 		.select('id')
	// 		.from('price_discount')
	// 		.where('title', price_discount.title)
	// 		.first()
	// 	if (!row) {
	// 		await knex.insert(price_discount).into('price_discount')
	// 		continue
	// 	}
	// 	await knex.update(price_discount).from('price_discount').where('id', row.id)
	// }

	let quantity_discounts = JSON.parse(
		readFileSync('source/discount_product.json').toString(),
	)
	for (let quantity_discount of quantity_discounts) {
		let row = await knex
			.select('id')
			.from('quantity_discount')
			.where('title', quantity_discount.title)
			.first()
		let { product, brand, categories, ...discountData } = quantity_discount

		let productID = product
			? await knex.select('id').from('product').where('name', product)
			: null
		console.log({ productID })
		let brandID = brand
			? await knex.select('id').from('brand').where('name', brand)
			: null
		console.log({ brandID })
		let categoriesID = categories
			? await knex.select('id').from('categories').where('name', categories)
			: null

		if (!row) {
			await knex
				.insert({
					title: discountData.title,
					product_id: productID,
					brand_id: brandID,
					categories_id: categoriesID,
					quantity: discountData.quantity,
					discount_amount: discountData.discount_amount,
					start_date: discountData.start_date,
					end_date: discountData.end_date,
					is_delete: discountData.is_delete,
				})
				.into('quantity_discount')
			continue
		}
		await knex
			.update({
				title: discountData.title,
				product_id: productID,
				brand_id: brandID,
				categories_id: categoriesID,
				quantity: discountData.quantity,
				discount_amount: discountData.discount_amount,
				start_date: discountData.start_date,
				end_date: discountData.end_date,
				is_delete: discountData.is_delete,
			})
			.from('quantity_discount')
			.where('id', row.id)
	}
}
