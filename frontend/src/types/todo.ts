export interface Todo {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
}

export type TodoStatusFilter = 'all' | 'completed' | 'pending';

export type TodoSortType = 'newest' | 'oldest';

export interface TodoFormValues {
    title: string;
    description: string;
}

export interface TodoListParams {
  search?: string;
  status?: TodoStatusFilter;
  page?: number;
  limit?: number;
  sort?: TodoSortType;
}

export interface PaginationMeta {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface TodoListResponse {
    success: boolean;
    message: string;
    data: Todo[];
    pagination: PaginationMeta;
}