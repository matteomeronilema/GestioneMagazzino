import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Venduti.css';

function Venduti() {
  const { state } = useAppContext();
  const { soldProducts, vendutiSearchTerm } = state;

  const filteredProducts = soldProducts.filter(product =>
    product.productName.toLowerCase().includes(vendutiSearchTerm.toLowerCase()) ||
    product.customerName.toLowerCase().includes(vendutiSearchTerm.toLowerCase())
  );

  return (
    <div className="venduti">
      <h2>Prodotti Venduti</h2>
      {filteredProducts.length === 0 ? (
        <p>Nessun prodotto venduto corrispondente alla ricerca.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome Prodotto</th>
              <th>Quantità Venduta</th>
              <th>Prezzo di Vendita</th>
              <th>Prezzo Totale</th>
              <th>Data di Vendita</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
          {filteredProducts.map((product) => (
                <tr key={product.id}>
                <td data-label="Nome Prodotto">{product.productName}</td>
                <td data-label="Quantità Venduta">{product.reservedQuantity}</td>
                <td data-label="Prezzo di Vendita">€{product.salePrice.toFixed(2)}</td>
                <td data-label="Prezzo Totale">€{(product.salePrice * product.reservedQuantity).toFixed(2)}</td>
                <td data-label="Data di Vendita">{new Date(product.dateSold).toLocaleDateString()}</td>
                <td data-label="Cliente">{product.customerName}</td>
                </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Venduti;