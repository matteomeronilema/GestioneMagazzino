import React from 'react';
import PropTypes from 'prop-types';
import './ReservedProducts.css';

function ReservedProducts({ reservations, onAccept, onReject, canManageReservations }) {
  console.log('canManageReservations in ReservedProducts:', canManageReservations);

  const handleAccept = (reservationId) => {
    console.log('Cliccato Accetta per prenotazione ID:', reservationId);
    try {
      onAccept(reservationId);
    } catch (error) {
      console.error('Errore durante l\'accettazione della prenotazione:', error);
      // Qui potresti gestire l'errore, ad esempio mostrando un messaggio all'utente
    }
  };

  const handleReject = (reservationId) => {
    console.log('Cliccato Rifiuta per prenotazione ID:', reservationId);
    try {
      onReject(reservationId);
    } catch (error) {
      console.error('Errore durante il rifiuto della prenotazione:', error);
      // Qui potresti gestire l'errore, ad esempio mostrando un messaggio all'utente
    }
  };

  return (
    <div className="reserved-products">
      {reservations.length === 0 ? (
        <p>Nessuna prenotazione trovata.</p>
      ) : (
        <ul className="reservations-list">
          {reservations.map((reservation) => {
            const unitPrice = parseFloat(reservation.salePrice);
            const totalPrice = unitPrice * reservation.reservedQuantity;
            
            return (
              <li key={reservation.id} className="reservation-item">
                <h3>{reservation.productName}</h3>
                <p>Prenotato da: {reservation.customerName}</p>
                <p>Quantità: {reservation.reservedQuantity}</p>
                <p>Motivazione: {reservation.reason}</p>
                {reservation.reason === 'Vendita' && (
                  <>
                    <p>Prezzo di vendita unitario: 
                      {!isNaN(unitPrice) 
                        ? `€${unitPrice.toFixed(2)}` 
                        : 'Non specificato'}
                    </p>
                    <p>Prezzo di vendita totale: 
                      {!isNaN(totalPrice) 
                        ? `€${totalPrice.toFixed(2)}` 
                        : 'Non specificato'}
                    </p>
                  </>
                )}
                {reservation.returnDate && (
                  <p>Data di rientro prevista: {new Date(reservation.returnDate).toLocaleDateString()}</p>
                )}
                {reservation.comments && <p>Commenti: {reservation.comments}</p>}
                <p>Data prenotazione: {new Date(reservation.dateReserved).toLocaleString()}</p>
                <div className="reservation-actions">
                  {canManageReservations && (
                    <>
                      <button onClick={() => handleAccept(reservation.id)}>Accetta</button>
                      <button onClick={() => handleReject(reservation.id)}>Rifiuta</button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

ReservedProducts.propTypes = {
  reservations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productName: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    reservedQuantity: PropTypes.number.isRequired,
    reason: PropTypes.string.isRequired,
    salePrice: PropTypes.string,
    returnDate: PropTypes.string,
    comments: PropTypes.string,
    dateReserved: PropTypes.string.isRequired,
  })).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  canManageReservations: PropTypes.bool.isRequired,
};

export default ReservedProducts;