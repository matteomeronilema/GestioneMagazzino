import React from 'react';
import './Redazionali.css';
import { useAppContext } from '../../context/AppContext';

function Redazionali({ onProductReturn }) {
  const { state } = useAppContext();
  const { redazionaliProducts, redazionaliSearchTerm } = state;

  const filteredProducts = redazionaliProducts.filter(product =>
    product.productName.toLowerCase().includes(redazionaliSearchTerm.toLowerCase()) ||
    product.customerName.toLowerCase().includes(redazionaliSearchTerm.toLowerCase())
  );

  return (
    <div className="redazionali-page">
      <h2>Prodotti in Conto Visione</h2>
      {filteredProducts.length === 0 ? (
        <p>Nessun prodotto in conto visione corrispondente alla ricerca.</p>
      ) : (
        <ul className="redazionali-list">
          {filteredProducts.map((product) => (
            <li key={product.id} className="redazionali-item">
              <h3>{product.productName}</h3>
              <p>Quantità: {product.reservedQuantity}</p>
              <p>Cliente: {product.customerName}</p>
              <p>Data di prenotazione: {new Date(product.dateReserved).toLocaleDateString()}</p>
              <p>Data di rientro prevista: {new Date(product.returnDate).toLocaleDateString()}</p>
              {product.comments && <p>Commenti: {product.comments}</p>}
              <button 
                className="return-button" 
                onClick={() => onProductReturn(product)}
              >
                Merce rientrata
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Redazionali;