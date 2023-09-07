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
  brand_name: string;
}
export interface category {
  id: number;
  categories_name: string;
}
