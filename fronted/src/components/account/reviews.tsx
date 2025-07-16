'use client';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import "../../styles/productioncard.css";
import { hasUserPurchasedProduct } from '../../utils/api';
import { WooCommerceReview } from '../../utils/types';
interface ReviewSectionProps {
  productId: number;
  reviews: WooCommerceReview[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, reviews }) => {
  const { user, isAuthenticated } = useAuth();
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const checkPurchase = async () => {
        const hasPurchased = await hasUserPurchasedProduct(user.id, productId);
        setCanReview(hasPurchased);
      };
      checkPurchase();
    }
  }, [isAuthenticated, user, productId]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
      : 0;

  // Determine if reviews should be visible
  const showReviews = reviews.length > 0;
  const showBeFirstToReview = isAuthenticated && canReview && !showReviews;

  return (
    <>
    {showReviews &&
      (<section className="reviews-section">
        <h2>Customer Reviews</h2>
  
        {/* Average Rating and Number of Reviews */}
        {showReviews && (
          <div className="average-rating">
            <span>★ {averageRating.toFixed(1)}</span>
            <span>({reviews.length} reviews)</span>
          </div>
        )}
  
        {/* Reviews List */}
        {showReviews && (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review">
                <p className="review-comment">{review.review}</p>
                <div className="review-meta">
                  <span className="review-rating">Rating: {review.rating} ★</span>
                  <span className="review-author">
                    By {review.reviewer} on {new Date(review.date_created).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
  
        {/* Be the First to Review */}
        {showBeFirstToReview && (
          <div className="be-first-to-review">
            <p>No reviews yet. Be the first to review this product!</p>
            <button
              className="add-review-button"
              onClick={() => router.push(`/products/${productId}/review`)}
            >
              Add a Review
            </button>
          </div>
        )}
      </section>)
    }
    </>
  );
};

export default ReviewSection;
