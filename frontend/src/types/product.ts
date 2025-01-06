export type Category = 
  | 'ELECTRONICS'
  | 'FURNITURE'
  | 'HOME APPLIANCES'
  | 'SPORTING GOODS'
  | 'OUTDOOR'
  | 'TOYS'

export interface Product {
  id: string
  title: string
  categories: Category[]
  description: string
  price: number
  rentPrice: number
  rentType: 'per hour' | 'per day'
  datePosted: string
  views: number
}

export interface ProductFormData {
  title: string
  categories: Category[]
  description: string
  price: number
  rentPrice: number
  rentType: 'per hour' | 'per day'
  userId: number
}

