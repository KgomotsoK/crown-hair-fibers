'use client';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecaptcha } from '../../../../hooks/useRecaptcha';
import '../../../../styles/payment.css';
import { createPaymentIntent, getOrderByNumber, updateOrderStatus } from '../../../../utils/api';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Payment Form Component
const PaymentForm = ({ 
  orderNumber, 
  total,
  onClientSecretSet 
}: { 
  orderNumber: string, 
  total: string,
  onClientSecretSet: (secret: string) => void 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {validateRecaptcha} = useRecaptcha();
  const paymentElementOptions = {
    defaultValues: {
      billingDetails: {
        address: {
          country: 'US', // Default to USA
        },
      },
    },
    fields: {
      billingDetails: {
        address: {
          country: 'never' as const,
        }
      }
    },
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    /*const isValid = await validateRecaptcha('payment_form_submit');
    if (!isValid) {
      setError('Recaptcha validation failed. Please try again.');
      return;
    }
    */
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setMessage(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success/${orderNumber}`,
          payment_method_data: {
            billing_details: {
              address: {
                country: 'US' // Explicitly provide country
              }
            }
          }
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await updateOrderStatus(
          orderNumber,
          'processing',
          'stripe',
          paymentIntent.id
        );

        setMessage('Payment successful! Redirecting...');
        router.push(`/checkout/success/${orderNumber}`);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <motion.button
            className="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
           onClick={() => window.location.reload()}>Try Again</motion.button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement options={paymentElementOptions}/>
      {message && <div className="message">{message}</div>}
     
      <motion.button
            type="submit"
            className="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isProcessing ? <div className="button-loading">
          <motion.div 
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}className="button-loading-spinner"></motion.div>
        <p>Processing...</p>
      </div> : 'Pay Now'}
      </motion.button>
    </form>
  );
};

// Main Payment Page Component
export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params?.orderNumber as string;
  const total = searchParams.get('total') || '0';

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    const fetchOrderAndPaymentIntent = async () => {
      try {
        const [orderResponse, paymentResponse] = await Promise.all([
          getOrderByNumber(orderNumber),
          createPaymentIntent(orderNumber, parseFloat(total)),
        ]);
        setOrderDetails(orderResponse);
        setClientSecret(paymentResponse.clientSecret);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load order or payment details.');
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber && total) {
      fetchOrderAndPaymentIntent();
    }
  }, [orderNumber, total]);

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
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page-container">
        <div className="error-container">
          <h1>Error</h1>
          <p>{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="back-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
    <div className="payment-page-container">
      <div className="loading">
      <motion.div 
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}className="loading-spinner"></motion.div>
          <p>Initializing Payment...</p>
      </div>
    </div>)
  }

  return (
    <div className="payment-page-container">
      <div className="page-title">
        <h1>Complete Your Order</h1>
        <motion.div
          id="underline"
          initial={{ width: '100%' }}
          whileInView={{width: '50%'}}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>

      <div className="payment-content">
        <div className="payment-section">
          <h2>Payment Details</h2>
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                orderNumber={orderNumber} 
                total={total} 
                onClientSecretSet={setClientSecret}
              />
            </Elements>
          )}
        </div>

        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-info">
            <div className="order-number">
              <span>Order #:</span>
              <span>{orderNumber}</span>
            </div>
            <div className="order-total">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>

          {orderDetails && orderDetails.line_items && (
            <div className="order-items">
              {orderDetails.line_items.map((item: any) => (
                <div key={item.id} className="order-item">
                  {item.image && (
                    <div className="item-image">
                      <Image 
                        src={item.image.src} 
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}