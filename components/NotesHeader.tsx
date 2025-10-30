
import React from 'react';

interface NotesHeaderProps {
    onAddNote: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const NotesHeader: React.FC<NotesHeaderProps> = ({ onAddNote, searchQuery, onSearchChange }) => {
  return (
    <div className="bg-brand-primary p-4 flex items-center justify-between flex-wrap gap-4 sticky top-0 z-10 border-b border-brand-secondary">
      <div className="relative flex-grow max-w-lg">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
        </span>
        <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
            onClick={onAddNote}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Note</span>
        </button>
      </div>
    </div>
  );
};

export default NotesHeader;
