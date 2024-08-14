import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

export function useProductManagement() {
  const { state, dispatch } = useAppContext();
  const { products } = state;

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Date.now(), // o usa uuid se preferisci
      visible: product.quantity > 0,
      state: product.state || 'Nuovo',
      isPrototype: !!product.isPrototype,
      isForShowroom: !!product.isForShowroom
    };
    dispatch({ type: 'SET_PRODUCTS', payload: [...products, newProduct] });
  }, [products, dispatch]);

  const editProduct = useCallback((editedProduct) => {
    dispatch({ type: 'SET_PRODUCTS', payload: products.map(product => 
      product.id === editedProduct.id ? {
        ...editedProduct,
        visible: editedProduct.quantity > 0,
        price: Number(editedProduct.price),
        quantity: Number(editedProduct.quantity),
        state: editedProduct.state || 'Nuovo',
        isPrototype: !!editedProduct.isPrototype,
        isForShowroom: !!editedProduct.isForShowroom
      } : product
    )});
  }, [products, dispatch]);

  const deleteProduct = useCallback((productId) => {
    dispatch({ type: 'SET_PRODUCTS', payload: products.filter(product => product.id !== productId) });
  }, [products, dispatch]);

  return { addProduct, editProduct, deleteProduct };
}

export function useReservationManagement() {
  const { dispatch } = useAppContext();

  const acceptReservation = useCallback((reservation) => {
    dispatch({ 
      type: 'ACCEPT_RESERVATION', 
      payload: { 
        id: reservation.id, 
        reservation: {
          ...reservation,
          status: reservation.reason === 'Conto Visione' ? 'In Conto Visione' : 
                  reservation.reason === 'Vendita' ? 'Venduto' : 'Recuperato',
          dateAccepted: reservation.reason !== 'Vendita' ? new Date().toISOString() : undefined,
          dateSold: reservation.reason === 'Vendita' ? new Date().toISOString() : undefined,
          dateRecuperated: reservation.reason !== 'Conto Visione' && reservation.reason !== 'Vendita' ? new Date().toISOString() : undefined
        } 
      } 
    });
  }, [dispatch]);

  const rejectReservation = useCallback((reservation) => {
    dispatch({ 
      type: 'REJECT_RESERVATION', 
      payload: { id: reservation.id } 
    });
  }, [dispatch]);

  return { acceptReservation, rejectReservation };
}