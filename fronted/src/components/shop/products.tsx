'use client';
import Link from 'next/link';
import '../../styles/products.css';
import ProductsContainer from '../ProductsContainer';


const Products = () => {
 
  return (
    <main className="shop-main-page">
      <div className='products-cont'>
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link>
      </div>
      <h1 className="page-title">
      Our Products</h1>
      <ProductsContainer />
      </div>
      </main>
  );
};

export default Products;
