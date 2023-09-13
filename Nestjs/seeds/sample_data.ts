import { readFileSync } from 'fs'
import { Knex } from 'knex'
import { hashPassword } from '../utils/hash'

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

	let price_discounts = JSON.parse(
		readFileSync('source/discount_price.json').toString(),
	)
	for (let price_discount of price_discounts) {
		let row = await knex
			.select('id')
			.from('price_discount')
			.where('title', price_discount.title)
			.first()
		if (!row) {
			await knex.insert(price_discount).into('price_discount')
			continue
		}
		await knex.update(price_discount).from('price_discount').where('id', row.id)
	}

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
			? knex.select('id').from('product').where('name', product)
			: null

		let brandID = brand
			? knex.select('id').from('brand').where('name', brand)
			: null

		let categoriesID = categories
			? knex.select('id').from('categories').where('name', categories)
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

	let pos_list = JSON.parse(readFileSync('source/pos.json').toString())
	for (let pos of pos_list) {
		let row = await knex
			.select('id')
			.from('pos')
			.where('code', pos.code)
			.first()
		if (!row) {
			await knex.insert(pos).into('pos')
			continue
		}
		await knex.update(pos).from('pos').where('id', row.id)
	}

	let users = JSON.parse(readFileSync('source/member.json').toString())
	for (let user of users) {
		let row = await knex
			.select('id')
			.from('users')
			.where('username', user.username)
			.first()
		let hashedPW = await hashPassword(user.password)
		let dob = user.birthday ? user.birthday : null
		if (!row) {
			await knex
				.insert({
					username: user.username,
					email: user.email,
					password: hashedPW,
					birthday: dob,
					point: user.points,
					role: user.role,
					is_delete: user.is_delete,
				})
				.into('users')
			continue
		}
		await knex
			.update({
				username: user.username,
				email: user.email,
				password: hashedPW,
				birthday: dob,
				point: user.points,
				role: user.role,
				is_delete: user.is_delete,
			})
			.from('users')
			.where('id', row.id)
	}

	let receipts = JSON.parse(readFileSync('source/receipt.json').toString())
	for (let receipt of receipts) {
		let row = await knex
			.select('id')
			.from('receipt')
			.where('total', receipt.total)
			.andWhere('discount_total', receipt.discount_total)
			.first()
		let { user, pos, item, ...receiptData } = receipt
		let userID = user
			? knex.select('id').from('users').where('username', user)
			: null
		let receipt_id: number
		if (!row) {
			let rows = await knex
				.insert({
					user_id: userID,
					pos_id: knex.select('id').from('pos').where('code', pos),
					total: receiptData.total,
					discount_total: receiptData.discount_total,
				})
				.into('receipt')
				.returning('id')
			receipt_id = rows[0].id
		} else {
			await knex
				.update({
					user_id: userID,
					pos_id: knex.select('id').from('pos').where('code', pos),
					total: receiptData.total,
					discount_total: receiptData.discount_total,
				})
				.from('receipt')
				.where('id', row.id)
		}
		for (let item_content of receipt.item) {
			await knex('receipt_item').insert({
				receipt_id,
				name: item_content.name,
				price: item_content.price,
			})
		}
	}
}
