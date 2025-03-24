'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/checkout.css';
import { createOrder, updateUserDetails } from '../utils/api';

const Checkout = () => {
  const { cart, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveBillingInfo, setSaveBillingInfo] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: '',
    paymentMethod: 'stripe',
    shippingMethod: 'free_shipping',
    differentShipping: false,
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postcode: '',
      country: '',
    },
  });

  // Pre-fill form data if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.billing?.first_name || user.first_name || '',
        lastName: user.billing?.last_name || user.last_name || '',
        email: user.email || '',
        phone: user.billing?.phone || '',
        address: user.billing?.address_1 || '',
        city: user.billing?.city || '',
        postcode: user.billing?.postcode || '',
        country: user.billing?.country || '',
        shipping: {
          firstName: user.shipping?.first_name || user.first_name || '',
          lastName: user.shipping?.last_name || user.last_name || '',
          email: user.email || '',
          phone: user.shipping?.phone || '',
          address: user.shipping?.address_1 || '',
          city: user.shipping?.city || '',
          postcode: user.shipping?.postcode || '',
          country: user.shipping?.country || '',
        },
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('shipping.')) {
      const shippingField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          [shippingField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'differentShipping') {
      setFormData((prev) => ({
        ...prev,
        differentShipping: checked,
        shipping: checked
          ? prev.shipping
          : {
              ...prev,
              firstName: prev.firstName,
              lastName: prev.lastName,
              email: prev.email,
              phone: prev.phone,
              address: prev.address,
              city: prev.city,
              postcode: prev.postcode,
              country: prev.country,
            },
      }));
    } else if (name === 'saveBillingInfo') {
      setSaveBillingInfo(checked);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Save billing info if requested
      if (isAuthenticated && user && saveBillingInfo) {
        await updateUserDetails({
          ...user,
          billing: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address_1: formData.address,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country,
            company: '',
            address_2: '',
            state: ''
          },
        });
      }

      const orderData = {
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country,
        },
        shipping: formData.differentShipping
          ? {
              first_name: formData.shipping.firstName,
              last_name: formData.shipping.lastName,
              address_1: formData.shipping.address,
              city: formData.shipping.city,
              postcode: formData.shipping.postcode,
              country: formData.shipping.country,
            }
          : {
              first_name: formData.firstName,
              last_name: formData.lastName,
              address_1: formData.address,
              city: formData.city,
              postcode: formData.postcode,
              country: formData.country,
            },
        payment_method: formData.paymentMethod,
        payment_method_title: 'Stripe',
        line_items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_lines: [
          {
            method_id: formData.shippingMethod,
            method_title: formData.shippingMethod,
            total: '0',
          },
        ],
      };
      const response = await createOrder(orderData);

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        console.log('Order creation failed:', response.message);
        return <p>Your order could not be processed. Please try again.</p>;
      }
    } catch (error) {
      console.log('Error during order creation:', error);
      return <p>Failed to create order. Please try again.</p>;
     // setError('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="header-container">
        <h1>Checkout</h1>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="contents">
        <motion.form
          onSubmit={handleSubmit}
          className="checkout-form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-contents">
            <div className="billing-details-container">
              <h2>Billing Details</h2>
              <div className="form-inputs">
                <div className="names">
                  <motion.input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                  <motion.input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <motion.input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
                <motion.input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
                <motion.input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
                <motion.input
                  type="text"
                  name="postcode"
                  placeholder="Postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                />
                <motion.input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="differentShipping"
                  checked={formData.differentShipping}
                  onChange={handleCheckboxChange}
                />
                Ship to a different address?
              </label>

              <AnimatePresence>
                {formData.differentShipping && (
                  <motion.div
                    className="shipping-details-container"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2>Shipping Details</h2>
                    <div className="form-inputs">
                      <div className="names">
                        <input
                          type="text"
                          name="shipping.firstName"
                          placeholder="First Name"
                          value={formData.shipping.firstName}
                          onChange={handleChange}
                          required
                        />
                        <input
                          type="text"
                          name="shipping.lastName"
                          placeholder="Last Name"
                          value={formData.shipping.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <input
                        type="text"
                        name="shipping.address"
                        placeholder="Address"
                        value={formData.shipping.address}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        name="shipping.city"
                        placeholder="City"
                        value={formData.shipping.city}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        name="shipping.postcode"
                        placeholder="Postcode"
                        value={formData.shipping.postcode}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        name="shipping.country"
                        placeholder="Country"
                        value={formData.shipping.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="payment-section">
                <h2>Payment Method</h2>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="stripe">Card Payment</option>
                </select>
              </div>
            </div>
          </div>
          <motion.button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? 'Processing...' : `Proceed To Payment`}
          </motion.button>
        </motion.form>

        <motion.div
          className="details"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="order-summary-container">
            <h2>Order Summary</h2>
            <div className="order-summary">
              <div className="cart-items">
                {cart.map((item) => (
                  <motion.div
                    className="cart-item"
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="item-details">
                      <Image src={item.image} alt={item.name} height={50} width={50} />
                      <div>
                        <h3>{item.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </motion.div>
                ))}
              </div>
              <div className="order-totals">
                <div className="subtotal">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="shipping">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="total">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;