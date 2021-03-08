import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ApiService from '../api/ApiService';
import Loader from './Loader';
import Message from './Message';
import { GBP } from '../config/currency';
import './ProductCarousel.css';

const ProductCarousel = () => {
  const { isLoading, data, isError, error } = useQuery(
    'topProducts',
    ApiService.products.getTopProducts
  );

  const settings = {
    dots: false,
    fade: false,
    autoplay: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message type='danger'>{error.message}</Message>
  ) : (
    <Slider {...settings}>
      {data?.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className='carousel'
        >
          <img src={product.image} alt={product.name} />
          <h2>
            <span>
              {product.brand} {product.name}
            </span>
            <br />
            <span>{`${GBP(product.price).format()}`}</span>
          </h2>
        </Link>
      ))}
    </Slider>
  );
};

export default ProductCarousel;
