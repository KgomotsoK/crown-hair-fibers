'use client'
import '@/styles/cart.css';
import { faMinus, faPlus, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { useCart } from '../context/CartContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  // add other properties as needed
}

const CartItem = memo(({ 
  item, 
  onQuantityChange, 
  onRemove 
}: { 
  image: string,
  item: CartItem, 
  onQuantityChange: (id: number, currentQuantity: number, change: number) => void,
  onRemove: (id: number) => void 
}) => (
  <motion.div
    className="cart-item"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  >
   
    <div className="cart-item-info">
    <div className='cart-item-img'>
      <Image src={item.image || '/placeholder.jpg'} alt={item.name} height={100} width={100}/>
    </div>
      <div className="item-name">
        <h3 className="cart-item-name">{item.name}</h3>
      </div>
      
      <div className="cart-quantity-control">
        <motion.p
          className="cart-item-price"
          key={item.quantity} // Trigger animation on quantity change
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          ${(item.price * item.quantity).toFixed(2)}
        </motion.p>
        <div className="quantity-controllers">
          <motion.div
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon 
              icon={faMinus} 
              className="icon-minus cart-icons" 
              onClick={() => onQuantityChange(item.id, item.quantity, -1)}
            />
          </motion.div>
          <motion.span
            key={item.quantity}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="quantity-display"
          >
            {item.quantity}
          </motion.span>
          <motion.div
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon 
              icon={faPlus} 
              className="icon-plus cart-icons" 
              onClick={() => onQuantityChange(item.id, item.quantity, 1)}
            />
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="delete-cont"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon 
          icon={faTrash} 
          className="icon-remove" 
          onClick={() => onRemove(item.id)}
        />
      </motion.div>
    </div>
    <div className="cart-items-divider"></div>
  </motion.div>
));

CartItem.displayName = 'CartItem';

const Cart = () => {
  const router = useRouter();
  const { 
    cart, 
    updateCartItem, 
    removeFromCart, 
    totalPrice,
    isCartOpen,
    closeCart 
  } = useCart();

  const handleQuantityChange = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateCartItem(id, newQuantity);
  };

  const handleContinueShopping = () => {
    closeCart();
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="cart-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="cart-content"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            <div className="cart-header">
              <motion.div
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <FontAwesomeIcon 
                  className="cart-header-icon" 
                  icon={faX} 
                  onClick={closeCart}
                />
              </motion.div>
            </div>

            {cart.length === 0 ? (
              <motion.div
                className="empty-cart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="cart-empty">Your cart is empty</h2>
                <p>Add some items to get started!</p>
              </motion.div>
            ) : (
              <>
                <h2 className="cart-title">Cart Items</h2>
                <div className="cart-items">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <CartItem
                        key={item.id}
                        image={item.image}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <motion.div 
                  className="cart-footer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="cart-total">
                    <span className="total-label">Total:</span>
                    <motion.span
                      className="total-amount"
                      key={totalPrice} // Trigger animation when total changes
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      ${totalPrice.toFixed(2)}
                    </motion.span>
                  </div>
                </motion.div>

                <div className="buttons-container">
                  <motion.button
                    className="continue-shopping"
                    onClick={handleContinueShopping}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>
                  <motion.button
                    className="checkout-button"
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Checkout
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(Cart);