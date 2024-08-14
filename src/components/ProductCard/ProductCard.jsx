import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { PERMISSIONS } from '../../utils/roles';
import './ProductCard.css';

function ProductCard({ product, onEdit, onDelete, onReserve }) {
  const { checkPermission, state } = useAppContext();

  if (!product || typeof product !== 'object') {
    console.error('Invalid product:', product);
    return null;
  }

  const canEditProduct = checkPermission(PERMISSIONS.EDIT_INVENTORY);
  const canDeleteProduct = checkPermission(PERMISSIONS.MANAGE_INVENTORY);
  const canReserveProduct = checkPermission(PERMISSIONS.RESERVE_PRODUCT);

  console.log('Current user:', state.user);
  console.log('Can edit product:', canEditProduct);
  console.log('Can delete product:', canDeleteProduct);
  console.log('Can reserve product:', canReserveProduct);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Prezzo: €{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</p>
        <p>Quantità: {product.quantity}</p>
        <p>Categoria: {product.category}</p>
        <p>Stato: {product.state}</p>
        <p>Ubicazione: {product.ubicazione}</p>
        {product.isPrototype && <p className="tag prototype">Prototipo</p>}
        {product.isForShowroom && <p className="tag showroom">Per Showroom</p>}
      </div>
      <div className="product-actions">
        {canEditProduct && <button onClick={() => onEdit(product)}>Modifica</button>}
        {canDeleteProduct && <button onClick={() => onDelete(product.id)}>Elimina</button>}
        {canReserveProduct && <button onClick={() => onReserve(product)}>Prenota</button>}
      </div>
      <div>
        <p>Debug: Can Reserve: {canReserveProduct ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

export default ProductCard;