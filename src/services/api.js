const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// helpers
const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const handleRes = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Error en la petición');
  }
  return res.json();
};

// auth
export const loginUsuario = (email, password) =>
  fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleRes);

// products 
export const getProductos = () =>
  fetch(`${BASE_URL}/products`).then(handleRes);

export const getProductoById = (id) =>
  fetch(`${BASE_URL}/products/${id}`).then(handleRes);

export const createProducto = (formData, token) =>
  fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData, // FormData para subir imagen
  }).then(handleRes);

export const updateProducto = (id, formData, token) =>
  fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(handleRes);

export const deleteProducto = (id, token) =>
  fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  }).then(handleRes);

//  ussers 
export const getUsuarios = (token) =>
  fetch(`${BASE_URL}/users`, {
    headers: authHeaders(token),
  }).then(handleRes);

export const createUsuario = (formData) =>
  fetch(`${BASE_URL}/users`, {
    method: 'POST',
    body: formData,
  }).then(handleRes);

export const updateUsuario = (id, formData, token) =>
  fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(handleRes);

export const deleteUsuario = (id, token) =>
  fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  }).then(handleRes);

// ordenes 
export const createOrder = (orderData, token) =>
  fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(orderData),
  }).then(handleRes);

export const getOrders = (token) =>
  fetch(`${BASE_URL}/orders`, {
    headers: authHeaders(token),
  }).then(handleRes);
