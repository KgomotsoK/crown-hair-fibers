// Fronted/src/utils/addTocart.tsx
'use client';

import { useCart } from '@/context/CartContext';
import React from 'react';
import '../styles/cart.css';
import { WooCommerceProduct } from './types';

interface AddToCartProps {
  product: WooCommerceProduct | undefined;
  quantity?: number;
  disabled?: boolean;
}

const AddToCart: React.FC<AddToCartProps> = ({ product, quantity = 1, disabled = false }) => {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    if (!product?.id || disabled) return;

    // Ensure price is a valid number
    const price = parseFloat(product?.price || '0');
    if (isNaN(price)) {
      console.error('Invalid price:', product?.price);
      return;
    }

    console.log("Product About to be Added!")

    // Ensure quantity is a valid number
    const validQuantity = Number(quantity) || 1;

    // Add the product to the cart
    addToCart({
      id: product.id,
      image: product?.images[0]?.src || '',
      name: product?.name || '',
      price: price,
      quantity: validQuantity,
    });
  };

  return (
    <button className="add-to-cart-button" onClick={handleAddToCart} disabled={disabled}>
      Add to Cart
    </button>
  );
};

export default AddToCart;
