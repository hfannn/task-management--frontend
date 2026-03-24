export type TaskStatus = 'TODO' | 'DOING' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
    id?: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    userId: number | null;

    user?: {
        id: number;
        name: string;
        email?: string;
        role?: string;
    } | null;

    createdAt?: string;
}