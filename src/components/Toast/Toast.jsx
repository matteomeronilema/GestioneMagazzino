import React from 'react';
import './Toast.css';

function Toast({ message, type = 'error', onClose }) {
  return (
    <div className={`toast ${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;