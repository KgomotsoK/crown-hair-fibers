import { useAuth } from '@/context/AuthContext';
import { createReview } from '@/utils/api';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface ReviewFormProps {
  productId: number;
  onSubmit: () => void;
}
const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const {user} = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user){
        await createReview({
            product_id: productId,
            rating,
            review: comment,
            reviewer: user.first_name +" "+ user.last_name,
            reviewer_email: user.email || "",
        });
        onSubmit();
    }
    else{
        router.push("/login");
    }
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value} ★
            </option>
          ))}
        </select>
      </label>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;