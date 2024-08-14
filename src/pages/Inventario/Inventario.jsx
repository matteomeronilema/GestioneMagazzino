import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { PERMISSIONS } from '../../utils/roles';
import ProductList from '../../components/ProductList/ProductList';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import EditProductForm from '../../components/EditProductForm/EditProductForm';

function Inventario({ 
  onEditProduct, 
  onDeleteProduct, 
  onReserveProduct,
  isAddProductFormVisible,
  isEditProductFormVisible,
  productToEdit,
  onAddProduct,
  onCloseForm,
  onSaveEditedProduct
}) {
  const { state, checkPermission } = useAppContext();
  const { filteredProducts } = state;

  const visibleProducts = filteredProducts.filter(product => product.quantity > 0 && product.visible);

  const canEditInventory = checkPermission(PERMISSIONS.EDIT_INVENTORY);
  const canManageInventory = checkPermission(PERMISSIONS.MANAGE_INVENTORY);
  const canManageReservations = checkPermission(PERMISSIONS.MANAGE_RESERVATIONS);
  const canViewInventory = checkPermission(PERMISSIONS.VIEW_INVENTORY);

  if (!canViewInventory) {
    return <div>Non hai i permessi per visualizzare l'inventario.</div>;
  }

  return (
    <div className="inventario-page">
      <ProductList 
        products={visibleProducts} 
        onEditProduct={canEditInventory ? onEditProduct : null}
        onDeleteProduct={canManageInventory ? onDeleteProduct : null}
        onReserveProduct={onReserveProduct}
      />

      {isAddProductFormVisible && canEditInventory && (
        <AddProductForm onAddProduct={onAddProduct} onClose={onCloseForm} />
      )}

      {isEditProductFormVisible && productToEdit && canEditInventory && (
        <EditProductForm 
          product={productToEdit} 
          onEditProduct={onSaveEditedProduct} 
          onClose={onCloseForm} 
        />
      )}
    </div>
  );
}

export default Inventario;