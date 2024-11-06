import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const KanbanBoard = () => {
  const { selectedProject, updateTask } = useStore();
  const currentSprint = selectedProject?.sprints[0];

  const columns = [
    { id: 'backlog', title: 'Backlog', icon: <Clock className="w-5 h-5" /> },
    { id: 'todo', title: 'Por Hacer', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'in_progress', title: 'En Progreso', icon: <ArrowRight className="w-5 h-5" /> },
    { id: 'done', title: 'Completado', icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = currentSprint?.tasks.find(t => t.id === taskId);
    
    if (task && selectedProject && currentSprint) {
      updateTask(selectedProject.id, currentSprint.id, {
        ...task,
        status: status as Task['status'],
        updatedAt: new Date()
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!currentSprint) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay sprints activos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map(column => (
        <div
          key={column.id}
          className="bg-gray-100 rounded-lg p-4"
          onDrop={(e) => handleDrop(e, column.id)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center gap-2 mb-4">
            {column.icon}
            <h3 className="font-medium">{column.title}</h3>
            <span className="ml-auto bg-gray-200 px-2 py-1 rounded-full text-sm">
              {currentSprint.tasks.filter(task => task.status === column.id).length}
            </span>
          </div>
          <div className="space-y-2">
            {currentSprint.tasks
              .filter(task => task.status === column.id)
              .map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="bg-white p-3 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium mb-1">{task.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.storyPoints} pts
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};