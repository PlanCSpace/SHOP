export type Language = 'en' | 'tr' | 'ar';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  is_new?: boolean;
  discount_percentage?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: ShippingAddress;
  items: {
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
}

export interface AdminSettings {
  id: number;
  free_shipping_threshold: number;
  shipping_cost: number;
}

export interface HeroBannerContent {
  id: number;
  title_en: string;
  title_tr: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_tr: string;
  subtitle_ar: string;
  description_en: string;
  description_tr: string;
  description_ar: string;
  image_url: string;
  button_text_en: string;
  button_text_tr: string;
  button_text_ar: string;
  slide_order: number;
}

export type AppView = 'home' | 'cart' | 'checkout' | 'admin' | 'product' | 'profile' | 'privacyPolicy' | 'termsOfService' | 'cookies';
