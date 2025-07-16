// fronted/src/context/ProductContext.tsx
'use client';
import { WooCommerceProduct } from '@/utils/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ProductContextType = {
  products: Record<number, WooCommerceProduct>;
  variations: Record<number, WooCommerceProduct>;
  setProducts: React.Dispatch<React.SetStateAction<Record<number, WooCommerceProduct>>>;
  setVariations: React.Dispatch<React.SetStateAction<Record<number, WooCommerceProduct>>>;
  getProductVariations: (productId: number) => WooCommerceProduct[];
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Cache keys for localStorage
const PRODUCTS_CACHE_KEY = 'cached_products';
const VARIATIONS_CACHE_KEY = 'cached_variations';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Record<number, WooCommerceProduct>>({});
  const [variations, setVariations] = useState<Record<number, WooCommerceProduct>>({});

  // Load cached data on mount
  useEffect(() => {
    const cachedProducts = localStorage.getItem(PRODUCTS_CACHE_KEY);
    const cachedVariations = localStorage.getItem(VARIATIONS_CACHE_KEY);
    
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
    }
    if (cachedVariations) {
      setVariations(JSON.parse(cachedVariations));
    }
  }, []);

  // Cache data when it changes
  useEffect(() => {
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(VARIATIONS_CACHE_KEY, JSON.stringify(variations));
  }, [variations]);

  // Helper function to get variations for a specific product
  const getProductVariations = (productId: number): WooCommerceProduct[] => {
    return Object.values(variations).filter(
      variation => variation.parent_id === productId
    );
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        variations, 
        setProducts, 
        setVariations, 
        getProductVariations 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
