import axios from 'axios';
import { CART_ADD_ITEM } from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  //TODO: handle invalid product id
  const {
    data: { _id, name, image, price, countInStock },
  } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: _id,
      name,
      image,
      price,
      countInStock,
      qty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// export const removeFromCart = (id) => {
//   disp;
// };
