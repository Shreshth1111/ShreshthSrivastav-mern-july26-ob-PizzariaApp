import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

/*
 * Helper: returns Authorization header with JWT token from localStorage.
 * This is attached to protected API calls so the server can verify the user.
 */
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('pizzeria_token')}` }
});

/* Pizza endpoints */
export const getPizzas      = ()     => axios.get(`${BASE_URL}/pizzas`);

/* Ingredient endpoints */
export const getIngredients = ()     => axios.get(`${BASE_URL}/ingredients`);

/* Cart endpoints */
export const getCartItems   = ()     => axios.get(`${BASE_URL}/cart`);
export const addToCart      = (item) => axios.post(`${BASE_URL}/cart`, item);
export const updateCartItem = (id, quantity) => axios.put(`${BASE_URL}/cart/${id}`, { quantity });
export const deleteCartItem = (id)   => axios.delete(`${BASE_URL}/cart/${id}`);

/* Auth endpoints */
export const registerUser   = (data) => axios.post(`${BASE_URL}/auth/register`, data);
export const loginUser      = (data) => axios.post(`${BASE_URL}/auth/login`, data);
