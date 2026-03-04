const BASE_URL = 'https://69949106fade7a9ec0f5c1ca.mockapi.io/elbordo/api';

// pruductos
export const getProductos = () =>
  fetch(`${BASE_URL}/products`).then(res => {
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  });

export const getProductoById = (id) =>
  fetch(`${BASE_URL}/products/${id}`).then(res => {
    if (!res.ok) throw new Error('Producto no encontrado');
    return res.json();
  });

export const createProducto = (data) =>
  fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
  }).then(res => {
    if (!res.ok) throw new Error('Error al crear producto');
    return res.json();
  });

export const updateProducto = (id, data) =>
  fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => {
    if (!res.ok) throw new Error('Error al actualizar producto');
    return res.json();
  });

export const deleteProducto = (id) =>
  fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
  }).then(res => {
    if (!res.ok) throw new Error('Error al eliminar producto');
    return res.json();
  });

// ussers
export const getUsuarios = () =>
  fetch(`${BASE_URL}/user`).then(res => {
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return res.json();
  });

export const createUsuario = (data) =>
  fetch(`${BASE_URL}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => {
    if (!res.ok) throw new Error('Error al crear usuario');
    return res.json();
  });

export const updateUsuario = (id, data) =>
  fetch(`${BASE_URL}/user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => {
    if (!res.ok) throw new Error('Error al actualizar usuario');
    return res.json();
  });

export const deleteUsuario = (id) =>
  fetch(`${BASE_URL}/user/${id}`, {
    method: 'DELETE',
  }).then(res => {
    if (!res.ok) throw new Error('Error al eliminar usuario');
    return res.json();
  });
