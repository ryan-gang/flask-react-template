export interface Comment {
  id: string;
  content: string;
  account_id: string;
  task_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CommentFormData {
  content: string;
}
