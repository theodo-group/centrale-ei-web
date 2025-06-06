import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [selectedUserId, setSelectedUserId] = useState(() => {
    // On récupère la valeur dans localStorage au chargement
    return localStorage.getItem('selectedUserId') || null;
  });

  const updateContext = (userId) => {
    console.log('updated');
    setSelectedUserId(userId);
  };

  // Sauvegarde dans localStorage à chaque changement de selectedUserId
  useEffect(() => {
    if (selectedUserId !== null) {
      localStorage.setItem('selectedUserId', selectedUserId);
    }
  }, [selectedUserId]);

  return (
    <UserContext.Provider value={{ selectedUserId, updateContext }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
