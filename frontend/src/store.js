import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { cartReducer } from './reducers/cartReducers';

const reducer = combineReducers({
  cart: cartReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems');
const parsedCartItems = cartItemsFromStorage
  ? JSON.parse(cartItemsFromStorage)
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress');
const parsedShippingAddress = shippingAddressFromStorage
  ? JSON.parse(shippingAddressFromStorage)
  : {};

const initialState = {
  cart: { cartItems: parsedCartItems, shippingAddress: parsedShippingAddress },
};
const middleware = [reduxThunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
