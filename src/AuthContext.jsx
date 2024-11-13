
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const mockUsers = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const login = (username, password) => {
    const user = mockUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLoginError(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);