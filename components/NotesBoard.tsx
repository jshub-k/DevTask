
import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { db, serverTimestamp } from '../services/firebase';
import { Note } from '../types';
import Spinner from './Spinner';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import NotesHeader from './NotesHeader';

const NotesBoard: React.FC<{ user: User }> = ({ user }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        const notesCollection = db.collection('users').doc(user.uid).collection('notes');
        const q = notesCollection.orderBy('createdAt', 'desc');

        const unsubscribe = q.onSnapshot((snapshot) => {
            const fetchedNotes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Note));
            setNotes(fetchedNotes);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching notes:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const filteredNotes = useMemo(() => {
        if (!searchQuery) {
            return notes;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return notes.filter(note =>
            note.title.toLowerCase().includes(lowercasedQuery) ||
            note.content.toLowerCase().includes(lowercasedQuery)
        );
    }, [notes, searchQuery]);

    const openAddNoteModal = () => {
        setEditingNote(null);
        setIsModalOpen(true);
    };

    const openEditNoteModal = (note: Note) => {
        setEditingNote(note);
        setIsModalOpen(true);
    };

    const handleSaveNote = async (noteData: Omit<Note, 'id' | 'createdAt'>) => {
        if (!user) return;
        const notesCollection = db.collection('users').doc(user.uid).collection('notes');

        if (editingNote) {
            const noteRef = notesCollection.doc(editingNote.id);
            await noteRef.update(noteData);
        } else {
            await notesCollection.add({ ...noteData, createdAt: serverTimestamp() });
        }
        setIsModalOpen(false);
        setEditingNote(null);
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!user) return;
        if (window.confirm("Are you sure you want to delete this note?")) {
            const noteRef = db.collection('users').doc(user.uid).collection('notes').doc(noteId);
            await noteRef.delete();
        }
    };

    return (
        <>
            <NotesHeader 
                onAddNote={openAddNoteModal} 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
            />
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <main className="p-4 md:p-8">
                    {filteredNotes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredNotes.map(note => (
                                <NoteCard key={note.id} note={note} onEdit={openEditNoteModal} onDelete={handleDeleteNote} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center text-gray-500 mt-16">
                            <h3 className="text-2xl font-semibold">No notes yet</h3>
                            <p className="mt-2">Click "Add Note" to create your first one.</p>
                        </div>
                    )}
                </main>
            )}
            {isModalOpen && (
                <NoteModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingNote(null); }}
                    onSave={handleSaveNote}
                    note={editingNote}
                />
            )}
        </>
    );
};

export default NotesBoard;
