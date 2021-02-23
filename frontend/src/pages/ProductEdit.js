import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductEdit = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');

  const history = useHistory();

  const { isLoading, isError, error } = useQuery(
    ['product', id],
    ApiService.products.getProduct(id),
    {
      onSuccess: (data) => {
        setName(data.name);
        setDescription(data.description);
        setBrand(data.brand);
        setPrice(data.price);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setImage(data.image);
      },
      staleTime: 0,
    }
  );

  const queryClient = useQueryClient();

  const updateProductInfo = useMutation(ApiService.admin.updateProduct(id), {
    onSuccess: (data) => {
      toast.success('Product updated');
      queryClient.setQueryData('products', (oldData) =>
        oldData.map((product) => (product._id === data._id ? data : product))
      );
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 5000 });
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();

    updateProductInfo.mutate({
      name,
      description,
      brand,
      price,
      category,
      countInStock,
      image,
    });
  };

  useEffect(() => {
    if (updateProductInfo.isSuccess) {
      history.push(`/admin/product-list`);
    }
  }, [updateProductInfo, history]);

  const uploadFileHandler = async (e) => {
    //TODO: switch to useMutation?
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append('image', file);
    setUploadErrorMessage('');
    setUploading(true);

    try {
      const data = await ApiService.uploads.uploadImage(formData);

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      setUploadErrorMessage(error.message);
    }
  };

  return (
    <div>
      <Link to={`/admin/product-list`} className='btn secondary'>
        &larr; Go Back
      </Link>
      <div className='w-screen md:max-w-md md:mx-auto'>
        <h1>Update Product</h1>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message type='danger'>{error.message}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            <section>
              <label>
                Name
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </section>
            <section>
              <label>
                Brand
                <input
                  type='text'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </label>
            </section>
            <section>
              <label>
                Description
                <textarea
                  rows='5'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>
            </section>
            <section>
              <label>
                Category
                <input
                  type='text'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </label>
            </section>
            <section>
              <label>
                Price
                <input
                  type='number'
                  step='0.01'
                  min='0'
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </label>
            </section>
            <section>
              <label>
                Qty
                <input
                  type='number'
                  min='0'
                  value={countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                  required
                />
              </label>
            </section>
            <section>
              <label>
                Image
                <input
                  type='text'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <input
                  type='file'
                  accept='.jpg,.jpeg,.png,image/jpeg,image/png'
                  onChange={uploadFileHandler}
                />
              </label>
              {uploading && <Loader />}
            </section>
            {uploadErrorMessage && (
              <section>
                <Message type='danger'>{uploadErrorMessage}</Message>
              </section>
            )}
            <section>
              <button type='submit' className='btn primary'>
                Update
              </button>
              <Link to={`/admin/product-list`} className='btn secondary ml-4'>
                Cancel
              </Link>
            </section>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;
