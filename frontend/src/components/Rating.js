import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function Rating({ value, text, color = '#f8e825', maxRating = 5 }) {
  const ratingStars = [];
  let stars = 0;

  for (; stars < Math.min(Math.floor(value), maxRating); stars++) {
    ratingStars.push(<FaStar />);
  }

  if (stars < maxRating && value % 1 >= 0.5) {
    ratingStars.push(<FaStarHalfAlt />);
    stars++;
  }

  for (; stars < maxRating; stars++) {
    ratingStars.push(<FaRegStar />);
  }

  return (
    <div className='rating inline'>
      <div className='inline-flex'>
        {ratingStars.map((star, index) => (
          <span key={index} style={{ color }} className='mr-0.5'>
            {star}
          </span>
        ))}
      </div>
      <span className='sr-only'>{`Rating: ${value} out of 5`}</span>
      {text && <span className='text-sm ml-1'>{text}</span>}
    </div>
  );
}

export default Rating;
