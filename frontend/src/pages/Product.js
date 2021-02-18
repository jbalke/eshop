import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductDetail from '../components/ProductDetail';
import Rating from '../components/Rating';
import { useUserProfile } from '../hooks/userQueries';
import { getDate } from '../utils/dates';
import { ScrollToTop } from '../utils/scroll';

function Product() {
  const { id } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const queryClient = useQueryClient();

  const userProfile = useUserProfile();

  const reviewInfo = useMutation(ApiService.products.reviewProduct(id), {
    onSuccess: () => {
      toast.success('Review added');
      queryClient.invalidateQueries(['product', id]);
      setRating(0);
      setComment('');
    },
  });

  const { isError, error, data, isLoading } = useQuery(
    ['product', id],
    ApiService.products.getProduct(id),
    {
      initialData: () =>
        queryClient
          .getQueryData('products')
          ?.find((product) => product._id === id),
    }
  );

  const submitHandler = (e) => {
    e.preventDefault();
    reviewInfo.reset();
    reviewInfo.mutate({ rating, comment });
  };

  return (
    <>
      <ScrollToTop />
      <Link className='btn secondary mb-2' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <>
          <ProductDetail {...data} />
          <div className='flex flex-col md:flex-row mt-4'>
            <section className='w-full md:w-1/2'>
              <h2>Reviews</h2>
              {!data.reviews?.length ? (
                <Message>No reviews</Message>
              ) : (
                <ul className='divide-y'>
                  {data.reviews.map((review) => (
                    <li key={review._id} className=''>
                      <p className=''>
                        <Rating value={review.rating} />
                        <span className='ml-2 font-bold'>
                          {review.user.name}
                        </span>
                        <span className='text-xs ml-2'>
                          {getDate(review.createdAt)}
                        </span>
                      </p>
                      <p>{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className='w-full md:w-1/2 mt-4 md:mt-2 md:ml-4'>
              <h3>Write a customer review</h3>
              {userProfile.data?.user ? (
                <form onSubmit={submitHandler}>
                  <section>
                    <label>
                      Rating
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className='ml-2'
                      >
                        <option value=''>Select...</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very Good</option>
                        <option value='5'>5 - Excellent</option>)
                      </select>
                    </label>
                  </section>
                  <section>
                    <label>
                      Comment
                      <textarea
                        row='3'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                  </section>
                  <section>
                    <button type='submit' className='btn primary'>
                      Submit
                    </button>
                  </section>
                  {reviewInfo.isError && (
                    <Message type='danger'>{reviewInfo.error.message}</Message>
                  )}
                </form>
              ) : (
                <Message>
                  Please{' '}
                  <Link to='/login' className='underline'>
                    sign in
                  </Link>{' '}
                  to write a review
                </Message>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}

export default Product;
