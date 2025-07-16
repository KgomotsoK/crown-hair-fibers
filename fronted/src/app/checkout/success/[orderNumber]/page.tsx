'use client';

import { useCart } from '@/context/CartContext';
import { getOrderByNumber } from '@/utils/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../../../../styles/success.css';

export default function SuccessPage() {
  const params = useParams();
  const {clearCart} = useCart()
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderNumber = params?.orderNumber as string;;

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        const order = await getOrderByNumber(orderNumber);
        setOrderDetails(order);
        setLoading(false);
        clearCart(); // Clear cart after successful order
      } catch (error) {
        console.error('Error checking order status:', error);
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    checkOrderStatus();
  }, [orderNumber]);


  if (loading) {
    return (
      <div className="loading">
        <motion.div 
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}className="loading-spinner"></motion.div>
        <p>Loading order details...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="success-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div 
        className="success-content"
      >
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
        </div>
        
        <h1>Payment Successful!</h1>
        <p className="order-number">Order #{orderNumber}</p>
        
        <div className="order-details">
          <h2>Order Summary</h2>
          
          {orderDetails && (
            <>
              <div className="customer-info">
                <div className="info-section">
                  <h3>Shipping Address</h3>
                  <p>
                    {orderDetails.shipping?.first_name} {orderDetails.shipping?.last_name}<br />
                    {orderDetails.shipping?.address_1}<br />
                    {orderDetails.shipping?.address_2 && <>{orderDetails.shipping.address_2}<br /></>}
                    {orderDetails.shipping?.city}, {orderDetails.shipping?.state} {orderDetails.shipping?.postcode}<br />
                    {orderDetails.shipping?.country}
                  </p>
                </div>
                
                <div className="info-section">
                  <h3>Contact Information</h3>
                  <p>
                    Email: {orderDetails.billing?.email}<br />
                    Phone: {orderDetails.billing?.phone}
                  </p>
                </div>
              </div>
              
              {orderDetails.line_items && (
                <div className="order-table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th className="item-header">Items</th>
            <th className="quantity-header">Quantity</th>
            <th className="price-header">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.line_items.map((item: any) => (
            <tr key={item.id}>
              <td className="item-cell">
                <div className="item-info">
                  <img src={item.image.src} alt={item.name} className="item-image" />
                  <span className="item-name">{item.name}</span>
                </div>
              </td>
              <td className="quantity-cell">{item.quantity}</td>
              <td className="price-cell">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="shipping-row">
            <td colSpan={2} className="shipping-label">Shipping</td>
            <td className="shipping-cost">${orderDetails.shipping_cost || '0.00'}</td>
          </tr>
          {orderDetails.discount_code && (
            <tr className="discount-row">
              <td colSpan={2} className="discount-label">Discount ({orderDetails.discount_code})</td>
              <td className="discount-amount">-${orderDetails.discount_amount || '0.00'}</td>
            </tr>
          )}
          <tr className="total-row">
            <td colSpan={2} className="total-label">Total</td>
            <td className="total-amount">${orderDetails.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
              )}
            </>
          )}
        </div>
        
        <p className="message">
          Thank you for your order! A confirmation email has been sent to {orderDetails?.billing?.email}.
          We will process your order shortly.
        </p>
        
        <div className="actions">
          <Link href="/" className="home-button">
            Continue Shopping
          </Link>
          
          {orderDetails && orderDetails.number && (
            <Link href={`/account/orders/${orderDetails.number}`} className="view-order-button">
              View Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 