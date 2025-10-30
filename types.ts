
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum Status {
  ToDo = 'todo',
  InProgress = 'inProgress',
  Done = 'done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  order: number;
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: any; // Firestore Timestamp
}

export const noteColors = [
  '#282828', // Default Gray
  '#5C2B29', // Red
  '#614A19', // Orange
  '#635D19', // Yellow
  '#345920', // Green
  '#16504B', // Teal
  '#2D555E', // Blue
  '#1E3A5F', // Dark Blue
  '#42275E', // Purple
  '#5B2245', // Pink
];
