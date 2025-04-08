'use client';
//import { useRecaptcha } from '@/hooks/useRecaptcha';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/checkout.css';
import { createOrder, updateUserDetails } from '../utils/api';

declare global {
  interface Window {
    google: any;
  }
}

const Checkout = () => {
  const { cart, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveBillingInfo, setSaveBillingInfo] = useState(false);
  const billingAutocompleteRef = useRef(null);
  const shippingAutocompleteRef = useRef(null);
  //const {validateRecaptcha} = useRecaptcha();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    postcode: '',
    state: '',
    paymentMethod: 'stripe',
    shippingMethod: 'Free Shipping',
    differentShipping: false,
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address_1: '',
      address_2: '',
      city: '',
      postcode: '',
      state: '',
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
        address_1: user.billing?.address_1 || '',
        address_2: user.billing?.address_2 || '',
        city: user.billing?.city || '',
        postcode: user.billing?.postcode || '',
        state: user.billing?.state || '',
        shipping: {
          firstName: user.shipping?.first_name || user.first_name || '',
          lastName: user.shipping?.last_name || user.last_name || '',
          email: user.email || '',
          phone: user.shipping?.phone || '',
          address_1: user.shipping?.address_1 || '',
          address_2: user.shipping?.address_2 || '',
          city: user.shipping?.city || '',
          postcode: user.shipping?.postcode || '',
          state: user.shipping?.state || '',
        },
      }));
    }
  }, [isAuthenticated, user]);

  // Setup Google Places Autocomplete
  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initAutocomplete();
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB6pHh6GB3mk-nXQTdS5E5CVtkjL-R7Ndw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    };

    // Initialize autocomplete
    const initAutocomplete = () => {
      if (!window.google) return;

      // Initialize billing address autocomplete
      if (billingAutocompleteRef.current) {
        const billingAutocomplete = new window.google.maps.places.Autocomplete(billingAutocompleteRef.current, {
          componentRestrictions: { country: 'us' }, // Restrict to USA addresses only
          types: ['address']
        });

        billingAutocomplete.addListener('place_changed', () => {
          const place = billingAutocomplete.getPlace();
          fillAddressFields(place, 'billing');
        });
      }

      // Initialize shipping address autocomplete
      if (shippingAutocompleteRef.current) {
        const shippingAutocomplete = new window.google.maps.places.Autocomplete(shippingAutocompleteRef.current, {
          componentRestrictions: { country: 'us' }, // Restrict to USA addresses only
          types: ['address']
        });

        shippingAutocomplete.addListener('place_changed', () => {
          const place = shippingAutocomplete.getPlace();
          fillAddressFields(place, 'shipping');
        });
      }
    };

    // Extract and fill address fields from Google Places result
    const fillAddressFields = (place: any, addressType: 'billing' | 'shipping') => {
      if (!place.address_components) return;
      
      // Extract address components
      let streetNumber = '';
      let streetName = '';
      let city = '';
      let state = '';
      let postcode = '';

      for (const component of place.address_components) {
        const componentType = component.types[0];

        switch (componentType) {
          case 'street_number':
            streetNumber = component.long_name;
            break;
          case 'route':
            streetName = component.long_name;
            break;
          case 'locality':
            city = component.long_name;
            break;
          case 'administrative_area_level_1':
            state = component.short_name;
            break;
          case 'postal_code':
            postcode = component.long_name;
            break;
        }
      }

      // Combine street number and name for full address
      const address_1 = streetNumber && streetName ? `${streetNumber} ${streetName}` : (streetNumber || streetName);

      // Update form state based on address type
      if (addressType === 'billing') {
        setFormData(prev => ({
          ...prev,
          address_1,
          city,
          state,
          postcode
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            address_1,
            city,
            state,
            postcode
          }
        }));
      }
    };

    loadGoogleMapsScript();

    return () => {
      // No need to clean up script if it's already loaded by another component
    };
  }, [formData.differentShipping]);

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
              ...prev.shipping,
              firstName: prev.firstName,
              lastName: prev.lastName,
              email: prev.email,
              phone: prev.phone,
              address_1: prev.address_1,
              address_2: prev.address_2,
              city: prev.city,
              postcode: prev.postcode,
              state: prev.state,
            },
      }));
    } else if (name === 'saveBillingInfo') {
      setSaveBillingInfo(checked);
    }
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*const isValid = await validateRecaptcha('checkout_form_submit');
    if (!isValid) {
      setError('Recaptcha validation failed. Please try again.');   
      return;
    }*/
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
            address_1: formData.address_1,
            address_2: formData.address_2,
            city: formData.city,
            postcode: formData.postcode,
            state: formData.state,
            country: 'US', // Hardcoded to US
            company: '',
          },
        });
      }

      const orderData = {
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.address_1,
          address_2: formData.address_2,
          city: formData.city,
          postcode: formData.postcode,
          state: formData.state,
          country: 'US', // Hardcoded to US
        },
        shipping: formData.differentShipping
          ? {
              first_name: formData.shipping.firstName,
              last_name: formData.shipping.lastName,
              address_1: formData.shipping.address_1,
              address_2: formData.shipping.address_2,
              city: formData.shipping.city,
              postcode: formData.shipping.postcode,
              state: formData.shipping.state,
              country: 'US', // Hardcoded to US
            }
          : {
              first_name: formData.firstName,
              last_name: formData.lastName,
              address_1: formData.address_1,
              address_2: formData.address_2,
              city: formData.city,
              postcode: formData.postcode,
              state: formData.state,
              country: 'US', // Hardcoded to US
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
        status: 'pending', // Mark order as pending payment
      };
      const response = await createOrder(orderData);

      if (response.orderId) {
        // Redirect to custom payment page
        window.location.href = `/checkout/payment/${response.orderNumber}?total=${response.orderTotal}`;
      } else {
        console.log('Order creation failed:', response.message);
        setError('Your order could not be processed. Please try again.');
      }
    } catch (error) {
      console.log('Error during order creation:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="checkout-container">
      <div className="page-title">
          <h1>Checkout</h1>
          <motion.div
            id="underline"
            initial={{ width: '100%' }}
            whileInView={{width: '50%'}}
            transition={{ duration: 0.8, delay: 0.2 }}
            />
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
                  name="address_1"
                  placeholder="Street Address"
                  value={formData.address_1}
                  onChange={handleChange}
                  ref={billingAutocompleteRef}
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
                <motion.input
                  type="text"
                  name="address_2"
                  placeholder="Building/Apartment/Unit Number"
                  value={formData.address_2}
                  onChange={handleChange}
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
                  placeholder="Zip Code"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                />
                <motion.input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
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
                        name="shipping.address_1"
                        placeholder="Street Address"
                        value={formData.shipping.address_1}
                        onChange={handleChange}
                        ref={shippingAutocompleteRef}
                        required
                      />
                      <input
                        type="text"
                        name="shipping.address_2"
                        placeholder="Building/Apartment/Unit Number"
                        value={formData.shipping.address_2}
                        onChange={handleChange}
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
                        placeholder="Zip Code"
                        value={formData.shipping.postcode}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        name="shipping.state"
                        placeholder="State"
                        value={formData.shipping.state}
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
            {isSubmitting ? <div className="button-loading">
          <motion.div 
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}className="button-loading-spinner"></motion.div>
        <p>Processing...</p>
      </div> : `Proceed To Payment`}
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