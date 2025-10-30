
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from './services/firebase';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Use v8 compat API for onAuthStateChanged.
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-primary">
        <Spinner />
      </div>
    );
  }

  return user ? <Dashboard user={user} /> : <LoginPage />;
};

export default App;
