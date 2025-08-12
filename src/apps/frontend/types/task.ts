export interface Task {
  id: string;
  title: string;
  description: string;
  account_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  active?: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface TaskFormData {
  title: string;
  description: string;
}
