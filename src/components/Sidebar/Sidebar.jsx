import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { PERMISSIONS } from '../../utils/roles';
import './Sidebar.css';

function Sidebar({ onNavigate, currentPage }) {
  const { checkPermission } = useAppContext();

  const menuItems = [
    { name: 'Dashboard', page: 'dashboard', permission: PERMISSIONS.VIEW_REPORTS },
    { name: 'Inventario', page: 'inventario', permission: PERMISSIONS.VIEW_INVENTORY },
    { name: 'Prenotazioni', page: 'prenotazioni', permission: PERMISSIONS.VIEW_RESERVATIONS },
    { name: 'Redazionali', page: 'redazionali', permission: PERMISSIONS.VIEW_INVENTORY },
    { name: 'Recuperati', page: 'recuperati', permission: PERMISSIONS.VIEW_INVENTORY },
    { name: 'Venduti', page: 'venduti', permission: PERMISSIONS.VIEW_REPORTS },
    { name: 'Reportistica', page: 'reportistica', permission: PERMISSIONS.VIEW_REPORTS },
    { name: 'Gestione Utenti', page: 'usermanagement', permission: PERMISSIONS.MANAGE_USERS },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item) => (
            checkPermission(item.permission) && (
              <li key={item.page}>
                <button 
                  onClick={() => onNavigate(item.page)}
                  className={currentPage === item.page ? 'active' : ''}
                >
                  {item.name}
                </button>
              </li>
            )
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
