import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User, Project, Task, Sprint } from '../types';



interface Store {
  currentUser: User | null;
  projects: Project[];
  selectedProject: Project | null;
  notifications: Notification[];

  setCurrentUser: (user: User | null) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  setSelectedProject: (project: Project | null) => void;
  updateTask: (projectId: string, sprintId: string, task: Task) => void;
  addTask: (projectId: string, sprintId: string, task: Task) => void;
  deleteTask: (projectId: string, sprintId: string, taskId: string) => void;
  addNotification: (notification: Notification) => void;
}

const sampleProject: Project = {
  id: '1',
  name: 'Proyecto Demo',
  description: 'Un proyecto de demostración para Agile PM',
  status: 'active',
  team: [],
  sprints: [
    {
      id: '1',
      name: 'Kuronoma',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-15'),
      status: 'active',
      tasks: [
        {
          id: '1',
          title: 'Implementar autenticación',
          description: 'Agregar login y registro de usuarios',
          status: 'in_progress',
          storyPoints: 5,
          priority: 'high',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Diseñar dashboard',
          description: 'Crear diseño responsive del dashboard',
          status: 'todo',
          storyPoints: 3,
          priority: 'medium',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '5',
          title: 'Di dashboard',
          description: 'Crear diseño responsive del dashboard',
          status: 'todo',
          storyPoints: 3,
          priority: 'medium',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'API REST',
          description: 'Desarrollar endpoints de la API',
          status: 'backlog',
          storyPoints: 8,
          priority: 'high',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

export const useStore = create<Store>((set) => ({
  currentUser: null,
  projects: [sampleProject],
  selectedProject: sampleProject,
  notifications: [],

  setCurrentUser: (user) => set({ currentUser: user }),
  
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  
  
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === project.id ? project : p
      ),
      selectedProject: state.selectedProject?.id === project.id ? project : state.selectedProject,
    })),
  
  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      selectedProject: state.selectedProject?.id === projectId ? null : state.selectedProject,
    })),
  
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  updateTask: (projectId, sprintId, task) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              sprints: project.sprints.map((sprint) =>
                sprint.id === sprintId
                  ? {
                      ...sprint,
                      tasks: sprint.tasks.map((t) =>
                        t.id === task.id ? task : t
                      ),
                    }
                  : sprint
              ),
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? {
            ...state.selectedProject,
            sprints: state.selectedProject.sprints.map((sprint) =>
              sprint.id === sprintId
                ? {
                    ...sprint,
                    tasks: sprint.tasks.map((t) =>
                      t.id === task.id ? task : t
                    ),
                  }
                : sprint
            ),
          }
        : state.selectedProject,
    })),
    addTask: (projectId, sprintId, task) =>
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                sprints: project.sprints.map((sprint) =>
                  sprint.id === sprintId
                    ? {
                        ...sprint,
                        tasks: [...sprint.tasks, task],
                      }
                    : sprint
                ),
              }
            : project
        ),
        selectedProject: state.selectedProject?.id === projectId
          ? {
              ...state.selectedProject,
              sprints: state.selectedProject.sprints.map((sprint) =>
                sprint.id === sprintId
                  ? {
                      ...sprint,
                      tasks: [...sprint.tasks, task],
                    }
                  : sprint
              ),
            }
          : state.selectedProject,
      })),
  
    deleteTask: (projectId, sprintId, taskId) =>
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                sprints: project.sprints.map((sprint) =>
                  sprint.id === sprintId
                    ? {
                        ...sprint,
                        tasks: sprint.tasks.filter((t) => t.id !== taskId),
                      }
                    : sprint
                ),
              }
            : project
        ),
        selectedProject: state.selectedProject?.id === projectId
          ? {
              ...state.selectedProject,
              sprints: state.selectedProject.sprints.map((sprint) =>
                sprint.id === sprintId
                  ? {
                      ...sprint,
                      tasks: sprint.tasks.filter((t) => t.id !== taskId),
                    }
                  : sprint
              ),
            }
          : state.selectedProject,
      })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
}));