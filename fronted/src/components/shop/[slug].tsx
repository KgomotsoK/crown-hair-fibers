// frontend/src/components/shop/[id].tsx
'use client'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import parse from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useProductContext } from '../../context/ProductContext';
import '../../styles/productioncard.css';
import AddToCart from '../../utils/addTocart';
import { getProduct, getProductReviews, hasUserPurchasedProduct } from '../../utils/api';
import { WooCommerceImage, WooCommerceProduct, WooCommerceReview } from '../../utils/types';
import ReviewSection from '../account/reviews';

interface VariationImage {
  id: number;
  src: string;
  option: string;
}

// Define a mapping for custom swatch images - you'll need to populate this with your actual image paths
const CUSTOM_SWATCH_IMAGES: Record<string, string> = {
  // Format: 'option': 'image-path.jpg'
  'Gray': '/assets/images/swatch images/Gray.webp',
  'Auburn': '/assets/images/swatch images/Auburn.webp',
  'Black': '/assets/images/swatch images/Black.webp',
  'Medium Brown': '/assets/images/swatch images/Medium-Brown.webp',
  'Medium Blonde': '/assets/images/swatch images/Medium-Blonde.webp',
  'Golden Blonde': '/assets/images/swatch images/Golden-Blonde.webp',
  'Light Blonde': '/assets/images/swatch images/Light-Blonde.webp',
  'Dark Brown': '/assets/images/swatch images/Dark-Brown.webp',
  'Light Brown': '/assets/images/swatch images/Light-Brown.webp',
  'White': '/assets/images/swatch images/White.webp',
  'Hazel Brown': '/assets/images/swatch images/Hazel-Brown.webp',
  'Dark Gray': '/assets/images/swatch images/Dark-Gray.webp',
  'Ash Brown': '/assets/images/swatch images/Ash-Brown.webp',
  'Dark Auburn': '/assets/images/swatch images/Dark-Auburn.webp',
};


const ProductDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  //const { id } = params;
  const { products, variations, getProductVariations, setVariations } = useProductContext();
  const { user, isAuthenticated } = useAuth();
  const {openCart} = useCart();
  const [product, setProduct] = useState<WooCommerceProduct>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<Record<string, string>>({});
  const [variationDetails, setVariationDetails] = useState<WooCommerceProduct | null>(null);
  const [isLoadingVariation, setIsLoadingVariation] = useState(false);
  const [allProductImages, setAllProductImages] = useState<WooCommerceImage[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<WooCommerceReview[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [swatchesLoaded, setSwatchesLoaded] = useState(false);

  //refresh page once it loads
    useEffect(() => {
      // This will refresh the page once after the component mounts
      const refreshOnce = () => {
        // Using sessionStorage to track if the page has been refreshed once already
        if (!sessionStorage.getItem('pageRefreshed')) {
          sessionStorage.setItem('pageRefreshed', 'true');
          window.location.reload();
        }
      };
      
      refreshOnce();
    }, []);

  // Fetch product data and reviews when component mounts or ID changes
  useEffect(() => {
    try{
      if (id) {
        const productId = parseInt(id as string, 10);
        if (products[productId]) {
              setProduct(products[productId]);
              if (variations) {
              setVariations(getProductVariations(productId));
              setIsInitialLoad(false);
        setSwatchesLoaded(true);
              }
              else if (product?.variations) {
                const variations: WooCommerceProduct[] = [];
                product.variations?.map(async (variation) => {
                const variant = await getProduct(variation);
                variations.push(variant);
                });
                setVariations(variations);
                setIsInitialLoad(false);
        setSwatchesLoaded(true);
              }
              else{
                return;
              }
        } else {
              // Fallback fetch if product isn't cached
              const fetchProductById = async () => {
                const response = await getProduct(productId);
                setProduct(response);
              };
              fetchProductById();
        }
        
  
        const fetchReviews = async () => {
          try {
            const reviews = await getProductReviews(productId);
            setReviews(reviews);
          } catch (error) {
            console.error('Failed to fetch reviews:', error);
          }
        };
        fetchReviews();
      }
    }
    catch(error){
      console.error('Failed to fetch product:', error);
    }
    
  }, [id, products]);

  // Keep a combined set of product images
  useEffect(() => {
    if (product) {
      setAllProductImages(product.images || []);
    }
  }, [product]);

  // Check if the user has purchased the product
  useEffect(() => {
    if (isAuthenticated && user && id) {
      const productId = parseInt(id as string, 10);
      const checkPurchase = async () => {
        try {
          const hasPurchased = await hasUserPurchasedProduct(user.id, productId);
          setHasPurchased(hasPurchased);
        } catch (error) {
          console.error('Failed to check purchase status:', error);
        }
      };
      checkPurchase();
    }
  }, [isAuthenticated, user, id]);

  // Find matching variation when attributes are selected
  useEffect(() => {
    const findMatchingVariation = async () => {
      if (!product?.variations || Object.keys(selectedVariation).length === 0) return;
      
      setIsLoadingVariation(true);
      
      // Check if all required attributes are selected
      const allAttributesSelected = product.attributes?.every(
        (attr) => selectedVariation[attr.name]
      );
      
      if (!allAttributesSelected) {
        setIsLoadingVariation(false);
        return;
      }

      // Try to find the variation in cache first
      for (const variationId of product.variations) {
        const cachedVariation = variations[variationId];
        
        if (cachedVariation) {
          const matchesSelectedAttributes = product.attributes?.every((attr) => {
            const selectedValue = selectedVariation[attr.name];
            const variationValue = cachedVariation.attributes?.find(
              // @ts-ignore
              (vAttr) => vAttr.name === attr.name)?.option;
            return selectedValue === variationValue;
          });

          if (matchesSelectedAttributes) {
            setVariationDetails(cachedVariation);
            
            // Create a new image array, starting with the variation image
            const newImages = [...allProductImages];
            
            // If variation has images, remove the first product image and put variation image first
            if (cachedVariation.images?.length > 0) {
              // Create a new array with variation image first (index 0), then original images except the first one
              const updatedImages = [
                cachedVariation.images[0],
                ...newImages.filter((_, index) => index !== 0)
              ];
              setAllProductImages(updatedImages);
              setSelectedImage(0); // Select the first image (variation image)
            }
            
            setIsLoadingVariation(false);
            return;
          }
        }
      }

      // If not found in cache, fetch from API
      for (const variationId of product.variations) {
        try {
          // Skip if already in cache
          if (variations[variationId]) continue;
          
          const variation = await getProduct(variationId);
          
          // Add to cache
          setVariations(prev => ({
            ...prev,
            [variationId]: variation
          }));
          
          const matchesSelectedAttributes = product.attributes?.every((attr) => {
            const selectedValue = selectedVariation[attr.name];
            const variationValue = variation.attributes?.find(
              // @ts-ignore
              (vAttr) => vAttr.name === attr.name)?.option;
            return selectedValue === variationValue;
          });

          if (matchesSelectedAttributes) {
            setVariationDetails(variation);
            
            // Create a new image array, starting with the variation image
            const newImages = [...allProductImages];
            
            // If variation has images, remove the first product image and put variation image first
            if (variation.images?.length > 0) {
              // Create a new array with variation image first (index 0), then original images except the first one
              const updatedImages = [
                variation.images[0],
                ...newImages.filter((_, index) => index !== 0)
              ];
              setAllProductImages(updatedImages);
              setSelectedImage(0); // Select the first image (variation image)
            }
            
            break;
          }
        } catch (error) {
          console.error('Failed to fetch variation:', error);
        }
      }
      
      setIsLoadingVariation(false);
    };
    
    if (product?.variations && Object.keys(selectedVariation).length > 0) {
      findMatchingVariation();
    }
  }, [selectedVariation, product, variations, allProductImages]);

  const handleVariationSelect = (attribute: string, value: string) => {
    setSelectedVariation((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Get custom swatch image or fallback to variation image
  const getSwatchImage = (option: string, productId: number) => {
    // First try to use custom swatch image
    if (CUSTOM_SWATCH_IMAGES[option]) {
      return CUSTOM_SWATCH_IMAGES[option];
    }

    
    // Default fallback (you might want to have a default placeholder)
    return '/images/placeholder.jpg';
  };

  if (!product) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const displayProduct = variationDetails || product;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Determine if reviews should be visible
  const showReviews = reviews.length > 0;
  const showBeFirstToReview = isAuthenticated && hasPurchased && !showReviews;
  
  // Get the current product images to display
  // We're now using allProductImages directly since we've already handled image replacement
  const displayImages = allProductImages;

  const productId = product.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="product-container"
    >
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}
      </div>

      <main className="product-main">
        {/* Product Image Section */}
        <div className="image-section">
          <div className="main-image-container">
            {displayImages.length > 0 ? (
              <Image
                src={displayImages[selectedImage].src}
                alt={displayImages[selectedImage].alt || displayProduct.name}
                className="main-image"
                width={500}
                height={500}
                priority
              />
            ) : (
              <div className="no-image">No image available</div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {displayImages.length > 1 && (
            <div className="thumbnail-gallery">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail-button ${selectedImage === index ? 'active' : ''}`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `Product view ${index + 1}`}
                    className="thumbnail-image"
                    width={100}
                    height={100}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="product-details">
          <h1 className="product-title">{displayProduct.name}</h1>

          {/* Average Rating and Number of Reviews */}
          {showReviews && (
            <div className="product-meta">
              <div className="rating">
                <span className="stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: i < Math.round(averageRating) ? '#ffd700' : '#ccc' }}>
                      ★
                    </span>
                  ))}
                </span>
                <span className="reviews">({reviews.length} Reviews)</span>
              </div>
            </div>
          )}

          {/* Price Section */}
          <div className="product-price">
            {displayProduct.price_html ? parse(displayProduct.price_html) : `$${displayProduct.price}`}
          </div>

          {/* Stock Status */}
          <div className="stock-status">
            <p className={displayProduct.stock_status === 'instock' ? 'in-stock' : 'out-of-stock'}>
              {displayProduct.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
            </p>
            {displayProduct.sku && <p className="sku">SKU: {displayProduct.sku}</p>}
          </div>

          {/* Variation Selector */}
          {product.type === 'variable' && product.attributes && (
            <div className="variation-selector">
              {product.attributes.map((attribute) => (
                <div key={attribute.id} className="attribute">
                  <h3>{attribute.name}</h3>
                  <div className="attribute-options">
                    {attribute.options.map((option) => {
                      // Get swatch image (custom or from variations)
                      const swatchImageSrc = getSwatchImage(option, productId);
                      
                      return (
                        <button
                          key={option}
                          className={`option-button ${
                            selectedVariation[attribute.name] === option ? 'selected' : ''
                          }`}
                          onClick={() => handleVariationSelect(attribute.name, option)}
                          title={option}
                        >
                          {swatchesLoaded ? (
                            <div className="variation-image-container">
                              <Image
                                src={swatchImageSrc}
                                alt={option}
                                width={60}
                                height={60}
                                className="variation-image"
                              />
                            </div>
                          ) : (
                            <div className="variation-fallback">{option}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading indicator during variation selection */}
          {isLoadingVariation && (
            <div className="variation-loading">
              <div className="loading-spinner small"></div>
              <span>Loading product...</span>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <button 
              className="button-one" 
              onClick={() => handleQuantityChange(-1)}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <input 
              type="number" 
              value={quantity} 
              readOnly 
              aria-label="Product quantity"
            />
            <button 
              className="button-two" 
              onClick={() => handleQuantityChange(1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <AddToCart product={displayProduct} quantity={quantity}/>
            <button 
              className="go-to-cart-button"
              onClick={openCart}
            >
              Go to Cart
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          {/* Product Description */}
          <div className="description-section">
            <h2 className="description-title">Description</h2>
            <div className="description-content">
              {product.description ? parse(product.description) : 'No description available.'}
            </div>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      {showReviews && <ReviewSection productId={product.id} reviews={reviews} />}
      {showBeFirstToReview && (
        <div className="be-first-to-review">
          <p>No reviews yet. Be the first to review this product!</p>
          <button
            className="add-review-button"
            onClick={() => router.push(`/products/${product.id}/review`)}
          >
            Add a Review
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetailPage;
