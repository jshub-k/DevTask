
import React from 'react';
import { Status, Task } from '../types';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, tasks, onEditTask, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const columnStyle = `flex flex-col bg-brand-secondary rounded-xl p-4 transition-colors duration-200 ${isOver ? 'bg-gray-700' : ''}`;

  return (
    <div ref={setNodeRef} className={columnStyle}>
      <h2 className="text-xl font-bold mb-4 px-2 text-gray-300 flex justify-between items-center">
        {title}
        <span className="text-sm font-normal bg-gray-700 text-gray-300 rounded-full px-2 py-1">{tasks.length}</span>
      </h2>
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500 border-2 border-dashed border-gray-600 rounded-lg p-4">
                Drop tasks here
            </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
