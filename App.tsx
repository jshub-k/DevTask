
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import LoginPage from './components/LoginPage';
import KanbanBoard from './components/KanbanBoard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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

  return user ? <KanbanBoard user={user} /> : <LoginPage />;
};

export default App;
