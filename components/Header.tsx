
import React from 'react';
import { auth } from '../services/firebase';

interface AppHeaderProps {
    currentView: 'board' | 'notes';
    onSetView: (view: 'board' | 'notes') => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentView, onSetView }) => {
  const handleLogout = () => {
    auth.signOut();
  };

  const navButtonClasses = (view: 'board' | 'notes') => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
      ? 'bg-blue-600 text-white' 
      : 'text-gray-300 hover:bg-brand-secondary hover:text-white'
    }`;

  return (
    <header className="bg-brand-secondary shadow-md p-4 flex items-center justify-between flex-shrink-0 z-20">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold text-white">Dev Queue</h1>
        <nav className="flex items-center space-x-2">
            <button onClick={() => onSetView('board')} className={navButtonClasses('board')}>
                Board
            </button>
            <button onClick={() => onSetView('notes')} className={navButtonClasses('notes')}>
                Notes
            </button>
        </nav>
      </div>
      
      <button onClick={handleLogout} className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Logout">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </header>
  );
};

export default AppHeader;
