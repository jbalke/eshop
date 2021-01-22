export const getProducts = async () => {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('failed to get products from server');
  }
};

export const getProduct = (id) => async () => {
  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('unable to get product from server');
  }
};
