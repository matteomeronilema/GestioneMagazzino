import React from 'react';
import './Header.css';
import SearchBar from '../SearchBar/SearchBar';
import { useAppContext } from '../../context/AppContext';

function Header({ onAddProductClick, onReset }) {
  const { state, dispatch, logout } = useAppContext();

  const handleSearch = (term) => {
    if (state.currentPage === 'redazionali') {
      dispatch({ type: 'SET_REDAZIONALI_SEARCH_TERM', payload: term });
    } else if (state.currentPage === 'recuperati') {
      dispatch({ type: 'SET_RECUPERATI_SEARCH_TERM', payload: term });
    } else if (state.currentPage === 'venduti') {
      dispatch({ type: 'SET_VENDUTI_SEARCH_TERM', payload: term });
    } else {
      dispatch({ type: 'SET_SEARCH_TERM', payload: term });
    }
  };

  const handleLogout = () => {
    logout();
    // Opzionale: reindirizza l'utente alla pagina di login
    // window.location.href = '/login';
  };
  
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Gestione Magazzino Arredo</h1>
      </div>
      <SearchBar onSearch={handleSearch} />
      <div className="user-actions">
        <span>Benvenuto, {state.user ? state.user.username : 'Utente'}!</span>
        <button className="add-product-btn" onClick={onAddProductClick}>
          Aggiungi Prodotto
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button onClick={onReset}>Reset App</button>
      </div>
    </header>
  );
}

export default Header;