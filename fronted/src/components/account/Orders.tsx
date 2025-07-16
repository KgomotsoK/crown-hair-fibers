'use client';
import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css';
import { getUserOrders } from '../../utils/api';
import { WooCommerceOrder } from '../../utils/types';

interface OrdersProps {
  user_id?: number;
  token: string | null;
}

const Orders: React.FC<OrdersProps> = ({ user_id, token }) =>{
  const [orders, setOrders] = useState<WooCommerceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchOrderData = async () => {
       try {
         if (user_id) {
           const ordersData = await getUserOrders(user_id.toString());
           setOrders(ordersData);
           setLoading(false);
         }
       } catch (error) {
         console.error('Failed to fetch order details:', error);
       }
     };
 
     if (token && user_id) {
       fetchOrderData();
     }
   }, [token, user_id]);

   if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="customer_orders-container">
        <h2>Orders</h2>
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.number}</h3>
                  <span className={`status status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="order-info">
                    <p><strong>Date:</strong> {new Date(order.date_created).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> {order.currency_symbol}{order.total}</p>
                    <p><strong>Payment Method:</strong> {order.payment_method}</p>
                  </div>
    
                  <div className="order-items">
                    <h4>Items</h4>
                    {order.line_items.map((item) => (
                      <div key={item.id} className="order-item">
                        {item.image && (
                          <img 
                            src={item.image.src} 
                            alt={item.name} 
                            className="item-image"
                          />
                        )}
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          <p className="item-meta">
                            Quantity: {item.quantity} × {order.currency_symbol}{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
    
                  <div className="shipping-info">
                    <h4>Shipping Address</h4>
                    <p>
                      {order.shipping.first_name} {order.shipping.last_name}<br />
                      {order.shipping.address_1}
                      {order.shipping.address_2 && <><br />{order.shipping.address_2}</>}<br />
                      {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}<br />
                      {order.shipping.country}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <p>You haven&apos;t placed any orders yet.</p>
          </div>
        )}
      </div>
  );
};

export default Orders;