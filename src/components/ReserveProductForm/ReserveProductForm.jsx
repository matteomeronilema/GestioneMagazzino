import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ReserveProductForm.css';

function ReserveProductForm({ product, onReserve, onClose }) {
  const [reservation, setReservation] = useState({
    name: '',
    quantity: 1,
    reason: 'Conto Visione',
    comments: '',
    returnDate: '',
    salePrice: ''
  });

  const [showReturnDate, setShowReturnDate] = useState(true);
  const [showSalePrice, setShowSalePrice] = useState(false);

  const reasons = ['Conto Visione', 'Vendita', 'Recupero', 'Buttato'];

  useEffect(() => {
    setShowReturnDate(reservation.reason === 'Conto Visione');
    setShowSalePrice(reservation.reason === 'Vendita');
  }, [reservation.reason]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
    console.log(`Campo ${name} aggiornato a:`, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log('Tentativo di prenotazione del prodotto:', product.id);
      onReserve(product, reservation);
      console.log('Prenotazione completata con successo');
      onClose();
    } catch (error) {
      console.error('Errore durante la prenotazione:', error);
      // Qui potresti gestire l'errore, ad esempio mostrando un messaggio all'utente
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="reserve-product-form" onSubmit={handleSubmit}>
          <h2>Prenota {product.name}</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={reservation.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantità</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={reservation.quantity}
              onChange={handleChange}
              min="1"
              max={product.quantity}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Motivazione</label>
            <select
              id="reason"
              name="reason"
              value={reservation.reason}
              onChange={handleChange}
              required
            >
              {reasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          {showReturnDate && (
            <div className="form-group">
              <label htmlFor="returnDate">Data di rientro prevista</label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={reservation.returnDate}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {showSalePrice && (
            <div className="form-group">
              <label htmlFor="salePrice">Prezzo di vendita</label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                value={reservation.salePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="comments">Commenti</label>
            <textarea
              id="comments"
              name="comments"
              value={reservation.comments}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit">Prenota</button>
            <button type="button" onClick={onClose}>Annulla</button>
          </div>
        </form>
      </div>
    </div>
  );
}

ReserveProductForm.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onReserve: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReserveProductForm;