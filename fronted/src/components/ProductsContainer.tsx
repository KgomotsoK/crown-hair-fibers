// fronted/src/components/ProductsContainer.tsx
'use client';
import ProductCard from '@/components/ProductCard';
import { useProductContext } from '@/context/ProductContext';
import '@/styles/products.css';
import { getProducts } from '@/utils/api';
import { WooCommerceProduct } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const fetchProducts = async () => {
  const data = await getProducts();
  return data;
};

const ProductsContainer = () => {
  const { setProducts } = useProductContext();

  const { data: products, isLoading, error } = useQuery<WooCommerceProduct[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  React.useEffect(() => {
    if (products) {
      const productMap = products.reduce(
        (acc: Record<number, WooCommerceProduct>, product) => {
          acc[product.id] = product;
          return acc;
        },
        {}
      );
      setProducts(productMap);
    }
  }, [products, setProducts]);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (error instanceof Error) return <p>Could not fetch products. Please refresh page.</p>;

  return (
    <div className="products-container-page">
      <div className='products-container'>
      <ProductCard productsData={products || []} />
      </div>
      
    </div>
  );
};

export default ProductsContainer;
