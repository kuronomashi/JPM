import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { TaskForm } from './TaskForm';
import { Task } from '../types';

import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,Plus,Trash
} from 'lucide-react';

export const KanbanBoard = () => {
  const { selectedProject, updateTask,addTask,deleteTask } = useStore();
  const currentSprint = selectedProject?.sprints[0];
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);


  const columns = [
    { id: 'backlog', title: 'Backlog', icon: <Clock className="w-5 h-5" /> },
    { id: 'todo', title: 'Por Hacer', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'in_progress', title: 'En Progreso', icon: <ArrowRight className="w-5 h-5" /> },
    { id: 'done', title: 'Completado', icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  if (!currentSprint) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay sprints activos</p>
      </div>
    );
  }
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProject ) {
      const newTask = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setShowTaskForm(false);
      addTask(selectedProject.id, currentSprint.id, newTask);
    }
  };

  
  const handleDeleteTask = (taskId: string) => {
    if (selectedProject && currentSprint) {
      deleteTask(selectedProject.id, currentSprint.id, taskId);
    }
  };

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


  return (
    <div className="space-y-6">
      <div className="flex justify-end items-end">

       <button
       onClick={() => setShowTaskForm(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
        <Plus className="w-4 h-4" />
        Nueva Tarea
      </button>
      </div>
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
                  <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium mb-1">{task.title}</h4>
                  <button className='text-red-600' onClick={() => handleDeleteTask(task.id)}> <Trash className="w-4 h-4" /></button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${task.priority === 'high'
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
    <div className="bg-white rounded-xl shadow-lg p-6 hover-card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Sprint Actual: {currentSprint.name}
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between text-gray-600">
              <span>Periodo</span>
              <span className="font-medium text-gray-900">
                {new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso del Sprint</span>
                <span className="font-medium text-primary-600">
                  {Math.round((currentSprint.tasks.filter(t => t.status === 'done').length / currentSprint.tasks.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${(currentSprint.tasks.filter(t => t.status === 'done').length / currentSprint.tasks.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
    {showTaskForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </div>
    
  );
};