import React, { useState } from 'react';
import './AddProductForm.css';
import { validateProduct } from '../../utils/productValidation';

function AddProductForm({ onAddProduct, onClose }) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
    state: 'Nuovo',
    isPrototype: false,
    isForShowroom: false,
    ubicazione: ''

  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(product);
    if (Object.keys(validationErrors).length === 0) {
      onAddProduct({
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity)
      });
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="add-product-form" onSubmit={handleSubmit}>
          <h2>Aggiungi Nuovo Prodotto</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nome Prodotto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
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
              value={product.price}
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
              value={product.quantity}
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
              value={product.category}
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
              value={product.imageUrl}
              onChange={handleChange}
            />
            {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ubicazione">Ubicazione</label>
            <select
              id="ubicazione"
              name="ubicazione"
              value={product.ubicazione}
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

          <div className="form-group">
            <label htmlFor="state">Stato</label>
            <select
              id="state"
              name="state"
              value={product.state}
              onChange={handleChange}
              required
            >
              <option value="Nuovo">Nuovo</option>
              <option value="Usato Buono Stato">Usato Buono Stato</option>
              <option value="Usato">Usato</option>
              <option value="Rovinato">Rovinato</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isPrototype"
                checked={product.isPrototype}
                onChange={(e) => setProduct({...product, isPrototype: e.target.checked})}
              />
              Prototipo
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isForShowroom"
                checked={product.isForShowroom}
                onChange={(e) => setProduct({...product, isForShowroom: e.target.checked})}
              />
              Per Showroom
            </label>
          </div>
                    
          <div className="form-actions">
            <button type="submit">Aggiungi Prodotto</button>
            <button type="button" onClick={onClose}>Annulla</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;
