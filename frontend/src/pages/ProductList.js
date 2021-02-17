import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useModal } from '../hooks/useModal';
import { toast } from 'react-toastify';

const ProductList = () => {
  const modalRoot = document.getElementById('modal');
  const {
    Modal,
    setShowModal,
    isActionConfirmed,
    setIsActionConfirmed,
  } = useModal(modalRoot);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const history = useHistory();
  const queryClient = useQueryClient();

  const { isLoading, data, isError, error } = useQuery(
    'products',
    ApiService.products.getProducts
  );

  const deleteProductInfo = useMutation(ApiService.admin.deleteProduct, {
    onSuccess: (data) => {
      toast.success(`${selectedProduct.name} deleted`);
      queryClient.setQueryData('products', (oldData) =>
        oldData.filter((product) => product._id !== data._id)
      );
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 5000 });
    },
  });

  const createProductInfo = useMutation(ApiService.admin.createProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData('products', (oldData) => [...oldData, data]);
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 5000 });
    },
  });

  useEffect(() => {
    if (isActionConfirmed) {
      setIsActionConfirmed(false);
      deleteProductInfo.mutate({ id: selectedProduct._id });
    }
  }, [
    deleteProductInfo,
    selectedProduct,
    isActionConfirmed,
    setIsActionConfirmed,
  ]);

  useEffect(() => {
    if (createProductInfo.isSuccess) {
      history.push(`/admin/product/${createProductInfo.data._id}/edit`);
    }
  }, [createProductInfo, history]);

  return (
    <>
      <Modal>
        <span>
          Are you sure you want to <strong>DELETE</strong>{' '}
          {selectedProduct?.name}?
        </span>
      </Modal>
      <div>
        <div className='flex justify-between items-center'>
          <h1>Products</h1>
          <Link
            className='btn primary'
            onClick={() => createProductInfo.mutate()}
          >
            New Product
          </Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message type='danger'>{error.message}</Message>
        ) : (
          <table className='product-list'>
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
                <tr key={product._id}>
                  <td>
                    <Link to={`/admin/product/${product._id}`}>
                      {product._id}
                    </Link>
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td className='flex items-center justify-around'>
                    <Link
                      to={`/admin/product/${product._id}/edit`}
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
