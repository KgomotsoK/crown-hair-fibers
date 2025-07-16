'use client';

import { useCart } from '@/context/CartContext';
import React from 'react';
import { WooCommerceProduct } from './types';

interface AddToCartProps {
  product: WooCommerceProduct | undefined;
  quantity?: number;  // Make quantity optional with ?
}

const AddToCart: React.FC<AddToCartProps> = ({ product, quantity = 1 }) => {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    if (!product?.id) return;

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
    <button className="add-to-cart-button" onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};

export default AddToCart;