import React, { useState } from 'react';
import './EditProductForm.css';
import { validateProduct } from '../../utils/productValidation';

function EditProductForm({ product, onEditProduct, onClose }) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(editedProduct);
    if (Object.keys(validationErrors).length === 0) {
      onEditProduct({
        ...editedProduct,
        price: parseFloat(editedProduct.price),
        quantity: parseInt(editedProduct.quantity)
      });
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="edit-product-form" onSubmit={handleSubmit}>
          <h2>Modifica Prodotto</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nome Prodotto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={editedProduct.description}
              onChange={handleChange}
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Prezzo</label>
            <input
              type="number"
              id="price"
              name="price"
              value={editedProduct.price}
              onChange={handleChange}
              step="0.01"
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantità</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={editedProduct.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <span className="error">{errors.quantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <input
              type="text"
              id="category"
              name="category"
              value={editedProduct.category}
              onChange={handleChange}
            />
            {errors.category && <span className="error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">URL Immagine</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={editedProduct.imageUrl}
              onChange={handleChange}
            />
            {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ubicazione">Ubicazione</label>
            <select
              id="ubicazione"
              name="ubicazione"
              value={editedProduct.ubicazione}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona un'ubicazione</option>
              <option value="Giussano">Giussano</option>
              <option value="Alzate Magazzino 700">Alzate Magazzino 700</option>
              <option value="Alzate da Christian">Alzate da Christian</option>
              <option value="Alzate al Carico">Alzate al Carico</option>
            </select>
            {errors.ubicazione && <span className="error">{errors.ubicazione}</span>}
          </div>
          
          <div className="form-actions">
            <button type="submit">Salva Modifiche</button>
            <button type="button" onClick={onClose}>Annulla</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductForm;