
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import AppHeader from './Header';
import KanbanBoard from './KanbanBoard';
import NotesBoard from './NotesBoard';

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const [view, setView] = useState<'board' | 'notes'>('board');

    return (
        <div className="flex flex-col h-screen bg-brand-primary text-white">
            <AppHeader currentView={view} onSetView={setView} />
            <div className="flex-grow overflow-y-auto">
                {view === 'board' && <KanbanBoard user={user} />}
                {view === 'notes' && <NotesBoard user={user} />}
            </div>
        </div>
    );
};

export default Dashboard;
