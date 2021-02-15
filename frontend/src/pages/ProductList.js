import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useModal } from '../hooks/useModal';

const ProductList = () => {
  const modalRoot = document.getElementById('modal');
  const {
    Modal,
    setShowModal,
    isActionConfirmed,
    setIsActionConfirmed,
  } = useModal(modalRoot);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const { isLoading, data, isError, error } = useQuery(
    'products',
    ApiService.products.getProducts
  );

  return (
    <>
      <Modal>
        <span>
          Are you sure you want to <strong>DELETE</strong>{' '}
          {selectedProduct?.name}?
        </span>
      </Modal>
      <div>
        <h1>Products</h1>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message type='danger'>{error.message}</Message>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr>
                  <td>
                    <Link to={`/admin/product/${product._id}`}>
                      {product._id}
                    </Link>
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td className='flex items-center justify-around'>
                    <Link
                      to={`/admin/product/${product._id}`}
                      className='btn primary'
                      title='Edit'
                    >
                      <FaEdit fill='white' />
                    </Link>
                    <button
                      type='button'
                      className='btn primary'
                      title='Delete'
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowModal(true);
                      }}
                    >
                      <FaTrash fill='white' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ProductList;
