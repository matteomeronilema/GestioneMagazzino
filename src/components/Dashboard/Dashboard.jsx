import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Dashboard.css';

function Dashboard() {
  const { state } = useAppContext();
  const { products } = state;

  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const averagePrice = totalValue / totalQuantity || 0;
  const lowStockProducts = products.filter(product => product.quantity < 5).length;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Totale Prodotti</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Quantità Totale</h3>
          <p>{totalQuantity}</p>
        </div>
        <div className="stat-card">
          <h3>Valore Totale Inventario</h3>
          <p>€{totalValue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Prezzo Medio</h3>
          <p>€{averagePrice.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Prodotti con Scorte Basse</h3>
          <p>{lowStockProducts}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;