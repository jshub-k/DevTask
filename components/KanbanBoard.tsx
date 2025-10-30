
import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
// FIX: Updated Firestore imports and usage to match the v8 compat API.
import { db, serverTimestamp } from '../services/firebase';
import { Task, Status, Priority } from '../types';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';
import Header from './Header';
import Spinner from './Spinner';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanBoardProps {
  user: User;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // FIX: Use v8 collection and query syntax.
    const tasksCollection = db.collection('users').doc(user.uid).collection('tasks');
    const q = tasksCollection.orderBy('order', 'asc');

    // FIX: Use v8 onSnapshot syntax.
    const unsubscribe = q.onSnapshot((snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      setTasks(fetchedTasks);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery) {
      return tasks;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowercasedQuery) ||
      task.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [tasks, searchQuery]);

  const columns = useMemo(() => ({
    [Status.ToDo]: filteredTasks.filter(task => task.status === Status.ToDo),
    [Status.InProgress]: filteredTasks.filter(task => task.status === Status.InProgress),
    [Status.Done]: filteredTasks.filter(task => task.status === Status.Done),
  }), [filteredTasks]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    const overId = over.id;
    
    // Check if dropping on a column (droppable area) or another task (sortable item)
    const overIsColumn = Object.values(Status).includes(overId as Status);

    const oldStatus = activeTask?.status;
    const newStatus = overIsColumn ? overId as Status : tasks.find(t => t.id === overId)?.status;

    if (!activeTask || !newStatus) return;

    let newTasks = [...tasks];
    
    if (oldStatus !== newStatus) {
        // Task moved to a different column
        const updatedTask = { ...activeTask, status: newStatus };
        newTasks = newTasks.map(t => t.id === active.id ? updatedTask : t);
    } else {
        // Task reordered within the same column
        const oldIndex = tasks.findIndex(t => t.id === active.id);
        const newIndex = tasks.findIndex(t => t.id === over.id);
        newTasks = arrayMove(tasks, oldIndex, newIndex);
    }

    // Update local state immediately for better UX
    setTasks(newTasks);

    // Persist changes to Firestore
    try {
        // FIX: Use v8 batch and doc syntax.
        const batch = db.batch();
        const tasksRef = db.collection('users').doc(user.uid).collection('tasks');
        
        // Update order and status for all tasks
        // This is a simple approach; for large boards, more targeted updates would be better.
        const tasksToUpdate = [
            ...newTasks.filter(t => t.status === Status.ToDo),
            ...newTasks.filter(t => t.status === Status.InProgress),
            ...newTasks.filter(t => t.status === Status.Done),
        ];

        tasksToUpdate.forEach((task, index) => {
            const taskRef = tasksRef.doc(task.id);
            // We need to re-calculate the final ordering based on the new structure
            const finalStatus = newTasks.find(t => t.id === task.id)?.status;
            batch.update(taskRef, { status: finalStatus, order: index });
        });

        await batch.commit();

    } catch (error) {
        console.error("Failed to update task order/status:", error);
        // Revert local state if Firestore update fails
        setTasks(tasks); 
    }
  };
  
  const openAddTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };
  
  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'order'>) => {
    if (!user) return;
    const tasksCollection = db.collection('users').doc(user.uid).collection('tasks');
    
    if (editingTask) { // Update existing task
      // FIX: Use v8 doc and batch syntax.
      const taskRef = tasksCollection.doc(editingTask.id);
      const batch = db.batch();
      batch.update(taskRef, taskData);
      await batch.commit();
    } else { // Create new task
      const tasksInColumn = columns[taskData.status];
      const newOrder = tasksInColumn.length;
      // FIX: Use v8 add syntax and call serverTimestamp as a function.
      await tasksCollection.add({ ...taskData, order: newOrder, createdAt: serverTimestamp() });
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
      if (!user) return;
      if (window.confirm("Are you sure you want to delete this task?")) {
        // FIX: Use v8 doc and delete syntax.
        const taskRef = db.collection('users').doc(user.uid).collection('tasks').doc(taskId);
        await taskRef.delete();
      }
  };

  return (
    <div className="flex flex-col h-screen bg-brand-primary text-white overflow-x-hidden">
      <Header
        onAddTask={openAddTaskModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
            <Spinner />
        </div>
      ) : (
        <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-x-auto">
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[800px] md:min-w-0">
              <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <KanbanColumn 
                    status={Status.ToDo} 
                    title="To Do" 
                    tasks={columns.todo} 
                    onEditTask={openEditTaskModal}
                    onDeleteTask={handleDeleteTask}
                />
                <KanbanColumn 
                    status={Status.InProgress} 
                    title="In Progress" 
                    tasks={columns.inProgress}
                    onEditTask={openEditTaskModal}
                    onDeleteTask={handleDeleteTask}
                />
                <KanbanColumn 
                    status={Status.Done} 
                    title="Done" 
                    tasks={columns.done} 
                    onEditTask={openEditTaskModal}
                    onDeleteTask={handleDeleteTask}
                />
              </SortableContext>
            </div>
          </DndContext>
        </main>
      )}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
          onSave={handleSaveTask}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
