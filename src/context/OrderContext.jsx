import React, { createContext, useContext, useState } from 'react';
import { createOrder as apiCreateOrder, getOrders } from '../services/api';
import { useAuth } from './AuthContext';
import Toast from '../components/Toast';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [order, setOrder] = useState([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const { token, isLoggedIn } = useAuth();

  const addItemToCart = (producto) => {
    // Mostrar toast solo si no está logueado, solo la primera vez por sesión
    if (!isLoggedIn && !sessionStorage.getItem('elbordo_toast_shown')) {
      setShowToast(true);
      sessionStorage.setItem('elbordo_toast_shown', 'true');
    }

    setOrder((prev) => {
      const exists = prev.find((item) => item._id === producto._id);
      let newOrder;
      if (exists) {
        newOrder = prev.map((item) =>
          item._id === producto._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newOrder = [...prev, { ...producto, quantity: 1 }];
      }
      const newCount = newOrder.reduce((acc, item) => acc + item.quantity, 0);
      const newTotal = newOrder.reduce((acc, item) => acc + item.quantity * item.precio, 0);
      setCount(newCount);
      setTotal(newTotal);
      return newOrder;
    });
  };

  const clearCart = () => { setOrder([]); setCount(0); setTotal(0); };

  const createOrder = async () => {
    if (order.length === 0) throw new Error('El carrito está vacío');
    if (!token) throw new Error('Debés iniciar sesión para crear una orden');

    const orderData = {
      totalPrice: total,
      products: order.map((item) => ({
        product: item._id,
        nombre: item.nombre,
        precio: item.precio,
        imagen: item.imagen,
        quantity: item.quantity,
      })),
    };

    const newOrder = await apiCreateOrder(orderData, token);

    try {
      const allOrders = await getOrders(token);
      console.log('📦 Todas las órdenes:', allOrders);
    } catch (err) {
      console.warn('No se pudieron obtener las órdenes:', err.message);
    }

    clearCart();
    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ order, count, total, addItemToCart, clearCart, createOrder }}>
      {children}
      <Toast
        visible={showToast}
        mensaje='Recordá crear un usuario en "El Bordo" para poder disfrutar de nuestros productos y nuestras ofertas 🎸'
        onClose={() => setShowToast(false)}
        duracion={6000}
      />
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
