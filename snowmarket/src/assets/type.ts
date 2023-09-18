import { array, nullable, number, object, string } from 'cast.ts'

export interface Users {
  id: string
  username: string
  email: string
  birthday: string | null
  point: number
}
export let user = object({
  id: string(),
  username: string(),
  email: string(),
  birthday: nullable(string()),
  point: number(),
})

export interface Products {
  id: number
  brand_id: number | null
  categories_id: number | null
  price: number
  stock: number
  name: string
  brand_name: string | null
  category_name: string | null
}

export let product = object({
  id: number(),
  brand_id: nullable(number()),
  categories_id: nullable(number()),
  price: number(),
  stock: number(),
  name: string(),
  brand_name: nullable(string()),
  category_name: nullable(string()),
})
export interface Brand {
  id: number
  name: string
}
export interface Category {
  id: number
  name: string
}

export let brand = object({
  id: number(),
  name: string(),
})

export let category = object({
  id: number(),
  name: string(),
})

export interface PriceDiscount {
  id: string
  title: string
  total_price: string
  discount_rate: string
  start_date: string
  end_date: string
}

export let priceDiscount = object({
  id: string(),
  title: string(),
  total_price: string(),
  discount_rate: string(),
  start_date: string(),
  end_date: string(),
})

export interface ProductDiscount {
  id: string
  title: string
  product_id: string | null
  brand_id: string | null
  categories_id: string | null
  quantity: string
  discount_amount: string
  start_date: string
  end_date: string
}

export let productDiscount = object({
  id: string(),
  title: string(),
  product_id: nullable(string()),
  brand_id: nullable(string()),
  categories_id: nullable(string()),
  quantity: string(),
  discount_amount: string(),
  start_date: string(),
  end_date: string(),
  product_name: nullable(string()),
  brand_name: nullable(string()),
  category_name: nullable(string()),
})
export interface Receipt {
  id: number
  username: string | null
  pos_name: string
  total: number
  discount_total: number
  date: string
}

export let receipt = object({
  id: number(),
  username: nullable(string()),
  pos_name: string(),
  total: number(),
  discount_total: number(),
  date: string(),
})

export interface Item {
  receipt_id: number
  name: string
  price: number
  quantity: number
  product_id: number | null
  brand_id: number | null
  category_id: number | null
}

export let item = object({
  receipt_id: number(),
  name: string(),
  price: number(),
  quantity: number(),
  product_id: nullable(number()),
  brand_id: nullable(number()),
  category_id: nullable(number()),
})

export let test = object({
  result: string(),
})

export interface DeletedProduct {
  id: number
  name: string
}

export let deletedProduct = object({
  id: number(),
  name: string(),
})

export interface DeletedProductDiscount {
  id: number
  title: string
}

export let deletedProductDiscount = object({
  id: number(),
  title: string(),
})

export interface DeletedPriceDiscount {
  id: number
  title: string
}

export let deletedPriceDiscount = object({
  id: number(),
  title: string(),
})

export interface CheckData {
  data: number[]
}
