// Fronted/src/utils/api.tsx
import axios from 'axios';
import { WooCommerceCustomer, WooCommerceOrder, WooCommerceProduct, WooCommerceReview } from '../utils/types';

// Use environment variable for API base URL
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';

type LoginResponse = {
  user: WooCommerceCustomer;
  token: string;
} | { 
  success: false; 
  message: string 
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message 
      };
    }
    return { 
      success: false, 
      message: 'An unexpected error occurred' 
    };
  }
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

export const createOrder =  async (order: object): Promise<{orderId: number, orderNumber: string, orderTotal: string, message: string}> => {
  try {
    const response = await axios.post(`${API_BASE}/orders`, order);
    return response.data;
  } catch (error) {
    console.log('Failed to create order:', error);
    // @ts-ignore
    return { orderId: 0, orderNumber: '', orderTotal: '', message: error.message };
  }
}

export const getUserOrders = async (customer_id: string): Promise<WooCommerceOrder[]> => {
    const response = await axios.get(`${API_BASE}/orders/${customer_id}`);
    return response.data;
};

export const getOrder = async (orderId: string): Promise<WooCommerceOrder> => {
  const response = await axios.get(`${API_BASE}/orders/${orderId}`);
  return response.data;
};

export const getOrderByNumber = async (order_number: string): Promise<WooCommerceOrder> => {
  const response = await axios.get(`${API_BASE}/orders/${order_number}`);
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

export const getProductBySlug = async (slug: string): Promise<WooCommerceProduct> => {
  const response = await axios.get(`${API_BASE}/products/${slug}`);
  return response.data;
};

export const contact = async (data: object): Promise<unknown> => {
    const response = await axios.post(`${API_BASE}/contact`, data);
    return response;
}

// Payment related API calls
export const createPaymentIntent = async (orderNumber: string, amount: number): Promise<{ clientSecret: string; orderNumber: string }> => {
  try {
    const response = await axios.post(
      `${API_BASE}/payments/create-payment-intent`,
      {
        orderNumber,
        amount: Math.round(amount * 100), // Convert to cents
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderNumber: string, status: string, paymentMethod: string, transactionId: string): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE}/orders/updateOrderStatus`,
      {
        orderNumber,
        status,
        paymentMethod,
        transactionId
      }
    );
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
};

// Function to verify reCAPTCHA token on the server
export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE}/auth/verify-recaptcha`, { token });
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
};

// Function to execute reCAPTCHA and get a token
export const executeRecaptcha = async (action: string): Promise<string | null> => {
  if (typeof window === 'undefined' || !window.grecaptcha) {
    console.error('reCAPTCHA not loaded');
    return null;
  }

  const siteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    throw new Error('reCAPTCHA site key is not defined');
  }

  try {
    return await window.grecaptcha.execute(
      siteKey,
      { action }
    );
  } catch (error) {
    console.error('reCAPTCHA execution error:', error);
    return null;
  }
};

// Add TypeScript declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
} 