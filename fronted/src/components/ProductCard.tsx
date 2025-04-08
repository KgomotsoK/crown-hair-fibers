'use client';
import parse from 'html-react-parser';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useProductContext } from '../context/ProductContext';
import '../styles/products.css';
import AddToCart from '../utils/addTocart';
import { getProduct } from '../utils/api';
import { WooCommerceProduct } from '../utils/types';

interface ProductListingProps {
  productsData: WooCommerceProduct[];
}

const ProductCardItem: React.FC<{ product: WooCommerceProduct }> = ({ product }) => {
  const router = useRouter();
  const { setVariations } = useProductContext();
  const [productState, setProductState] = React.useState<WooCommerceProduct | null>(null);

  useEffect(() => {
    if (productState) {
      const variations: WooCommerceProduct[] = [];
      productState.variations?.map(async (variation) => {
        const variant = await getProduct(variation);
        variations.push(variant);
      });
      setVariations(variations);
    }
    else{
      setVariations([]);
    }
  }, [productState, setVariations]);


  const fetchVariations = (product: WooCommerceProduct) => {
    setProductState(product);
  };

  return (
    <div key={product.id} className='product-card' onClick={() => router.push(`/shop/${product.id}`)}>
      <div onClick={() => router.push(`/shop/${product.id}`)} >
        {product.on_sale && (
          <div className='sale_price'>
            {product.regular_price && product.sale_price 
              ? ((1 - parseFloat(product.sale_price) / parseFloat(product.regular_price)) * 100).toFixed(0)
              : 0}% off
          </div>
        )}
        <div className='image-wrapper'>
          <Image
            src={product.images?.[0]?.src ?? '/placeholder-image.jpg'}
            alt={product.name || 'Product Image'}
            className="product-image"
            width={300}
            height={300}
          />
        </div>
        <p className="product-name">{product.name}</p>
        <p className="product-price">{parse(product.price_html)}</p>
        {product.stock_status === 'instock' ? (
          <p className="product-stock" style={{color: '#0aaf33'}}>In Stock</p>
        ) : (
          <p className="product-stock" style={{color: 'rgb(149, 3, 25)'}}>Out of Stock</p>
        )}
      </div>
      <div className='addToCart-buttons-container' onClick={() => (product.variations ?? []).length > 0 ? fetchVariations(product) : null}>
        {(Array.isArray(product.variations) && product.variations.length > 0) ? (
          <button className="add-to-cart-button" onClick={() => router.push(`/shop/${product.id}`)}>
            Select Option
          </button>
        ) : (
          <AddToCart product={product} />
        )}
      </div>
    </div>
  );
};

const ProductCard: React.FC<ProductListingProps> = ({ productsData }) => {
  return (
    <div className="card">
      {productsData.map((product) => 
        product.status !== 'draft' && (
          <ProductCardItem key={product.id} product={product} />
        )
      )}
    </div>
  );
};

export default ProductCard;