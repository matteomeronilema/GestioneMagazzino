import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import sampleProducts from '../data/sampleProducts';
import { ROLES, ROLE_PERMISSIONS, PERMISSIONS } from '../utils/roles';
import api from '../utils/api';

const AppContext = createContext();

const initialState = {
  user: null,
  products: [],
  filteredProducts: [],
  reservations: [],
  filteredReservations: [],
  recuperatedProducts: [],
  redazionaliProducts: [],
  soldProducts: [],
  currentPage: 'inventario',
  searchTerm: '',
  redazionaliSearchTerm: '',
  recuperatiSearchTerm: '',
  vendutiSearchTerm: '',
  locationFilter: '',
  error: null,
};

function appReducer(state, action) {
  console.log('Reducer action:', action.type, action.payload);
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, filteredProducts: action.payload };
    case 'SET_FILTERED_PRODUCTS':
      return { ...state, filteredProducts: action.payload };
    case 'SET_RESERVATIONS':
      return { ...state, reservations: action.payload, filteredReservations: action.payload };
    case 'SET_FILTERED_RESERVATIONS':
      return { ...state, filteredReservations: action.payload };
    case 'SET_RECUPERATED_PRODUCTS':
      return { ...state, recuperatedProducts: action.payload };
    case 'SET_REDAZIONALI_PRODUCTS':
      return { ...state, redazionaliProducts: action.payload };
    case 'SET_SOLD_PRODUCTS':
      return { ...state, soldProducts: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_REDAZIONALI_SEARCH_TERM':
      return { ...state, redazionaliSearchTerm: action.payload };
    case 'SET_RECUPERATI_SEARCH_TERM':
      return { ...state, recuperatiSearchTerm: action.payload };
    case 'SET_VENDUTI_SEARCH_TERM':
      return { ...state, vendutiSearchTerm: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOCATION_FILTER':
      return { ...state, locationFilter: action.payload };
    case 'ACCEPT_RESERVATION':
      const acceptedReservation = action.payload.reservation;
      let updatedProducts, updatedCategory;
      
      if (acceptedReservation.reason === 'Vendita') {
        updatedCategory = [...state.soldProducts, acceptedReservation];
      } else if (acceptedReservation.reason === 'Conto Visione') {
        updatedCategory = [...state.redazionaliProducts, acceptedReservation];
      } else {
        updatedCategory = [...state.recuperatedProducts, acceptedReservation];
      }
      
      updatedProducts = state.products.map(p => 
        p.id === acceptedReservation.productId 
          ? { ...p, quantity: p.quantity - acceptedReservation.reservedQuantity }
          : p
      );
      
      return {
        ...state,
        reservations: state.reservations.filter(r => r.id !== action.payload.id),
        filteredReservations: state.filteredReservations.filter(r => r.id !== action.payload.id),
        products: updatedProducts,
        [acceptedReservation.reason === 'Vendita' ? 'soldProducts' : 
         acceptedReservation.reason === 'Conto Visione' ? 'redazionaliProducts' : 
         'recuperatedProducts']: updatedCategory
      };
    
    case 'REJECT_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(r =>
          r.id === action.payload.id ? { ...r, status: 'rejected' } : r
        ),
        filteredReservations: state.filteredReservations.map(r =>
          r.id === action.payload.id ? { ...r, status: 'rejected' } : r
        ),
      };
    case 'FILTER_PRODUCTS':
      const { products, searchTerm, locationFilter } = action.payload;
      const filtered = products.filter(product =>
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (locationFilter === '' || product.location === locationFilter)
      );
      return { ...state, filteredProducts: filtered };
    case 'FILTER_RESERVATIONS':
      const { reservations, reservationSearchTerm } = action.payload;
      const filteredReservations = reservations.filter(reservation =>
        reservation.productName.toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
        reservation.customerName.toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
        reservation.reason.toLowerCase().includes(reservationSearchTerm.toLowerCase())
      );
      return { ...state, filteredReservations };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const productsToUse = savedProducts ? JSON.parse(savedProducts) : sampleProducts;
    dispatch({ type: 'SET_PRODUCTS', payload: productsToUse });
    
    const savedReservations = localStorage.getItem('reservations');
    const savedRecuperatedProducts = localStorage.getItem('recuperatedProducts');
    const savedRedazionali = localStorage.getItem('redazionaliProducts');
    const savedSoldProducts = localStorage.getItem('soldProducts');

    dispatch({ type: 'SET_RESERVATIONS', payload: savedReservations ? JSON.parse(savedReservations) : [] });
    dispatch({ type: 'SET_RECUPERATED_PRODUCTS', payload: savedRecuperatedProducts ? JSON.parse(savedRecuperatedProducts) : [] });
    dispatch({ type: 'SET_REDAZIONALI_PRODUCTS', payload: savedRedazionali ? JSON.parse(savedRedazionali) : [] });
    dispatch({ type: 'SET_SOLD_PRODUCTS', payload: savedSoldProducts ? JSON.parse(savedSoldProducts) : [] });

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(state.products));
    localStorage.setItem('reservations', JSON.stringify(state.reservations));
    localStorage.setItem('recuperatedProducts', JSON.stringify(state.recuperatedProducts));
    localStorage.setItem('redazionaliProducts', JSON.stringify(state.redazionaliProducts));
    localStorage.setItem('soldProducts', JSON.stringify(state.soldProducts));
    
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.products, state.reservations, state.recuperatedProducts, state.redazionaliProducts, state.soldProducts, state.user]);

  const filterProducts = useCallback((products, searchTerm, locationFilter) => {
    dispatch({ type: 'FILTER_PRODUCTS', payload: { products, searchTerm, locationFilter } });
  }, []);

  const filterReservations = useCallback((reservations, searchTerm) => {
    dispatch({ type: 'FILTER_RESERVATIONS', payload: { reservations, reservationSearchTerm: searchTerm } });
  }, []);

  useEffect(() => {
    filterProducts(state.products, state.searchTerm, state.locationFilter);
  }, [state.products, state.searchTerm, state.locationFilter, filterProducts]);

  useEffect(() => {
    filterReservations(state.reservations, state.searchTerm);
  }, [state.reservations, state.searchTerm, filterReservations]);

  const checkPermission = useCallback((permission) => {
    if (!state.user) return false;
    if (state.user.role === ROLES.ADMIN) return true;
    const hasPermission = ROLE_PERMISSIONS[state.user.role]?.includes(permission) || false;
    console.log(`Checking permission: ${permission}, Result: ${hasPermission}`);
    return hasPermission;
  }, [state.user]);

  const hasRole = useCallback((role) => {
    return state.user && state.user.role === role;
  }, [state.user]);

  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await api.post('/refresh-token', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        dispatch({ type: 'SET_USER', payload: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    return null;
  }, [dispatch]);

  const login = useCallback(async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      const { user, accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('User logged in:', user);
      console.log('User permissions:', ROLE_PERMISSIONS[user.role]);
      dispatch({ type: 'SET_USER', payload: user });
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'SET_USER', payload: null });
  }, [dispatch]);

  console.log('Current AppContext state:', state);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      filterProducts, 
      filterReservations,
      checkPermission,
      hasRole,
      refreshToken,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}