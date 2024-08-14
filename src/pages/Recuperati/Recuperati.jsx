import React from 'react';
import './Recuperati.css';
import { useAppContext } from '../../context/AppContext';

function Recuperati() {
  const { state } = useAppContext();
  const { recuperatedProducts, recuperatiSearchTerm } = state;

  const filteredProducts = recuperatedProducts.filter(product =>
    product.productName.toLowerCase().includes(recuperatiSearchTerm.toLowerCase()) ||
    product.customerName.toLowerCase().includes(recuperatiSearchTerm.toLowerCase()) ||
    product.reason.toLowerCase().includes(recuperatiSearchTerm.toLowerCase())
  );

  return (
    <div className="recuperati-page">
      <h2>Prodotti Recuperati</h2>
      {filteredProducts.length === 0 ? (
        <p>Nessun prodotto recuperato corrispondente alla ricerca.</p>
      ) : (
        <ul className="recuperati-list">
          {filteredProducts.map((product) => {
            const unitPrice = parseFloat(product.salePrice);
            const totalPrice = unitPrice * product.reservedQuantity;

            return (
              <li key={product.id} className="recuperati-item">
                <h3>{product.productName}</h3>
                <p>Quantità recuperata: {product.reservedQuantity}</p>
                <p>Recuperato da: {product.customerName}</p>
                <p>Motivazione originale: {product.reason}</p>
                {product.reason === 'Vendita' && (
                  <>
                    <p>Prezzo di vendita unitario: 
                      {unitPrice 
                        ? `€${unitPrice.toFixed(2)}` 
                        : 'Non specificato'}
                    </p>
                    <p>Prezzo di vendita totale: 
                      {unitPrice 
                        ? `€${totalPrice.toFixed(2)}` 
                        : 'Non specificato'}
                    </p>
                  </>
                )}
                {product.comments && <p>Commenti: {product.comments}</p>}
                <p>Data prenotazione: {new Date(product.dateReserved).toLocaleString()}</p>
                <p>Data recupero: {new Date(product.dateRecuperated).toLocaleString()}</p>
                <p>Stato: {product.status}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Recuperati;