import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useModal } from '../hooks/useModal';
import { toast } from 'react-toastify';
import Paginate from '../components/Paginate';
import ItemLimit from '../components/ItemLimit';
import Meta from '../components/Meta';

const ProductList = () => {
  const [limit, setLimit] = useState(25);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const queryClient = useQueryClient();
  const location = useLocation();

  const queryString = new URLSearchParams(location.search);

  const queryPage = Number(queryString.get('page')) || 1;
  const pageNumber = Number.isNaN(queryPage) ? 1 : queryPage;

  const queryKeyword = queryString.get('keyword') || '';
  const queryLimit = queryString.get('limit') || limit;

  const [page, setPage] = useState(pageNumber);
  const [keyword, setKeyword] = useState(queryKeyword);

  const modalRoot = document.getElementById('modal');
  const {
    Modal,
    setShowModal,
    isActionConfirmed,
    setIsActionConfirmed,
  } = useModal(modalRoot);

  const history = useHistory();

  const createProductInfo = useMutation(ApiService.admin.createProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['products', { keyword, page, limit }],
        (oldData) => ({ ...oldData, products: [...oldData.products, data] })
      );
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 5000 });
    },
  });

  const {
    isLoading,
    data,
    isError,
    error,
    isFetching,
    isPreviousData,
  } = useQuery(
    ['products', { keyword, page, limit }],
    ApiService.products.getProducts,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 0,
      onSuccess: (data) => {
        data.products?.forEach((product) =>
          queryClient.setQueryData(['product', product._id], () => product)
        );
      },
    }
  );

  const deleteProductInfo = useMutation(ApiService.admin.deleteProduct, {
    onSuccess: (data) => {
      toast.success(`${selectedProduct.name} deleted`);
      queryClient.setQueryData(
        ['products', { keyword, page, limit }],
        (oldData) => ({
          ...oldData,
          products: oldData.products.filter(
            (product) => product._id !== data._id
          ),
        })
      );
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

  useEffect(() => {
    setPage(pageNumber);
    setKeyword(queryKeyword);
    setLimit(queryLimit);
  }, [pageNumber, queryKeyword, queryLimit, setLimit]);

  return (
    <div className='flex-grow flex flex-col justify-between'>
      <Meta title='E-Shop | Product List' />
      <div>
        <Modal>
          <span>
            Are you sure you want to <strong>DELETE</strong>{' '}
            {selectedProduct?.name}?
          </span>
        </Modal>
        <div>
          <div className='flex justify-between items-center'>
            <h1>Products {isFetching && <span>...</span>}</h1>
            <button
              className='btn primary'
              onClick={() => createProductInfo.mutate()}
            >
              New Product
            </button>
          </div>
          <ItemLimit limit={limit} step={25} />
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message type='danger'>{error.message}</Message>
          ) : data.products?.length ? (
            <div className='overflow-x-scroll md:overflow-x-auto'>
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
                  {data.products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <Link to={`/product/${product._id}`}>
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
            </div>
          ) : (
            <Message>No products found</Message>
          )}
        </div>
      </div>
      <div className='mt-4 w-1/2 mx-auto'>
        <Paginate
          pages={data?.pages}
          page={page}
          isPreviousData={isPreviousData}
        />
      </div>
    </div>
  );
};

export default ProductList;
