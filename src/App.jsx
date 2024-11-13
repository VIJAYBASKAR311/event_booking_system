
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import EventBooking from './EventBooking';
import Login from './Login';

const AppContent = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <EventBooking /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;