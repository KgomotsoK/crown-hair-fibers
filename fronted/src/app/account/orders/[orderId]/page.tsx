'use client';

import { useAuth } from '@/context/AuthContext';
import '@/styles/order-details.css';
import { getOrderByNumber } from '@/utils/api';
import { WooCommerceOrder } from '@/utils/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailsPage() {
  const params = useParams();
  const [orderDetails, setOrderDetails] = useState<WooCommerceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderId = params?.orderId as string;
  const { user } = useAuth();

  if (orderId && typeof orderId !== 'string') {
    return (
      <div className="order-details-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <Link href="/account/dashboard" className="back-button">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let isMounted = true;
    const fetchOrderDetails = async () => {
      try {
        const order = await getOrderByNumber(orderId);
        if (isMounted) {
          setOrderDetails(order);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load order details');
          setLoading(false);
        }
      }
    };
  
    fetchOrderDetails();
  
    return () => {
      isMounted = false;
    };
  }, [orderId]);

 
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
      <div className="order-details-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <Link href="/account/dashboard" className="back-button">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="order-details-container">
        <div className="error-message">
          <h2>Order Not Found</h2>
          <p>The requested order could not be found.</p>
           <Link href={`${user && user.id? '/account/dashboard' : '/'}`} className="back-button">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = orderDetails.line_items.reduce(
    (sum, item) => sum + parseFloat(item.total),
    0
  );

  // Shipping amount is $0.00
  const shipping = 0;

  // Total is the same as subtotal since shipping is free
  const total = subtotal;

  return (
    <div className="order-details-container">
      <div 
        className="order-details-content"
      >
        <div className="order-header">
          <h1>Order Details</h1>
          <Link href={user? "/account/dashboard" : "/homepage"} className="back-link">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="order-info">
          <div className="order-number">
            <span>Order #:</span>
            <span>{orderDetails.number}</span>
          </div>
          <div className="order-date">
            <span>Date:</span>
            <span>{new Date(orderDetails.date_created).toLocaleDateString()}</span>
          </div>
          <div className="order-status">
            <span>Status:</span>
            <span className={`status-${orderDetails.status}`}>{orderDetails.status}</span>
          </div>
        </div>
        
        <div className="order-sections">
          <div className="customer-info">
            <h2>Customer Information</h2>
            <div className="customer-details">
            <div className="info-section">
              <h3>Billing Address</h3>
              <p>
                {orderDetails.billing?.first_name} {orderDetails.billing?.last_name}<br />
                {orderDetails.billing?.address_1}<br />
                {orderDetails.billing?.address_2 && <>{orderDetails.billing.address_2}<br /></>}
                {orderDetails.billing?.city}, {orderDetails.billing?.state} {orderDetails.billing?.postcode}<br />
                {orderDetails.billing?.country}
              </p>
              <p>
                Email: {orderDetails.billing?.email}<br />
                Phone: {orderDetails.billing?.phone}
              </p>
            </div>
            
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
            </div>
            
          </div>
          
          <div className="order-items">
            <h2>Order Items</h2>
            <div className="items-list">
              {orderDetails.line_items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    {item.image && (
                      <Image 
                        src={item.image.src} 
                        alt={item.name}
                        width={80}
                        height={80}
                      />
                    )}
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      <span className="item-quantity">Quantity: {item.quantity}</span>
                      {item.sku && <span className="item-sku">SKU: {item.sku}</span>}
                    </div>
                  </div>
                  <div className="item-price">${parseFloat(item.total).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-actions">
          <Link href="/shop" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 