
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
}
