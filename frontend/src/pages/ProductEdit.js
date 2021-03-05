import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../api/ApiService';
import InputWarning from '../components/InputWarning';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { GBP } from '../config/currency';

const ProductEdit = () => {
  const { id } = useParams();

  const history = useHistory();

  const { isLoading, isError, error, data } = useQuery(
    ['product', id],
    ApiService.products.getProduct(id),
    {
      staleTime: 0,
    }
  );

  const { register, errors, handleSubmit, setValue, getValues } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: data.name,
      brand: data.brand,
      description: data.description,
      category: data.category,
      price: GBP(data.price),
      image: data.image,
      countInStock: data.countInStock,
    },
  });

  const queryClient = useQueryClient();

  const updateProductInfo = useMutation(ApiService.admin.updateProduct(id), {
    onSuccess: (data) => {
      toast.success('Product updated');
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 5000 });
    },
  });

  useEffect(() => {
    if (updateProductInfo.isSuccess) {
      history.goBack();
    }
  }, [updateProductInfo, history]);

  const uploadImageInfo = useMutation(ApiService.uploads.uploadImage, {
    onSuccess: (data) => {
      setValue('image', data);
    },
  });

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    uploadImageInfo.mutate(formData);
  };

  const onSubmit = (data) => {
    updateProductInfo.mutate({ ...data, price: data.price * 100 });
  };

  return (
    <div>
      <Meta title='E-Shop | Edit Product' />
      <button className='btn secondary' onClick={() => history.goBack()}>
        &larr; Go Back
      </button>
      <div className='w-screen md:max-w-md md:mx-auto'>
        <h1>Update Product</h1>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message type='danger'>{error.message}</Message>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <section>
              <label>
                Name
                <input
                  name='name'
                  type='text'
                  className='w-full'
                  ref={register({ required: 'Required' })}
                  aria-required
                />
              </label>
              {errors.name && <InputWarning message={errors.name.message} />}
            </section>
            <section>
              <label>
                Brand
                <input
                  name='brand'
                  type='text'
                  className='w-full'
                  ref={register({ required: 'Required' })}
                  aria-required
                />
              </label>
              {errors.brand && <InputWarning message={errors.brand.message} />}
            </section>
            <section>
              <label>
                Description
                <textarea
                  name='description'
                  rows='5'
                  className='w-full'
                  ref={register({ required: 'Required' })}
                  aria-required
                />
              </label>
              {errors.description && (
                <InputWarning message={errors.description.message} />
              )}
            </section>
            <section>
              <label>
                Category
                <input
                  name='category'
                  type='text'
                  className='w-full'
                  ref={register({ required: 'Required' })}
                  aria-required
                />
              </label>
              {errors.category && (
                <InputWarning message={errors.category.message} />
              )}
            </section>
            <section>
              <label>
                Price
                <input
                  name='price'
                  type='number'
                  step='0.01'
                  min='0'
                  className='w-full'
                  ref={register({
                    required: 'Required',
                    min: { value: 0, message: 'Must be greater than zero' },
                  })}
                  aria-required
                />
              </label>
              {errors.price && <InputWarning message={errors.price.message} />}
            </section>
            <section>
              <label>
                Qty
                <input
                  name='countInStock'
                  type='number'
                  min='0'
                  className='w-full'
                  ref={register({
                    required: 'Required',
                    min: { value: 0, message: 'Must be greater than zero' },
                  })}
                  aria-required
                />
              </label>
              {errors.countInStock && (
                <InputWarning message={errors.countInStock.message} />
              )}
            </section>
            <section>
              <label>
                Image
                <input
                  name='image'
                  type='text'
                  className='w-full'
                  ref={register({ required: 'Required' })}
                  readOnly
                  aria-required
                />
                {errors.image && (
                  <InputWarning message={errors.image.message} />
                )}
                <input
                  type='file'
                  accept='.jpg,.jpeg,.png,image/jpeg,image/png'
                  className='w-full mt-1'
                  onChange={uploadFileHandler}
                />
              </label>
              {uploadImageInfo.isLoading ? (
                <Loader />
              ) : (
                <img
                  src={getValues('image')}
                  alt={getValues('image')}
                  className='border shadow-md mt-1'
                />
              )}
            </section>
            {uploadImageInfo.isError && (
              <section>
                <Message type='danger'>{uploadImageInfo.error.message}</Message>
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
