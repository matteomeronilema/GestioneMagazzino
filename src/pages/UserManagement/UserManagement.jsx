import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS } from '../../utils/roles';
import './UserManagement.css';

const UserManagement = () => {
  const { checkPermission } = useAppContext();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user', permissions: [] });
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Errore nel recupero degli utenti');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Impossibile recuperare gli utenti. Riprova più tardi.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e, userId = null) => {
    const { value } = e.target;
    if (userId) {
      setEditingUser(prev => ({
        ...prev,
        role: value,
        permissions: ROLE_PERMISSIONS[value]
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        role: value,
        permissions: ROLE_PERMISSIONS[value]
      }));
    }
  };

  const handlePermissionChange = (e, userId = null) => {
    const { value, checked } = e.target;
    if (userId) {
      setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === userId) {
          const updatedPermissions = checked
            ? [...user.permissions, value]
            : user.permissions.filter(p => p !== value);
          return { ...user, permissions: updatedPermissions };
        }
        return user;
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, value]
          : prev.permissions.filter(p => p !== value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (!response.ok) {
        throw new Error('Errore nell\'aggiunta dell\'utente');
      }
      await fetchUsers();
      setNewUser({ username: '', password: '', role: 'user', permissions: [] });
      setError(null);
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Impossibile aggiungere l\'utente. Riprova più tardi.');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user, password: '' }); // Reset password when editing
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      if (!response.ok) {
        throw new Error('Errore nel salvataggio delle modifiche');
      }
      await fetchUsers();
      setEditingUser(null);
      setError(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Impossibile salvare le modifiche. Riprova più tardi.');
    }
  };

  if (!checkPermission(PERMISSIONS.MANAGE_USERS)) {
    return <div>Non hai i permessi per gestire gli utenti.</div>;
  }

  return (
    <div className="user-management">
      <h2>Gestione Utenti</h2>
      <p>Numero totale di utenti: {users.length}</p>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={newUser.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Nascondi" : "Mostra"} Password
        </button>
        <select
          name="role"
          value={newUser.role}
          onChange={(e) => handleRoleChange(e)}
          required
        >
          {Object.values(ROLES).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <div>
          <h4>Permessi:</h4>
          {Object.values(PERMISSIONS).map(permission => (
            <div key={permission}>
              <input
                type="checkbox"
                id={`new-${permission}`}
                value={permission}
                checked={newUser.permissions.includes(permission)}
                onChange={handlePermissionChange}
                disabled={newUser.role !== ROLES.ADMIN}
              />
              <label htmlFor={`new-${permission}`}>{permission}</label>
            </div>
          ))}
        </div>
        <button type="submit">Aggiungi Utente</button>
      </form>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {editingUser && editingUser.id === user.id ? (
              <>
                <input
                  type="text"
                  name="username"
                  value={editingUser.username}
                  onChange={handleEditInputChange}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={editingUser.password}
                  onChange={handleEditInputChange}
                  placeholder="Nuova password (lascia vuoto per non cambiare)"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Nascondi" : "Mostra"} Password
                </button>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={(e) => handleRoleChange(e, user.id)}
                >
                  {Object.values(ROLES).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <div>
                  <h4>Permessi:</h4>
                  {Object.values(PERMISSIONS).map(permission => (
                    <div key={permission}>
                      <input
                        type="checkbox"
                        id={`edit-${user.id}-${permission}`}
                        value={permission}
                        checked={editingUser.permissions.includes(permission)}
                        onChange={(e) => handlePermissionChange(e, user.id)}
                        disabled={editingUser.role !== ROLES.ADMIN}
                      />
                      <label htmlFor={`edit-${user.id}-${permission}`}>{permission}</label>
                    </div>
                  ))}
                </div>
                <button onClick={handleSaveEdit}>Salva</button>
                <button onClick={() => setEditingUser(null)}>Annulla</button>
              </>
            ) : (
              <>
                {user.username} - {user.role}
                <button onClick={() => handleEditUser(user)}>Modifica</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;