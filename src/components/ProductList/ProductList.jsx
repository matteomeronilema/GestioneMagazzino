import React, { useState, useMemo } from 'react';
import './ProductList.css';
import ProductCard from '../ProductCard/ProductCard';
import { useErrorHandler } from '../../hooks/useErrorHandler';

function ProductList({ products, onEditProduct, onDeleteProduct, onReserveProduct, userRole }) {
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [showroomFilter, setShowroomFilter] = useState('all');
  const [ubicazioneFilter, setUbicazioneFilter] = useState('all'); // Nuovo stato per il filtro ubicazione
  const { error, handleError } = useErrorHandler();

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return ['all', ...uniqueCategories];
  }, [products]);

  const ubicazioni = useMemo(() => {
    const uniqueUbicazioni = new Set(products.map(product => product.ubicazione).filter(Boolean));
    return ['all', ...uniqueUbicazioni];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => 
        (categoryFilter === 'all' || product.category === categoryFilter) &&
        (stateFilter === 'all' || product.state === stateFilter) &&
        (showroomFilter === 'all' || 
          (showroomFilter === 'yes' && product.isForShowroom) || 
          (showroomFilter === 'no' && !product.isForShowroom)) &&
        (ubicazioneFilter === 'all' || product.ubicazione === ubicazioneFilter) // Nuovo filtro per ubicazione
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'price') {
          return a.price - b.price;
        } else if (sortBy === 'quantity') {
          return a.quantity - b.quantity;
        }
        return 0;
      });
  }, [products, sortBy, categoryFilter, stateFilter, showroomFilter, ubicazioneFilter]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleDelete = async (productId) => {
    try {
      await onDeleteProduct(productId);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleStateChange = (e) => {
    setStateFilter(e.target.value);
  };
  
  const handleShowroomChange = (e) => {
    setShowroomFilter(e.target.value);
  };

  const handleUbicazioneChange = (e) => {
    setUbicazioneFilter(e.target.value);
  };

  if (error) {
    return <div>Errore nel caricamento dei prodotti: {error.message}</div>;
  }
    
  console.log('ProductList props:', { products, onEditProduct, onDeleteProduct });

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Lista Prodotti</h2>
        <div className="product-list-controls">
          <select value={categoryFilter} onChange={handleCategoryChange}>
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Tutte le categorie' : category}
              </option>
            ))}
          </select>
          <select value={stateFilter} onChange={handleStateChange}>
            <option value="all">Tutti gli stati</option>
            <option value="Nuovo">Nuovo</option>
            <option value="Usato Buono Stato">Usato Buono Stato</option>
            <option value="Usato">Usato</option>
            <option value="Rovinato">Rovinato</option>
          </select>
          <select value={showroomFilter} onChange={handleShowroomChange}>
            <option value="all">Tutti i prodotti</option>
            <option value="yes">Per Showroom</option>
            <option value="no">Non per Showroom</option>
          </select>
          <select value={ubicazioneFilter} onChange={handleUbicazioneChange}>
            {ubicazioni.map(ubicazione => (
              <option key={ubicazione} value={ubicazione}>
                {ubicazione === 'all' ? 'Tutte le ubicazioni' : ubicazione}
              </option>
            ))}
          </select>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="name">Ordina per Nome</option>
            <option value="price">Ordina per Prezzo</option>
            <option value="quantity">Ordina per Quantità</option>
          </select>
        </div>
      </div>
      {filteredAndSortedProducts.length === 0 ? (
        <p>Nessun prodotto disponibile per i filtri selezionati.</p>
      ) : (
        <div className="product-grid">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={onEditProduct}
              onDelete={handleDelete}
              onReserve={(product) => onReserveProduct(product, 1)}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;