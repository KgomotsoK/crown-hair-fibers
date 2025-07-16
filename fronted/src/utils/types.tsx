// frontend/src/utils/types.tsx
export interface WooCommerceImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  type: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  parent_id: number;
  status: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  categories: WooCommerceCategory[];
  images: WooCommerceImage[];
  attributes?: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  variations?: number[];
  price_html: string;
  related_ids: number[];
  sku: string;
}

interface Address {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  email?: string; 
  phone: string;
}
export interface WooCommerceCustomer {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: Address;
  shipping: Address;
  is_paying_customer: boolean;
  avatar_url: string;
  token?: string;
}

export interface WooCommerceReview {
  id: number;
  date_created: string;
  date_created_gmt: string;
  product_id: number;
  status: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
  reviewer_avatar_urls: {
    [size: string]: string;
  };
}  

export interface WooCommerceOrder {
  id: number;
  status: string;
  date_created: string;
  date_modified: string;
  total: string;
  customer_id: number;
  billing: Address;
  shipping: Address;
  payment_method: string;
  transaction_id: string;
  customer_note: string;
  date_paid: string;
  number: string;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: Array<{
      id: number;
      total: string;
      subtotal: string;
    }>;
    meta_data: Array<{
      key: string;
      value: string;
    }>;
    sku: string;
    price: number;
    image: {
      id: string;
      src: string;
    };
  }>;
  currency_symbol: string;
}

export interface WooCommerceOrderPayload{
billing: Address;
shipping: Address;
payment_method: string;
payment_method_title: string;
items: Array<{
  product_id: number;
  quantity: number;
}>;
}
