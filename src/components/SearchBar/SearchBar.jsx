import React from 'react';
import { useAppContext } from '../../context/AppContext';

function SearchBar({ onSearch }) {
  const { state } = useAppContext();
  const { currentPage, searchTerm, redazionaliSearchTerm, recuperatiSearchTerm, vendutiSearchTerm } = state;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  const getSearchTerm = () => {
    switch (currentPage) {
      case 'redazionali':
        return redazionaliSearchTerm;
      case 'recuperati':
        return recuperatiSearchTerm;
      case 'venduti':
        return vendutiSearchTerm;
      case 'prenotazioni':
        return searchTerm; // Usiamo il searchTerm generale per le prenotazioni
      default:
        return searchTerm;
      
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Cerca prodotti..."
        value={getSearchTerm()}
        onChange={handleSearchChange}
      />
    </div>
  );
}

export default SearchBar;