
import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div
      style={{ backgroundColor: note.color }}
      className={`p-4 rounded-lg shadow-lg relative group h-64 flex flex-col transition-transform hover:-translate-y-1`}
    >
      <div className="absolute top-2 right-2 flex items-center space-x-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(note)} className="p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
          </svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }} className="p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <h3 className="font-bold text-lg mb-2 text-white truncate flex-shrink-0">{note.title}</h3>
        <div className="flex-grow overflow-y-auto pr-1">
            <p className="text-gray-200 text-sm whitespace-pre-wrap">{note.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
