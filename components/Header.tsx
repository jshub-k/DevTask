
import React from 'react';
// FIX: Removed unused signOut import as we're using auth service directly.
import { auth } from '../services/firebase';
import { Priority } from '../types';

interface HeaderProps {
    onAddTask: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
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


const Header: React.FC<HeaderProps> = ({ onAddTask, searchQuery, onSearchChange }) => {
  // FIX: Updated sign out call to match the v8 compat API.
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="bg-brand-secondary shadow-md p-4 flex items-center justify-between flex-wrap gap-4">
      <h1 className="text-2xl font-bold text-white order-1">Dev Queue Kanban</h1>
      
      <div className="relative flex-grow max-w-lg order-3 w-full md:order-2 md:w-auto">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
        </span>
        <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div className="flex items-center space-x-4 order-2 md:order-3">
        <div className="hidden lg:flex">
          <PriorityLegend />
        </div>
        <button
            onClick={onAddTask}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Task</span>
        </button>
        <button onClick={handleLogout} className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
