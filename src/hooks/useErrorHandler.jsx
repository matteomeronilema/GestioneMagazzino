import { useState } from 'react';

export const useErrorHandler = (initialState = null) => {
  const [error, setError] = useState(initialState);
  
  const handleError = (error) => {
    setError(error);
    // Qui potresti anche loggare l'errore
    console.error(error);
  };

  return { error, handleError };
};