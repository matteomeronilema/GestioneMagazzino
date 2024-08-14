import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import UserManagement from './pages/UserManagement/UserManagement';
import Sidebar from './components/Sidebar/Sidebar';
import Inventario from './pages/Inventario/Inventario';
import Prenotazioni from './pages/Prenotazioni/Prenotazioni';
import Recuperati from './pages/Recuperati/Recuperati';
import Login from './components/Login/Login';
import ReserveProductForm from './components/ReserveProductForm/ReserveProductForm';
import Dashboard from './components/Dashboard/Dashboard';
import Redazionali from './pages/Redazionali/Redazionali';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Venduti from './pages/Venduti/Venduti';
import Toast from './components/Toast/Toast';
import api from './utils/api';
import Reportistica from './pages/Reportistica/Reportistica';
import { useAppContext } from './context/AppContext';
import { useProductManagement, useReservationManagement } from './hooks/useProductManagement';
import { PERMISSIONS } from './utils/roles';
import './App.css';

function App() {
  const { state, dispatch, checkPermission } = useAppContext();
  const { user, products, filteredProducts, reservations, recuperatedProducts, redazionaliProducts, currentPage, error } = state;
  const { addProduct, editProduct, deleteProduct } = useProductManagement();
  const { acceptReservation, rejectReservation } = useReservationManagement();

  const [isAddProductFormVisible, setIsAddProductFormVisible] = useState(false);
  const [isEditProductFormVisible, setIsEditProductFormVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isReserveProductFormVisible, setIsReserveProductFormVisible] = useState(false);
  const [productToReserve, setProductToReserve] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/verify-token')
        .then(response => {
          dispatch({ type: 'SET_USER', payload: response.data.user });
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);

  const handleLogin = useCallback((username, role, permissions) => {
    dispatch({ type: 'SET_USER', payload: { username, role, permissions } });
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    api.post('/logout')
      .then(() => {
        localStorage.removeItem('token');
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 'inventario' });
      })
      .catch(error => {
        console.error('Logout failed', error);
      });
  }, [dispatch]);

  const handleAddProductClick = useCallback(() => {
    if (checkPermission(PERMISSIONS.EDIT_INVENTORY)) {
      setIsAddProductFormVisible(true);
    } else {
      dispatch({ type: 'SET_ERROR', payload: { message: 'Non hai i permessi per aggiungere prodotti.' } });
    }
  }, [checkPermission, dispatch]);

  const handleDeleteProduct = useCallback((productId) => {
    if (checkPermission(PERMISSIONS.EDIT_INVENTORY)) {
      deleteProduct(productId);
    } else {
      dispatch({ type: 'SET_ERROR', payload: { message: 'Non hai i permessi per eliminare i prodotti.' } });
    }
  }, [checkPermission, deleteProduct, dispatch]);

  const resetApp = useCallback(() => {
    if (checkPermission(PERMISSIONS.MANAGE_USERS)) {
      localStorage.removeItem('products');
      localStorage.removeItem('reservations');
      localStorage.removeItem('recuperatedProducts');
      localStorage.removeItem('redazionaliProducts');
      localStorage.removeItem('soldProducts');
      window.location.reload();
    } else {
      dispatch({ type: 'SET_ERROR', payload: { message: 'Non hai i permessi per resettare l\'applicazione.' } });
    }
  }, [checkPermission, dispatch]);

  const handleSearch = useCallback((term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, [dispatch]);

  const handleEditProduct = useCallback((productToEdit) => {
    if (checkPermission(PERMISSIONS.EDIT_INVENTORY)) {
      setProductToEdit(productToEdit);
      setIsEditProductFormVisible(true);
    } else {
      dispatch({ type: 'SET_ERROR', payload: { message: 'Non hai i permessi per modificare i prodotti.' } });
    }
  }, [checkPermission, dispatch]);

  const handleReserveProduct = useCallback((product) => {
    console.log('handleReserveProduct chiamata con:', product);
    if (checkPermission(PERMISSIONS.RESERVE_PRODUCT)) {
      console.log('Permesso di prenotazione verificato');
      setProductToReserve(product);
      setIsReserveProductFormVisible(true);
      console.log('Form di prenotazione impostato come visibile');
    } else {
      console.log('Permesso di prenotazione negato');
      dispatch({ type: 'SET_ERROR', payload: { message: 'Non hai i permessi per prenotare i prodotti.' } });
    }
  }, [checkPermission, dispatch]);

  const handleCloseForm = useCallback(() => {
    setIsAddProductFormVisible(false);
    setIsEditProductFormVisible(false);
    setProductToEdit(null);
  }, []);

  const handleProductReturn = useCallback((returnedProduct) => {
    if (checkPermission(PERMISSIONS.EDIT_INVENTORY)) {
      dispatch({ type: 'SET_REDAZIONALI_PRODUCTS', payload: redazionaliProducts.filter(product => product.id !== returnedProduct.id) });
      dispatch({ type: 'SET_PRODUCTS', payload: products.map(p => {
        if (p.id === returnedProduct.productId) {
          return { ...p, quantity: p.quantity + returnedProduct.reservedQuantity, visible: true };
        }
        return p;
      })});
    } else {
      dispatch({ type: 'SET_ERROR', payload: { message: 'Non hai i permessi per restituire i prodotti.' } });
    }
  }, [dispatch, products, redazionaliProducts, checkPermission]);

  const handleSaveReservation = useCallback((product, reservationData) => {
    if (checkPermission(PERMISSIONS.MANAGE_RESERVATIONS)) {
      const { quantity, name, reason, comments, returnDate, salePrice } = reservationData;
      const reservedQuantity = parseInt(quantity, 10);
      
      dispatch({ type: 'SET_PRODUCTS', payload: products.map(p => {
        if (p.id === product.id) {
          const newQuantity = Math.max(0, p.quantity - reservedQuantity);
          return { ...p, quantity: newQuantity, visible: newQuantity > 0 };
        }
        return p;
      })});
    
      dispatch({ type: 'SET_RESERVATIONS', payload: [
        ...reservations,
        {
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          reservedQuantity,
          originalQuantity: product.quantity,
          customerName: name,
          reason,
          comments,
          returnDate: reason === 'Conto Visione' ? returnDate : null,
          salePrice: reason === 'Vendita' ? parseFloat(salePrice) : null,
          dateReserved: new Date().toISOString()
        }
      ]});
    
      setIsReserveProductFormVisible(false);
      setProductToReserve(null);
    } else {
      dispatch({ type: 'SET_ERROR', payload: { message: 'Non hai i permessi per gestire le prenotazioni.' } });
    }
  }, [dispatch, products, reservations, checkPermission]);

  const handleNavigate = useCallback((page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, [dispatch]);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return checkPermission(PERMISSIONS.VIEW_REPORTS) ? <Dashboard products={filteredProducts} /> : null;
      case 'inventario':
        return checkPermission(PERMISSIONS.VIEW_INVENTORY) ? (
          <Inventario 
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onReserveProduct={handleReserveProduct}
            isAddProductFormVisible={isAddProductFormVisible}
            isEditProductFormVisible={isEditProductFormVisible}
            productToEdit={productToEdit}
            onAddProduct={addProduct}
            onCloseForm={handleCloseForm}
            onSaveEditedProduct={editProduct}
          />
        ) : null;
      case 'prenotazioni':
        return checkPermission(PERMISSIONS.VIEW_RESERVATIONS) ? (
          <Prenotazioni 
            reservations={reservations}
            onAccept={acceptReservation}
            onReject={rejectReservation}
          />
        ) : null;
      case 'redazionali':
        return checkPermission(PERMISSIONS.VIEW_INVENTORY) ? (
          <Redazionali 
            redazionaliProducts={redazionaliProducts} 
            onProductReturn={handleProductReturn}
          />
        ) : null;
      case 'recuperati':
        return checkPermission(PERMISSIONS.VIEW_INVENTORY) ? (
          <Recuperati recuperatedProducts={recuperatedProducts} />
        ) : null;
      case 'venduti':
        return checkPermission(PERMISSIONS.VIEW_REPORTS) ? <Venduti /> : null;
      case 'usermanagement':
        return checkPermission(PERMISSIONS.MANAGE_USERS) ? <UserManagement /> : null;
      case 'reportistica':
        return checkPermission(PERMISSIONS.VIEW_REPORTS) ? <Reportistica /> : null;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <Header 
          onAddProductClick={handleAddProductClick} 
          onSearch={handleSearch}
          username={user.username}
          role={user.role}
          onLogout={handleLogout}
          onReset={resetApp}
        />
        <div className="main-container">
          <Sidebar 
            onNavigate={handleNavigate} 
            currentPage={currentPage} 
          />
          <main className="content">
            {renderContent()}
          </main>
        </div>
        {isReserveProductFormVisible && productToReserve && (
          <ReserveProductForm
            product={productToReserve}
            onReserve={handleSaveReservation}
            onClose={() => {
              setIsReserveProductFormVisible(false);
              setProductToReserve(null);
            }}
          />
        )}
        {error && (
          <Toast 
            message={error.message} 
            onClose={() => dispatch({ type: 'SET_ERROR', payload: null })} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;