
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Priority } from '../types';

interface HeaderProps {
    onAddTask: () => void;
}

const PriorityLegend = () => (
    <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <span className="h-3 w-3 block rounded-full bg-red-500"></span>
            <span className="text-sm text-gray-300">High</span>
        </div>
        <div className="flex items-center space-x-2">
            <span className="h-3 w-3 block rounded-full bg-orange-400"></span>
            <span className="text-sm text-gray-300">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
            <span className="h-3 w-3 block rounded-full bg-green-500"></span>
            <span className="text-sm text-gray-300">Low</span>
        </div>
    </div>
);


const Header: React.FC<HeaderProps> = ({ onAddTask }) => {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <header className="bg-brand-secondary shadow-md p-4 flex items-center justify-between flex-wrap gap-4">
      <h1 className="text-2xl font-bold text-white">Dev Queue Kanban</h1>
      <div className="hidden md:flex">
        <PriorityLegend />
      </div>
      <div className="flex items-center space-x-4">
        <button
            onClick={onAddTask}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Task</span>
        </button>
        <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
