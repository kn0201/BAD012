export interface users {
  id: string;
  username: string;
  email: string;
  birthday: string;
  points: number;
}
export interface products {
  id: number;
  brand_id: number;
  category_id: number;
  price: number;
  stock: number;
  name: string;
}

export interface brand {
  id: number;
  name: string;
}
export interface category {
  id: number;
  name: string;
}

export interface priceDiscount {
  id: string;
  title: string;
  total_price: string;
  discount_rate: string;
  start_date: string;
  end_date: string;
}

export interface productDiscount {
  id: string;
  title: string;
  product_id: string;
  brand_id: string | null;
  categories_id: string | null;
  amount: string;
  discount_amount: string;
  start_date: string;
  end_date: string;
}

export interface receipt {
  id: number;
  products: Array<object>;
  total_price: number;
  date: string;
}

export interface Item {
  text: string;
  value: string;
}
