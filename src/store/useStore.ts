import { create } from 'zustand';

import { User, Project, Task, Sprint } from '../types';

const LOCAL_STORAGE_KEY = 'project-management-store';

function saveToLocalStorage(state: Store) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function loadFromLocalStorage(): Partial<Store> | null {
  const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedState ? JSON.parse(storedState) : null;
}

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

export const useStore = create<Store>((set) => {
  const initialState: Store = {
    currentUser: null,
    projects: [sampleProject],
    selectedProject: sampleProject,
    notifications: [],
    setCurrentUser: (user) => set((state) => {
      const newState = { ...state, currentUser: user };
      saveToLocalStorage(newState);
      return newState;
    }),
    addProject: (project) => set((state) => {
      const newState = { ...state, projects: [...state.projects, project] };
      saveToLocalStorage(newState);
      return newState;
    }),
    updateProject: (project) => set((state) => {
      const updatedProjects = state.projects.map((p) =>
        p.id === project.id ? project : p
      );
      const newState = {
        ...state,
        projects: updatedProjects,
        selectedProject:
          state.selectedProject?.id === project.id ? project : state.selectedProject,
      };
      saveToLocalStorage(newState);
      return newState;
    }),
    deleteProject: (projectId) => set((state) => {
      const updatedProjects = state.projects.filter((p) => p.id !== projectId);
      const newState = {
        ...state,
        projects: updatedProjects,
        selectedProject:
          state.selectedProject?.id === projectId ? null : state.selectedProject,
      };
      saveToLocalStorage(newState);
      return newState;
    }),
    setSelectedProject: (project) => set((state) => {
      const newState = { ...state, selectedProject: project };
      saveToLocalStorage(newState);
      return newState;
    }),
    updateTask: (projectId, sprintId, task) => set((state) => {
      const updatedProjects = state.projects.map((project) =>
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
      );
      const newState = {
        ...state,
        projects: updatedProjects,
        selectedProject:
          state.selectedProject?.id === projectId
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
      };
      saveToLocalStorage(newState);
      return newState;
    }),
    addTask: (projectId, sprintId, newTask) => set((state) => {
      const updatedProjects = state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              sprints: project.sprints.map((sprint) =>
                sprint.id === sprintId
                  ? { ...sprint, tasks: [...sprint.tasks, newTask] }
                  : sprint
              ),
            }
          : project
      );
      const newState = { ...state, projects: updatedProjects };
      saveToLocalStorage(newState);
      return newState;
    }),
    deleteTask: (projectId, sprintId, taskId) => set((state) => {
      const updatedProjects = state.projects.map((project) =>
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
      );
      const newState = { ...state, projects: updatedProjects };
      saveToLocalStorage(newState);
      return newState;
    }),
    addNotification: (notification) => set((state) => {
      const newState = { ...state, notifications: [...state.notifications, notification] };
      saveToLocalStorage(newState);
      return newState;
    }),
  };

  // Cargar el estado inicial desde localStorage si existe
  const loadedState = loadFromLocalStorage();
  return loadedState ? { ...initialState, ...loadedState } : initialState;
});