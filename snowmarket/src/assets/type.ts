import { number, object, string } from 'cast.ts'

export interface Users {
  id: string
  username: string
  email: string
  birthday: string
  points: number
}
export interface Products {
  id: number
  brand_id: number
  category_id: number
  price: number
  stock: number
  name: string
}

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

export interface ProductDiscount {
  id: string
  title: string
  product_id: string
  brand_id: string | null
  categories_id: string | null
  amount: string
  discount_amount: string
  start_date: string
  end_date: string
}

export interface Receipt {
  id: number
  products: Array<object>
  total_price: number
  date: string
}

export interface Item {
  text: string
  value: string
}
