import React from 'react';
import { useAppContext } from '../../context/AppContext';
import ReservedProducts from '../../components/ReservedProducts/ReservedProducts';
import './Prenotazioni.css';
import { PERMISSIONS } from '../../utils/roles';
import api from '../../utils/api';

function Prenotazioni() {
  const { state, dispatch, checkPermission } = useAppContext();
  const { filteredReservations } = state;

  const handleAccept = async (reservationId) => {
    if (checkPermission(PERMISSIONS.MANAGE_RESERVATIONS)) {
      try {
        console.log('Accettazione prenotazione con ID:', reservationId);
        const response = await api.post(`/reservations/${reservationId}/accept`);
        console.log('Risposta dal server:', response.data);
        
        if (response.data.message === 'Prenotazione accettata con successo') {
          const reservation = filteredReservations.find(r => r.id === reservationId);
          dispatch({ 
            type: 'ACCEPT_RESERVATION', 
            payload: { 
              id: reservationId,
              reservation: reservation 
            } 
          });
        }
      } catch (error) {
        console.error('Errore nell\'accettazione della prenotazione:', error);
      }
    } else {
      console.log('Permesso negato per accettare la prenotazione');
    }
  };
  
  const handleReject = async (reservationId) => {
    if (checkPermission(PERMISSIONS.MANAGE_RESERVATIONS)) {
      try {
        console.log('Rifiuto prenotazione con ID:', reservationId);
        const response = await api.post(`/reservations/${reservationId}/reject`);
        console.log('Risposta dal server:', response.data);
        
        if (response.data.message === 'Prenotazione rifiutata con successo') {
          dispatch({ type: 'REJECT_RESERVATION', payload: { id: reservationId } });
        }
      } catch (error) {
        console.error('Errore nel rifiuto della prenotazione:', error);
      }
    } else {
      console.log('Permesso negato per rifiutare la prenotazione');
    }
  };

  const canManageReservations = checkPermission(PERMISSIONS.MANAGE_RESERVATIONS);

  return (
    <div className="prenotazioni-page">
      <h2>Prenotazioni</h2>
      {filteredReservations.length > 0 ? (
        <ReservedProducts 
          reservations={filteredReservations} 
          onAccept={handleAccept}
          onReject={handleReject}
          canManageReservations={canManageReservations}
        />
      ) : (
        <p>Nessuna prenotazione trovata.</p>
      )}
    </div>
  );
}

export default Prenotazioni;