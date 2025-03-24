import axios from 'axios';
import { WooCommerceCustomer, WooCommerceOrder, WooCommerceProduct, WooCommerceReview } from '../utils/types';

const API_BASE = '/api';


type LoginResponse = WooCommerceCustomer | { success: false; message: string };

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data;
};

export const register = async (username: string, first_name: string, last_name: string, email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE}/auth/register`, { username, first_name, last_name, email, password });
    return response.data;
};

export const updateUserDetails = async (details: WooCommerceCustomer): Promise<WooCommerceCustomer> => {
    const response = await axios.put(`${API_BASE}/auth/edit-customer/${details.id}`, details);
    return response.data;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await axios.post(`${API_BASE}/auth/forgot-password`, { email });
};

export const resetPassword = async ({ token, newPassword, email }: { token: string; newPassword: string; email: string}) => {
  await axios.post(`${API_BASE}/auth/reset`, { token, newPassword, email });
};

export const createOrder =  async (order: object): Promise<{paymentUrl: string, message: string}> => {
  try {
    const response = await axios.post(`${API_BASE}/orders`, order);
    return response.data;
  } catch (error) {
    console.log('Failed to create order:', error);
    // @ts-ignore
    return { paymentUrl: '', message: error.message };
  }
}
export const getUserOrders = async (customer_id: string): Promise<WooCommerceOrder[]> => {
    const response = await axios.get(`${API_BASE}/orders/getUserOrders/${customer_id}`);
    return response.data;
};

export const getProductReviews = async (productId: number): Promise<WooCommerceReview[]> => {
  try {
    const response = await axios.get(`${API_BASE}/products/product-reviews/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product reviews:', error);
    return []; // Return empty array instead of throwing
  }
};

export const hasUserPurchasedProduct = async (userId: number, productId: number): Promise<boolean> => {
    const orders = await getUserOrders(userId.toString());
    return orders.some((order) =>
      order.line_items.some((item) => item.product_id === productId)
    );
  };

export const getUserReviews = async (): Promise<WooCommerceReview[]> => {
    const response = await axios.get(`${API_BASE}/products/customer-reviews`);
    return response.data;
};

export const createReview = async (review: object): Promise<object> => {
    const response = await axios.post(`${API_BASE}/products/add-review`, review);
    return response.data;
};

export const updateReview = async (review: WooCommerceReview): Promise<WooCommerceReview> => {
    const response = await axios.put(`${API_BASE}/products/edit-review/${review.id}`, review);
    return response.data;
};

export const deleteReview = async (review: WooCommerceReview): Promise<WooCommerceReview> => {
  const response = await axios.delete(`${API_BASE}/products/delete-review/${review.id}`);
  return response.data;
};

export const getProducts = async (): Promise<WooCommerceProduct[]> => {
    const response = await axios.get(`${API_BASE}/products`);
    return response.data;
  };
export const getProduct = async (productId: number): Promise<WooCommerceProduct> => {
    const response = await axios.get(`${API_BASE}/products/${productId}`);
    return response.data;
};


export const contact = async (data: object): Promise<unknown> => {
    const response = await axios.post(`${API_BASE}/contact`, data);
    return response;
}